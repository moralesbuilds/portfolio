# /// script
# dependencies = [
#   "python-frontmatter",
#   "casefy",
#   "python-dotenv"
# ]
# ///

import sys
import types
import frontmatter
from utilities import get_local_flag, parse_wrangler_json, create_tag_records, upload_markdown_file, get_locale, get_required, get_optional, get_bool, execute_sql_command, get_use_npx

def insert_project_sql(post):
  name = get_required(post, "name")
  locale = get_locale(post)
  slug = get_required(post, "slug")
  title = get_required(post, "title")
  summary =  get_required(post, "summary")
  repository_url = get_optional(post, "repository_url")
  repository_url = f"'{repository_url}'" if repository_url is not None else 'NULL'
  is_featured = 1 if get_bool(post, "is_featured") else 0
  return (
    "INSERT INTO projects (name, locale, slug, title, summary, repository_url, author_id, status, is_featured, published_at, created_at, updated_at) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{title}', '{summary}', {repository_url}, 1, 'published', {is_featured}, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL) "
    "ON CONFLICT (name, locale) "
    "DO UPDATE SET title = excluded.title, summary = excluded.summary, repository_url = excluded.repository_url, is_featured = excluded.is_featured, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
    "RETURNING id;"
  )

def create_project_record(post, settings):
  result = execute_sql_command("contents-db", insert_project_sql(post), settings)
  json_result = parse_wrangler_json(result.stdout)
  project_id = json_result[0]["results"][0]["id"]
  print(f"Project ID: {project_id}")
  return project_id

def insert_project_tag_sql(project_id, tag_ids):
  project_tag_records = [f"({project_id}, {tag_id})" for tag_id in tag_ids]
  return (
    "INSERT INTO project_tags (project_id, tag_id) VALUES "
    f"{", ".join(project_tag_records)} "
    "ON CONFLICT (project_id, tag_id) DO NOTHING;"
  )

def create_project_tag_records(project_id, tag_ids, settings):
  execute_sql_command("contents-db", insert_project_tag_sql(project_id, tag_ids), settings)

def insert_project_metrics_sql(post):
  metrics = []
  if "pinned_metrics" in post.metadata:  
    metrics += [f"('{metric.replace("'", "''")}', {index}, TRUE)" for index, metric in enumerate(post.metadata["pinned_metrics"])]

  if "metrics" in post.metadata:
    start = len(metrics)
    metrics += [f"('{metric.replace("'", "''")}', {start + index}, FALSE)" for index, metric in enumerate(post.metadata["metrics"])]
  
  if len(metrics) == 0:
    return None
  
  name = post.metadata["name"].replace("'", "''")
  return (
    "WITH ordered_metrics(metric_name, sort_order, pinned) AS ("
    f"  VALUES {", ".join(metrics)}"
    ") "
    "INSERT INTO project_metrics (project_name, metric_definition_id, is_public, pinned, sort_order, created_at) "
    f"SELECT '{name}' AS project_name, md.id AS metric_definition_id, TRUE AS is_public, om.pinned, om.sort_order, strftime('%Y-%m-%dT%H:%M:%SZ', 'now') AS created_at FROM metric_definitions md "
    "JOIN ordered_metrics om ON md.name = om.metric_name "
    "ORDER BY om.sort_order "
    "ON CONFLICT (project_name, metric_definition_id) "
    "DO UPDATE SET pinned = excluded.pinned, sort_order = excluded.sort_order"
  )

def create_project_metrics(post, settings):
  sql = insert_project_metrics_sql(post)
  if sql is None:
    return None
  execute_sql_command("metrics-db", sql, settings)

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python scripts/upload_project.py <project file path> <--local | --remote>")
    sys.exit(1)

  markdown_file = sys.argv[1]
  settings = types.SimpleNamespace(flag=get_local_flag(), use_npx=get_use_npx())

  post = frontmatter.load(markdown_file)
  project_id = create_project_record(post, settings)
  
  tag_ids = create_tag_records(post, settings)
  if tag_ids is not None:
    create_project_tag_records(project_id, tag_ids, settings)
    
  create_project_metrics(post, settings)
  
  upload_markdown_file(markdown_file, "projects", post, settings)

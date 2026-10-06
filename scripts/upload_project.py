# /// script
# dependencies = [
#   "python-frontmatter",
#   "casefy"
# ]
# ///

import sys
import subprocess
import frontmatter
from utilities import get_local_flag, parse_wrangler_json, create_tag_records, upload_markdown_file

def insert_project_sql(post):
  name = post.metadata['name'].replace("'", "''")
  locale = post.metadata['locale'].replace("'", "''")
  slug = post.metadata['slug'].replace("'", "''")
  title = post.metadata['title'].replace("'", "''")
  summary = post.metadata['summary'].replace("'", "''")
  repository_url = f"'{post.metadata['repository_url'].replace("'", "''")}'" if "repository_url" in post.metadata else 'NULL'
  is_featured = int(post.metadata['is_featured']) if "is_featured" in post.metadata else 0
  return (
    "INSERT INTO projects (name, locale, slug, title, summary, repository_url, author_id, status, is_featured, published_at, created_at, updated_at) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{title}', '{summary}', {repository_url}, 1, 'published', {is_featured}, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL) "
    "ON CONFLICT (name, locale) "
    "DO UPDATE SET title = excluded.title, summary = excluded.summary, repository_url = excluded.repository_url, is_featured = excluded.is_featured, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
    "RETURNING id;"
  )

def create_project_record(post, flag):
  cmd = [
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "contents-db",
    "--command",
    insert_project_sql(post),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)

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

def create_project_tag_records(project_id, tag_ids, flag):
  cmd = [
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "contents-db",
    "--command",
    insert_project_tag_sql(project_id, tag_ids),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python scripts/upload_project.py <project file path> <--local | --remote>")
    sys.exit(1)

  markdown_file = sys.argv[1]
  flag = get_local_flag()

  post = frontmatter.load(markdown_file)
  project_id = create_project_record(post, flag)
  tag_ids = create_tag_records(post, flag)
  if tag_ids is not None:
    create_project_tag_records(project_id, tag_ids, flag)
  upload_markdown_file(markdown_file, "projects", post, flag)

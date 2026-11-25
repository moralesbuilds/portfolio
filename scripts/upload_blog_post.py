# /// script
# dependencies = [
#   "python-frontmatter",
#   "casefy",
#   "python-dotenv"
# ]
# ///

import sys
import types
import casefy
import frontmatter
from utilities import create_tag_records, get_local_flag, parse_wrangler_json, upload_markdown_file, get_required, get_locale, execute_sql_command, get_use_npx

def insert_category_sql(post):
  label = get_required(post, "category")
  locale = get_locale(post)
  slug = casefy.kebabcase(label)
  name = slug
  return (
    "INSERT INTO categories (name, locale, slug, label) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{label}') "
    "ON CONFLICT (name, locale) "
    "DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )
  
def create_category_record(post, settings):
  result = execute_sql_command("contents-db", insert_category_sql(post), settings)
  json_result = parse_wrangler_json(result.stdout)
  category_id = json_result[0]["results"][0]["id"]
  print(f"Category ID: {category_id}")
  return category_id

def insert_blog_post_sql(post, category_id):
  name = get_required(post, "name")
  locale = get_locale(post)
  slug = get_required(post, "slug")
  title = get_required(post, "title")
  summary = get_required(post, "summary")
  return (
    "INSERT INTO blog_posts (name, locale, slug, title, category_id, status, summary, author_id, published_at, created_at, updated_at) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{title}', {category_id}, 'published', '{summary}', 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL) "
    "ON CONFLICT (name, locale)"
    "DO UPDATE SET title = excluded.title, summary = excluded.summary, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
    "RETURNING id;"
  )

def create_blog_post_record(post, category_id, settings):
  result = execute_sql_command("contents-db", insert_blog_post_sql(post, category_id), settings)
  json_result = parse_wrangler_json(result.stdout)
  blog_post_id = json_result[0]["results"][0]["id"]
  print(f"Blog Post ID: {blog_post_id}")
  return blog_post_id

def insert_blog_post_tag_sql(blog_post_id, tag_ids):
  blog_post_tag_records = [f"({blog_post_id}, {tag_id})" for tag_id in tag_ids]
  return (
    "INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES "
    f"{", ".join(blog_post_tag_records)} "
    "ON CONFLICT (blog_post_id, tag_id) DO NOTHING;"
  )

def create_blog_post_tag_records(blog_post_id, tag_ids, settings):
  execute_sql_command("contents-db", insert_blog_post_tag_sql(blog_post_id, tag_ids), settings)
  
if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python scripts/upload_blog_post.py <blog post file path> <--local | --remote> [--npx]")
    sys.exit(1)
    
  markdown_file = sys.argv[1]
  settings = types.SimpleNamespace(flag=get_local_flag(), use_npx=get_use_npx())
  
  post = frontmatter.load(markdown_file)
  category_id = create_category_record(post, settings)
  blog_post_id = create_blog_post_record(post, category_id, settings)
  tag_ids = create_tag_records(post, settings)
  if tag_ids is not None:
    create_blog_post_tag_records(blog_post_id, tag_ids, settings)
  upload_markdown_file(markdown_file, "blog_posts", post, settings)
  
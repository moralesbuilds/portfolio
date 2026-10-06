# /// script
# dependencies = [
#   "python-frontmatter",
#   "casefy"
# ]
# ///

import sys
import casefy
import subprocess
import frontmatter
from utilities import create_tag_records, get_local_flag, parse_wrangler_json, upload_markdown_file

def insert_category_sql(post):
  label = post.metadata['category'].replace("'", "''")
  locale = post.metadata['locale'].replace("'", "''")
  slug = casefy.kebabcase(label)
  name = slug
  return (
    "INSERT INTO categories (name, locale, slug, label) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{label}') "
    "ON CONFLICT (name, locale) "
    "DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )
  
def create_category_record(post, flag):
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
    insert_category_sql(post),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)
  
  json_result = parse_wrangler_json(result.stdout)
  category_id = json_result[0]["results"][0]["id"]
  print(f"Category ID: {category_id}")
  return category_id
  

def insert_blog_post_sql(post, category_id):
  name = post.metadata['name'].replace("'", "''")
  locale = post.metadata['locale'].replace("'", "''")
  slug = post.metadata['slug'].replace("'", "''")
  title = post.metadata['title'].replace("'", "''")
  summary = post.metadata['summary'].replace("'", "''")
  return (
    "INSERT INTO blog_posts (name, locale, slug, title, category_id, status, summary, author_id, published_at, created_at, updated_at) "
    f"VALUES ('{name}', '{locale}', '{slug}', '{title}', {category_id}, 'published', '{summary}', 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL) "
    "ON CONFLICT (name, locale)"
    "DO UPDATE SET title = excluded.title, summary = excluded.summary, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
    "RETURNING id;"
  )

def create_blog_post_record(post, category_id, flag):
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
    insert_blog_post_sql(post, category_id),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)

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

def create_blog_post_tag_records(blog_post_id, tag_ids, flag):
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
    insert_blog_post_tag_sql(blog_post_id, tag_ids),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)
  
if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python scripts/upload_blog_post.py <blog post file path> <--local | --remote>")
    sys.exit(1)
    
  markdown_file = sys.argv[1]
  flag = get_local_flag()
  
  post = frontmatter.load(markdown_file)
  category_id = create_category_record(post, flag)
  blog_post_id = create_blog_post_record(post, category_id, flag)
  tag_ids = create_tag_records(post, flag)
  if tag_ids is not None:
    create_blog_post_tag_records(blog_post_id, tag_ids, flag)
  upload_markdown_file(markdown_file, "blog_posts", post, flag)
  
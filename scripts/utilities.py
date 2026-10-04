import os
import re
import sys
import json
import casefy
import subprocess

def get_local_flag():
  try:
    flag = sys.argv[2]
    if flag not in {"--local", "--remote"}:
      print("Not recognized flag")
      sys.exit(1)
    return flag
  except IndexError:
    return "--local"

def parse_wrangler_json(output: str):
  match = re.search(r'(\[|\{)', output)
  if not match:
      raise ValueError("No JSON payload found in Wrangler stdout.")
  
  json_str = output[match.start():]
  return json.loads(json_str)

def insert_tags_sql(post):
  locale = post.metadata['locale']
  tags = post.metadata['tags']
  tag_records = []
  for tag in tags:
    tag_name = casefy.kebabcase(tag)
    tag_records.append(f"('{tag_name}', '{locale}', '{tag_name}', '{tag}')")

  return (
    "INSERT INTO tags (name, locale, slug, label) VALUES "
    f"{", ".join(tag_records)} "
    "ON CONFLICT (name, locale) DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )
  
def create_tag_records(post, flag):
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
    insert_tags_sql(post),
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)
  json_result = parse_wrangler_json(result.stdout)
  return [tag['id'] for tag in json_result[0]["results"]]

def upload_markdown_file(markdown_file, type, post, flag):
  locale = post.metadata['locale']
  slug = post.metadata['slug']
  cmd = [
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "r2",
    "object",
    "put",
    f"blog-contents/{type}/{locale}/{slug}.md",
    "--file",
    f"{os.getcwd()}/{markdown_file}",
    flag
  ]
  result = subprocess.run(cmd, capture_output=True, text=True, check=True)
  print(result.stdout)

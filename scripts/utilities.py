import os
import re
import sys
import json
import casefy
import subprocess
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

default_locale = "en"
npx_cmd = ["npx"]
pnpm_cmd = ["pnpm", "--filter", "web", "exec"]

def execute_command(cmd):
  result = subprocess.run(cmd, capture_output=True, text=True, check=False)
  print(result.stdout)
  if result.returncode != 0:
    print(result.stderr)
    sys.exit(result.returncode)
  else:
    return result

def execute_sql_command(database, sql, settings):
  start_cmd = npx_cmd if settings.use_npx else pnpm_cmd
  cmd = [
    "wrangler",
    "d1",
    "execute",
    database,
    "--command",
    sql,
    settings.flag
  ]
  return execute_command(start_cmd + cmd)

def get_local_flag():
  try:
    flag = sys.argv[2]
    if flag not in {"--local", "--remote"}:
      print("Not recognized flag")
      sys.exit(1)
    else:
      return flag
  except IndexError:
    return "--local"

def get_use_npx():
  try:
    return sys.argv[3] == "--npx"
  except IndexError:
    return False

def get_required(post, field):
  val = post.metadata.get(field)
  if val is None:
    raise ValueError(f"The field {field} is required.")
  return val.replace("'", "''")

def get_optional(post, field, default_val=None):
  val = post.metadata.get(field) or default_val
  return val.replace("'", "''") if val is not None else None

def get_locale(post):
  return get_optional(post, "locale", default_val=default_locale)

def get_bool(post, field):
  val = post.metadata.get(field)
  if isinstance(val, bool):
    return val

  if isinstance(val, str):
    return val.lower() == "true"

  return False

def parse_wrangler_json(output: str):
  match = re.search(r'(\[|\{)', output)
  if not match:
      raise ValueError("No JSON payload found in Wrangler stdout.")
  
  json_str = output[match.start():]
  return json.loads(json_str)

def insert_tags_sql(post):
  if "tags" not in post.metadata:
    return None
  
  tags = post.metadata['tags']
  if len(tags) == 0:
    return None

  tag_records = []
  locale = get_locale(post)
  for tag in tags:
    tag_name = casefy.kebabcase(tag)
    tag_label = tag.replace("'", "''")
    tag_records.append(f"('{tag_name}', '{locale}', '{tag_name}', '{tag_label}')")

  return (
    "INSERT INTO tags (name, locale, slug, label) VALUES "
    f"{", ".join(tag_records)} "
    "ON CONFLICT (name, locale) DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )
  
def create_tag_records(post, settings):
  sql = insert_tags_sql(post)
  if sql is None or settings.flag is None:
    return None
  
  result = execute_sql_command("contents-db", sql, settings)
  json_result = parse_wrangler_json(result.stdout)

  if not isinstance(json_result, list) or len(json_result) == 0:
    return None
  
  results = json_result[0]["results"]
  if not isinstance(results, list) or len(results) == 0:
    return None

  return [tag['id'] for tag in results]

def upload_markdown_file(markdown_file, type, post, settings):
  if markdown_file is None:
    raise ValueError("A markdown file is required.")

  slug = get_required(post, "slug")
  if type is None:
    raise ValueError("A type is required")
  if settings.flag is None:
    raise ValueError("A flag is required")

  locale = get_locale(post)
  start_cmd = npx_cmd if settings.use_npx else pnpm_cmd
  cmd = [
    "wrangler",
    "r2",
    "object",
    "put",
    f"blog-contents/{type}/{locale}/{slug}.md",
    "--file",
    os.path.abspath(markdown_file),
    settings.flag
  ]
  execute_command(start_cmd + cmd)

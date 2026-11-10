import sys
import types
import pytest
import subprocess
from utilities import execute_command, get_local_flag, parse_wrangler_json, insert_tags_sql, create_tag_records, get_locale, upload_markdown_file

def test_execute_command_success(mocker):
  mock_run = mocker.patch("subprocess.run")
  mock_run.return_value = mocker.MagicMock(
    spec=subprocess.CompletedProcess,
    returncode=0,
    stdout="Process completed"
  )
  
  result = execute_command(["cat", "example.txt"])
  assert result.stdout == "Process completed"
  mock_run.assert_called_once_with(
    ["cat", "example.txt"], capture_output=True, text=True, check=False
  )

def test_execute_command_failed(mocker):
  mock_run = mocker.patch("subprocess.run")
  mock_run.return_value = mocker.MagicMock(
    spec=subprocess.CompletedProcess,
    returncode=1,
    stdout="Process completed",
    stderr="Process failed"
  )  
  mock_exit = mocker.patch("sys.exit")
  
  result = execute_command(["cat", "example.txt"])
  assert result is None
  mock_run.assert_called_once_with(
    ["cat", "example.txt"], capture_output=True, text=True, check=False
  )
  mock_exit.assert_called_once_with(1)
  
@pytest.mark.parametrize(
  "flag", ["--local", "--remote"]
)
def test_get_local_flag_success(mocker, flag):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", flag])
  result = get_local_flag()
  assert result == flag

def test_get_local_flag_failed(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", "--random"])
  mock_exit = mocker.patch("sys.exit")
  result = get_local_flag()
  assert result is None
  mock_exit.assert_called_once_with(1)
  
def test_get_local_flag_default(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md"])
  result = get_local_flag()
  assert result == "--local"

@pytest.mark.parametrize(
  "metadata", [{}, { "locale": None }]
)
def test_get_locale_default_value(metadata):
  post = types.SimpleNamespace(metadata = metadata)
  result = get_locale(post)
  assert result == "en"

def test_get_locale_present_value():
  post = types.SimpleNamespace(metadata = { "locale": "es" })
  result = get_locale(post)
  assert result == "es"

def test_parse_wrangler_json_success():
  output = parse_wrangler_json("""
wrangler x.xxx.x
───────────────────────────────────────────────
Resource location: local 

Use --remote if you want to access the remote instance.

🌀 Executing on local database test-db (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 1 command executed successfully.
[
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  }
]""")
  assert len(output) == 1
  assert output[0]["success"]
  assert len(output[0]["results"]) == 0
  assert output[0]["meta"]["duration"] == 0

def test_parse_wrangler_json_exception():
  with pytest.raises(ValueError, match="No JSON payload found in Wrangler stdout."):
    parse_wrangler_json("""
wrangler x.xxx.x
───────────────────────────────────────────────
Resource location: local 

Use --remote if you want to access the remote instance.

🌀 Executing on local database test-db (xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 1 command executed successfully.""")

def test_insert_tags_sql_no_tags():
  post = types.SimpleNamespace(metadata = {})
  sql = insert_tags_sql(post)
  assert sql is None

def test_insert_tags_sql_empty_tags():
  post = types.SimpleNamespace(metadata = { "locale": "en", "tags": [] })
  sql = insert_tags_sql(post)
  assert sql is None

def test_insert_tags_sql_success_default_locale(mocker):
  post = types.SimpleNamespace(metadata = { "tags": ["Test"] })
  mocker.patch("casefy.kebabcase", return_value="test")

  sql = insert_tags_sql(post)
  assert sql == (
    "INSERT INTO tags (name, locale, slug, label) VALUES "
    "('test', 'en', 'test', 'Test') "
    "ON CONFLICT (name, locale) DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )

def test_insert_tags_sql_success_multiple_tag_values(mocker):
  def mock_kebabcase(str):
    return str.lower()

  post = types.SimpleNamespace(metadata = { "tags": ["A", "B", "C"], "locale": "en" })
  mocker.patch("casefy.kebabcase", side_effect=mock_kebabcase)

  sql = insert_tags_sql(post)
  assert sql == (
    "INSERT INTO tags (name, locale, slug, label) VALUES "
    "('a', 'en', 'a', 'A'), "
    "('b', 'en', 'b', 'B'), "
    "('c', 'en', 'c', 'C') "
    "ON CONFLICT (name, locale) DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )

def test_insert_tags_sql_success(mocker):
  post = types.SimpleNamespace(metadata = { "locale": "es", "tags": ["Prueba"] })
  mocker.patch("casefy.kebabcase", return_value="prueba")

  sql = insert_tags_sql(post)
  assert sql == (
    "INSERT INTO tags (name, locale, slug, label) VALUES "
    "('prueba', 'es', 'prueba', 'Prueba') "
    "ON CONFLICT (name, locale) DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )

def test_create_tag_records_no_sql(mocker):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value=None)

  result = create_tag_records(post, "--flag")
  assert result is None

def test_create_tag_records_no_flag(mocker):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value=None)

  result = create_tag_records(post, None)
  assert result is None

def test_create_tag_records_success(mocker):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value="INSERT INTO tags (name) VALUES ('Test') RETURNING id;")
  mock_execute_command = mocker.patch("utilities.execute_command")
  mocker.patch("utilities.parse_wrangler_json", return_value=[{ "results": [{"id": 1}] }])

  result = create_tag_records(post, "--local")
  assert result == [1], "The Id lists are not equal"
  mock_execute_command.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "contents-db",
    "--command",
    "INSERT INTO tags (name) VALUES ('Test') RETURNING id;",
    "--local"
  ])

@pytest.mark.parametrize(
  "json", [[], None, {}, [{"results": None}], [{"results": []}], [{"results": {}}]]
)
def test_create_tag_records_success_no_tag_results(mocker, json):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value="INSERT INTO tags (name) VALUES ('Test') RETURNING id;")
  mock_execute_command = mocker.patch("utilities.execute_command")
  mocker.patch("utilities.parse_wrangler_json", return_value=json)

  result = create_tag_records(post, "--local")
  assert result is None
  mock_execute_command.assert_called_once()

def test_upload_markdown_file_success(mocker):
  post = types.SimpleNamespace(metadata = { "locale": "en", "slug": "test-content" })
  mock_execute_command = mocker.patch("utilities.execute_command")
  mocker.patch("os.path.abspath", return_value="/a/b/content.md")

  upload_markdown_file("b/content.md", "content", post, "--remote")
  mock_execute_command.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "r2",
    "object",
    "put",
    "blog-contents/content/en/test-content.md",
    "--file",
    "/a/b/content.md",
    "--remote"
  ])

@pytest.mark.parametrize("markdown_file, type, flag, error", [
  (None, "content", "--remote", "A markdown file is required."),
  ("b/content.md", None, "--remote", "A type is required"),
  ("b/content.md", "content", None, "A flag is required"),
])
def test_upload_markdown_file_missing_params(mocker, markdown_file, type, flag, error):
  post = types.SimpleNamespace(metadata = { "locale": "en", "slug": "test-content" })
  mock_execute_command = mocker.patch("utilities.execute_command")

  with pytest.raises(ValueError, match=error):
    upload_markdown_file(markdown_file, type, post, flag)
  mock_execute_command.assert_not_called()

@pytest.mark.parametrize("metadata", [
  { "locale": "en", "slug": None },
  { "locale": "en" },
])
def test_upload_markdown_file_missing_slug(mocker, metadata):
  post = types.SimpleNamespace(metadata = metadata)
  mock_execute_command = mocker.patch("utilities.execute_command")

  with pytest.raises(ValueError, match="A slug is required."):
    upload_markdown_file("b/content.md", "content", post, "--remote")
  mock_execute_command.assert_not_called()

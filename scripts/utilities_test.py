import sys
import types
import pytest
import subprocess
from utilities import execute_command, get_local_flag, parse_wrangler_json, insert_tags_sql, create_tag_records, get_locale, upload_markdown_file, get_optional, get_required, get_bool, execute_sql_command, get_use_npx

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

def test_execute_command_falls_back_to_interactive_shell(mocker):
  ok = mocker.MagicMock(spec=subprocess.CompletedProcess, returncode=0, stdout="ok")
  mock_run = mocker.patch("subprocess.run", side_effect=[FileNotFoundError(), ok])
  mocker.patch.dict("os.environ", {"SHELL": "/bin/zsh"})

  result = execute_command(["pnpm", "--filter", "web", "exec", "wrangler", "d1", "execute", "db", "--command", "SELECT 'a b';"])

  assert result is ok
  assert mock_run.call_count == 2
  mock_run.assert_called_with(
    ["/bin/zsh", "-ic", "pnpm --filter web exec wrangler d1 execute db --command 'SELECT '\"'\"'a b'\"'\"';'"],
    capture_output=True, text=True, check=False
  )

def test_execute_command_fallback_defaults_to_bash(mocker):
  ok = mocker.MagicMock(spec=subprocess.CompletedProcess, returncode=0, stdout="ok")
  mock_run = mocker.patch("subprocess.run", side_effect=[FileNotFoundError(), ok])
  mocker.patch.dict("os.environ", {}, clear=True)

  execute_command(["pnpm", "-v"])

  mock_run.assert_called_with(
    ["bash", "-ic", "pnpm -v"], capture_output=True, text=True, check=False
  )

def test_execute_command_fallback_failure_exits(mocker):
  failed = mocker.MagicMock(spec=subprocess.CompletedProcess, returncode=127, stdout="", stderr="not found")
  mocker.patch("subprocess.run", side_effect=[FileNotFoundError(), failed])
  mock_exit = mocker.patch("sys.exit")

  execute_command(["pnpm", "-v"])

  mock_exit.assert_called_once_with(127)

def test_execute_sql_command_pnpm(mocker):
  mock_execute_command = mocker.patch("utilities.execute_command", return_value="Done")
  settings = types.SimpleNamespace(flag="--remote", use_npx=False)
  result = execute_sql_command("examples-db", "INSERT INTO examples (name) VALUES ('example');", settings)
  mock_execute_command.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "examples-db",
    "--command",
    "INSERT INTO examples (name) VALUES ('example');",
    "--remote"
  ])
  assert result == "Done"

def test_execute_sql_command_npx(mocker):
  mock_execute_command = mocker.patch("utilities.execute_command", return_value="Done")
  settings = types.SimpleNamespace(flag="--remote", use_npx=True)
  result = execute_sql_command("examples-db", "INSERT INTO examples (name) VALUES ('example');", settings)
  mock_execute_command.assert_called_once_with([
    "npx",
    "wrangler",
    "d1",
    "execute",
    "examples-db",
    "--command",
    "INSERT INTO examples (name) VALUES ('example');",
    "--remote"
  ])
  assert result == "Done"

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

def test_get_use_npx_present(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", "--local", "--npx"])
  assert get_use_npx() == True

def test_get_use_npx_present(mocker):
  mocker.patch.object(sys, "argv", ["main.py", "file.md", "--local"])
  assert get_use_npx() == False

@pytest.mark.parametrize(
  "metadata,expected", [
    ({}, False),
    ({ "field": None }, False),
    ({ "field": False }, False),
    ({ "field": True }, True),
    ({ "field": "False" }, False),
    ({ "field": "true" }, True),
    ({ "field": "True" }, True),
    ({ "field": "truE" }, True),
    ({ "field": "TRUE" }, True),
    ({ "field": {} }, False)
  ] 
)
def test_get_bool(metadata, expected):
  post = types.SimpleNamespace(metadata = metadata)
  result = get_bool(post, "field")
  assert result == expected

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

@pytest.mark.parametrize(
  "metadata", [{}, { "example": None }]
)
def test_get_required_raises_error(metadata):
  post = types.SimpleNamespace(metadata = metadata)
  with pytest.raises(ValueError, match="The field example is required."):
    get_required(post, "example")

@pytest.mark.parametrize(
  "metadata,expected", [
  ({ "example": "value" }, "value"),
  ({ "example": "'value'" }, "''value''")
])
def test_get_required_success(metadata, expected):
  post = types.SimpleNamespace(metadata = metadata)
  value = get_required(post, "example")
  assert value == expected

@pytest.mark.parametrize(
  "metadata,default_val,expected", [
  ({ "example": "value" }, None, "value"),
  ({ "example": "value'" }, None, "value''"),
  ({ "example": None }, "hello", "hello"),
  ({ }, None, None),
  ({ }, "result", "result"),
  ({ "example": None }, None, None)
])
def test_get_optional_success(metadata, default_val, expected):
  post = types.SimpleNamespace(metadata = metadata)
  value = get_optional(post, "example", default_val=default_val)
  assert value == expected

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
  settings = types.SimpleNamespace(flag = "--flag")
  mocker.patch("utilities.insert_tags_sql", return_value=None)

  result = create_tag_records(post, settings)
  assert result is None

def test_create_tag_records_no_flag(mocker):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value=None)

  result = create_tag_records(post, None)
  assert result is None

def test_create_tag_records_success(mocker):
  mocker.patch("utilities.insert_tags_sql", return_value="INSERT INTO tags (name) VALUES ('Test') RETURNING id;")
  mock_execute_sql_command = mocker.patch("utilities.execute_sql_command")
  mocker.patch("utilities.parse_wrangler_json", return_value=[{ "results": [{"id": 1}] }])

  post = types.SimpleNamespace(metadata = {})
  settings = types.SimpleNamespace(flag="--local")
  result = create_tag_records(post, settings)

  assert result == [1], "The Id lists are not equal"
  mock_execute_sql_command.assert_called_once_with("contents-db", "INSERT INTO tags (name) VALUES ('Test') RETURNING id;", settings)

@pytest.mark.parametrize(
  "json", [[], None, {}, [{"results": None}], [{"results": []}], [{"results": {}}]]
)
def test_create_tag_records_success_no_tag_results(mocker, json):
  post = types.SimpleNamespace(metadata = {})
  mocker.patch("utilities.insert_tags_sql", return_value="INSERT INTO tags (name) VALUES ('Test') RETURNING id;")
  mock_execute_command = mocker.patch("utilities.execute_sql_command")
  mocker.patch("utilities.parse_wrangler_json", return_value=json)
  settings = types.SimpleNamespace(flag="--local")

  result = create_tag_records(post, settings)
  assert result is None
  mock_execute_command.assert_called_once_with("contents-db", "INSERT INTO tags (name) VALUES ('Test') RETURNING id;", settings)

def test_upload_markdown_file_success_pnpm(mocker):
  post = types.SimpleNamespace(metadata={ "locale": "en", "slug": "test-content" })
  settings = types.SimpleNamespace(flag="--remote", use_npx=False)
  mock_execute_command = mocker.patch("utilities.execute_command")
  mocker.patch("os.path.abspath", return_value="/a/b/content.md")

  upload_markdown_file("b/content.md", "content", post, settings)
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

def test_upload_markdown_file_success_npx(mocker):
  post = types.SimpleNamespace(metadata={ "locale": "en", "slug": "test-content" })
  settings = types.SimpleNamespace(flag="--remote", use_npx=True)
  mock_execute_command = mocker.patch("utilities.execute_command")
  mocker.patch("os.path.abspath", return_value="/a/b/content.md")

  upload_markdown_file("b/content.md", "content", post, settings)
  mock_execute_command.assert_called_once_with([
    "npx",
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
  settings = types.SimpleNamespace(flag=flag)

  with pytest.raises(ValueError, match=error):
    upload_markdown_file(markdown_file, type, post, settings)
  mock_execute_command.assert_not_called()

@pytest.mark.parametrize("metadata", [
  { "locale": "en", "slug": None },
  { "locale": "en" },
])
def test_upload_markdown_file_missing_slug(mocker, metadata):
  post = types.SimpleNamespace(metadata=metadata)
  settings = types.SimpleNamespace(flag="--remote")
  mock_execute_command = mocker.patch("utilities.execute_command")

  with pytest.raises(ValueError, match="The field slug is required."):
    upload_markdown_file("b/content.md", "content", post, settings)
  mock_execute_command.assert_not_called()

import os
import sys
import types
import runpy
import pytest
from upload_project import insert_project_sql, create_project_record, insert_project_tag_sql, create_project_tag_records, insert_project_metrics_sql, create_project_metrics

@pytest.mark.parametrize(
  "metadata,message", [
  ({ "name": None, "locale": "en", "slug": "example", "title": "Example", "summary": "This is an example" }, "The field name is required."),
  ({ "name": "example", "locale": "en", "slug": None, "title": "Example", "summary": "This is an example" }, "The field slug is required."),
  ({ "name": "example", "locale": "en", "slug": "example", "title": None, "summary": "This is an example" }, "The field title is required."),
  ({ "name": "example", "locale": "en", "slug": "example", "title": "Example", "summary": None }, "The field summary is required.")
])
def test_insert_project_sql_missing_required_field(metadata, message):
  post = types.SimpleNamespace(metadata = metadata)
  with pytest.raises(ValueError, match = message):
    insert_project_sql(post)

@pytest.mark.parametrize(
  "metadata,values", [
  (
    { "name": "example", "locale": "en", "slug": "example", "title": "Example", "summary": "This is an example" },
    "('example', 'en', 'example', 'Example', 'This is an example', NULL, 1, 'published', 0, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL)"
  ),
  (
    { "name": "ejemplo", "locale": "es", "slug": "ejemplo", "title": "Ejemplo", "summary": "Esto es un ejemplo", "is_featured": "True", "repository_url": "https://example.com/es" },
    "('ejemplo', 'es', 'ejemplo', 'Ejemplo', 'Esto es un ejemplo', 'https://example.com/es', 1, 'published', 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL)"
  )
])
def test_insert_project_sql_success(metadata, values):
  post = types.SimpleNamespace(metadata = metadata)
  result = insert_project_sql(post)
  assert result == (
      "INSERT INTO projects (name, locale, slug, title, summary, repository_url, author_id, status, is_featured, published_at, created_at, updated_at) "
      f"VALUES {values} "
      "ON CONFLICT (name, locale) "
      "DO UPDATE SET title = excluded.title, summary = excluded.summary, repository_url = excluded.repository_url, is_featured = excluded.is_featured, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
      "RETURNING id;"
    )

def test_create_project_record_success(mocker):
  mocker.patch("upload_project.insert_project_sql", return_value="INSERT INTO tests (name) VALUES ('example') RETURNING id;")
  execute_command_mock = mocker.patch("upload_project.execute_command", return_value=types.SimpleNamespace(stdout="The result, trust me!"))
  parse_mock = mocker.patch("upload_project.parse_wrangler_json", return_value=[{ "results": [{ "id": 100 }]} ])
  post = types.SimpleNamespace(metadata = {})
  
  result = create_project_record(post, "--flag")

  execute_command_mock.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "contents-db",
    "--command",
    "INSERT INTO tests (name) VALUES ('example') RETURNING id;",
    "--flag"
  ])
  parse_mock.assert_called_once_with("The result, trust me!")
  assert result == 100

def test_insert_project_tag_sql_success():
  sql = insert_project_tag_sql(100, [1, 2, 3])
  assert sql == (
    "INSERT INTO project_tags (project_id, tag_id) VALUES "
    "(100, 1), (100, 2), (100, 3) "
    "ON CONFLICT (project_id, tag_id) DO NOTHING;"
  )

def test_create_project_tag_records(mocker):
  mocker.patch("upload_project.insert_project_tag_sql", return_value="INSERT INTO project_tags (project_id, tag_id) VALUES (1, 1);")
  execute_command_mock = mocker.patch("upload_project.execute_command", return_value=types.SimpleNamespace(stdout="The result, trust me!"))
  post = types.SimpleNamespace(metadata = {})

  create_project_tag_records(1, [1], "--local")

  execute_command_mock.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "contents-db",
    "--command",
    "INSERT INTO project_tags (project_id, tag_id) VALUES (1, 1);",
    "--local"
  ])

def test_insert_project_metrics_sql_no_metrics():
  post = types.SimpleNamespace(metadata = { "name": "example" })
  assert insert_project_metrics_sql(post) is None

@pytest.mark.parametrize(
  "metadata,values", [
  (
    { "name": "example", "pinned_metrics": ["stars"] },
    "('stars', 0, TRUE)"
  ),
  (
    { "name": "example", "metrics": ["forks"] },
    "('forks', 0, FALSE)"
  ),
  (
    { "name": "example", "pinned_metrics": ["stars", "users"], "metrics": ["forks"] },
    "('stars', 0, TRUE), ('users', 1, TRUE), ('forks', 2, FALSE)"
  ),
  (
    { "name": "example", "pinned_metrics": ["Dev's choice"] },
    "('Dev''s choice', 0, TRUE)"
  )
])
def test_insert_project_metrics_sql_success(metadata, values):
  post = types.SimpleNamespace(metadata = metadata)
  result = insert_project_metrics_sql(post)
  assert result == (
    "WITH ordered_metrics(metric_name, sort_order, pinned) AS ("
    f"  VALUES {values}"
    ") "
    "INSERT INTO project_metrics (project_name, metric_definition_id, is_public, pinned, sort_order, created_at) "
    "SELECT 'example' AS project_name, md.id AS metric_definition_id, TRUE AS is_public, om.pinned, om.sort_order, strftime('%Y-%m-%dT%H:%M:%SZ', 'now') AS created_at FROM metric_definitions md "
    "JOIN ordered_metrics om ON md.name = om.metric_name "
    "ORDER BY om.sort_order "
    "ON CONFLICT (project_name, metric_definition_id) "
    "DO UPDATE SET pinned = excluded.pinned, sort_order = excluded.sort_order"
  )

def test_insert_project_metrics_sql_escapes_project_name():
  post = types.SimpleNamespace(metadata = { "name": "dev's", "metrics": ["Forks"] })
  result = insert_project_metrics_sql(post)
  assert "SELECT 'dev''s' AS project_name" in result

def test_create_project_metrics_without_metrics(mocker):
  mocker.patch("upload_project.insert_project_metrics_sql", return_value=None)
  execute_command_mock = mocker.patch("upload_project.execute_command")
  post = types.SimpleNamespace(metadata = {})

  result = create_project_metrics(post, "--local")

  execute_command_mock.assert_not_called()
  assert result is None

def test_create_project_metrics_success(mocker):
  mocker.patch("upload_project.insert_project_metrics_sql", return_value="INSERT INTO project_metrics (project_name) VALUES ('example');")
  execute_command_mock = mocker.patch("upload_project.execute_command")
  post = types.SimpleNamespace(metadata = {})

  create_project_metrics(post, "--remote")

  execute_command_mock.assert_called_once_with([
    "pnpm",
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "metrics-db",
    "--command",
    "INSERT INTO project_metrics (project_name) VALUES ('example');",
    "--remote"
  ])

script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "upload_project.py")

def run_script(mocker, argv, post, tag_ids):
  mocker.patch.object(sys, "argv", argv)
  mocker.patch("frontmatter.load", return_value=post)
  mocker.patch("utilities.get_local_flag", return_value="--local")
  mocker.patch("utilities.parse_wrangler_json", return_value=[{ "results": [{ "id": 100 }] }])
  mocks = types.SimpleNamespace(
    execute_command = mocker.patch("utilities.execute_command", return_value=types.SimpleNamespace(stdout="stdout")),
    create_tag_records = mocker.patch("utilities.create_tag_records", return_value=tag_ids),
    upload_markdown_file = mocker.patch("utilities.upload_markdown_file")
  )
  runpy.run_path(script_path, run_name="__main__")
  return mocks

def test_main_missing_arguments(mocker, capsys):
  mocker.patch.object(sys, "argv", ["upload_project.py"])
  with pytest.raises(SystemExit) as error:
    runpy.run_path(script_path, run_name="__main__")

  assert error.value.code == 1
  assert "Usage: python scripts/upload_project.py" in capsys.readouterr().out

def test_main_uploads_everything(mocker):
  post = types.SimpleNamespace(metadata = { "name": "example", "slug": "example", "title": "Example", "summary": "This is an example", "metrics": ["Forks"] })

  mocks = run_script(mocker, ["upload_project.py", "projects/example.md"], post, [1, 2])

  databases = [call.args[0][7] for call in mocks.execute_command.call_args_list]
  assert databases == ["contents-db", "contents-db", "metrics-db"]

  project_tags_cmd = mocks.execute_command.call_args_list[1].args[0]
  assert project_tags_cmd[9] == (
    "INSERT INTO project_tags (project_id, tag_id) VALUES "
    "(100, 1), (100, 2) "
    "ON CONFLICT (project_id, tag_id) DO NOTHING;"
  )
  assert all(call.args[0][-1] == "--local" for call in mocks.execute_command.call_args_list)

  mocks.create_tag_records.assert_called_once_with(post, "--local")
  mocks.upload_markdown_file.assert_called_once_with("projects/example.md", "projects", post, "--local")

def test_main_skips_tags_and_metrics_when_missing(mocker):
  post = types.SimpleNamespace(metadata = { "name": "example", "slug": "example", "title": "Example", "summary": "This is an example" })

  mocks = run_script(mocker, ["upload_project.py", "projects/example.md"], post, None)

  databases = [call.args[0][7] for call in mocks.execute_command.call_args_list]
  assert databases == ["contents-db"]
  
  mocks.upload_markdown_file.assert_called_once_with("projects/example.md", "projects", post, "--local")

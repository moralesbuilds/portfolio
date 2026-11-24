import os
import sys
import types
import runpy
import pytest
from upload_blog_post import insert_category_sql, create_category_record, insert_blog_post_sql, create_blog_post_record, insert_blog_post_tag_sql, create_blog_post_tag_records

def test_insert_category_sql_missing_required_field():
  post = types.SimpleNamespace(metadata = { "category": None, "locale": "en" })
  with pytest.raises(ValueError, match = "The field category is required."):
    insert_category_sql(post)

def test_insert_category_sql_success(mocker):
  def mock_kebabcase(str):
    return str.lower()

  mocker.patch("casefy.kebabcase", side_effect=mock_kebabcase)
  post = types.SimpleNamespace(metadata = { "category": "Category", "locale": "en" })

  result = insert_category_sql(post)
  assert result == (
    "INSERT INTO categories (name, locale, slug, label) "
    "VALUES ('category', 'en', 'category', 'Category') "
    "ON CONFLICT (name, locale) "
    "DO UPDATE SET label = excluded.label "
    "RETURNING id;"
  )

def test_create_category_record_success(mocker):
  mocker.patch("upload_blog_post.insert_category_sql", return_value="INSERT INTO categories (name) VALUES ('name') RETURNING id;")
  execute_sql_command_mock = mocker.patch("upload_blog_post.execute_sql_command", return_value=types.SimpleNamespace(stdout="The result, trust me!"))
  parse_mock = mocker.patch("upload_blog_post.parse_wrangler_json", return_value=[{ "results": [{ "id": 10 }]} ])
  post = types.SimpleNamespace(metadata = {})

  result = create_category_record(post, "--flag")

  execute_sql_command_mock.assert_called_once_with("contents-db", "INSERT INTO categories (name) VALUES ('name') RETURNING id;", "--flag")
  parse_mock.assert_called_once_with("The result, trust me!")
  assert result == 10

@pytest.mark.parametrize(
  "metadata,message", [
  ({ "name": None, "locale": "en", "slug": "test", "title": "test", "summary": "test" }, "The field name is required."),
  ({ "name": "test", "locale": "en", "slug": None, "title": "Test", "summary": "test" }, "The field slug is required."),
  ({ "name": "test", "locale": "en", "slug": "test", "title": None, "summary": "test" }, "The field title is required."),
  ({ "name": "test", "locale": "en", "slug": "test", "title": "test", "summary": None }, "The field summary is required.")
])
def test_insert_blog_post_sql_missing_required_field(metadata, message):
  post = types.SimpleNamespace(metadata = metadata)
  with pytest.raises(ValueError, match = message):
    insert_blog_post_sql(post, 10)

def test_insert_blog_post_sql_success():
  post = types.SimpleNamespace(metadata = { "name": "test1", "locale": "en", "slug": "test2", "title": "Test3", "summary": "test4" })
  result = insert_blog_post_sql(post, 10)
  assert result == (
    "INSERT INTO blog_posts (name, locale, slug, title, category_id, status, summary, author_id, published_at, created_at, updated_at) "
    "VALUES ('test1', 'en', 'test2', 'Test3', 10, 'published', 'test4', 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), NULL) "
    "ON CONFLICT (name, locale)"
    "DO UPDATE SET title = excluded.title, summary = excluded.summary, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') "
    "RETURNING id;"
  )

def test_create_blog_post_record_success(mocker):
  mocker.patch("upload_blog_post.insert_blog_post_sql", return_value="INSERT INTO blog_posts (name) VALUES ('example') RETURNING id;")
  execute_sql_command_mock = mocker.patch("upload_blog_post.execute_sql_command", return_value=types.SimpleNamespace(stdout="The result, trust me!"))
  parse_mock = mocker.patch("upload_blog_post.parse_wrangler_json", return_value=[{ "results": [{ "id": 20 }]} ])
  post = types.SimpleNamespace(metadata = {})

  result = create_blog_post_record(post, "--flag")

  execute_sql_command_mock.assert_called_once_with("contents-db", "INSERT INTO blog_posts (name) VALUES ('example') RETURNING id;", "--flag")
  parse_mock.assert_called_once_with("The result, trust me!")
  assert result == 20

def test_insert_blog_post_tag_sql_success():
  result = insert_blog_post_tag_sql(100, [10, 20, 30])
  assert result == (
    "INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES "
    "(100, 10), (100, 20), (100, 30) "
    "ON CONFLICT (blog_post_id, tag_id) DO NOTHING;"
  )

def test_create_blog_post_record_success(mocker):
  mocker.patch("upload_blog_post.insert_blog_post_tag_sql", return_value="INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES (100, 10);")
  execute_sql_command_mock = mocker.patch("upload_blog_post.execute_sql_command", return_value=types.SimpleNamespace(stdout="The result, trust me!"))
  post = types.SimpleNamespace(metadata = {})

  create_blog_post_tag_records(100, [10], "--flag")

  execute_sql_command_mock.assert_called_once_with("contents-db", "INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES (100, 10);", "--flag")

script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "upload_blog_post.py")

def run_script(mocker, argv, post, tag_ids):
  mocker.patch.object(sys, "argv", argv)
  mocker.patch("frontmatter.load", return_value=post)
  mocker.patch("utilities.get_local_flag", return_value="--local")
  mocker.patch("utilities.parse_wrangler_json", return_value=[{ "results": [{ "id": 200 }] }])
  mocks = types.SimpleNamespace(
    execute_sql_command = mocker.patch("utilities.execute_sql_command", return_value=types.SimpleNamespace(stdout="stdout")),
    create_tag_records = mocker.patch("utilities.create_tag_records", return_value=tag_ids),
    upload_markdown_file = mocker.patch("utilities.upload_markdown_file")
  )
  runpy.run_path(script_path, run_name="__main__")
  return mocks

def test_main_missing_arguments(mocker, capsys):
  mocker.patch.object(sys, "argv", ["upload_blog_post.py"])
  with pytest.raises(SystemExit) as error:
    runpy.run_path(script_path, run_name="__main__")

  assert error.value.code == 1
  assert "Usage: python scripts/upload_blog_post.py" in capsys.readouterr().out

def test_main_uploads_everything(mocker):
  post = types.SimpleNamespace(metadata = { "name": "blog-post-example", "locale": "en", "slug": "blog-post-example", "title": "Post Title: A Clear Promise to the Reader", "summary": "A brief of the blog post", "category": "Testing", "tags": ["Tests"] })

  mocks = run_script(mocker, ["upload_blog_post.py", "blog_posts/example.md"], post, [1])

  databases = [call.args[0] for call in mocks.execute_sql_command.call_args_list]
  assert databases == ["contents-db", "contents-db", "contents-db"]

  blog_post_tags_cmd = mocks.execute_sql_command.call_args_list[2].args[1]
  assert blog_post_tags_cmd == (
    "INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES "
    "(200, 1) "
    "ON CONFLICT (blog_post_id, tag_id) DO NOTHING;"
  )
  assert all(call.args[2] == "--local" for call in mocks.execute_sql_command.call_args_list)

  mocks.create_tag_records.assert_called_once_with(post, "--local")
  mocks.upload_markdown_file.assert_called_once_with("blog_posts/example.md", "blog_posts", post, "--local")

def test_main_skips_tags_when_missing(mocker):
  post = types.SimpleNamespace(metadata = { "name": "blog-post-example", "locale": "en", "slug": "blog-post-example", "title": "Post Title: A Clear Promise to the Reader", "summary": "A brief of the blog post", "category": "Testing" })

  mocks = run_script(mocker, ["upload_blog_post.py", "blog_posts/example.md"], post, None)

  databases = [call.args[0] for call in mocks.execute_sql_command.call_args_list]
  assert databases == ["contents-db", "contents-db"]

  mocks.upload_markdown_file.assert_called_once_with("blog_posts/example.md", "blog_posts", post, "--local")

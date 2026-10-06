-- Migration number: 0004 	 2026-09-30T00:50:16.157Z

-- projects definition

CREATE TABLE projects (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL CHECK(LENGTH(name) <= 100),
	locale TEXT NOT NULL CHECK(locale IN ('en', 'es')),
	slug TEXT NOT NULL CHECK(LENGTH(slug) <= 100),
	title TEXT NOT NULL CHECK(LENGTH(title) <= 100),
	summary TEXT NOT NULL CHECK(LENGTH(summary) <= 500),
	repository_url TEXT CHECK(LENGTH(repository_url) <= 256),
	author_id INTEGER NOT NULL,
	status TEXT NOT NULL CHECK(status IN ('published', 'draft', 'archived')),
	is_featured INTEGER DEFAULT (FALSE) NOT NULL CHECK (is_featured IN (0, 1)),
	published_at TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT
) STRICT;

CREATE UNIQUE INDEX projects_name_locale_IDX ON projects (name, locale);
CREATE UNIQUE INDEX projects_slug_locale_IDX ON projects (slug, locale);

-- project_tags definition

CREATE TABLE project_tags (
	project_id INTEGER NOT NULL,
	tag_id INTEGER NOT NULL,
	PRIMARY KEY (project_id,tag_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) STRICT;

-- project_blog_posts definition

CREATE TABLE project_blog_posts (
	project_id INTEGER NOT NULL,
	blog_post_id INTEGER NOT NULL,
	PRIMARY KEY (project_id,blog_post_id),
	FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
	FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) STRICT;

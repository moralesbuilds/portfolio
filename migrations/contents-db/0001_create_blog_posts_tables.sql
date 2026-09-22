-- Migration number: 0001 	 2026-09-15T17:28:07.125Z

-- categories definition

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(LENGTH(name) <= 100),
  locale TEXT NOT NULL CHECK(locale IN ('en', 'es')),
  slug TEXT NOT NULL CHECK(LENGTH(slug) <= 100),
  label TEXT NOT NULL CHECK(LENGTH(label) <= 100),
  description TEXT CHECK(LENGTH(description) <= 500)
) STRICT;

CREATE UNIQUE INDEX categories_name_locale_IDX ON categories (name, locale);
CREATE UNIQUE INDEX categories_slug_locale_IDX ON categories (slug, locale);

-- tags definition

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(LENGTH(name) <= 100),
  locale TEXT NOT NULL CHECK(locale IN ('en', 'es')),
  slug TEXT NOT NULL CHECK(LENGTH(slug) <= 100),
  label TEXT NOT NULL CHECK(LENGTH(label) <= 100)
) STRICT;

CREATE UNIQUE INDEX tags_name_locale_IDX ON tags (name, locale);
CREATE UNIQUE INDEX tags_slug_locale_IDX ON tags (slug, locale);

-- blog_posts definition

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- Translation key (e.g., 'hello-world') grouping locale variants
  locale TEXT NOT NULL CHECK(locale IN ('en', 'es')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('published', 'draft', 'archived')),
  summary TEXT,
  author_id INTEGER NOT NULL,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT
) STRICT;

CREATE UNIQUE INDEX blog_posts_name_locale_IDX ON blog_posts (name, locale);
CREATE UNIQUE INDEX blog_posts_slug_locale_IDX ON blog_posts (slug, locale);

-- blog_post_tags definition

CREATE TABLE blog_post_tags (
  blog_post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (blog_post_id, tag_id),
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) STRICT;

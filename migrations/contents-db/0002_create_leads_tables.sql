-- Migration number: 0002 	 2026-09-23T02:17:48.750Z

-- lead_sources definition

CREATE TABLE lead_sources (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL CHECK(LENGTH(name) <= 100)
) STRICT;

CREATE UNIQUE INDEX lead_sources_names_IDX ON lead_sources (name);

INSERT INTO lead_sources (name) VALUES ('website');

-- leads definition

CREATE TABLE leads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lead_source_id INTEGER NOT NULL,
	name TEXT NOT NULL CHECK(LENGTH(name) <= 100),
	email TEXT NOT NULL CHECK(LENGTH(email) <= 100),
	message TEXT NOT NULL CHECK(LENGTH(message) <= 2000),
	status TEXT NOT NULL CHECK(status IN ('new', 'read', 'archived')),
	locale TEXT NOT NULL CHECK(locale IN ('en', 'es')),
	ip_address TEXT,
	is_spam INTEGER DEFAULT (FALSE) NOT NULL,
	created_at TEXT NOT NULL,
	FOREIGN KEY (lead_source_id) REFERENCES lead_sources(id) ON DELETE RESTRICT
) STRICT;

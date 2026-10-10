-- Migration number: 0001 	 2026-10-10T01:37:39.481Z

-- metric_definitions definition

CREATE TABLE metric_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(LENGTH(name) <= 64),
  unit TEXT NOT NULL CHECK(unit IN ('bytes', 'ms', 'score', 'count', 'percent')),
  better TEXT NOT NULL CHECK(better IN ('lower', 'higher')),
  reference_value REAL, -- p. ej. A platform limit
  tag_type TEXT NOT NULL CHECK(tag_type IN ('none', 'commit_sha')),
  created_at TEXT NOT NULL
) STRICT;

CREATE UNIQUE INDEX metric_definitions_name_IDX on metric_definitions (name);

-- project_metrics definition

CREATE TABLE project_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_name TEXT NOT NULL CHECK(LENGTH(project_name) <= 100), -- = contents-db projects.name
  metric_definition_id INTEGER NOT NULL,
  is_public INTEGER NOT NULL DEFAULT (TRUE) CHECK(is_public IN (0, 1)),
  pinned INTEGER NOT NULL DEFAULT (FALSE) CHECK(pinned IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (metric_definition_id) REFERENCES metric_definitions(id)
) STRICT;

CREATE UNIQUE INDEX project_metrics_name_definition_IDX ON project_metrics (project_name, metric_definition_id);

-- metric_samples definition

CREATE TABLE metric_samples (
  project_metric_id INTEGER NOT NULL,
  timestamp INTEGER NOT NULL, -- Unix epoch in milliseconds
  value REAL NOT NULL,
  tag TEXT CHECK(tag IS NULL OR LENGTH(tag) <= 200),
  PRIMARY KEY (project_metric_id, timestamp),
  FOREIGN KEY (project_metric_id) REFERENCES project_metrics(id)
) STRICT, WITHOUT ROWID;

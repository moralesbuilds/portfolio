-- Migration number: 0002 	 2026-10-10T03:05:04.794Z

INSERT INTO metric_definitions (name, unit, better, reference_value, tag_type, created_at) VALUES
  ('worker.size.uncompressed', 'bytes', 'lower', 67108864, 'commit_sha', strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  ('worker.size.gzip', 'bytes', 'lower', NULL, 'commit_sha', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));

INSERT INTO project_metrics (project_name, metric_definition_id, is_public, pinned, sort_order, created_at) VALUES
  ('portfolio', (SELECT id FROM metric_definitions WHERE name = 'worker.size.uncompressed'), 1, 1, 0, strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  ('portfolio', (SELECT id FROM metric_definitions WHERE name = 'worker.size.gzip'), 1, 1, 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));

-- forcing new changes

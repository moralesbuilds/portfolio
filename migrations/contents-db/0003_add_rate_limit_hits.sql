-- Migration number: 0003 	 2026-09-26T21:57:13.794Z

-- rate_limit_hits definition

CREATE TABLE rate_limit_hits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  created_at INTEGER NOT NULL  -- ms since epoch
) STRICT; -- This table is generic so it can be reused by other parts of the system that requires rate limiting

CREATE INDEX idx_rate_limit_key_time ON rate_limit_hits (key, created_at); -- Speed up counting by key
CREATE INDEX idx_rate_limit_time ON rate_limit_hits (created_at); -- Speed up cleaning up old keys

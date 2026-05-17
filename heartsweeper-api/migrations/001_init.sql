CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  rows INTEGER NOT NULL,
  cols INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

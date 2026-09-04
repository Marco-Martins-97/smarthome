CREATE TABLE sessions (
    sid TEXT PRIMARY KEY,
    session TEXT NOT NULL,
    expires_at DATETIME NOT NULL
);
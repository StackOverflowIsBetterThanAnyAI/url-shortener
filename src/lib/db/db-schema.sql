CREATE TABLE IF NOT EXISTS links (
    short      CHAR(6)       PRIMARY KEY,
    url        VARCHAR(2048) NOT NULL,
    user_id    TEXT          NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS links_user_id_idx ON links (user_id);
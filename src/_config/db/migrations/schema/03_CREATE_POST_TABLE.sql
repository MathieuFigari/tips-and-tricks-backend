CREATE TABLE IF NOT EXISTS "post"
(
    "id"           SERIAL PRIMARY KEY,
    "title"        VARCHAR   NOT NULL,
    "slug"         VARCHAR   NOT NULL,
    "command"      TEXT      NOT NULL,
    "description"  TEXT      NULL,
    "message"      TEXT      NULL,
    "user_id"      INTEGER NOT NULL,
    "published_at" TIMESTAMPTZ        DEFAULT current_timestamp NOT NULL,
    "created_at"   TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at"   TIMESTAMP NULL
);

ALTER TABLE "post" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

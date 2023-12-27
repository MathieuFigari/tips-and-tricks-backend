CREATE TYPE roles AS ENUM ('admin', 'moderator');

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR UNIQUE NOT NULL,
    "username" VARCHAR UNIQUE NOT NULL,
    "password" VARCHAR NOT NULL,
    "roles" roles NULL,
    "refresh_token" VARCHAR UNIQUE NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
)

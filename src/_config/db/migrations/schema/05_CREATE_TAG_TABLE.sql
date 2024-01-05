CREATE TABLE IF NOT EXISTS "tag" (
    "id" SERIAL PRIMARY KEY,
    "label" VARCHAR UNIQUE NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
);

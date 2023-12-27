CREATE TABLE IF NOT EXISTS "tips" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,
    "command" TEXT NOT NULL,
    "description" TEXT NULL,
    "published_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    "updated_at" TIMESTAMPTZ NULL
);

ALTER TABLE "tips" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id")  ON DELETE CASCADE ON UPDATE CASCADE;
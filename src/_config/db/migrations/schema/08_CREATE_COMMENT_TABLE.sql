CREATE TABLE IF NOT EXISTS "comment" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "published_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
  "updated_at" TIMESTAMPTZ,
  "post_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL
);

ALTER TABLE "comment"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comment"
ADD FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

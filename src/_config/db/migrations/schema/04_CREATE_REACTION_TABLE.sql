DROP TYPE IF EXISTS reaction_enum;
CREATE TYPE reaction_enum AS ENUM ('like', 'dislike');

CREATE TABLE IF NOT EXISTS "reaction"
(
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reaction" reaction_enum NOT NULL
);

ALTER TABLE "reaction"
    ADD PRIMARY KEY ("post_id", "user_id"),
    ADD FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;


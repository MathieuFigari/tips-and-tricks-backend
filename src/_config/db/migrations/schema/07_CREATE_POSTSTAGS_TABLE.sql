CREATE TABLE IF NOT EXISTS "post_tags" (
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    PRIMARY KEY ("post_id", "tag_id"),
    FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE
);
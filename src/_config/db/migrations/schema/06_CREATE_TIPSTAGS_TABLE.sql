CREATE TABLE IF NOT EXISTS "tips_tags" (
    "tips_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    PRIMARY KEY ("tips_id", "tag_id"),
    FOREIGN KEY ("tips_id") REFERENCES "tips" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE
);
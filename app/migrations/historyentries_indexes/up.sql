-- migration: create_historyentries_indexes

BEGIN;

-- B-tree composite index for queries filtering by type (equality) and createdAt (range)
CREATE INDEX IF NOT EXISTS idx_historyentries_type_createdAt
  ON historyentries USING btree (type, createdAt);

-- B-tree composite index for queries filtering by type (equality), createdAt (range) and triggerHasBeenRepliedTo (equality),
CREATE INDEX IF NOT EXISTS idx_historyentries_type_createdAt_replied
  ON historyentries USING btree (type, createdAt, triggerHasBeenRepliedTo);

COMMIT;

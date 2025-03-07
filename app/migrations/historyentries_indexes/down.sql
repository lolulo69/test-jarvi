-- down migration: drop_historyentries_indexes

BEGIN;

DROP INDEX IF EXISTS idx_historyentries_type_createdAt;
DROP INDEX IF EXISTS idx_historyentries_type_createdAt_replied;

COMMIT;

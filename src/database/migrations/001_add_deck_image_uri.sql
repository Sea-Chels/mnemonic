-- Add image_uri column to decks table if it doesn't exist
-- SQLite doesn't support "IF NOT EXISTS" for ALTER TABLE, so we use a more complex approach
PRAGMA table_info(decks);

-- This will be handled in the migration code to check if column exists
ALTER TABLE decks ADD COLUMN image_uri TEXT;
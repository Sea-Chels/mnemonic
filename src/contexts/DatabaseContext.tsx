import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';

interface DatabaseContextValue {
  db: SQLite.SQLiteDatabase | null;
  isInitialized: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isInitialized: false,
  error: null,
});

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

const runMigrations = async (database: SQLite.SQLiteDatabase) => {
  try {
    // Check if image_uri column exists in decks table
    const tableInfo = await database.getAllAsync("PRAGMA table_info(decks);");
    const hasImageUri = tableInfo.some((column: any) => column.name === 'image_uri');
    
    if (!hasImageUri) {
      console.log('Adding image_uri column to decks table...');
      await database.execAsync('ALTER TABLE decks ADD COLUMN image_uri TEXT;');
    }
  } catch (error) {
    console.warn('Migration warning (this is usually fine for new databases):', error);
  }
};

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('mnemonic.db');
        
        // Create tables
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            color TEXT DEFAULT '#3366FF',
            icon TEXT DEFAULT 'book',
            image_uri TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deck_id INTEGER NOT NULL,
            front TEXT NOT NULL,
            back TEXT NOT NULL,
            difficulty INTEGER DEFAULT 0,
            interval INTEGER DEFAULT 1,
            repetitions INTEGER DEFAULT 0,
            ease_factor REAL DEFAULT 2.5,
            next_review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deck_id INTEGER NOT NULL,
            cards_studied INTEGER DEFAULT 0,
            cards_correct INTEGER DEFAULT 0,
            study_duration INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
          );
        `);

        // Run migrations for existing databases
        await runMigrations(database);

        setDb(database);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize database';
        setError(errorMessage);
        setIsInitialized(false);
        console.error('Database initialization error:', err);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isInitialized, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};
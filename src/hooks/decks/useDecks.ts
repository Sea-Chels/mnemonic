import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Deck } from '../../database/types';

export const useDecks = () => {
  const { db, isInitialized } = useDatabase();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDecks = useCallback(async () => {
    if (!db || !isInitialized) return;

    try {
      setLoading(true);
      setError(null);
      const result = await db.getAllAsync<Deck>('SELECT * FROM decks ORDER BY created_at DESC');
      setDecks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decks');
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isInitialized]);

  const createDeck = async (name: string, description?: string, color?: string, imageUri?: string) => {
    if (!db) throw new Error('Database not initialized');

    try {
      const result = await db.runAsync(
        'INSERT INTO decks (name, description, color, image_uri) VALUES (?, ?, ?, ?)',
        [name, description || null, color || '#3366FF', imageUri || null]
      );
      await loadDecks();
      return result.lastInsertRowId;
    } catch (err) {
      console.error('Error creating deck:', err);
      throw err;
    }
  };

  const updateDeck = async (id: number, updates: Partial<Deck>) => {
    if (!db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];
    
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }
    if (updates.image_uri !== undefined) {
      fields.push('image_uri = ?');
      values.push(updates.image_uri);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    try {
      await db.runAsync(
        `UPDATE decks SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      await loadDecks();
    } catch (err) {
      console.error('Error updating deck:', err);
      throw err;
    }
  };

  const deleteDeck = async (id: number) => {
    if (!db) throw new Error('Database not initialized');

    try {
      await db.runAsync('DELETE FROM decks WHERE id = ?', [id]);
      await loadDecks();
    } catch (err) {
      console.error('Error deleting deck:', err);
      throw err;
    }
  };

  const getDeckById = async (id: number): Promise<Deck | null> => {
    if (!db) throw new Error('Database not initialized');

    try {
      const result = await db.getFirstAsync<Deck>('SELECT * FROM decks WHERE id = ?', [id]);
      return result || null;
    } catch (err) {
      console.error('Error getting deck:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadDecks();
    }
  }, [isInitialized, loadDecks]);

  return {
    decks,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeckById,
    refreshDecks: loadDecks,
  };
};
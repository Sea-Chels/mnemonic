import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Flashcard } from '../../database/types';

export const useFlashcards = (deckId?: number) => {
  const { db, isInitialized } = useDatabase();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFlashcards = useCallback(async () => {
    if (!db || !isInitialized) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = 'SELECT * FROM flashcards';
      const params: any[] = [];
      
      if (deckId !== undefined) {
        query += ' WHERE deck_id = ?';
        params.push(deckId);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await db.getAllAsync<Flashcard>(query, params);
      setFlashcards(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flashcards');
      console.error('Error loading flashcards:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isInitialized, deckId]);

  const createFlashcard = async (deckId: number, front: string, back: string) => {
    if (!db) throw new Error('Database not initialized');

    try {
      const result = await db.runAsync(
        'INSERT INTO flashcards (deck_id, front, back) VALUES (?, ?, ?)',
        [deckId, front, back]
      );
      await loadFlashcards();
      return result.lastInsertRowId;
    } catch (err) {
      console.error('Error creating flashcard:', err);
      throw err;
    }
  };

  const updateFlashcard = async (id: number, updates: Partial<Flashcard>) => {
    if (!db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];
    
    if (updates.front !== undefined) {
      fields.push('front = ?');
      values.push(updates.front);
    }
    if (updates.back !== undefined) {
      fields.push('back = ?');
      values.push(updates.back);
    }
    if (updates.difficulty !== undefined) {
      fields.push('difficulty = ?');
      values.push(updates.difficulty);
    }
    if (updates.interval !== undefined) {
      fields.push('interval = ?');
      values.push(updates.interval);
    }
    if (updates.repetitions !== undefined) {
      fields.push('repetitions = ?');
      values.push(updates.repetitions);
    }
    if (updates.ease_factor !== undefined) {
      fields.push('ease_factor = ?');
      values.push(updates.ease_factor);
    }
    if (updates.next_review_date !== undefined) {
      fields.push('next_review_date = ?');
      values.push(updates.next_review_date);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    try {
      await db.runAsync(
        `UPDATE flashcards SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      await loadFlashcards();
    } catch (err) {
      console.error('Error updating flashcard:', err);
      throw err;
    }
  };

  const deleteFlashcard = async (id: number) => {
    if (!db) throw new Error('Database not initialized');

    try {
      await db.runAsync('DELETE FROM flashcards WHERE id = ?', [id]);
      await loadFlashcards();
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      throw err;
    }
  };

  const getFlashcardById = async (id: number): Promise<Flashcard | null> => {
    if (!db) throw new Error('Database not initialized');

    try {
      const result = await db.getFirstAsync<Flashcard>('SELECT * FROM flashcards WHERE id = ?', [id]);
      return result || null;
    } catch (err) {
      console.error('Error getting flashcard:', err);
      throw err;
    }
  };

  const getDueFlashcards = async (deckId: number): Promise<Flashcard[]> => {
    if (!db) throw new Error('Database not initialized');

    try {
      const result = await db.getAllAsync<Flashcard>(
        `SELECT * FROM flashcards 
         WHERE deck_id = ? AND next_review_date <= datetime('now')
         ORDER BY next_review_date ASC`,
        [deckId]
      );
      return result;
    } catch (err) {
      console.error('Error getting due flashcards:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadFlashcards();
    }
  }, [isInitialized, loadFlashcards]);

  return {
    flashcards,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardById,
    getDueFlashcards,
    refreshFlashcards: loadFlashcards,
  };
};
import { useState, useCallback } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Flashcard } from '../../database/types';
import { calculateSM2, ReviewQuality } from '../../utils/spacedRepetition';

export const useSpacedRepetition = () => {
  const { db } = useDatabase();
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    correct: 0,
    incorrect: 0,
  });

  const startStudySession = useCallback(async (deckId: number) => {
    if (!db) throw new Error('Database not initialized');

    try {
      // Get all due cards for the deck
      const dueCards = await db.getAllAsync<Flashcard>(
        `SELECT * FROM flashcards 
         WHERE deck_id = ? 
         ORDER BY next_review_date ASC, repetitions ASC
         LIMIT 20`,
        [deckId]
      );

      if (dueCards.length === 0) {
        // If no due cards, get new cards
        const newCards = await db.getAllAsync<Flashcard>(
          `SELECT * FROM flashcards 
           WHERE deck_id = ? AND repetitions = 0
           LIMIT 20`,
          [deckId]
        );
        
        setSessionCards(newCards);
        if (newCards.length > 0) {
          setCurrentCard(newCards[0]);
        }
      } else {
        setSessionCards(dueCards);
        setCurrentCard(dueCards[0]);
      }

      setSessionStats({ studied: 0, correct: 0, incorrect: 0 });
    } catch (err) {
      console.error('Error starting study session:', err);
      throw err;
    }
  }, [db]);

  const reviewCard = useCallback(async (quality: ReviewQuality) => {
    if (!db || !currentCard) throw new Error('No card to review');

    try {
      // Calculate new scheduling parameters
      const sm2Result = calculateSM2(
        quality,
        currentCard.repetitions,
        currentCard.interval,
        currentCard.ease_factor
      );

      // Update the card in the database
      await db.runAsync(
        `UPDATE flashcards 
         SET interval = ?, 
             repetitions = ?, 
             ease_factor = ?, 
             next_review_date = ?,
             difficulty = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          sm2Result.interval,
          sm2Result.repetitions,
          sm2Result.easeFactor,
          sm2Result.nextReviewDate,
          quality < 3 ? currentCard.difficulty + 1 : Math.max(0, currentCard.difficulty - 1),
          currentCard.id
        ]
      );

      // Update session statistics
      setSessionStats(prev => ({
        studied: prev.studied + 1,
        correct: quality >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
      }));

      // Move to next card
      const currentIndex = sessionCards.findIndex(c => c.id === currentCard.id);
      if (currentIndex < sessionCards.length - 1) {
        setCurrentCard(sessionCards[currentIndex + 1]);
      } else {
        // Session complete
        setCurrentCard(null);
      }
    } catch (err) {
      console.error('Error reviewing card:', err);
      throw err;
    }
  }, [db, currentCard, sessionCards]);

  const skipCard = useCallback(() => {
    if (!currentCard || sessionCards.length === 0) return;

    const currentIndex = sessionCards.findIndex(c => c.id === currentCard.id);
    if (currentIndex < sessionCards.length - 1) {
      setCurrentCard(sessionCards[currentIndex + 1]);
    } else {
      setCurrentCard(sessionCards[0]); // Loop back to first card
    }
  }, [currentCard, sessionCards]);

  const endSession = useCallback(async (deckId: number) => {
    if (!db) return;

    try {
      // Save study session to database
      await db.runAsync(
        `INSERT INTO study_sessions (deck_id, cards_studied, cards_correct, study_duration) 
         VALUES (?, ?, ?, ?)`,
        [
          deckId,
          sessionStats.studied,
          sessionStats.correct,
          0 // Duration would be calculated from actual time
        ]
      );

      // Reset session
      setCurrentCard(null);
      setSessionCards([]);
      setSessionStats({ studied: 0, correct: 0, incorrect: 0 });
    } catch (err) {
      console.error('Error ending session:', err);
    }
  }, [db, sessionStats]);

  return {
    currentCard,
    sessionCards,
    sessionStats,
    startStudySession,
    reviewCard,
    skipCard,
    endSession,
    isSessionActive: currentCard !== null,
    remainingCards: sessionCards.length - sessionStats.studied,
  };
};
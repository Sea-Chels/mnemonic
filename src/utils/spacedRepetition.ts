/**
 * SM-2 Algorithm Implementation
 * SuperMemo 2 algorithm for spaced repetition
 */

export interface SM2Result {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate: string;
}

export enum ReviewQuality {
  AGAIN = 0,  // Complete blackout
  HARD = 1,   // Incorrect response but remembered upon seeing answer
  GOOD = 3,   // Correct response with hesitation
  EASY = 5,   // Perfect response
}

/**
 * Calculate the next review schedule using SM-2 algorithm
 * @param quality - User's assessment of recall quality (0-5)
 * @param repetitions - Number of consecutive correct responses
 * @param previousInterval - Previous interval in days
 * @param previousEaseFactor - Previous ease factor (default 2.5)
 * @returns Updated scheduling parameters
 */
export function calculateSM2(
  quality: ReviewQuality,
  repetitions: number,
  previousInterval: number,
  previousEaseFactor: number = 2.5
): SM2Result {
  let interval: number;
  let newRepetitions: number;
  let easeFactor: number;

  // Calculate new ease factor
  easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor should not go below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Determine next interval and repetitions
  if (quality < 3) {
    // Incorrect response - reset repetitions
    newRepetitions = 0;
    interval = 1;
  } else {
    // Correct response
    newRepetitions = repetitions + 1;
    
    switch (newRepetitions) {
      case 1:
        interval = 1;
        break;
      case 2:
        interval = 6;
        break;
      default:
        interval = Math.round(previousInterval * easeFactor);
        break;
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    repetitions: newRepetitions,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

/**
 * Get initial SM-2 parameters for a new card
 */
export function getInitialSM2Parameters(): Partial<SM2Result> {
  return {
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
  };
}

/**
 * Calculate study statistics for a deck
 */
export interface DeckStatistics {
  totalCards: number;
  dueCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
}

export function calculateDeckStatistics(flashcards: any[]): DeckStatistics {
  const now = new Date();
  
  const stats: DeckStatistics = {
    totalCards: flashcards.length,
    dueCards: 0,
    newCards: 0,
    learningCards: 0,
    reviewCards: 0,
  };

  flashcards.forEach(card => {
    if (card.repetitions === 0) {
      stats.newCards++;
    } else if (card.repetitions < 3) {
      stats.learningCards++;
    } else {
      stats.reviewCards++;
    }

    const reviewDate = new Date(card.next_review_date);
    if (reviewDate <= now) {
      stats.dueCards++;
    }
  });

  return stats;
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days === 0) return 'Now';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} years`;
}
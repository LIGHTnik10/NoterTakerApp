import { Flashcard } from '../types';

// SM-2 Spaced Repetition Algorithm
export enum ReviewQuality {
  AGAIN = 0,    // Complete blackout
  HARD = 3,     // Correct response recalled with serious difficulty
  GOOD = 4,     // Correct response with hesitation
  EASY = 5,     // Perfect response
}

export function calculateNextReview(
  flashcard: Flashcard,
  quality: ReviewQuality
): Flashcard {
  let { interval, easeFactor, repetitions } = flashcard;

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next interval
  if (quality < ReviewQuality.HARD) {
    // Reset if quality is too low
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date (in days)
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...flashcard,
    interval,
    easeFactor,
    repetitions,
    nextReview,
    updatedAt: Date.now(),
  };
}

export function getFlashcardsDueForReview(flashcards: Record<string, Flashcard>): Flashcard[] {
  const now = Date.now();
  return Object.values(flashcards).filter(card => card.nextReview <= now);
}

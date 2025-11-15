import { Flashcard } from "../types";

// FSRS (Free Spaced Repetition Scheduler) Algorithm
// More efficient than SM-2, reduces reviews by 20-30%

export enum ReviewRating {
  AGAIN = 1, // Complete blackout
  HARD = 2, // Recalled with serious difficulty
  GOOD = 3, // Recalled with some hesitation
  EASY = 4, // Perfect recall
}

// FSRS Parameters (can be optimized with user data)
const FSRS_PARAMS = {
  requestRetention: 0.9, // Target 90% retention
  maximumInterval: 36500, // 100 years in days
  w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
    0.34, 1.26, 0.29, 2.61,
  ], // Default weights (can be trained on user data)
};

interface FSRSCard {
  difficulty: number; // 0-10
  stability: number; // Days
  state: "new" | "learning" | "review" | "relearning";
  lastReview?: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

function constrainDifficulty(difficulty: number): number {
  return Math.min(Math.max(difficulty, 1), 10);
}

function calculateStability(
  state: string,
  difficulty: number,
  stability: number,
  rating: ReviewRating,
): number {
  const w = FSRS_PARAMS.w;

  if (state === "new") {
    return w[rating - 1];
  }

  if (state === "review" || state === "relearning") {
    const retrievability = Math.exp(Math.log(0.9) * (1 / stability));

    if (rating === ReviewRating.AGAIN) {
      return (
        w[11] *
        Math.pow(difficulty, -w[12]) *
        (Math.pow(stability + 1, w[13]) - 1) *
        Math.exp(w[14] * (1 - retrievability))
      );
    } else {
      return (
        stability *
        (1 +
          Math.exp(w[8]) *
            (11 - difficulty) *
            Math.pow(stability, -w[9]) *
            (Math.exp((1 - retrievability) * w[10]) - 1))
      );
    }
  }

  return stability;
}

function calculateDifficulty(difficulty: number, rating: ReviewRating): number {
  const w = FSRS_PARAMS.w;
  const deltaD = -w[6] * (rating - 3);
  return constrainDifficulty(difficulty + deltaD);
}

function calculateInterval(
  stability: number,
  requestRetention: number,
): number {
  const interval =
    (stability / FSRS_PARAMS.w[9]) *
    (Math.pow(requestRetention, 1 / FSRS_PARAMS.w[10]) - 1);
  return Math.min(
    Math.max(Math.round(interval), 1),
    FSRS_PARAMS.maximumInterval,
  );
}

export function calculateNextReviewFSRS(
  flashcard: Flashcard,
  rating: ReviewRating,
): Flashcard {
  const card: FSRSCard = {
    difficulty: flashcard.difficulty ?? 0,
    stability: flashcard.stability ?? 0,
    state: flashcard.state ?? "new",
    interval: flashcard.interval,
    easeFactor: flashcard.easeFactor,
    repetitions: flashcard.repetitions,
  };

  const now = Date.now();
  let newState = card.state;

  // Update difficulty
  const newDifficulty =
    card.state !== "new"
      ? calculateDifficulty(card.difficulty, rating)
      : FSRS_PARAMS.w[4] - FSRS_PARAMS.w[5] * (rating - 3);

  // Update stability
  const newStability = calculateStability(
    card.state,
    newDifficulty,
    card.stability,
    rating,
  );

  // Determine new state
  if (rating === ReviewRating.AGAIN) {
    newState = card.state === "new" ? "learning" : "relearning";
  } else {
    if (card.state === "new" || card.state === "learning") {
      newState = rating === ReviewRating.EASY ? "review" : "learning";
    } else {
      newState = "review";
    }
  }

  // Calculate interval
  const newInterval = calculateInterval(
    newStability,
    FSRS_PARAMS.requestRetention,
  );

  // Calculate next review date
  const nextReview = now + newInterval * 24 * 60 * 60 * 1000;

  // Update repetitions
  const newRepetitions =
    rating === ReviewRating.AGAIN ? 0 : card.repetitions + 1;

  return {
    ...flashcard,
    difficulty: newDifficulty,
    stability: newStability,
    state: newState,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    updatedAt: now,
  };
}

export function getFlashcardsDueForReview(
  flashcards: Record<string, Flashcard>,
): Flashcard[] {
  const now = Date.now();
  return Object.values(flashcards)
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview); // Prioritize most overdue
}

export function calculateRetentionRate(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  const totalCards = sessions.reduce((sum, s) => sum + s.cardsReviewed, 0);
  const correctCards = sessions.reduce((sum, s) => sum + s.correctCards, 0);

  return totalCards > 0 ? (correctCards / totalCards) * 100 : 0;
}

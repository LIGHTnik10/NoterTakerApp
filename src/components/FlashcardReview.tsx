import React, { useState } from 'react';
import { Flashcard } from '../types';
import { ReviewQuality } from '../utils/spacedRepetition';

interface FlashcardReviewProps {
  flashcards: Flashcard[];
  onReview: (flashcardId: string, quality: ReviewQuality) => void;
  onFinish: () => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  flashcards,
  onReview,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Cards to Review</h2>
          <p className="text-gray-500 mb-4">Great job! You're all caught up.</p>
          <button
            onClick={onFinish}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex) / flashcards.length) * 100;

  const handleReview = (quality: ReviewQuality) => {
    onReview(currentCard.id, quality);
    setShowAnswer(false);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Flashcard Review</h2>
            <span className="text-gray-600">
              {currentIndex + 1} / {flashcards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[300px] flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center w-full">
                <div className="text-sm text-gray-500 mb-2">
                  {showAnswer ? 'Answer' : 'Question'}
                </div>
                <div className="text-2xl font-medium mb-6">
                  {showAnswer ? currentCard.back : currentCard.front}
                </div>
              </div>
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-lg font-medium"
              >
                Show Answer
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-center text-sm text-gray-600 mb-2">
                  How well did you know this?
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReview(ReviewQuality.AGAIN)}
                    className="py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.HARD)}
                    className="py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.GOOD)}
                    className="py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.EASY)}
                    className="py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

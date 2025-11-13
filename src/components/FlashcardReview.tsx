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
      <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
        <div className="text-center max-w-lg glass-card rounded-3xl p-12 animate-scale-in">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
            All Caught Up!
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Amazing work! You've reviewed all your flashcards. Keep up the great learning!
          </p>
          <button
            onClick={onFinish}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>🎴</span>
            <span>Back to Flashcards</span>
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
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass-card border-b border-gray-200 p-6 m-6 mb-0 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎯 Review Session
              </h2>
              <p className="text-gray-600 mt-1">Test your knowledge and strengthen your memory</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {currentIndex + 1} / {flashcards.length}
              </div>
              <div className="text-sm text-gray-500">Cards reviewed</div>
            </div>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Display */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="card p-10 min-h-[400px] flex flex-col justify-between animate-scale-in perspective-1000">
            {/* Card Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center w-full">
                <div className={`inline-block px-6 py-2 rounded-full mb-6 font-semibold text-sm ${
                  showAnswer
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                }`}>
                  {showAnswer ? '✅ ANSWER' : '❓ QUESTION'}
                </div>
                <div className="text-3xl font-bold text-gray-800 leading-relaxed px-4">
                  {showAnswer ? currentCard.back : currentCard.front}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all text-xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">👁️</span>
                <span>Show Answer</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-gray-700 mb-3 font-semibold">
                  How well did you recall this?
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => handleReview(ReviewQuality.AGAIN)}
                    className="py-4 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">❌</span>
                    <span className="text-sm">Again</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.HARD)}
                    className="py-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">😓</span>
                    <span className="text-sm">Hard</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.GOOD)}
                    className="py-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">👍</span>
                    <span className="text-sm">Good</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.EASY)}
                    className="py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">🎉</span>
                    <span className="text-sm">Easy</span>
                  </button>
                </div>
                <div className="text-xs text-center text-gray-500 mt-2">
                  Your answer helps schedule the next review optimally
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="glass-card border-t border-gray-200 p-4 m-6 mt-0 rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span>📊</span> Progress: {Math.round(progress)}%
          </span>
          <span className="flex items-center gap-2">
            <span>⏱️</span> {flashcards.length - currentIndex - 1} cards remaining
          </span>
          <span className="flex items-center gap-2">
            <span>🔥</span> Keep going!
          </span>
        </div>
      </div>
    </div>
  );
};

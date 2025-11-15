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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
        <div className="text-center max-w-2xl glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-16 animate-scale-in border border-green-500/20">
          <div className="text-6xl sm:text-8xl mb-6 sm:mb-8">🎉</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            All Caught Up!
          </h2>
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed">
            Amazing work! You've reviewed all your flashcards. Keep up the great learning!
          </p>
          <button
            onClick={onFinish}
            className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
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
      <div className="glass-card border-b border-slate-700/50 p-4 sm:p-6 lg:p-8 m-4 sm:m-6 lg:m-8 mb-0 rounded-t-2xl sm:rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                🎯 Review Session
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Test your knowledge and strengthen your memory</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-3xl sm:text-4xl font-bold text-slate-100">
                {currentIndex + 1} / {flashcards.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Cards reviewed</div>
            </div>
          </div>
          <div className="relative w-full bg-slate-800 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-700">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-purple-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Display */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl w-full">
          <div className="card p-6 sm:p-8 lg:p-12 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col justify-between animate-scale-in border border-slate-700/50">
            {/* Card Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center w-full">
                <div className={`inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 font-bold text-sm sm:text-base uppercase tracking-wider ${
                  showAnswer
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                }`}>
                  {showAnswer ? '✅ ANSWER' : '❓ QUESTION'}
                </div>
                <div className="text-xl sm:text-2xl lg:text-4xl font-bold text-slate-100 leading-relaxed px-4 sm:px-8">
                  {showAnswer ? currentCard.back : currentCard.front}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all text-lg sm:text-xl lg:text-2xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transform hover:-translate-y-2 flex items-center justify-center gap-3 sm:gap-4"
              >
                <span className="text-2xl sm:text-3xl">👁️</span>
                <span>Show Answer</span>
              </button>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="text-center text-slate-300 mb-3 sm:mb-4 font-bold text-base sm:text-lg">
                  How well did you recall this?
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleReview(ReviewQuality.AGAIN)}
                    className="py-4 sm:py-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all font-bold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-2xl sm:text-3xl">❌</span>
                    <span className="text-sm sm:text-base">Again</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.HARD)}
                    className="py-4 sm:py-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl sm:rounded-2xl hover:from-orange-600 hover:to-amber-700 transition-all font-bold shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-2xl sm:text-3xl">😓</span>
                    <span className="text-sm sm:text-base">Hard</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.GOOD)}
                    className="py-4 sm:py-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-2xl sm:text-3xl">👍</span>
                    <span className="text-sm sm:text-base">Good</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewQuality.EASY)}
                    className="py-4 sm:py-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl sm:rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-2xl sm:text-3xl">🎉</span>
                    <span className="text-sm sm:text-base">Easy</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-center text-slate-400 mt-3 sm:mt-4 font-medium">
                  Your answer helps schedule the next review optimally
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="glass-card border-t border-slate-700/50 p-4 sm:p-6 m-4 sm:m-6 lg:m-8 mt-0 rounded-b-2xl sm:rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-sm sm:text-base text-slate-300 font-medium">
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">📊</span> Progress: <span className="text-indigo-400 font-bold">{Math.round(progress)}%</span>
          </span>
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">⏱️</span> <span className="text-purple-400 font-bold">{flashcards.length - currentIndex - 1}</span> remaining
          </span>
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">🔥</span> Keep going!
          </span>
        </div>
      </div>
    </div>
  );
};

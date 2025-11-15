import React, { useState } from "react";
import { Flashcard, UserSettings } from "../types";
import { ReviewRating } from "../utils/fsrs";

interface FlashcardReviewProps {
  flashcards: Flashcard[];
  onReview: (flashcardId: string, rating: ReviewRating) => void;
  onFinish: () => void;
  settings: UserSettings;
  dailyReviewed: number;
  streak: number;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  flashcards,
  onReview,
  onFinish,
  settings,
  dailyReviewed,
  streak,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  if (flashcards.length === 0) {
    const goalMet = dailyReviewed >= settings.dailyGoal;

    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
        <div className="text-center max-w-2xl glass-card rounded-3xl p-16 animate-scale-in border border-green-500/20">
          <div className="text-8xl mb-8">{goalMet ? "🎉" : "✨"}</div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            {goalMet ? "Goal Achieved!" : "All Caught Up!"}
          </h2>
          <p className="text-slate-300 text-xl mb-10 leading-relaxed">
            {goalMet
              ? `Amazing work! You've reviewed ${dailyReviewed} cards today and met your daily goal!`
              : "You've reviewed all your due flashcards. Keep up the great learning!"}
          </p>

          {/* Streak Display */}
          {streak > 0 && (
            <div className="mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-5xl streak-fire">🔥</span>
                <span className="text-6xl font-black text-orange-400">
                  {streak}
                </span>
              </div>
              <div className="text-orange-300 font-bold text-lg">
                Day Streak!
              </div>
            </div>
          )}

          {/* Daily Progress */}
          <div className="mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-3">Daily Progress</div>
            <div className="relative w-full bg-slate-800 rounded-full h-4 mb-3 overflow-hidden border border-slate-700">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${Math.min((dailyReviewed / settings.dailyGoal) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="text-slate-300 font-bold">
              {dailyReviewed} / {settings.dailyGoal} cards
            </div>
          </div>

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
  const progress = (currentIndex / flashcards.length) * 100;
  const totalReviewed = dailyReviewed + currentIndex;

  const handleReview = (rating: ReviewRating) => {
    if (rating >= ReviewRating.GOOD) {
      setSessionCorrect(sessionCorrect + 1);
    }

    onReview(currentCard.id, rating);
    setShowAnswer(false);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const renderCardContent = () => {
    if (currentCard.type === "cloze") {
      return (
        <div className="text-4xl font-bold text-slate-100 leading-relaxed px-8">
          {showAnswer ? (
            <div>
              <div className="text-2xl text-slate-400 mb-4">Answer:</div>
              <div className="text-green-400">{currentCard.back}</div>
            </div>
          ) : (
            currentCard.front
          )}
        </div>
      );
    }

    return (
      <div className="text-4xl font-bold text-slate-100 leading-relaxed px-8">
        {showAnswer ? currentCard.back : currentCard.front}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass-card border-b border-slate-700/50 p-8 m-8 mb-0 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                🎯 Review Session
              </h2>
              <p className="text-slate-400 text-lg">
                Using {settings.reviewAlgorithm} algorithm • Target:{" "}
                {settings.retentionTarget}% retention
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-100">
                {currentIndex + 1} / {flashcards.length}
              </div>
              <div className="text-sm text-slate-400 font-medium">
                Cards reviewed
              </div>
            </div>
          </div>

          {/* Session Progress */}
          <div className="relative w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700 mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-purple-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Daily Goal Progress */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                Daily Goal:{" "}
                <span className="text-indigo-400 font-bold">
                  {totalReviewed}
                </span>{" "}
                / {settings.dailyGoal}
              </span>
              {streak > 0 && (
                <span className="flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold">
                  <span className="streak-fire">🔥</span>
                  {streak} day streak
                </span>
              )}
            </div>
            <div className="text-slate-400">
              Accuracy:{" "}
              <span className="text-green-400 font-bold">
                {currentIndex > 0
                  ? Math.round((sessionCorrect / currentIndex) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Display */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="max-w-4xl w-full">
          <div className="card p-12 min-h-[500px] flex flex-col justify-between animate-scale-in border border-slate-700/50">
            {/* Card Type Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-bold">
                {currentCard.type === "cloze"
                  ? "📝 Cloze Deletion"
                  : "🎴 Basic Flashcard"}
              </span>
            </div>

            {/* Card Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center w-full">
                <div
                  className={`inline-block px-8 py-3 rounded-2xl mb-8 font-bold text-base uppercase tracking-wider ${
                    showAnswer
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  }`}
                >
                  {showAnswer ? "✅ ANSWER" : "❓ QUESTION"}
                </div>
                {renderCardContent()}

                {/* Card Stats */}
                {currentCard.repetitions > 0 && (
                  <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
                    <span>Reviewed: {currentCard.repetitions} times</span>
                    {currentCard.interval > 0 && (
                      <span>Interval: {currentCard.interval} days</span>
                    )}
                    {settings.reviewAlgorithm === "FSRS" &&
                      currentCard.stability && (
                        <span>
                          Stability: {Math.round(currentCard.stability)} days
                        </span>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all text-2xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transform hover:-translate-y-2 flex items-center justify-center gap-4"
              >
                <span className="text-3xl">👁️</span>
                <span>Show Answer</span>
              </button>
            ) : (
              <div className="space-y-5">
                <div className="text-center text-slate-300 mb-4 font-bold text-lg">
                  How well did you recall this?
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <button
                    onClick={() => handleReview(ReviewRating.AGAIN)}
                    className="py-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all font-bold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">❌</span>
                    <span className="text-base">Again</span>
                    <span className="text-xs opacity-75">&lt;10m</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewRating.HARD)}
                    className="py-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl hover:from-orange-600 hover:to-amber-700 transition-all font-bold shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">😓</span>
                    <span className="text-base">Hard</span>
                    <span className="text-xs opacity-75">Difficult</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewRating.GOOD)}
                    className="py-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">👍</span>
                    <span className="text-base">Good</span>
                    <span className="text-xs opacity-75">Optimal</span>
                  </button>
                  <button
                    onClick={() => handleReview(ReviewRating.EASY)}
                    className="py-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-2 flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl">🎉</span>
                    <span className="text-base">Easy</span>
                    <span className="text-xs opacity-75">Perfect!</span>
                  </button>
                </div>
                <div className="text-sm text-center text-slate-400 mt-4 font-medium">
                  Your rating optimizes the next review schedule using{" "}
                  {settings.reviewAlgorithm}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="glass-card border-t border-slate-700/50 p-6 m-8 mt-0 rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-12 text-base text-slate-300 font-medium">
          <span className="flex items-center gap-3">
            <span className="text-xl">📊</span> Progress:{" "}
            <span className="text-indigo-400 font-bold">
              {Math.round(progress)}%
            </span>
          </span>
          <span className="flex items-center gap-3">
            <span className="text-xl">⏱️</span>{" "}
            <span className="text-purple-400 font-bold">
              {flashcards.length - currentIndex - 1}
            </span>{" "}
            cards remaining
          </span>
          <span className="flex items-center gap-3">
            <span className="text-xl">✨</span>{" "}
            <span className="text-green-400 font-bold">{sessionCorrect}</span>{" "}
            correct
          </span>
        </div>
      </div>
    </div>
  );
};

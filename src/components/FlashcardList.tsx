import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardListProps {
  flashcards: Record<string, Flashcard>;
  onDeleteFlashcard: (flashcardId: string) => void;
  onCreateFlashcard: () => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcards,
  onDeleteFlashcard,
  onCreateFlashcard,
}) => {
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [showForm, setShowForm] = useState(false);

  const flashcardsList = Object.values(flashcards).sort((a, b) => b.createdAt - a.createdAt);

  const handleCreate = () => {
    if (newFront.trim() && newBack.trim()) {
      // This will be handled by the parent
      setNewFront('');
      setNewBack('');
      setShowForm(false);
      onCreateFlashcard();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getDaysUntilReview = (nextReview: number) => {
    const days = Math.ceil((nextReview - Date.now()) / (24 * 60 * 60 * 1000));
    if (days < 0) return 'Due now';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-3">
              🎴 Flashcards
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Master your knowledge with intelligent spaced repetition</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>✨</span>
            <span>New Flashcard</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="glass-card rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <div className="text-3xl font-bold text-slate-100 mb-1">{flashcardsList.length}</div>
            <div className="text-sm text-slate-400 font-medium">Total Cards</div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✅</div>
            <div className="text-3xl font-bold text-slate-100 mb-1">
              {flashcardsList.filter(f => f.repetitions > 0).length}
            </div>
            <div className="text-sm text-slate-400 font-medium">Reviewed</div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔥</div>
            <div className="text-3xl font-bold text-slate-100 mb-1">
              {flashcardsList.filter(f => f.nextReview <= Date.now()).length}
            </div>
            <div className="text-sm text-slate-400 font-medium">Due Today</div>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="card mb-10 p-10 animate-slide-up border border-indigo-500/20">
            <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">✨ Create New Flashcard</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <span>🎯</span> Front (Question)
                </label>
                <input
                  type="text"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="What do you want to remember?"
                  className="input-field text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <span>💡</span> Back (Answer)
                </label>
                <input
                  type="text"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="The answer or explanation"
                  className="input-field text-base"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCreate}
                  className="btn-success flex items-center gap-2"
                >
                  <span>🎉</span>
                  <span>Create Flashcard</span>
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flashcards List */}
        <div className="space-y-5">
          {flashcardsList.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-3xl animate-scale-in border border-indigo-500/20">
              <div className="text-7xl mb-8">🎴</div>
              <h3 className="text-3xl font-bold text-slate-100 mb-4">No Flashcards Yet</h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Create flashcards manually or generate them from your notes using the <code className="bg-slate-800 text-amber-400 px-2 py-1 rounded font-mono text-sm">::</code> syntax
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>✨</span>
                <span>Create Your First Flashcard</span>
              </button>
            </div>
          ) : (
            flashcardsList.map((flashcard, index) => (
              <div
                key={flashcard.id}
                className="card p-4 sm:p-6 lg:p-8 hover:scale-[1.01] transition-all duration-300 animate-slide-up border border-slate-700/50 hover:border-indigo-500/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6">
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-500/20">
                        <div className="text-xs font-bold text-indigo-400 mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-wider">
                          <span>❓</span> Question
                        </div>
                        <div className="text-base sm:text-lg lg:text-xl font-semibold text-slate-100 leading-relaxed">{flashcard.front}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20">
                        <div className="text-xs font-bold text-green-400 mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-wider">
                          <span>✅</span> Answer
                        </div>
                        <div className="text-base sm:text-lg lg:text-xl font-medium text-slate-100 leading-relaxed">{flashcard.back}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-8 text-xs sm:text-sm">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <span>📅</span> {formatDate(flashcard.createdAt)}
                      </span>
                      <span className={`flex items-center gap-2 font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl ${
                        flashcard.nextReview <= Date.now()
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        <span>⏰</span> {getDaysUntilReview(flashcard.nextReview)}
                      </span>
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <span>🔁</span> {flashcard.repetitions} reviews
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteFlashcard(flashcard.id)}
                    className="btn-danger flex items-center gap-2 w-full lg:w-auto justify-center"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

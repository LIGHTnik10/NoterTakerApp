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
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎴 Flashcards
            </h2>
            <p className="text-gray-600 mt-2">Master your knowledge with spaced repetition</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <span>✨</span>
            <span>New Flashcard</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-6 border border-blue-100">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-800">{flashcardsList.length}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-green-100">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-800">
              {flashcardsList.filter(f => f.repetitions > 0).length}
            </div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-purple-100">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-800">
              {flashcardsList.filter(f => f.nextReview <= Date.now()).length}
            </div>
            <div className="text-sm text-gray-600">Due Today</div>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="card mb-8 p-8 animate-slide-up">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">✨ Create New Flashcard</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🎯</span> Front (Question)
                </label>
                <input
                  type="text"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="What do you want to remember?"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>💡</span> Back (Answer)
                </label>
                <input
                  type="text"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="The answer or explanation"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
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
        <div className="space-y-4">
          {flashcardsList.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl animate-scale-in">
              <div className="text-6xl mb-6">🎴</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Flashcards Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create flashcards manually or generate them from your notes using the :: syntax
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
                className="card p-6 hover:scale-[1.01] transition-transform animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                        <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                          <span>❓</span> QUESTION
                        </div>
                        <div className="text-lg font-semibold text-gray-800">{flashcard.front}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                        <div className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                          <span>✅</span> ANSWER
                        </div>
                        <div className="text-lg font-medium text-gray-800">{flashcard.back}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <span>📅</span> {formatDate(flashcard.createdAt)}
                      </span>
                      <span className={`flex items-center gap-1 font-semibold px-3 py-1 rounded-full ${
                        flashcard.nextReview <= Date.now()
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <span>⏰</span> {getDaysUntilReview(flashcard.nextReview)}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <span>🔁</span> {flashcard.repetitions} reviews
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteFlashcard(flashcard.id)}
                    className="btn-danger ml-6"
                  >
                    🗑️ Delete
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

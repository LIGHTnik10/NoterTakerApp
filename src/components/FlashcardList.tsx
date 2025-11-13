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
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Flashcards</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            + New Flashcard
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Flashcard</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front (Question)
                </label>
                <input
                  type="text"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="Enter question"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Back (Answer)
                </label>
                <input
                  type="text"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="Enter answer"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {flashcardsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No flashcards yet. Create one or generate from notes!</p>
            </div>
          ) : (
            flashcardsList.map((flashcard) => (
              <div key={flashcard.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Front</div>
                      <div className="text-lg font-medium">{flashcard.front}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Back</div>
                      <div className="text-lg">{flashcard.back}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {formatDate(flashcard.createdAt)}</span>
                      <span className="font-medium">{getDaysUntilReview(flashcard.nextReview)}</span>
                      <span>Repetitions: {flashcard.repetitions}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteFlashcard(flashcard.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Delete
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

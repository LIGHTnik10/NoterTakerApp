import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  notes: Record<string, Note>;
  selectedNoteId: string | null;
  currentView: 'notes' | 'flashcards' | 'review';
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
  onChangeView: (view: 'notes' | 'flashcards' | 'review') => void;
  flashcardsDueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  currentView,
  onSelectNote,
  onNewNote,
  onChangeView,
  flashcardsDueCount,
}) => {
  const notesList = Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">RemNote Clone</h1>
      </div>

      <div className="p-2 space-y-1">
        <button
          onClick={() => onChangeView('notes')}
          className={`w-full text-left px-3 py-2 rounded transition ${
            currentView === 'notes'
              ? 'bg-blue-600'
              : 'hover:bg-gray-800'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => onChangeView('flashcards')}
          className={`w-full text-left px-3 py-2 rounded transition ${
            currentView === 'flashcards'
              ? 'bg-blue-600'
              : 'hover:bg-gray-800'
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => onChangeView('review')}
          className={`w-full text-left px-3 py-2 rounded transition flex items-center justify-between ${
            currentView === 'review'
              ? 'bg-blue-600'
              : 'hover:bg-gray-800'
          }`}
        >
          <span>Review</span>
          {flashcardsDueCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {flashcardsDueCount}
            </span>
          )}
        </button>
      </div>

      {currentView === 'notes' && (
        <>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onNewNote}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            >
              + New Note
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {notesList.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No notes yet
                </div>
              ) : (
                notesList.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedNoteId === note.id
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {note.content.substring(0, 50)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

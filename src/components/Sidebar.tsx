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
    <div className="w-80 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white border-opacity-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              RemNote
            </h1>
            <p className="text-xs text-gray-400">Smart Learning</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => onChangeView('notes')}
          className={`sidebar-item ${currentView === 'notes' ? 'active' : ''}`}
        >
          <span className="text-xl">📝</span>
          <span>Notes</span>
        </button>
        <button
          onClick={() => onChangeView('flashcards')}
          className={`sidebar-item ${currentView === 'flashcards' ? 'active' : ''}`}
        >
          <span className="text-xl">🎴</span>
          <span>Flashcards</span>
        </button>
        <button
          onClick={() => onChangeView('review')}
          className={`sidebar-item ${currentView === 'review' ? 'active' : ''} justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <span>Review</span>
          </div>
          {flashcardsDueCount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
              {flashcardsDueCount}
            </span>
          )}
        </button>
      </div>

      {currentView === 'notes' && (
        <>
          {/* New Note Button */}
          <div className="px-4 py-3">
            <button
              onClick={onNewNote}
              className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              <span>New Note</span>
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="text-xs font-semibold text-gray-400 mb-2 px-1">
              RECENT NOTES
            </div>
            <div className="space-y-2">
              {notesList.length === 0 ? (
                <div className="text-center text-gray-400 py-12 animate-fade-in">
                  <div className="text-4xl mb-3">📭</div>
                  <div className="text-sm">No notes yet</div>
                  <div className="text-xs mt-1">Create your first note!</div>
                </div>
              ) : (
                notesList.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      selectedNoteId === note.id
                        ? 'bg-white bg-opacity-20 shadow-lg ring-2 ring-white ring-opacity-30'
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5">📄</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate group-hover:text-blue-200 transition-colors">
                          {note.title}
                        </div>
                        <div className="text-xs text-gray-400 truncate mt-1">
                          {note.content.substring(0, 60)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-white border-opacity-10 text-center">
        <div className="text-xs text-gray-400">
          {Object.keys(notes).length} notes • {Object.keys(notes).reduce((acc, id) => {
            const content = notes[id].content;
            const matches = content.match(/(.+?)::\s*(.+)/g);
            return acc + (matches ? matches.length : 0);
          }, 0)} flashcards
        </div>
      </div>
    </div>
  );
};

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
    <div className="w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 hover:border-slate-700 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2 group cursor-default">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:shadow-purple-900/70 group-hover:scale-110 transition-all duration-300">
            <span className="text-2xl group-hover:scale-125 transition-transform">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
              RemNote
            </h1>
            <p className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Smart Learning Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2 animate-fade-in">
        <button
          onClick={() => onChangeView('notes')}
          className={`sidebar-item group ${currentView === 'notes' ? 'active' : ''}`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">📝</span>
          <span>Notes</span>
        </button>
        <button
          onClick={() => onChangeView('flashcards')}
          className={`sidebar-item group ${currentView === 'flashcards' ? 'active' : ''}`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">🎴</span>
          <span>Flashcards</span>
        </button>
        <button
          onClick={() => onChangeView('review')}
          className={`sidebar-item group ${currentView === 'review' ? 'active' : ''} justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl group-hover:scale-125 transition-transform inline-block">🎯</span>
            <span>Review</span>
          </div>
          {flashcardsDueCount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse hover:shadow-red-500/50 hover:scale-110 transition-all duration-300">
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              <span>New Note</span>
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1 hover:text-slate-400 transition-colors">
              Recent Notes
            </div>
            <div className="space-y-2">
              {notesList.length === 0 ? (
                <div className="text-center text-slate-400 py-16 animate-fade-in">
                  <div className="text-5xl mb-4 opacity-50 hover:opacity-70 hover:scale-110 transition-all duration-300 cursor-default">📭</div>
                  <div className="text-sm font-medium">No notes yet</div>
                  <div className="text-xs mt-2 text-slate-500">Click the button above to start</div>
                </div>
              ) : (
                notesList.map((note, index) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 group animate-slide-up ${
                      selectedNoteId === note.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-lg ring-2 ring-indigo-500/30 hover:ring-indigo-500/50'
                        : 'bg-slate-800/40 hover:bg-slate-800/60 hover:shadow-md hover:scale-[1.02]'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all inline-block">📄</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {note.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-1.5 line-clamp-2 group-hover:text-slate-300 transition-colors">
                          {note.content.substring(0, 80)}
                        </div>
                        <div className="text-xs text-slate-500 mt-2 font-medium group-hover:text-slate-400 transition-colors">
                          {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
      <div className="p-4 border-t border-slate-800 text-center bg-slate-900/50">
        <div className="text-xs text-slate-400 font-medium">
          <span className="text-indigo-400 font-semibold">{Object.keys(notes).length}</span> notes • <span className="text-purple-400 font-semibold">{Object.keys(notes).reduce((acc, id) => {
            const content = notes[id].content;
            const matches = content.match(/(.+?)::\s*(.+)/g);
            return acc + (matches ? matches.length : 0);
          }, 0)}</span> flashcards
        </div>
      </div>
    </div>
  );
};

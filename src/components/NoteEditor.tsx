import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { parseFlashcardsFromNote } from '../utils/flashcardParser';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onCreateFlashcards: (noteId: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCreateFlashcards }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [flashcardCount, setFlashcardCount] = useState(0);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      updateFlashcardCount(note.content);
    } else {
      setTitle('');
      setContent('');
      setFlashcardCount(0);
    }
  }, [note]);

  const updateFlashcardCount = (text: string) => {
    const flashcards = parseFlashcardsFromNote(text);
    setFlashcardCount(flashcards.length);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateFlashcardCount(newContent);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const now = Date.now();
    const savedNote: Note = note
      ? { ...note, title, content, updatedAt: now }
      : {
          id: `note-${Date.now()}`,
          title,
          content,
          createdAt: now,
          updatedAt: now,
        };

    onSave(savedNote);
  };

  const handleCreateFlashcards = () => {
    if (note && flashcardCount > 0) {
      onCreateFlashcards(note.id);
    }
  };

  if (!note && !title && !content) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
        <div className="text-center max-w-lg glass-card rounded-3xl p-16 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/20">
          <div className="text-7xl mb-8 animate-scale-in hover:scale-110 transition-transform duration-300 cursor-default">✍️</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300">
            Start Creating
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed hover:text-slate-300 transition-colors">
            Select a note from the sidebar or create a new one to begin your learning journey
          </p>
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 text-sm text-slate-300 border border-indigo-500/20 hover:border-indigo-500/40 hover:from-indigo-500/15 hover:to-purple-500/15 transition-all duration-300 group cursor-default">
            <span className="font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">💡 Pro Tip:</span> Use the <code className="bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-slate-700 hover:text-amber-300 transition-all">::</code> syntax to create flashcards instantly!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fade-in p-8">
      <div className="glass-card rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden hover:shadow-indigo-500/20 transition-all duration-500">
        {/* Title Section */}
        <div className="border-b border-slate-700/50 p-8 bg-gradient-to-r from-slate-800/50 to-slate-800/30 hover:from-slate-800/60 hover:to-slate-800/40 transition-all duration-300">
          <input
            type="text"
            placeholder="✨ Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold outline-none bg-transparent placeholder-slate-500 text-slate-100 transition-all duration-200 focus:text-indigo-300"
          />
          <div className="flex items-center gap-6 mt-4 text-sm text-slate-400 animate-fade-in">
            <span className="flex items-center gap-2 font-medium hover:text-slate-300 transition-colors group">
              <span className="group-hover:scale-125 transition-transform inline-block">📅</span> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2 font-medium hover:text-slate-300 transition-colors group">
              <span className="group-hover:scale-125 transition-transform inline-block">📊</span> {content.length} characters
            </span>
            {flashcardCount > 0 && (
              <span className="flex items-center gap-2 text-amber-400 font-semibold animate-slide-up hover:scale-105 transition-transform group">
                <span className="group-hover:rotate-12 transition-transform inline-block">🎴</span> {flashcardCount} flashcard{flashcardCount !== 1 ? 's' : ''} detected
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 overflow-hidden">
          <textarea
            placeholder="Start writing your notes here...

💡 Quick Tip: Use the :: syntax to create flashcards
Example: What is React? :: A JavaScript library for building user interfaces"
            value={content}
            onChange={handleContentChange}
            className="w-full h-full outline-none resize-none text-lg leading-relaxed text-slate-200 placeholder-slate-500 bg-transparent focus:placeholder-slate-600 transition-all duration-200"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Action Bar */}
        <div className="border-t border-slate-700/50 p-8 bg-slate-800/30 hover:bg-slate-800/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              >
                <span className="inline-block group-hover:scale-110">💾</span>
                <span>Save Note</span>
              </button>
              {flashcardCount > 0 && (
                <button
                  onClick={handleCreateFlashcards}
                  className="btn-success flex items-center gap-2 animate-scale-in hover:scale-105 transition-transform duration-300"
                >
                  <span className="inline-block group-hover:rotate-12">🎯</span>
                  <span>Generate {flashcardCount} Flashcard{flashcardCount !== 1 ? 's' : ''}</span>
                </button>
              )}
            </div>

            {flashcardCount > 0 && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/30 animate-pulse hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 cursor-default">
                ⚡ {flashcardCount} ready!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

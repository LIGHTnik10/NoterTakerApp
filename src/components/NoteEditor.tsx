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
        <div className="text-center max-w-lg glass-card rounded-3xl p-16">
          <div className="text-7xl mb-8 animate-scale-in">✍️</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Start Creating
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Select a note from the sidebar or create a new one to begin your learning journey
          </p>
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 text-sm text-slate-300 border border-indigo-500/20">
            <span className="font-semibold text-indigo-300">💡 Pro Tip:</span> Use the <code className="bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">::</code> syntax to create flashcards instantly!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fade-in p-8">
      <div className="glass-card rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Title Section */}
        <div className="border-b border-slate-700/50 p-8 bg-gradient-to-r from-slate-800/50 to-slate-800/30">
          <input
            type="text"
            placeholder="✨ Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold outline-none bg-transparent placeholder-slate-500 text-slate-100"
          />
          <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              📅 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2 font-medium">
              📊 {content.length} characters
            </span>
            {flashcardCount > 0 && (
              <span className="flex items-center gap-2 text-amber-400 font-semibold">
                🎴 {flashcardCount} flashcard{flashcardCount !== 1 ? 's' : ''} detected
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
            className="w-full h-full outline-none resize-none text-lg leading-relaxed text-slate-200 placeholder-slate-500 bg-transparent"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Action Bar */}
        <div className="border-t border-slate-700/50 p-8 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <span>💾</span>
                <span>Save Note</span>
              </button>
              {flashcardCount > 0 && (
                <button
                  onClick={handleCreateFlashcards}
                  className="btn-success flex items-center gap-2 animate-scale-in"
                >
                  <span>🎯</span>
                  <span>Generate {flashcardCount} Flashcard{flashcardCount !== 1 ? 's' : ''}</span>
                </button>
              )}
            </div>

            {flashcardCount > 0 && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/30 animate-pulse">
                ⚡ {flashcardCount} ready!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

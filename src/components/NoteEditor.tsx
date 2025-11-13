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
        <div className="text-center max-w-md glass-card rounded-3xl p-12">
          <div className="text-6xl mb-6 animate-scale-in">✍️</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Start Creating
          </h2>
          <p className="text-gray-600 mb-6">
            Select a note from the sidebar or create a new one to begin your learning journey
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-sm text-gray-600">
            <span className="font-semibold">💡 Pro Tip:</span> Use the <code className="bg-white px-2 py-1 rounded text-xs font-mono">::</code> syntax to create flashcards!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fade-in m-6 mr-6">
      <div className="glass-card rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Title Section */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <input
            type="text"
            placeholder="✨ Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold outline-none bg-transparent placeholder-gray-400 text-gray-800"
          />
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              📅 {new Date().toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              📊 {content.length} characters
            </span>
            {flashcardCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                🎴 {flashcardCount} flashcard{flashcardCount !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 overflow-hidden">
          <textarea
            placeholder="Start writing your notes here...

💡 Quick Tip: Use the :: syntax to create flashcards
Example: What is the capital of France? :: Paris"
            value={content}
            onChange={handleContentChange}
            className="w-full h-full outline-none resize-none text-lg leading-relaxed text-gray-700 placeholder-gray-400 bg-transparent"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Action Bar */}
        <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg animate-pulse">
                🌟 {flashcardCount} ready to create!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

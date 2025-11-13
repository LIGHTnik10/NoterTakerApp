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
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Note Selected</h2>
          <p className="text-gray-500">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b p-4">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold outline-none"
        />
      </div>
      <div className="flex-1 p-4">
        <textarea
          placeholder="Write your notes here... Use :: to create flashcards (e.g., 'Question :: Answer')"
          value={content}
          onChange={handleContentChange}
          className="w-full h-full outline-none resize-none font-mono"
        />
      </div>
      <div className="border-t p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save Note
          </button>
          {flashcardCount > 0 && (
            <button
              onClick={handleCreateFlashcards}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Create {flashcardCount} Flashcard{flashcardCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {flashcardCount > 0 && (
            <span className="bg-yellow-100 px-2 py-1 rounded">
              {flashcardCount} flashcard{flashcardCount !== 1 ? 's' : ''} detected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

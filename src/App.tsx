import { useState } from 'react';
import { AppState, Note, Flashcard } from './types';
import { storage } from './services/storage';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { FlashcardList } from './components/FlashcardList';
import { FlashcardReview } from './components/FlashcardReview';
import { parseFlashcardsFromNote } from './utils/flashcardParser';
import { calculateNextReview, getFlashcardsDueForReview, ReviewQuality } from './utils/spacedRepetition';

function App() {
  const [state, setState] = useState<AppState>(() => storage.loadState());
  const [isNewNote, setIsNewNote] = useState(false);

  const selectedNote = state.selectedNoteId ? state.notes[state.selectedNoteId] : null;
  const flashcardsDue = getFlashcardsDueForReview(state.flashcards);

  const handleSaveNote = (note: Note) => {
    const newState = storage.saveNote(note, state);
    setState(newState);
    setIsNewNote(false);

    // Select the note after saving
    if (!state.selectedNoteId || state.selectedNoteId !== note.id) {
      setState(prev => ({ ...prev, selectedNoteId: note.id }));
    }
  };

  const handleSelectNote = (noteId: string) => {
    setState(prev => ({ ...prev, selectedNoteId: noteId }));
    setIsNewNote(false);
  };

  const handleNewNote = () => {
    setState(prev => ({ ...prev, selectedNoteId: null }));
    setIsNewNote(true);
  };

  const handleChangeView = (view: 'notes' | 'flashcards' | 'review') => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const handleCreateFlashcardsFromNote = (noteId: string) => {
    const note = state.notes[noteId];
    if (!note) return;

    const parsedFlashcards = parseFlashcardsFromNote(note.content);
    if (parsedFlashcards.length === 0) {
      alert('No flashcards found in note');
      return;
    }

    let newState = { ...state };
    parsedFlashcards.forEach(parsed => {
      const flashcard: Flashcard = {
        id: `flashcard-${Date.now()}-${Math.random()}`,
        front: parsed.front,
        back: parsed.back,
        noteId: note.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nextReview: Date.now(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
      };
      newState = storage.saveFlashcard(flashcard, newState);
    });

    setState(newState);
    alert(`Created ${parsedFlashcards.length} flashcard(s) from note!`);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      const newState = storage.deleteFlashcard(flashcardId, state);
      setState(newState);
    }
  };

  const handleReviewFlashcard = (flashcardId: string, quality: ReviewQuality) => {
    const flashcard = state.flashcards[flashcardId];
    if (!flashcard) return;

    const updatedFlashcard = calculateNextReview(flashcard, quality);
    const newState = storage.saveFlashcard(updatedFlashcard, state);
    setState(newState);
  };

  const handleFinishReview = () => {
    setState(prev => ({ ...prev, currentView: 'flashcards' }));
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        notes={state.notes}
        selectedNoteId={state.selectedNoteId}
        currentView={state.currentView}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onChangeView={handleChangeView}
        flashcardsDueCount={flashcardsDue.length}
      />

      {state.currentView === 'notes' && (
        <NoteEditor
          note={isNewNote ? null : selectedNote}
          onSave={handleSaveNote}
          onCreateFlashcards={handleCreateFlashcardsFromNote}
        />
      )}

      {state.currentView === 'flashcards' && (
        <FlashcardList
          flashcards={state.flashcards}
          onDeleteFlashcard={handleDeleteFlashcard}
          onCreateFlashcard={() => {
            // For now, we'll handle creation in the FlashcardList component
            // This is a placeholder that can be extended
          }}
        />
      )}

      {state.currentView === 'review' && (
        <FlashcardReview
          flashcards={flashcardsDue}
          onReview={handleReviewFlashcard}
          onFinish={handleFinishReview}
        />
      )}
    </div>
  );
}

export default App;

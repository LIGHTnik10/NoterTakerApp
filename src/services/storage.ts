import { Note, Flashcard, AppState } from '../types';

const STORAGE_KEY = 'remnote-clone-data';

export const storage = {
  loadState(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return {
      notes: {},
      flashcards: {},
      selectedNoteId: null,
      currentView: 'notes',
    };
  },

  saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  },

  saveNote(note: Note, state: AppState): AppState {
    const newState = {
      ...state,
      notes: {
        ...state.notes,
        [note.id]: note,
      },
    };
    this.saveState(newState);
    return newState;
  },

  deleteNote(noteId: string, state: AppState): AppState {
    const newNotes = { ...state.notes };
    delete newNotes[noteId];
    const newState = {
      ...state,
      notes: newNotes,
      selectedNoteId: state.selectedNoteId === noteId ? null : state.selectedNoteId,
    };
    this.saveState(newState);
    return newState;
  },

  saveFlashcard(flashcard: Flashcard, state: AppState): AppState {
    const newState = {
      ...state,
      flashcards: {
        ...state.flashcards,
        [flashcard.id]: flashcard,
      },
    };
    this.saveState(newState);
    return newState;
  },

  deleteFlashcard(flashcardId: string, state: AppState): AppState {
    const newFlashcards = { ...state.flashcards };
    delete newFlashcards[flashcardId];
    const newState = {
      ...state,
      flashcards: newFlashcards,
    };
    this.saveState(newState);
    return newState;
  },
};

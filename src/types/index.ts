export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  parentId?: string;
  children?: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  noteId?: string;
  createdAt: number;
  updatedAt: number;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface AppState {
  notes: Record<string, Note>;
  flashcards: Record<string, Flashcard>;
  selectedNoteId: string | null;
  currentView: 'notes' | 'flashcards' | 'review';
}

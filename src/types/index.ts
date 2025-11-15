// Rem (RemNote-style node) - the fundamental unit
export interface Rem {
  id: string;
  content: string;
  children: string[]; // IDs of child Rems
  parentId?: string;
  noteId?: string; // Which document this Rem belongs to
  isCollapsed?: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: string[]; // Tag IDs
  references?: string[]; // Referenced Rem/Note IDs
}

export interface Note {
  id: string;
  title: string;
  content: string; // For backward compatibility, will transition to Rems
  rems: string[]; // Root-level Rem IDs for this document
  createdAt: number;
  updatedAt: number;
  parentId?: string;
  children?: string[];
  tags?: string[];
  isFavorite?: boolean;
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children: string[]; // Note or Folder IDs
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  parentId?: string; // For hierarchical tags
  createdAt: number;
  updatedAt: number;
}

export interface Flashcard {
  id: string;
  type: "basic" | "cloze" | "reverse"; // Card types
  front: string;
  back: string;
  extra?: string; // Additional context
  remId?: string; // Link to source Rem
  noteId?: string;
  createdAt: number;
  updatedAt: number;
  // FSRS algorithm fields
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
  difficulty?: number; // FSRS difficulty
  stability?: number; // FSRS stability
  state?: "new" | "learning" | "review" | "relearning"; // FSRS state
}

export interface ReviewSession {
  id: string;
  startTime: number;
  endTime?: number;
  cardsReviewed: number;
  correctCards: number;
  totalTimeSpent: number;
}

export interface UserSettings {
  dailyGoal: number; // Cards per day
  theme: "light" | "dark";
  retentionTarget: number; // Percentage (e.g., 90)
  reviewAlgorithm: "SM2" | "FSRS";
  fontSize: "small" | "medium" | "large";
}

export interface AppState {
  notes: Record<string, Note>;
  rems: Record<string, Rem>;
  folders: Record<string, Folder>;
  tags: Record<string, Tag>;
  flashcards: Record<string, Flashcard>;
  selectedNoteId: string | null;
  currentView: "notes" | "flashcards" | "review" | "search" | "graph";
  searchQuery: string;
  settings: UserSettings;
  reviewSessions: ReviewSession[];
  streak: number;
  lastReviewDate?: number;
}

export interface Backlink {
  sourceId: string; // ID of the linking Rem/Note
  sourceType: "rem" | "note";
  targetId: string; // ID of the referenced Rem/Note
  context?: string; // Surrounding text for preview
}

export interface GraphNode {
  id: string;
  label: string;
  type: "note" | "rem" | "tag" | "folder";
  connections: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "hierarchy" | "reference" | "tag" | "portal";
}

import {
  Note,
  Flashcard,
  AppState,
  Rem,
  Tag,
  Folder,
  UserSettings,
  ReviewSession,
} from "../types";

const STORAGE_KEY = "remnote-clone-data";

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 20,
  theme: "dark",
  retentionTarget: 90,
  reviewAlgorithm: "FSRS",
  fontSize: "medium",
};

export const storage = {
  loadState(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Migrate old data structure if needed
        return {
          notes: parsed.notes || {},
          rems: parsed.rems || {},
          folders: parsed.folders || {},
          tags: parsed.tags || {},
          flashcards: parsed.flashcards || {},
          selectedNoteId: parsed.selectedNoteId || null,
          currentView: parsed.currentView || "notes",
          searchQuery: parsed.searchQuery || "",
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          reviewSessions: parsed.reviewSessions || [],
          streak: parsed.streak || 0,
          lastReviewDate: parsed.lastReviewDate,
        };
      }
    } catch (error) {
      console.error("Error loading state:", error);
    }
    return {
      notes: {},
      rems: {},
      folders: {},
      tags: {},
      flashcards: {},
      selectedNoteId: null,
      currentView: "notes",
      searchQuery: "",
      settings: DEFAULT_SETTINGS,
      reviewSessions: [],
      streak: 0,
    };
  },

  saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state:", error);
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

    // Delete associated flashcards
    const newFlashcards = { ...state.flashcards };
    Object.keys(newFlashcards).forEach((id) => {
      if (newFlashcards[id].noteId === noteId) {
        delete newFlashcards[id];
      }
    });

    const newState = {
      ...state,
      notes: newNotes,
      flashcards: newFlashcards,
      selectedNoteId:
        state.selectedNoteId === noteId ? null : state.selectedNoteId,
    };
    this.saveState(newState);
    return newState;
  },

  saveRem(rem: Rem, state: AppState): AppState {
    const newState = {
      ...state,
      rems: {
        ...state.rems,
        [rem.id]: rem,
      },
    };
    this.saveState(newState);
    return newState;
  },

  deleteRem(remId: string, state: AppState): AppState {
    const rem = state.rems[remId];
    if (!rem) return state;

    const newRems = { ...state.rems };

    // Recursively delete children
    const deleteRecursive = (id: string) => {
      const r = newRems[id];
      if (r && r.children) {
        r.children.forEach(deleteRecursive);
      }
      delete newRems[id];
    };

    deleteRecursive(remId);

    // Remove from parent's children array
    if (rem.parentId && newRems[rem.parentId]) {
      newRems[rem.parentId] = {
        ...newRems[rem.parentId],
        children: newRems[rem.parentId].children.filter((id) => id !== remId),
      };
    }

    const newState = {
      ...state,
      rems: newRems,
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

  saveTag(tag: Tag, state: AppState): AppState {
    const newState = {
      ...state,
      tags: {
        ...state.tags,
        [tag.id]: tag,
      },
    };
    this.saveState(newState);
    return newState;
  },

  deleteTag(tagId: string, state: AppState): AppState {
    const newTags = { ...state.tags };
    delete newTags[tagId];

    // Remove tag from all notes
    const newNotes = { ...state.notes };
    Object.keys(newNotes).forEach((id) => {
      if (newNotes[id].tags?.includes(tagId)) {
        newNotes[id] = {
          ...newNotes[id],
          tags: newNotes[id].tags!.filter((t) => t !== tagId),
        };
      }
    });

    const newState = {
      ...state,
      tags: newTags,
      notes: newNotes,
    };
    this.saveState(newState);
    return newState;
  },

  saveFolder(folder: Folder, state: AppState): AppState {
    const newState = {
      ...state,
      folders: {
        ...state.folders,
        [folder.id]: folder,
      },
    };
    this.saveState(newState);
    return newState;
  },

  updateSettings(settings: Partial<UserSettings>, state: AppState): AppState {
    const newState = {
      ...state,
      settings: {
        ...state.settings,
        ...settings,
      },
    };
    this.saveState(newState);
    return newState;
  },

  addReviewSession(session: ReviewSession, state: AppState): AppState {
    const newState = {
      ...state,
      reviewSessions: [...state.reviewSessions, session],
    };
    this.saveState(newState);
    return newState;
  },

  updateStreak(state: AppState): AppState {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReview = state.lastReviewDate
      ? new Date(state.lastReviewDate).setHours(0, 0, 0, 0)
      : 0;
    const daysSinceLastReview = (today - lastReview) / (1000 * 60 * 60 * 24);

    let newStreak = state.streak;
    if (daysSinceLastReview === 1) {
      newStreak++;
    } else if (daysSinceLastReview > 1) {
      newStreak = 1;
    }

    const newState = {
      ...state,
      streak: newStreak,
      lastReviewDate: Date.now(),
    };
    this.saveState(newState);
    return newState;
  },

  exportData(): string {
    const state = this.loadState();
    return JSON.stringify(state, null, 2);
  },

  importData(jsonData: string): AppState {
    try {
      const state = JSON.parse(jsonData);
      this.saveState(state);
      return state;
    } catch (error) {
      console.error("Error importing data:", error);
      throw new Error("Invalid data format");
    }
  },

  exportToMarkdown(notes: Record<string, Note>): string {
    let markdown = "# Notes Export\n\n";

    Object.values(notes).forEach((note) => {
      markdown += `## ${note.title}\n\n`;
      markdown += `${note.content}\n\n`;
      markdown += `*Created: ${new Date(note.createdAt).toLocaleString()}*\n\n`;
      markdown += "---\n\n";
    });

    return markdown;
  },
};

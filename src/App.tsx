import { useState, useEffect } from "react";
import { AppState, Note, Flashcard } from "./types";
import { storage } from "./services/storage";
import { Sidebar } from "./components/Sidebar";
import { NoteEditor } from "./components/NoteEditor";
import { FlashcardList } from "./components/FlashcardList";
import { FlashcardReview } from "./components/FlashcardReview";
import { Search } from "./components/Search";
import { ExportImport } from "./components/ExportImport";
import { parseFlashcardsFromNote } from "./utils/parser";
import {
  calculateNextReviewFSRS,
  getFlashcardsDueForReview,
  ReviewRating,
} from "./utils/fsrs";
import { calculateNextReview, ReviewQuality } from "./utils/spacedRepetition";

function App() {
  const [state, setState] = useState<AppState>(() => storage.loadState());
  const [isNewNote, setIsNewNote] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [dailyReviewed, setDailyReviewed] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedNote = state.selectedNoteId
    ? state.notes[state.selectedNoteId]
    : null;
  const flashcardsDue = getFlashcardsDueForReview(state.flashcards);

  // Apply theme
  useEffect(() => {
    if (state.settings.theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [state.settings.theme]);

  // Track daily reviewed count
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReview = state.lastReviewDate
      ? new Date(state.lastReviewDate).setHours(0, 0, 0, 0)
      : 0;

    if (today !== lastReview) {
      setDailyReviewed(0);
    } else {
      // Count reviews from today
      const todaysSessions = state.reviewSessions.filter((session) => {
        const sessionDate = new Date(session.startTime).setHours(0, 0, 0, 0);
        return sessionDate === today;
      });
      const total = todaysSessions.reduce(
        (sum, session) => sum + session.cardsReviewed,
        0,
      );
      setDailyReviewed(total);
    }
  }, [state.lastReviewDate, state.reviewSessions]);

  const handleSaveNote = (note: Note) => {
    const newState = storage.saveNote(note, state);
    setState(newState);
    setIsNewNote(false);

    // Select the note after saving
    if (!state.selectedNoteId || state.selectedNoteId !== note.id) {
      setState((prev) => ({ ...prev, selectedNoteId: note.id }));
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const newState = storage.deleteNote(noteId, state);
    setState(newState);
  };

  const handleSelectNote = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      selectedNoteId: noteId,
      currentView: "notes",
    }));
    setIsNewNote(false);
  };

  const handleNewNote = () => {
    setState((prev) => ({ ...prev, selectedNoteId: null }));
    setIsNewNote(true);
  };

  const handleChangeView = (
    view: "notes" | "flashcards" | "review" | "search" | "graph",
  ) => {
    if (view === "search") {
      setState((prev) => ({ ...prev, currentView: view }));
    } else {
      setState((prev) => ({ ...prev, currentView: view }));
      setShowExportImport(false);
    }
  };

  const handleCreateFlashcardsFromNote = (noteId: string) => {
    const note = state.notes[noteId];
    if (!note) return;

    const parsedFlashcards = parseFlashcardsFromNote(note.content);
    if (parsedFlashcards.length === 0) {
      alert("No flashcards found in note");
      return;
    }

    let newState = { ...state };
    parsedFlashcards.forEach((parsed) => {
      const flashcard: Flashcard = {
        id: `flashcard-${Date.now()}-${Math.random()}`,
        type: parsed.type,
        front: parsed.front,
        back: parsed.back,
        noteId: note.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nextReview: Date.now(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        state: "new",
      };
      newState = storage.saveFlashcard(flashcard, newState);
    });

    setState(newState);
    alert(`Created ${parsedFlashcards.length} flashcard(s) from note!`);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    if (confirm("Are you sure you want to delete this flashcard?")) {
      const newState = storage.deleteFlashcard(flashcardId, state);
      setState(newState);
    }
  };

  const handleReviewFlashcard = (flashcardId: string, rating: ReviewRating) => {
    const flashcard = state.flashcards[flashcardId];
    if (!flashcard) return;

    let updatedFlashcard: Flashcard;

    if (state.settings.reviewAlgorithm === "FSRS") {
      updatedFlashcard = calculateNextReviewFSRS(flashcard, rating);
    } else {
      // Convert ReviewRating to ReviewQuality for SM-2
      const qualityMap = {
        [ReviewRating.AGAIN]: ReviewQuality.AGAIN,
        [ReviewRating.HARD]: ReviewQuality.HARD,
        [ReviewRating.GOOD]: ReviewQuality.GOOD,
        [ReviewRating.EASY]: ReviewQuality.EASY,
      };
      updatedFlashcard = calculateNextReview(flashcard, qualityMap[rating]);
    }

    let newState = storage.saveFlashcard(updatedFlashcard, state);

    // Update streak and daily reviewed
    newState = storage.updateStreak(newState);
    setDailyReviewed((prev) => prev + 1);

    setState(newState);
  };

  const handleFinishReview = () => {
    setState((prev) => ({ ...prev, currentView: "flashcards" }));
  };

  const handleToggleTheme = () => {
    const newTheme = state.settings.theme === "dark" ? "light" : "dark";
    const newState = storage.updateSettings({ theme: newTheme }, state);
    setState(newState);
  };

  const handleImport = (importedState: AppState) => {
    setState(importedState);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={handleToggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={handleCloseSidebar}
        />
      )}

      <Sidebar
        notes={state.notes}
        selectedNoteId={state.selectedNoteId}
        currentView={state.currentView}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onChangeView={handleChangeView}
        flashcardsDueCount={flashcardsDue.length}
        settings={state.settings}
        onToggleTheme={handleToggleTheme}
        streak={state.streak}
        dailyReviewed={dailyReviewed}
        onDeleteNote={handleDeleteNote}
        isMobileOpen={isSidebarOpen}
        onCloseSidebar={handleCloseSidebar}
      />

      {state.currentView === "notes" && (
        <NoteEditor
          note={isNewNote ? null : selectedNote}
          onSave={handleSaveNote}
          onCreateFlashcards={handleCreateFlashcardsFromNote}
        />
      )}

      {state.currentView === "flashcards" && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
            <h2 className="text-2xl font-bold text-slate-100">Flashcards</h2>
            <button
              onClick={() => setShowExportImport(true)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <span>📦</span>
              <span>Export/Import</span>
            </button>
          </div>
          {showExportImport ? (
            <ExportImport
              state={state}
              onImport={handleImport}
              onClose={() => setShowExportImport(false)}
            />
          ) : (
            <FlashcardList
              flashcards={state.flashcards}
              onDeleteFlashcard={handleDeleteFlashcard}
              onCreateFlashcard={() => {
                // Placeholder for manual flashcard creation
              }}
            />
          )}
        </div>
      )}

      {state.currentView === "review" && (
        <FlashcardReview
          flashcards={flashcardsDue}
          onReview={handleReviewFlashcard}
          onFinish={handleFinishReview}
          settings={state.settings}
          dailyReviewed={dailyReviewed}
          streak={state.streak}
        />
      )}

      {state.currentView === "search" && (
        <Search
          state={state}
          onSelectNote={handleSelectNote}
          onClose={() => handleChangeView("notes")}
        />
      )}
    </div>
  );
}

export default App;

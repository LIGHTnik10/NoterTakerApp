import React, { useState } from "react";
import { Note, UserSettings } from "../types";

interface SidebarProps {
  notes: Record<string, Note>;
  selectedNoteId: string | null;
  currentView: "notes" | "flashcards" | "review" | "search" | "graph";
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
  onChangeView: (
    view: "notes" | "flashcards" | "review" | "search" | "graph",
  ) => void;
  flashcardsDueCount: number;
  settings: UserSettings;
  onToggleTheme: () => void;
  streak: number;
  dailyReviewed: number;
  onDeleteNote?: (noteId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  currentView,
  onSelectNote,
  onNewNote,
  onChangeView,
  flashcardsDueCount,
  settings,
  onToggleTheme,
  streak,
  dailyReviewed,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const notesList = Object.values(notes)
    .filter((note) => {
      if (searchQuery) {
        return (
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (showFavorites) {
        return note.isFavorite;
      }
      return true;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const totalFlashcards = Object.values(notes).reduce((acc, note) => {
    const matches = note.content.match(/(.+?)::\s*(.+)/g);
    const clozes = note.content.match(/\{[^}]+\}/g);
    return acc + (matches ? matches.length : 0) + (clozes ? clozes.length : 0);
  }, 0);

  const goalProgress = Math.min(
    (dailyReviewed / settings.dailyGoal) * 100,
    100,
  );

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDeleteNote?.(noteId);
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 hover:border-slate-700 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2 group cursor-default">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:shadow-purple-900/70 group-hover:scale-110 transition-all duration-300">
            <span className="text-2xl group-hover:scale-125 transition-transform">
              🧠
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
              RemNote Pro
            </h1>
            <p className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
              Smart Learning Platform
            </p>
          </div>
        </div>
      </div>

      {/* Daily Goal Progress */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-slate-300">Daily Goal</div>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-bold">
                <span className="streak-fire text-sm">🔥</span>
                <span>{streak}</span>
              </div>
            )}
          </div>
          <div className="relative w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {dailyReviewed} / {settings.dailyGoal} cards today
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2 animate-fade-in">
        <button
          onClick={() => onChangeView("notes")}
          className={`sidebar-item group ${currentView === "notes" ? "active" : ""}`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">
            📝
          </span>
          <span>Notes</span>
          <span className="ml-auto text-xs bg-slate-700 px-2 py-1 rounded-full">
            {Object.keys(notes).length}
          </span>
        </button>
        <button
          onClick={() => onChangeView("flashcards")}
          className={`sidebar-item group ${currentView === "flashcards" ? "active" : ""}`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">
            🎴
          </span>
          <span>Flashcards</span>
          <span className="ml-auto text-xs bg-slate-700 px-2 py-1 rounded-full">
            {totalFlashcards}
          </span>
        </button>
        <button
          onClick={() => onChangeView("review")}
          className={`sidebar-item group ${currentView === "review" ? "active" : ""} justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl group-hover:scale-125 transition-transform inline-block">
              🎯
            </span>
            <span>Review</span>
          </div>
          {flashcardsDueCount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse hover:shadow-red-500/50 hover:scale-110 transition-all duration-300">
              {flashcardsDueCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onChangeView("search")}
          className={`sidebar-item group ${currentView === "search" ? "active" : ""}`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">
            🔍
          </span>
          <span>Search</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={onToggleTheme}
          className="w-full sidebar-item justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {settings.theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span>Theme</span>
          </div>
          <span className="text-xs text-slate-400">
            {settings.theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>
      </div>

      {currentView === "notes" && (
        <>
          {/* New Note Button */}
          <div className="px-4 py-3">
            <button
              onClick={onNewNote}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              <span>New Note</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="px-4 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                showFavorites
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              ⭐ Favorites
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1 hover:text-slate-400 transition-colors">
              {showFavorites ? "Favorite Notes" : "Recent Notes"}
            </div>
            <div className="space-y-2">
              {notesList.length === 0 ? (
                <div className="text-center text-slate-400 py-16 animate-fade-in">
                  <div className="text-5xl mb-4 opacity-50 hover:opacity-70 hover:scale-110 transition-all duration-300 cursor-default">
                    {searchQuery ? "🔍" : showFavorites ? "⭐" : "📭"}
                  </div>
                  <div className="text-sm font-medium">
                    {searchQuery
                      ? "No matching notes"
                      : showFavorites
                        ? "No favorites yet"
                        : "No notes yet"}
                  </div>
                  {!searchQuery && !showFavorites && (
                    <div className="text-xs mt-2 text-slate-500">
                      Click the button above to start
                    </div>
                  )}
                </div>
              ) : (
                notesList.map((note, index) => (
                  <div
                    key={note.id}
                    className={`relative group animate-slide-up ${
                      selectedNoteId === note.id
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-lg ring-2 ring-indigo-500/30"
                        : "bg-slate-800/40 hover:bg-slate-800/60"
                    } rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <button
                      onClick={() => onSelectNote(note.id)}
                      className="w-full text-left px-4 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all inline-block">
                          {note.isFavorite ? "⭐" : "📄"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {note.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate mt-1.5 line-clamp-2 group-hover:text-slate-300 transition-colors">
                            {note.content.substring(0, 80)}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                              {new Date(note.updatedAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </div>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex gap-1">
                                {note.tags.slice(0, 2).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                    {onDeleteNote && (
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                      >
                        <span className="text-red-400 text-sm">🗑️</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-center bg-slate-900/50">
        <div className="text-xs text-slate-400 font-medium mb-2">
          <span className="text-indigo-400 font-semibold">
            {Object.keys(notes).length}
          </span>{" "}
          notes •
          <span className="text-purple-400 font-semibold ml-1">
            {totalFlashcards}
          </span>{" "}
          flashcards
        </div>
        <div className="text-xs text-slate-500">
          Powered by {settings.reviewAlgorithm} • v2.0
        </div>
      </div>
    </div>
  );
};

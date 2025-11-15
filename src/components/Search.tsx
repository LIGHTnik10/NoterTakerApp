import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { searchNotes, SearchResult, SearchFilters, highlightMatches } from '../utils/search';

interface SearchProps {
  state: AppState;
  onSelectNote: (noteId: string) => void;
  onClose: () => void;
}

export const Search: React.FC<SearchProps> = ({ state, onSelectNote, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query.trim() || Object.keys(filters).length > 0) {
      const searchResults = searchNotes(query, state, filters);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, filters, state]);

  const handleSelectResult = (noteId: string) => {
    onSelectNote(noteId);
    onClose();
  };

  const toggleFilter = (filterKey: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterKey] === value) {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = value as any;
      }
      return newFilters;
    });
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              🔍 Search
            </h2>
            <p className="text-slate-400 text-lg">Find anything in your notes</p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary flex items-center gap-2"
          >
            <span>✕</span>
            <span>Close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            autoFocus
            className="input-field text-lg"
          />
        </div>

        {/* Filter Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
          >
            <span>{showFilters ? '▼' : '▶'}</span>
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => toggleFilter('hasFlashcards', true)}
                className={`px-4 py-3 rounded-xl transition-all ${
                  filters.hasFlashcards
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="mr-2">🎴</span>
                Has Flashcards
              </button>
              <button
                onClick={() => toggleFilter('hasLinks', true)}
                className={`px-4 py-3 rounded-xl transition-all ${
                  filters.hasLinks
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="mr-2">🔗</span>
                Has Links
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {query && (
          <div className="mb-6 text-slate-400">
            Found <span className="text-indigo-400 font-bold">{results.length}</span> result{results.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 && query && (
            <div className="text-center py-16 glass-card rounded-3xl">
              <div className="text-6xl mb-6 opacity-50">🔍</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-3">No Results Found</h3>
              <p className="text-slate-400">Try adjusting your search terms or filters</p>
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={result.noteId}
              onClick={() => handleSelectResult(result.noteId)}
              className="w-full text-left card p-6 hover:scale-[1.01] transition-all animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="text-xl font-bold text-slate-100"
                  dangerouslySetInnerHTML={{ __html: highlightMatches(result.title, query) }}
                />
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
                  {result.matchCount} match{result.matchCount !== 1 ? 'es' : ''}
                </span>
              </div>
              <p
                className="text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightMatches(result.snippet, query) }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

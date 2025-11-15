import { Tag, AppState } from "../types";

export interface SearchResult {
  noteId: string;
  title: string;
  snippet: string;
  matchCount: number;
  score: number;
}

export interface SearchFilters {
  tags?: string[];
  dateFrom?: number;
  dateTo?: number;
  hasFlashcards?: boolean;
  hasLinks?: boolean;
}

export function searchNotes(
  query: string,
  state: AppState,
  filters?: SearchFilters,
): SearchResult[] {
  if (!query.trim() && !filters) return [];

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  Object.values(state.notes).forEach((note) => {
    // Apply filters first
    if (filters) {
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tagId) =>
          note.tags?.includes(tagId),
        );
        if (!hasAllTags) return;
      }

      if (filters.dateFrom && note.createdAt < filters.dateFrom) return;
      if (filters.dateTo && note.createdAt > filters.dateTo) return;

      if (filters.hasFlashcards) {
        const hasFlashcards =
          note.content.includes("::") ||
          note.content.includes("{") ||
          note.content.includes("{{c");
        if (!hasFlashcards) return;
      }

      if (filters.hasLinks) {
        const hasLinks = note.content.includes("[[");
        if (!hasLinks) return;
      }
    }

    // Search in title and content
    const titleMatch = note.title.toLowerCase().includes(queryLower);
    const contentMatch = note.content.toLowerCase().includes(queryLower);

    if (titleMatch || contentMatch || !query.trim()) {
      let matchCount = 0;
      let score = 0;

      // Count matches
      const titleMatches = (
        note.title.toLowerCase().match(new RegExp(queryLower, "g")) || []
      ).length;
      const contentMatches = (
        note.content.toLowerCase().match(new RegExp(queryLower, "g")) || []
      ).length;
      matchCount = titleMatches + contentMatches;

      // Calculate score (title matches weighted higher)
      score = titleMatches * 10 + contentMatches;

      // Extract snippet
      const snippet = extractSnippet(note.content, queryLower);

      results.push({
        noteId: note.id,
        title: note.title,
        snippet,
        matchCount,
        score,
      });
    }
  });

  // Sort by score (relevance)
  results.sort((a, b) => b.score - a.score);

  return results;
}

function extractSnippet(content: string, query: string): string {
  const snippetLength = 150;
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(query);

  if (index === -1) {
    // No match in content, return beginning
    return (
      content.substring(0, snippetLength) +
      (content.length > snippetLength ? "..." : "")
    );
  }

  // Extract around the match
  const start = Math.max(0, index - snippetLength / 2);
  const end = Math.min(
    content.length,
    index + query.length + snippetLength / 2,
  );

  let snippet = content.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

export function highlightMatches(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

export function getTagsByName(state: AppState): Record<string, Tag> {
  const tagsByName: Record<string, Tag> = {};
  Object.values(state.tags).forEach((tag) => {
    tagsByName[tag.name.toLowerCase()] = tag;
  });
  return tagsByName;
}

export function findOrCreateTag(tagName: string, state: AppState): Tag {
  const existing = Object.values(state.tags).find(
    (t) => t.name.toLowerCase() === tagName.toLowerCase(),
  );

  if (existing) return existing;

  // Create new tag
  const newTag: Tag = {
    id: `tag-${Date.now()}-${Math.random()}`,
    name: tagName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return newTag;
}

// Enhanced parser for RemNote-style syntax

export interface ParsedFlashcard {
  type: "basic" | "cloze" | "reverse";
  front: string;
  back: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedLink {
  text: string;
  targetId?: string;
  targetName: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedTag {
  name: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedCloze {
  text: string;
  deletions: { index: number; text: string }[];
}

// Parse basic flashcards: "Question :: Answer"
export function parseBasicFlashcards(content: string): ParsedFlashcard[] {
  const flashcards: ParsedFlashcard[] = [];
  const lines = content.split("\n");
  let currentIndex = 0;

  for (const line of lines) {
    const match = line.match(/(.+?)::\s*(.+)/);
    if (match) {
      const front = match[1].trim();
      const back = match[2].trim();
      flashcards.push({
        type: "basic",
        front,
        back,
        startIndex: currentIndex,
        endIndex: currentIndex + line.length,
      });
    }
    currentIndex += line.length + 1;
  }

  return flashcards;
}

// Parse cloze deletions: "This is a {cloze} deletion"
// Also supports numbered clozes: "{{c1::first}} and {{c2::second}}"
export function parseClozeFlashcards(content: string): ParsedFlashcard[] {
  const flashcards: ParsedFlashcard[] = [];

  // Simple cloze: {text}
  const simplePattern = /\{([^}]+)\}/g;
  let match;

  while ((match = simplePattern.exec(content)) !== null) {
    const clozeText = match[1];
    const front = content.replace(match[0], "[...]");

    flashcards.push({
      type: "cloze",
      front,
      back: clozeText,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // Numbered cloze: {{c1::text}}
  const numberedPattern = /\{\{c(\d+)::([^}]+)\}\}/g;
  const clozeGroups: Map<
    number,
    { text: string; placeholder: string; original: string }[]
  > = new Map();

  while ((match = numberedPattern.exec(content)) !== null) {
    const clozeNumber = parseInt(match[1]);
    const clozeText = match[2];

    if (!clozeGroups.has(clozeNumber)) {
      clozeGroups.set(clozeNumber, []);
    }

    clozeGroups.get(clozeNumber)!.push({
      text: clozeText,
      placeholder: match[0],
      original: content,
    });
  }

  // Create one flashcard per cloze number
  clozeGroups.forEach((group) => {
    let front = content;
    let answers: string[] = [];

    group.forEach((item) => {
      front = front.replace(item.placeholder, "[...]");
      answers.push(item.text);
    });

    flashcards.push({
      type: "cloze",
      front,
      back: answers.join(", "),
      startIndex: 0,
      endIndex: content.length,
    });
  });

  return flashcards;
}

// Parse all flashcards from content
export function parseFlashcardsFromNote(content: string): ParsedFlashcard[] {
  const basic = parseBasicFlashcards(content);
  const cloze = parseClozeFlashcards(content);
  return [...basic, ...cloze];
}

// Parse bidirectional links: [[Link Text]] or @Link
export function parseLinks(content: string): ParsedLink[] {
  const links: ParsedLink[] = [];

  // [[Link]] style
  const bracketPattern = /\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = bracketPattern.exec(content)) !== null) {
    links.push({
      text: match[1],
      targetName: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return links;
}

// Parse tags: #tag or #nested/tag
export function parseTags(content: string): ParsedTag[] {
  const tags: ParsedTag[] = [];
  const pattern = /#([\w-]+(?:\/[\w-]+)*)/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    tags.push({
      name: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return tags;
}

// Convert content with links/tags to HTML for display
export function highlightSyntax(content: string): string {
  let highlighted = content;

  // Highlight flashcards
  highlighted = highlighted.replace(
    /(.+?)::\s*(.+)/g,
    '<span class="flashcard-highlight">$1</span> :: <span class="flashcard-highlight">$2</span>',
  );

  // Highlight links
  highlighted = highlighted.replace(
    /\[\[([^\]]+)\]\]/g,
    '<span class="link-highlight">$1</span>',
  );

  // Highlight tags
  highlighted = highlighted.replace(
    /#([\w-]+(?:\/[\w-]+)*)/g,
    '<span class="tag-highlight">#$1</span>',
  );

  // Highlight cloze deletions
  highlighted = highlighted.replace(
    /\{([^}]+)\}/g,
    '<span class="cloze-highlight">{$1}</span>',
  );

  highlighted = highlighted.replace(
    /\{\{c(\d+)::([^}]+)\}\}/g,
    '<span class="cloze-highlight">{{c$1::$2}}</span>',
  );

  return highlighted;
}

// Extract all unique links from content
export function extractReferences(content: string): string[] {
  const links = parseLinks(content);
  return [...new Set(links.map((l) => l.targetName))];
}

// Extract all unique tags from content
export function extractTags(content: string): string[] {
  const tags = parseTags(content);
  return [...new Set(tags.map((t) => t.name))];
}

// Find backlinks: notes that reference this note
export function findBacklinks(
  targetNoteId: string,
  allNotes: Record<string, any>,
): Array<{ noteId: string; context: string }> {
  const backlinks: Array<{ noteId: string; context: string }> = [];

  Object.entries(allNotes).forEach(([noteId, note]) => {
    if (noteId === targetNoteId) return;

    const links = parseLinks(note.content);
    const hasBacklink = links.some((link) => {
      // Match by name (would need ID matching in real implementation)
      return link.targetName === allNotes[targetNoteId]?.title;
    });

    if (hasBacklink) {
      // Extract context (surrounding text)
      const contextLength = 100;
      const linkMatch = note.content.match(/\[\[([^\]]+)\]\]/);
      if (linkMatch) {
        const startIdx = Math.max(0, linkMatch.index! - contextLength / 2);
        const endIdx = Math.min(
          note.content.length,
          linkMatch.index! + linkMatch[0].length + contextLength / 2,
        );
        const context =
          "..." + note.content.substring(startIdx, endIdx) + "...";

        backlinks.push({ noteId, context });
      }
    }
  });

  return backlinks;
}

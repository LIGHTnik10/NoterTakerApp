// Parse RemNote-style flashcard syntax from notes
// Syntax: "Question text :: Answer text"

export interface ParsedFlashcard {
  front: string;
  back: string;
  startIndex: number;
  endIndex: number;
}

export function parseFlashcardsFromNote(content: string): ParsedFlashcard[] {
  const flashcards: ParsedFlashcard[] = [];
  const lines = content.split('\n');
  let currentIndex = 0;

  for (const line of lines) {
    const match = line.match(/(.+?)::\s*(.+)/);
    if (match) {
      const front = match[1].trim();
      const back = match[2].trim();
      flashcards.push({
        front,
        back,
        startIndex: currentIndex,
        endIndex: currentIndex + line.length,
      });
    }
    currentIndex += line.length + 1; // +1 for newline
  }

  return flashcards;
}

export function highlightFlashcardsInContent(content: string): string {
  // Replace :: syntax with highlighted version for display
  return content.replace(/(.+?)::\s*(.+)/g, (_match, front, back) => {
    return `<span class="flashcard-highlight">${front.trim()}</span> :: <span class="flashcard-highlight">${back.trim()}</span>`;
  });
}

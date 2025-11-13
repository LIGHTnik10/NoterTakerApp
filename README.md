# RemNote Clone - Note Taking & Flashcard App

A modern web application for note-taking and flashcard-based learning, inspired by RemNote. Built with React, TypeScript, and Vite.

## Features

### Note Taking
- Create and edit notes with a clean, distraction-free interface
- Organize notes with timestamps
- Quick access sidebar for all your notes
- Real-time saving with localStorage

### Flashcard Creation
- Create flashcards manually through the flashcard interface
- Generate flashcards automatically from notes using RemNote-style syntax
- Track flashcard statistics and review schedules

### RemNote-Style Syntax
Use the `::` syntax to create flashcards directly from your notes:
```
What is the capital of France? :: Paris
Who wrote Romeo and Juliet? :: William Shakespeare
```

When you write notes with this syntax, the app detects them and allows you to generate flashcards with one click.

### Spaced Repetition System
- Implements the SM-2 spaced repetition algorithm
- Review flashcards based on your performance
- Four quality levels: Again, Hard, Good, Easy
- Automatic scheduling for optimal learning retention
- Visual indicators for cards due for review

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NoterTakerApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Creating Notes
1. Click "New Note" in the sidebar
2. Enter a title and content
3. Use the `::` syntax to embed flashcards in your notes
4. Click "Save Note"

### Creating Flashcards from Notes
1. Write your note with `Question :: Answer` syntax
2. The app will detect flashcards and show a count
3. Click "Create X Flashcard(s)" to generate them
4. View all flashcards in the Flashcards section

### Manual Flashcard Creation
1. Navigate to the Flashcards view
2. Click "New Flashcard"
3. Enter the front (question) and back (answer)
4. Click "Create"

### Reviewing Flashcards
1. Navigate to the Review section
2. See cards that are due for review
3. Try to recall the answer, then click "Show Answer"
4. Rate your recall: Again, Hard, Good, or Easy
5. The app schedules the next review based on your rating

## Spaced Repetition Algorithm

The app uses the SM-2 (SuperMemo 2) algorithm for optimal learning:

- **Again** - Complete blackout, resets the card
- **Hard** - Correct with serious difficulty
- **Good** - Correct with some hesitation
- **Easy** - Perfect recall

Cards are scheduled for review at increasing intervals based on your performance, maximizing retention while minimizing study time.

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── NoteEditor.tsx  # Note editing interface
│   ├── FlashcardList.tsx    # Flashcard management
│   └── FlashcardReview.tsx  # Review interface
├── services/           # Business logic
│   └── storage.ts      # LocalStorage service
├── utils/              # Utility functions
│   ├── flashcardParser.ts   # Parse :: syntax
│   └── spacedRepetition.ts  # SM-2 algorithm
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Future Enhancements

Potential features for future development:
- Rich text formatting (bold, italic, lists, etc.)
- Hierarchical notes (parent-child relationships)
- Tags and categories
- Search functionality
- Export/import notes and flashcards
- Cloud sync and backup
- Mobile responsive improvements
- Dark mode
- Statistics and learning analytics
- Image support in flashcards

## License

Apache License 2.0 - See LICENSE file for details

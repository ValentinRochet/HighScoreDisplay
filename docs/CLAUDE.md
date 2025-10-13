# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HighScoreDisplayV2 is a static web application that displays a retro-style arcade high score board. The application features a CRT monitor aesthetic with neon colors, animations, and interactive score management.

## Project Structure

```
HighScoreDisplay/
├── src/                    # Source files
│   ├── index.html         # Main HTML structure
│   ├── script.js          # JavaScript functionality
│   └── style.css          # Complete styling
├── tests/                  # Test files
│   ├── complete-test.js   # Complete test sequence
│   ├── debug-test.js      # Debug test with logging
│   ├── simple-test.js     # Simple test case
│   └── test-duplication-bug.js  # Duplication bug test
├── docs/                   # Documentation
│   ├── CLAUDE.md          # This file
│   └── screenshots/       # Test screenshots
├── package.json           # Node dependencies (for Playwright)
└── package-lock.json
```

## Architecture

This is a simple client-side application with three main files in the `src/` directory:

- **index.html** - Main HTML structure with score display grid, popups for adding/editing scores, and confirmation dialogs
- **script.js** - All JavaScript functionality including DOM manipulation, localStorage persistence, animations, and event handling
- **style.css** - Complete styling with retro CRT/arcade aesthetic, animations, and responsive design

### Key Components

- **Score Display System**: 10-row grid showing rankings, player names, and scores with color-coded rankings (gold/silver/bronze for top 3)
- **Data Persistence**: Uses localStorage to save/restore scores and title between sessions
- **Animation System**: Includes sliding animations for score insertion, typewriter effects for new scores, and CRT scanline effects
- **Modal System**: Multiple overlapping popups for adding scores, editing title, and confirmation dialogs

### Core Functionality

- **Score Management**: Add new scores with automatic sorting and ranking
- **Score Deletion**: Click on ranking numbers to delete individual scores with confirmation
- **Title Customization**: Click on title to edit the high score board name
- **Data Persistence**: Automatic save/load using localStorage with key 'highScoreData'

## Development Commands

This is a static web application - no build process or package manager is required.

### Running the Application
- Open `src/index.html` directly in a web browser
- Use a local web server if needed: `python -m http.server 8000` or any static file server

### Development Workflow
- Edit files directly and refresh browser to see changes
- No compilation or build steps required
- All dependencies are loaded via CDN (Google Fonts)

## Code Conventions

- **Animation Timing**: Uses consistent timing (150ms intervals for sliding, 120ms for typewriter effect)
- **Event Handling**: All event listeners are set up in the main DOMContentLoaded block
- **Data Structure**: Scores stored as objects with `name` and `score` properties, always maintains exactly 10 entries

## Key Implementation Details

- **Score Sorting**: New scores are inserted in correct position with sliding animations
- **Empty State**: Shows "---" and "0" for empty score slots
- **Click Handlers**: Rankings are clickable for deletion, title is clickable for editing
- **Animation Coordination**: Complex sequence of sliding down, updating DOM, sliding up, and typewriter effects
- **Responsive Design**: Mobile-friendly layout with adjusted grid columns and font sizes

## Tests

### Playwright Tests

Test files are located in the `tests/` directory. Screenshots are saved to `docs/screenshots/`.

For every visual modification, use the playwright MCP to check the screenshot and make adjustments.
The address is `file:///D:/Developpement/HighScoreDisplay/src/index.html`
The OS is Windows 10.

#### Running Tests
```bash
node tests/complete-test.js      # Full test sequence
node tests/simple-test.js        # Simple test case
node tests/debug-test.js         # Debug test with logging
node tests/test-duplication-bug.js  # Duplication bug test
```

#### Test Execution Steps
- ouvre une nouvelle page
- change le titre du scoreboard
- ajoute 12 scores aléatoires
- vérifie que les scores sont bien ordonnés
- vérifie que le 11eme et 12eme scores sont bien enregistrés
- vérifie que le visuel n'a pas été impacté anormalement (décalages d'éléments, disparition d'éléments)
- supprime le 1er score
- vérifie à nouveau que les scores sont bien ordonnés, que la sauvegarde ne contient que 11 scores et que le visuel n'est toujours pas impacté anormalement
- réinitialise la sauvegarde
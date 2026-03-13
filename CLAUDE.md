I want a web app, using vite as the builder, that plays the game of minesweeper.

I primarily play this on my iPhone 15, but also want to play in on PC.

On the game board, pressing the happy face button creates a new game.

The game should be written with typescript and react, using tailwind for styling. Use MUI as the component library.

## Coding Style

- No single-line conditionals. Always use braces and put the body on its own line.

## Comprehensive Project Summary

### Architecture

A feature-complete Minesweeper game built with React 19, TypeScript, Vite, and Tailwind CSS 4. Optimized for both mobile (iPhone 15) and desktop with a retro Windows 95 UI aesthetic. Uses MUI for UI components and Emotion for CSS-in-JS.

### File Structure

```
src/
├── main.tsx                          # React entry point with MUI Theme setup
├── app.tsx                           # Root component managing screen navigation (Game / Options)
├── index.css                         # Global styles & Tailwind imports
├── types/
│   └── game.ts                       # TypeScript interfaces & enums (CellData, Board, GameStatus, GameSettings, Screen)
├── hooks/
│   ├── useMinesweeper.ts             # Core game logic hook (state, mine placement, reveal, flag, save/load)
│   ├── useTimer.ts                   # Elapsed seconds timer using Date.now()
│   └── useSettings.ts               # Settings persistence to localStorage (default: 11x18, 30 mines)
├── components/
│   ├── header/
│   │   ├── header.tsx                # Top bar: settings button, mine counter, smiley, timer, refresh button
│   │   ├── smileyButton.tsx          # Status indicator (happy/thumbs-up/thumbs-down) with custom SVG
│   │   └── ledDisplay.tsx            # 7-segment LED display using DSEG7 font
│   ├── board/
│   │   ├── gameBoard.tsx             # CSS grid container, dynamically sized (max 500px)
│   │   └── cell.tsx                  # Individual cell with touch (400ms long-press) and mouse handlers, memoized
│   ├── gameOver/
│   │   └── gameEffect.tsx            # Canvas-based fireworks animation on win (17 bursts, physics particles)
│   └── options/
│       └── optionsScreen.tsx         # Settings screen with MUI sliders (width, height, mines)
├── utils/
│   ├── board.ts                      # Board algorithms: flood-fill BFS reveal, mine placement, win detection
│   └── format.ts                     # LED display number formatter
└── styles/
    ├── cell.css                      # Cell styling: unrevealed 3D, revealed flat, mine-hit red, flag animation
    └── led.css                       # LED display: dark bg, red text, DSEG7 font, inset borders
```

### Game Logic

- **Deferred mine placement**: Mines placed on first reveal; clicked cell and 8 neighbors are always safe.
- **Game states**: Idle, Playing, Won, Lost, Review.
- **Flood-fill**: BFS algorithm expands from empty cells to all connected safe cells.
- **Persistence**: Auto-saves board state, timer, and settings to localStorage on every change. Resumes if settings match.
- **Win detection**: All non-mine cells revealed.

### Input Handling

- **Touch**: 400ms long-press for flagging with 10px movement threshold to cancel. `touchAction: 'none'` prevents browser gestures.
- **Mouse**: Left-click to reveal, right-click to flag.
- **Haptic**: `navigator.vibrate(50)` on flag toggle.
- Touch vs mouse event deduplication via ref tracking.

### Styling

- **Retro Windows 95 theme**: `#c0c0c0` gray, beveled 3D borders on cells/header/buttons.
- **LED display**: DSEG7Classic-Bold font, dark background, red text with layered shadow.
- **Flag animation**: 200ms ease-out scale from 6x to 1x.
- **Responsive**: Dynamic cell sizing based on viewport width, max 500px board.

### Visual Effects

- **Fireworks on win**: Canvas particle system with gravity (0.06 px/frame²), drag (0.985x), 3-layer glow, 80-120 particles per burst across 17 scheduled bursts over ~9 seconds.

### Build & Config

- **Vite**: Base path `/minesweb/` (GitHub Pages). React + Tailwind plugins.
- **TypeScript**: ES2022 target, strict mode, bundler module resolution, react-jsx.
- **Scripts**: `dev` (HMR), `build` (typecheck + production), `lint` (ESLint), `preview`.

### Dependencies

- `react@19.2.0`, `react-dom@19.2.0`
- `@mui/material@7.3.9`, `@mui/icons-material@7.3.9`
- `@emotion/react@11.14.0`, `@emotion/styled@11.14.1`
- `tailwindcss@4.2.1`, `@tailwindcss/vite@4.2.1`

### PWA & Mobile

- `manifest.webmanifest` for Add to Home Screen.
- Apple mobile web app meta tags: capable, black-translucent status bar.
- Viewport locked: no zoom, `user-scalable=no`.
- Apple touch icon and favicon provided.

### Header Controls

- **Left**: Settings button (MUI TuneIcon) opens Options screen.
- **Center**: LED mine counter, smiley button (new game), LED timer.
- **Right**: Refresh button (MUI RefreshIcon) navigates to `/index.html?v={timestamp}` for cache-busting full reload.

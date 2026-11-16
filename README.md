# StreamVibe

StreamVibe is a responsive video discovery and creator dashboard prototype built with React and Vite. Browse a curated feed, filter and search stories, open a native HTML5 demo player, join a live chat, and manage creator listings.

## Features

- Responsive home feed with category filters and search across titles, creators, and categories
- Native HTML5 media player with play/pause, seeking, volume, fullscreen, and a simulated quality selector
- Watch pages with related videos, comments, helpful votes, replies, likes, saved state, and share action
- Live room interface with a local in-page chat, emoji shortcut, and auto-scroll
- Creator Studio for adding, editing, removing, and locally previewing video listings with simulated upload progress
- Debounced search and a load-more recommendations control
- Light and dark themes
- Browser storage for theme, likes, saved videos, and creator listings
- Lazy-loaded pages, loading fallback, empty states, missing-video handling, and a page error fallback

## Tech stack

- React 19 and Vite
- React Router
- Zustand
- CSS Modules
- Vitest and Testing Library

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Checks

```bash
npm run lint
npm run test
npm run build
```

## Routes

- `/home` — discover and search videos
- `/watch/:id` — HTML5 demo player, comments, and related content
- `/live` — live room and chat interface
- `/studio` — creator listing dashboard

## Deployment

The app is a Vite single-page application and can be deployed on Vercel with the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

The current project uses curated sample content and browser storage. The player uses a public sample video when a listing has no uploaded local file. Upload progress, chat, and quality selection are UI simulations; they do not connect to a streaming service, WebSocket server, real upload service, or remote database. Local file object URLs are temporary and only work in the current browser session.

## Architecture

```text
BrowserRouter (main.jsx)
└── App shell (App.jsx)
    ├── Sidebar + search/theme controls
    └── Lazy-loaded routes
        ├── HomePage → catalog/search/category state
        ├── WatchPage → HTMLMediaElement + comments
        ├── LivePage → local chat state
        └── StudioPage → listing CRUD
              ↕
        Zustand store → localStorage persistence
```

# StreamVibe

StreamVibe is a responsive video discovery and creator dashboard prototype built with React and Vite. Browse a curated feed, filter and search stories, open a watch page, join a live chat, and manage creator video listings.

## Features

- Responsive home feed with category filters and search across titles, creators, and categories
- Watch pages with related videos, preview controls, likes, saved state, and share action
- Live room interface with an in-page chat
- Creator Studio for adding and removing video listings
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
- `/watch/:id` — watch-page preview and related content
- `/live` — live room and chat interface
- `/studio` — creator listing dashboard

## Deployment

The app is a Vite single-page application and can be deployed on Vercel with the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

The current project uses curated sample content and browser storage. It does not connect to a streaming service, upload service, or remote database.

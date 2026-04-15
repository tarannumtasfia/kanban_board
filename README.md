# Kanban Board

A drag-and-drop Kanban board built with React, dnd-kit, and styled-components.

## Requirements

- Node.js `>= 20.x`
- npm

## Setup

```bash
npm install
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm start         # Serve the production build
```

## Notes

- On first load, tasks are fetched from the remote API and saved to localStorage.
- After that, all data is read from localStorage — no further API calls are made.
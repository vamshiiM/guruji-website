# Divya Seva — Vite + React JS

Plain Vite + React (JavaScript) frontend. No TypeScript, no TanStack Start.

## Stack
- Vite 5
- React 18
- react-router-dom v6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- framer-motion
- lucide-react
- react-i18next (EN / HI / TA / MR)
- react-hot-toast

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Structure
```
src/
  assets/             images
  components/site/    Header, Footer, LanguageSwitcher, Reveal
  lib/                auth.jsx (context + localStorage), i18n.js
  pages/              Home, About, Services, Booking, Contact, Login, Profile, Admin
  App.jsx             routes + layout
  main.jsx            entry
  styles.css          tailwind v4 + design tokens
```

## Demo accounts
- Admin: `admin@divya.com` / `guruji108`
- User: any email + any password

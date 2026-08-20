# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173 (host: true)
npm run build    # production build
npm run preview  # serve the built output
```

There is no test runner, linter, or type checker configured. This is plain JavaScript (JSX) — no TypeScript.

## What this is

Marketing + booking site for a Vedic pandit ("Divya Seva"). Single-page React app, entirely client-side. There is **no backend**: all state (auth, bookings, services) is mocked in `localStorage` via `src/lib/auth.jsx`.

## Architecture

- **Entry:** `index.html` → `src/main.jsx` → `src/App.jsx`. `main.jsx` wraps everything in `<BrowserRouter>`; routing is `react-router-dom` v6 (`<Routes>`/`<Route>` in `App.jsx`).
- **`@/` alias** maps to `src/` (configured in both `vite.config.js` and `jsconfig.json`).
- **Two visual shells, chosen by path in `App.jsx`:** paths under `/admin` render `Admin` bare (no header/footer); everything else renders inside the `Header` + `Footer` chrome. Public routes live in `src/pages/`.
- **Auth / data layer — `src/lib/auth.jsx`:** an `AuthProvider` context is the single source of truth for `user`, `bookings`, and `services`, each persisted to a `localStorage` key (`divya_user`, `divya_bookings`, `divya_services`). Consume it with `useAuth()`. Admin role is granted only to emails in `ADMIN_EMAILS` who supply `ADMIN_PASSWORD` (`guruji108`); any other email/password logs in as a normal user. Bookings are filtered by the logged-in user's email unless the user is admin. Sample bookings are seeded on first run so the admin dashboard isn't empty. **Admin gating is client-side only** (there is no server to enforce it).
- **i18n — `src/lib/i18n.js`:** all translation strings for EN/HI/TA/MR are inlined in one `resources` object in this file (not JSON files). Language persists to `localStorage` key `divya_lang`; call `applyPersistedLanguage()` (done once in `App.jsx`) to restore it. Use `useTranslation()` / `t("key")` in components. When adding UI text, add the key to **all four** language blocks.
- **Theming — `src/lib/theme.js`:** three themes (`light`/`dark`/`sepia`) cycled via `useTheme()`, applied by toggling `html.dark` / `html.sepia` classes, persisted to `localStorage` key `divya-seva-theme`. Token values for each theme live in `src/styles.css`.

## Styling — two separate systems (important)

1. **Most of the app** uses Tailwind utility classes plus custom component utilities and design tokens defined in `src/styles.css` (`btn-primary`, `btn-ghost`, `glass-card`, `glass-panel`, `eyebrow`, `gold-divider`, and CSS variables like `--saffron`, `--gold`, `--foreground`). Colors are OKLCH. Fonts: Cormorant Garamond (`font-display`) + Inter (`font-sans`), loaded from Google Fonts in `index.html`.
2. **`src/pages/Admin.jsx` deliberately opts out of Tailwind** — it uses its own inline JS token object (`const T = {...}`) and inline `style` props ("no Tailwind, no shadcn"). Keep Admin styling self-contained; don't reach for the site's Tailwind utilities there.

Animations use `framer-motion`; icons use `lucide-react`; toasts use `react-hot-toast` (`<Toaster>` mounted in `App.jsx`).

## Known inconsistencies / gotchas

- **Tailwind version mismatch.** The build is configured for **Tailwind v3** (`tailwind.config.js` + `postcss.config.js` with the `tailwindcss` PostCSS plugin, and `tailwindcss@^3.4` in `package.json`). But `src/styles.css` is written in **Tailwind v4 syntax** (`@theme inline`, `@utility`, `@custom-variant`) and `README.md` claims v4 via `@tailwindcss/vite` (that plugin is not installed; `vite.config.js` only loads `@vitejs/plugin-react`). Before assuming a custom utility or token "just works," verify how it actually resolves under the installed toolchain. Don't trust the README's stack description on this point.
- **`src/routes/__root.jsx` is dead code.** It's a leftover from a TanStack Start/Router setup and imports packages that aren't installed (`@tanstack/react-router`, `@tanstack/react-query`) and a missing `../lib/lovable-error-reporting`. It is **not** part of the build. The live app is `main.jsx` + `App.jsx`; edit those, not `__root.jsx`.

## Demo accounts

- Admin: `admin@divya.com` (or `guruji@divya.com`) / password `guruji108`
- User: any other email + any password

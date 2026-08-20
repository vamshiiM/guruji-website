# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Monorepo with two independently deployed apps:

- **Frontend** (repo root) — Vite + React SPA. Deploys to Vercel.
- **Backend** (`server/`) — Express + Prisma + PostgreSQL API. Deploys to Railway. Has its own `package.json`, `.env`, and `server/README.md`.

## Commands

**Frontend** (repo root):
```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173 (host: true)
npm run build    # production build
npm run preview  # serve the built output
```
The frontend reads `VITE_API_URL` (see `.env.local`) to reach the API. It's plain JavaScript (JSX) — no TypeScript, no frontend test/lint tooling.

**Backend** (`server/`) — see `server/README.md` for the full flow:
```bash
cd server
npm install
npm run db:up      # Docker Postgres on host port 5544
npm run migrate    # prisma migrate dev
npm run seed       # admin + 5 services + 10 sample bookings
npm run dev        # API on http://localhost:4000
npm test           # node --test + supertest (needs the DB up)
```

## What this is

Marketing + booking site for a Vedic pandit ("Divya Seva"). React SPA backed by a real Express/Postgres API. The frontend handles auth, bookings, services, and a contact form entirely through the API — there is no more localStorage-based mock (it was replaced; the git history on `main` has the old client-only version as a restore point).

## Architecture

- **Entry:** `index.html` → `src/main.jsx` → `src/App.jsx`. `main.jsx` wraps everything in `<BrowserRouter>`; routing is `react-router-dom` v6 (`<Routes>`/`<Route>` in `App.jsx`).
- **`@/` alias** maps to `src/` (configured in both `vite.config.js` and `jsconfig.json`).
- **Two visual shells, chosen by path in `App.jsx`:** paths under `/admin` render `Admin` bare (no header/footer); everything else renders inside the `Header` + `Footer` chrome. Public routes live in `src/pages/`.
- **API client — `src/lib/api.js`:** a thin `fetch` wrapper (`credentials: "include"`, base = `VITE_API_URL`) that throws an `Error` whose `.code` is the server's error code (e.g. `BAD_ADMIN`, `RESERVED_EMAIL`). All server calls go through it.
- **Auth / data layer — `src/lib/auth.jsx`:** an `AuthProvider` context holds `user`, `bookings`, `services`, and a `loading` flag. On mount it hydrates via `GET /auth/me` + `GET /services` (and `/bookings` if signed in). Its methods (`login`, `signup`, `logout`, `addBooking`, `updateBooking`, `deleteBooking`, `addService`, `removeService`) are **async wrappers over `api.js`** — no localStorage. Consume with `useAuth()`. The server decides admin-vs-user scoping, so `bookings` and `allBookings` are the same array. Auth is a JWT in an **httpOnly cookie**; the admin role is enforced **server-side** on every admin route. When editing an `auth.jsx` method, keep the returned shape stable so pages don't need changes.
- **i18n — `src/lib/i18n.js`:** all translation strings for EN/HI/TA/MR are inlined in one `resources` object in this file (not JSON files). Language persists to `localStorage` key `divya_lang`; call `applyPersistedLanguage()` (done once in `App.jsx`) to restore it. Use `useTranslation()` / `t("key")` in components. When adding UI text, add the key to **all four** language blocks.
- **Theming — `src/lib/theme.js`:** three themes (`light`/`dark`/`sepia`) cycled via `useTheme()`, applied by toggling `html.dark` / `html.sepia` classes, persisted to `localStorage` key `divya-seva-theme`. Token values for each theme live in `src/styles.css`.

## Styling — two separate systems (important)

1. **Most of the app** uses Tailwind utility classes plus custom component utilities and design tokens defined in `src/styles.css` (`btn-primary`, `btn-ghost`, `glass-card`, `glass-panel`, `eyebrow`, `gold-divider`, and CSS variables like `--saffron`, `--gold`, `--foreground`). Colors are OKLCH. Fonts: Cormorant Garamond (`font-display`) + Inter (`font-sans`), loaded from Google Fonts in `index.html`.
2. **`src/pages/Admin.jsx` deliberately opts out of Tailwind** — it uses its own inline JS token object (`const T = {...}`) and inline `style` props ("no Tailwind, no shadcn"). Keep Admin styling self-contained; don't reach for the site's Tailwind utilities there.

Animations use `framer-motion`; icons use `lucide-react`; toasts use `react-hot-toast` (`<Toaster>` mounted in `App.jsx`).

## Known inconsistencies / gotchas

- **Tailwind version mismatch.** The build is configured for **Tailwind v3** (`tailwind.config.js` + `postcss.config.js` with the `tailwindcss` PostCSS plugin, and `tailwindcss@^3.4` in `package.json`). But `src/styles.css` is written in **Tailwind v4 syntax** (`@theme inline`, `@utility`, `@custom-variant`) and `README.md` claims v4 via `@tailwindcss/vite` (that plugin is not installed; `vite.config.js` only loads `@vitejs/plugin-react`). Before assuming a custom utility or token "just works," verify how it actually resolves under the installed toolchain. Don't trust the README's stack description on this point.
- **`src/routes/__root.jsx` is dead code.** It's a leftover from a TanStack Start/Router setup and imports packages that aren't installed (`@tanstack/react-router`, `@tanstack/react-query`) and a missing `../lib/lovable-error-reporting`. It is **not** part of the build. The live app is `main.jsx` + `App.jsx`; edit those, not `__root.jsx`.
- **Data-shape contract.** The API returns booking objects with keys `{id,name,email,phone,service,date,time,address,status,notes,createdAt}` and user `{name,email,role,joinedAt}` — matching what the pages already consume. `status` is stored/returned as the display string (`"Confirmed"` / `"Pending confirmation"` / `"Cancelled"`) the frontend switches on. Keep these shapes in sync between `server/src/lib/serializers.js` and the pages.

## Accounts

- Admin: the seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env` (the old public `guruji108` is retired — set a strong password).
- User: sign up with any non-reserved email + a 6+ char password (real accounts now).

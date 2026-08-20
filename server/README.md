# Divya Seva — Backend API

Express + Prisma + PostgreSQL API that powers auth, bookings, services, and the
contact form. The React frontend (repo root) talks to it via `VITE_API_URL`.

## Stack

- Node + Express (ESM)
- Prisma ORM + PostgreSQL
- JWT auth in an **httpOnly** cookie (`divya_token`), admin role enforced server-side
- Resend for email notifications (optional in dev)

## Local development

Requires Node 18+ and Docker (for a local Postgres).

```bash
cd server
cp .env.example .env          # then edit values (a dev .env is already gitignored)
npm install
npm run db:up                 # start Postgres in Docker (host port 5544)
npm run migrate               # apply migrations (prisma migrate dev)
npm run seed                  # admin + 5 services + 10 sample bookings
npm run dev                   # API on http://localhost:4000
```

Then in the repo root, run the frontend (`npm run dev`, port 5173). The root
`.env.local` sets `VITE_API_URL=http://localhost:4000`.

Seeded admin: the email/password from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

### Useful scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production entry) |
| `npm run db:up` / `db:down` | Start/stop the Docker Postgres |
| `npm run migrate` | `prisma migrate dev` (create + apply a migration) |
| `npm run migrate:deploy` | `prisma migrate deploy` (apply in prod/CI) |
| `npm run seed` | Idempotent seed (admin + services + sample bookings) |
| `npm test` | Integration tests (`node --test` + supertest; needs the DB up) |

## Environment variables

See `.env.example` for the full list. Key ones:

- `DATABASE_URL` — Postgres connection string.
- `JWT_SECRET` — long random secret for signing tokens.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the bootstrap admin the seed creates.
  **Pick a new strong password** — the old `guruji108` was public in client code.
- `RESERVED_ADMIN_EMAILS` — emails that may never be self-registered.
- `FRONTEND_ORIGIN` — exact allowed CORS origin(s), comma-separated. Never `*`.
- `COOKIE_DOMAIN` — empty in dev; `.yourdomain.com` in prod (shared across the
  frontend and `api.` subdomain).
- `RESEND_API_KEY` / `NOTIFY_EMAIL` / `MAIL_FROM` — email. If `RESEND_API_KEY` is
  empty, notifications are logged to the console instead of sent.

## API

Base path `/api`. Errors: `{ error: { code, message } }`.

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/signup` | public | `{name,email,password}`; sets cookie |
| POST | `/auth/login` | public | `{email,password}`; sets cookie |
| POST | `/auth/logout` | user | clears cookie |
| GET | `/auth/me` | public | `{user}` or `{user:null}` |
| GET | `/bookings` | user | admin: all; user: own |
| POST | `/bookings` | user | create; emails admin |
| PATCH | `/bookings/:id` | admin | `{status}` |
| DELETE | `/bookings/:id` | admin | |
| GET | `/services` | public | |
| POST | `/services` | admin | `{name,price,duration}` |
| DELETE | `/services/:id` | admin | |
| POST | `/contact` | public | `{name,email,message}`; emails admin |

## Deployment

### 1. Postgres + API on Railway

1. New Railway project → add the **PostgreSQL** plugin → copy its `DATABASE_URL`.
2. Add a **service** from this GitHub repo with **Root Directory = `server`**.
   - Build command: `npm install && npx prisma generate`
   - Release/Deploy command: `npx prisma migrate deploy && npx prisma db seed`
   - Start command: `node src/index.js`
3. Set env vars: `DATABASE_URL` (reference the plugin), `JWT_SECRET`,
   `COOKIE_DOMAIN=.yourdomain.com`, `FRONTEND_ORIGIN=https://yourdomain.com`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, `MAIL_FROM`,
   `NODE_ENV=production`. (Railway provides `PORT`.)
4. Settings → Custom Domain → `api.yourdomain.com`.

### 2. Frontend on Vercel

1. Import the repo, **Root Directory = repo root** (Vite auto-detected).
2. Env: `VITE_API_URL=https://api.yourdomain.com`.
3. Add custom domain `yourdomain.com`.

### 3. DNS (at your registrar)

- `CNAME api → <railway custom-domain target>`
- Apex `yourdomain.com` → Vercel (per Vercel's shown record)
- `CNAME www → cname.vercel-dns.com`
- Resend domain verification: SPF `TXT`, DKIM `CNAME`s, DMARC — so booking/contact
  emails deliver.

### 4. Verify the cookie end-to-end

Log in on `https://yourdomain.com`; in DevTools → Application → Cookies confirm
`divya_token` shows Domain `.yourdomain.com`, `Secure`, `HttpOnly`, `SameSite=Lax`.
Because both sites share the root domain, the cookie is sent with every
`credentials:'include'` request to the API.

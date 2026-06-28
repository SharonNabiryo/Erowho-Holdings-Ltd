# Erowho Holdings Limited — Rental Property Platform

**React 19 + TypeScript · Flask 3 + SQLite · Vercel deployment**

Erowho Holdings Limited is a real estate investment and holding company. This website lists rental properties owned, operated, or controlled by Erowho Holdings Limited across Canada and the United States.

**This is not:** a brokerage site, marketplace, agent platform, seller lead site, or investment solicitation site. It is a rental-facing website for a holding company that owns and manages its own properties.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, esbuild |
| Backend | Python 3.9+, Flask 3 |
| Database | SQLite (local/demo), Supabase Postgres (production) |
| Auth | PyJWT, Werkzeug password hashing |
| Deployment | Vercel (`@vercel/python` + `@vercel/static`) |
| Images | Unsplash CDN (real URLs, no upload yet) |

---

## Project Structure

```
.
├── backend/
│   ├── app.py          Flask routes, CORS, static serving
│   ├── db.py           Database connection, schema, queries, seeding
│   ├── auth.py         JWT tokens, password hashing, auth decorator
│   ├── validation.py   Input validation (pure Python, no Flask)
│   └── schema.sql      PostgreSQL-compatible schema for Supabase
├── frontend/
│   ├── src/
│   │   ├── main.tsx          React entry point
│   │   ├── App.tsx           Client-side router + auth guard
│   │   ├── api.ts            Typed API client
│   │   ├── tokens.ts         Design tokens + global CSS
│   │   ├── illustrations.tsx Property image mapping
│   │   ├── components/
│   │   │   └── ui.tsx        Navbar, Footer, PropertyCard, StatusBadge, etc.
│   │   └── pages/
│   │       ├── public.tsx    Home, Rentals, PropertyDetail, About, Portfolio, Process, Contact
│   │       └── admin.tsx     AdminLogin, AdminDashboard, AdminPropertyForm
│   ├── dist/
│   │   ├── index.html        HTML shell (sets window.API_BASE at runtime)
│   │   └── bundle.js         Built bundle — commit this for Vercel
│   ├── build.js              esbuild build script
│   └── package.json
├── build.sh                  Shell wrapper for build.js
├── start.sh                  Start Flask dev server
├── vercel.json               Vercel build + routing config
├── requirements.txt          Python dependencies
├── .env.example              All supported environment variables
└── README.md
```

---

## Local Development

### 1. Install Python dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Configure environment (optional for local dev)

```bash
cp .env.example .env
# Edit .env — defaults work for local development without changes
```

### 3. Start the backend

```bash
./start.sh
# or: python3 backend/app.py
```

Server starts at `http://localhost:5001`. Flask serves the API and the pre-built frontend from `frontend/dist/`.

### 4. Open in browser

```
http://localhost:5001
```

On first run, the database is created and seeded with five demo rental properties.

---

## Frontend Build

After editing any file in `frontend/src/`, rebuild the bundle:

```bash
cd frontend && npm install   # first time only
node build.js               # or: cd .. && ./build.sh
```

The build script uses esbuild with `--jsx=automatic` and `--format=iife`. No Webpack or Vite. Built output goes to `frontend/dist/bundle.js`.

Restart Flask after rebuilding.

---

## Admin Access

Navigate to Admin via the footer link, or direct your browser to the home page and click Admin Login in the footer.

**Default credentials (local/demo only):**

| Username | Password |
|---|---|
| `admin` | `admin123` |

These are **temporary demo credentials**. Change the password via the admin dashboard immediately after deploying anywhere real. Or set `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables before first run.

---

## Environment Variables

See `.env.example` for the full list with descriptions.

| Variable | Default | Notes |
|---|---|---|
| `FLASK_ENV` | — | Set to `development` for debug mode |
| `SECRET_KEY` | insecure dev default | **Must be changed in production** |
| `ADMIN_USERNAME` | `admin` | Demo-only default |
| `ADMIN_PASSWORD` | `admin123` | **Must be changed in production** |
| `DATABASE_URL` | local SQLite | `sqlite:///path` or future `postgres://` |
| `ALLOWED_ORIGINS` | localhost defaults | Comma-separated origin list for CORS |
| `TOKEN_TTL_SECONDS` | `604800` (7 days) | JWT lifetime in seconds |
| `VITE_API_BASE_URL` | — | Frontend API base (optional, see api.ts) |
| `SUPABASE_URL` | — | For future Supabase client SDK use |
| `SUPABASE_ANON_KEY` | — | For future Supabase client SDK use |
| `SUPABASE_SERVICE_ROLE_KEY` | — | For future Supabase server-side use |

---

## API Reference

All endpoints return JSON. Admin endpoints require `Authorization: Bearer <token>`.

### Public

| Method | Path | Notes |
|---|---|---|
| GET | `/api/properties` | Filters: `q`, `country`, `city`, `property_type`, `bedrooms`, `bathrooms`, `status`, `min_rent`, `max_rent` |
| GET | `/api/properties/:id` | Single property by ID |
| GET | `/api/properties/slug/:slug` | Single property by URL slug |
| POST | `/api/inquiries` | Submit rental inquiry |
| POST | `/api/contact` | Submit general contact message |

### Auth

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | Returns `{ token, username }` |
| GET | `/api/auth/verify` | Validate token |

### Admin (Bearer token required)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/admin/properties` | All properties including drafts |
| POST | `/api/admin/properties` | Create property |
| PUT | `/api/admin/properties/:id` | Update property |
| DELETE | `/api/admin/properties/:id` | Delete property |
| PATCH | `/api/admin/properties/:id/publish` | Toggle published/draft |
| GET | `/api/admin/inquiries` | All inquiries |
| PATCH | `/api/admin/inquiries/:id` | Update inquiry status |
| GET | `/api/admin/stats` | Dashboard statistics |
| POST | `/api/admin/change-password` | Change admin password (min 8 chars) |

---

## Database

### Local / Demo (SQLite)

SQLite database is created automatically at `backend/erowho.db` on first run. Schema is managed in `backend/db.py` via `init_db()`.

Tables: `properties`, `inquiries`, `admins`

Reset:
```bash
rm backend/erowho.db
python3 backend/app.py   # recreates and re-seeds
```

### Vercel

On Vercel, the database is stored at `/tmp/erowho.db`. The `/tmp` directory is writable but **ephemeral** — data is reset on every cold start. This is acceptable for demo but not for real business use.

### Known temporary limitations

- Vercel SQLite data is ephemeral. Every cold start wipes the database and re-seeds demo data.
- Full Postgres support is not yet implemented. The `DATABASE_URL=postgres://...` path is documented but `db.py` uses `sqlite3` directly.
- No image upload yet. Images are entered as Unsplash URLs.
- Single admin account. Multi-admin is not implemented.

---

## Supabase Production Setup

This section covers the steps to migrate from SQLite demo to a real Supabase Postgres database.

> **Status:** The schema is ready (`backend/schema.sql`). The Python backend still uses `sqlite3`. Full Postgres support requires adding SQLAlchemy + psycopg2-binary and replacing direct sqlite3 calls in `backend/db.py`. This is the documented migration path.

### Step 1 — Create a Supabase account

Go to [supabase.com](https://supabase.com) and create a free account.

### Step 2 — Create a Supabase project

- Click "New Project"
- Choose a name, region, and strong database password
- Wait for the project to provision

### Step 3 — Apply the schema

- In Supabase dashboard → SQL Editor
- Paste the contents of `backend/schema.sql`
- Click Run

This creates the `properties`, `inquiries`, `contact_inquiries`, and `admins` tables with proper constraints and indexes.

### Step 4 — Seed the admin user

Generate a werkzeug password hash in Python:

```python
from werkzeug.security import generate_password_hash
print(generate_password_hash("your-secure-password"))
```

Then run this SQL in Supabase SQL Editor (replace the hash):

```sql
INSERT INTO admins (username, password_hash, created_at, updated_at)
VALUES ('admin', 'pbkdf2:sha256:...your-hash...', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
```

### Step 5 — Get the database connection string

In Supabase dashboard → Settings → Database → Connection string → URI

It looks like:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Step 6 — Set environment variables in Vercel

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `SECRET_KEY` | A long random string (`openssl rand -hex 32`) |
| `ADMIN_USERNAME` | Your admin username |
| `ADMIN_PASSWORD` | Your admin password |
| `DATABASE_URL` | The Supabase connection string from Step 5 |
| `ALLOWED_ORIGINS` | Your Vercel deployment URL |

### Step 7 — Add SQLAlchemy support (code change required)

Install:
```bash
pip install sqlalchemy psycopg2-binary
```

In `backend/db.py`, replace the `sqlite3` connection block with SQLAlchemy. Look for the `# TODO` comment in `db.py` for the exact location.

Update `requirements.txt`:
```
Flask>=3.0.0
PyJWT>=2.7.0
Werkzeug>=3.0.0
SQLAlchemy>=2.0.0
psycopg2-binary>=2.9.0
```

### Step 8 — Test after deploy

1. Log in to admin
2. Create a test property and publish it
3. Confirm it appears on the public Rentals page
4. Submit a test rental inquiry
5. Confirm it appears in the admin Inquiries view
6. Reset admin password via the dashboard

### Supabase Storage (future — image uploads)

Once Supabase Postgres is working, you can enable real image uploads:

1. In Supabase dashboard → Storage → Create a bucket (e.g., `property-images`)
2. Set the bucket to public
3. Add a file upload input to the admin property form
4. Upload images to Supabase Storage and store the public URL in `image_url`

Until then, the admin form accepts any image URL (Unsplash, your own CDN, etc.).

---

## Vercel Deployment

The `vercel.json` config routes:
- `/api/*` → `backend/app.py` via `@vercel/python`
- `/bundle.js` → `frontend/dist/bundle.js` via `@vercel/static`
- Everything else → `frontend/dist/index.html` (SPA catch-all)

**Before deploying:**
1. Rebuild the frontend: `cd frontend && node build.js`
2. Commit `frontend/dist/index.html` and `frontend/dist/bundle.js`
3. Set environment variables in Vercel project settings (see above)
4. Push to `main` — Vercel deploys automatically

---

## Business Constraints

This site is intentionally limited to:

- Public users browsing rental properties
- Public users filtering and searching rentals
- Public users viewing property details
- Public users submitting rental inquiries
- Admin users managing properties and inquiries privately

**Do not add:** seller forms, broker portals, agent portals, public listing submission, investment solicitation, guaranteed return language, or marketplace features.

---

## Legal

Erowho Holdings Limited is a real estate investment and holding company. Rental availability is limited to properties owned, operated, or controlled by Erowho Holdings Limited. Website content is for informational purposes only and does not constitute brokerage, financial, legal, or investment advice.

# Erowho Holdings Limited — Rental Property Platform

**React 19 + TypeScript · Flask 3 + SQLite · Vercel deployment**

Erowho Holdings Limited is a real estate investment and holding company. This website lists rental properties owned, operated, or controlled by Erowho Holdings Limited. It is not a marketplace, brokerage site, or investment solicitation platform.

---

## Project Structure

```
.
├── backend/
│   └── app.py              Flask REST API + SQLite database
├── frontend/
│   ├── src/
│   │   ├── main.tsx        React entry point
│   │   ├── App.tsx         Client-side router + auth guard
│   │   ├── api.ts          Typed API client (all backend calls)
│   │   ├── tokens.ts       Design tokens (colors, fonts, global CSS)
│   │   ├── illustrations.tsx  Property image mapping
│   │   ├── components/
│   │   │   └── ui.tsx      Navbar, Footer, PropertyCard, StatusBadge, etc.
│   │   └── pages/
│   │       ├── public.tsx  Home, Rentals, PropertyDetail, About, Portfolio, Process, Contact
│   │       └── admin.tsx   AdminLogin, AdminDashboard, AdminPropertyForm
│   └── dist/
│       ├── index.html      HTML shell (sets window.API_BASE)
│       └── bundle.js       Built bundle (generated — not committed)
├── build.js                esbuild build script
├── build.sh                Shell wrapper for build.js
├── start.sh                Start Flask dev server
├── vercel.json             Vercel build + routing config
├── requirements.txt        Python dependencies
├── .env.example            All supported environment variables (copy to .env)
└── README.md               This file
```

---

## System Requirements

| Tool | Version |
|---|---|
| Python | 3.9+ |
| Node.js | 18+ |
| npm | 8+ |

---

## Local Development

### 1. Install Python dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Configure environment (optional)

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the Flask backend

```bash
./start.sh
# or: python3 backend/app.py
```

Backend runs at `http://localhost:5001`. Flask also serves the pre-built frontend from `frontend/dist/`.

### 4. Open in browser

```
http://localhost:5001
```

---

## Admin Access

Navigate to Admin via the footer link, or go to the Admin Login page.

**Default credentials (development only):**

| Username | Password |
|---|---|
| `admin` | `admin123` |

Change the default password via the admin dashboard, or set environment variables before first run (see `.env.example`).

---

## Rebuilding the Frontend

After editing any file in `frontend/src/`:

```bash
./build.sh
```

Or directly:

```bash
node build.js
```

Then restart Flask.

**Build requirements:** Node.js 18+, with `react` and `react-dom` installed:

```bash
npm install react react-dom
```

esbuild is used directly (no Vite, no webpack). The bundler is `node_modules/.bin/esbuild` or the globally installed version.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values before running in production.

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | insecure dev default | JWT signing key — **must be changed in production** |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `admin123` | Admin login password — **must be changed in production** |
| `DATABASE_URL` | `sqlite:///backend/erowho.db` | Database path — `sqlite:///path` format |
| `ALLOWED_ORIGINS` | localhost dev origins | CORS allowed origins, comma-separated |
| `TOKEN_TTL_SECONDS` | `604800` (7 days) | JWT token lifetime in seconds |

Production example:
```bash
SECRET_KEY="$(openssl rand -hex 32)" \
ADMIN_USERNAME="youruser" \
ADMIN_PASSWORD="$(openssl rand -hex 16)" \
ALLOWED_ORIGINS="https://yourdomain.com" \
python3 backend/app.py
```

---

## API Reference

All endpoints return JSON. Admin endpoints require `Authorization: Bearer <token>`.

### Public

| Method | Endpoint | Query params |
|---|---|---|
| GET | `/api/properties` | `q`, `country`, `city`, `property_type`, `bedrooms`, `bathrooms`, `status`, `min_rent`, `max_rent` |
| GET | `/api/properties/:id` | — |
| GET | `/api/properties/slug/:slug` | — |
| POST | `/api/inquiries` | Body: `full_name`, `email`, `phone?`, `property_id?`, `property_title?`, `desired_move_in_date?`, `number_of_occupants?`, `message?` |
| POST | `/api/contact` | Body: `full_name`, `email`, `phone?`, `inquiry_type?`, `message?` |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Returns JWT token |
| GET | `/api/auth/verify` | Verify token |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/properties` | All properties including drafts |
| POST | `/api/admin/properties` | Create property |
| PUT | `/api/admin/properties/:id` | Update property |
| DELETE | `/api/admin/properties/:id` | Delete property |
| PATCH | `/api/admin/properties/:id/publish` | Toggle published |
| GET | `/api/admin/inquiries` | All inquiries |
| PATCH | `/api/admin/inquiries/:id` | Update inquiry status |
| GET | `/api/admin/stats` | Dashboard stats |
| POST | `/api/admin/change-password` | Change admin password (min 8 chars) |

---

## Database

SQLite by default. Database is created automatically on first run.

| Table | Purpose |
|---|---|
| `properties` | Rental property listings |
| `inquiries` | Rental and contact form submissions |
| `admins` | Admin accounts (werkzeug-hashed passwords) |

Reset the database:
```bash
rm backend/erowho.db
python3 backend/app.py
```

---

## Deployment (Vercel)

The `vercel.json` config routes API traffic to `@vercel/python` and static assets to `@vercel/static`.

Required steps before deploying:
1. Build the frontend locally: `./build.sh`
2. Commit `frontend/dist/index.html` and `frontend/dist/bundle.js`
3. Set environment variables in Vercel project settings:
   - `SECRET_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ALLOWED_ORIGINS` (your Vercel domain)

The database uses `/tmp/erowho.db` on Vercel (ephemeral). For persistent storage, set `DATABASE_URL` to a managed database.

---

## Legal

Erowho Holdings Limited is a real estate investment and holding company. Rental availability is limited to properties owned, operated, or controlled by Erowho Holdings Limited. Website content is for informational purposes only and does not constitute brokerage, financial, legal, or investment advice.

-- Erowho Holdings Limited — Database Schema
-- Compatible with Supabase Postgres.
--
-- To apply to your Supabase project:
--   1. Open the Supabase dashboard → SQL Editor
--   2. Paste this file and click Run
--   3. Seed an initial admin user (see Supabase setup notes in README.md)
--
-- SQLite differences (local/dev):
--   - Use INTEGER PRIMARY KEY AUTOINCREMENT instead of SERIAL / GENERATED
--   - Use TEXT DEFAULT '[]' instead of JSONB
--   - Use TEXT / INTEGER instead of TIMESTAMPTZ / BOOLEAN
--   - The init_db() function in backend/db.py handles the SQLite version
-- ─────────────────────────────────────────────────────────────────────────────

-- ── properties ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
    id                  SERIAL PRIMARY KEY,
    title               TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    country             TEXT NOT NULL,
    city                TEXT NOT NULL,
    address_or_area     TEXT DEFAULT '',
    property_type       TEXT NOT NULL,
    bedrooms            NUMERIC(4, 1) NOT NULL DEFAULT 1,
    bathrooms           NUMERIC(4, 1) NOT NULL DEFAULT 1,
    monthly_rent        INTEGER NOT NULL,
    availability_status TEXT NOT NULL DEFAULT 'Available'
                        CHECK (availability_status IN (
                            'Available', 'Coming Soon', 'Rented', 'Under Review'
                        )),
    description         TEXT DEFAULT '',
    amenities           JSONB NOT NULL DEFAULT '[]',
    image_url           TEXT DEFAULT '',
    gallery_images      JSONB NOT NULL DEFAULT '[]',
    is_published        BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_featured
    ON properties (is_featured, is_published);

CREATE INDEX IF NOT EXISTS idx_properties_published
    ON properties (is_published, availability_status);

CREATE INDEX IF NOT EXISTS idx_properties_slug
    ON properties (slug);

-- ── inquiries (rental + contact form submissions) ─────────────────────────────
-- Contact form submissions are stored here with property_id = NULL
-- and property_title set to the inquiry_type string (e.g. "General Contact").
-- See backend/app.py /api/contact for the insertion logic.
CREATE TABLE IF NOT EXISTS inquiries (
    id                   SERIAL PRIMARY KEY,
    property_id          INTEGER REFERENCES properties (id) ON DELETE SET NULL,
    property_title       TEXT DEFAULT '',
    full_name            TEXT NOT NULL,
    email                TEXT NOT NULL,
    phone                TEXT DEFAULT '',
    desired_move_in_date TEXT DEFAULT '',
    number_of_occupants  TEXT DEFAULT '',
    message              TEXT DEFAULT '',
    status               TEXT NOT NULL DEFAULT 'New'
                         CHECK (status IN ('New', 'Reviewed', 'Contacted', 'Closed')),
    admin_notes          TEXT DEFAULT '',
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status
    ON inquiries (status, created_at DESC);

-- ── contact_inquiries (optional — separate table for general contact) ──────────
-- If you prefer to keep general contact submissions separate from rental
-- inquiries, use this table and update backend/app.py /api/contact accordingly.
-- Currently the app uses the inquiries table for both.
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id           SERIAL PRIMARY KEY,
    full_name    TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT DEFAULT '',
    inquiry_type TEXT DEFAULT 'General Contact',
    message      TEXT DEFAULT '',
    status       TEXT NOT NULL DEFAULT 'New'
                 CHECK (status IN ('New', 'Reviewed', 'Contacted', 'Closed')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── admins ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id            SERIAL PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,     -- werkzeug pbkdf2:sha256 format
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Initial admin seed (replace with your real credentials) ───────────────────
-- Generate a werkzeug hash in Python:
--   from werkzeug.security import generate_password_hash
--   print(generate_password_hash("your-secure-password"))
--
-- Then paste the hash below:
-- INSERT INTO admins (username, password_hash, created_at, updated_at)
-- VALUES ('admin', 'pbkdf2:sha256:...paste-hash-here...', NOW(), NOW())
-- ON CONFLICT (username) DO NOTHING;

-- ── Auto-update updated_at on Postgres ────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_contact_inquiries_updated_at
    BEFORE UPDATE ON contact_inquiries
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

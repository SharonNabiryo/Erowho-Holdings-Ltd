"""
Erowho Holdings Limited — Database layer

Uses SQLite for local development and Vercel demo deployments.
Data on Vercel (/tmp/erowho.db) is ephemeral — lost on cold start.

Supabase/Postgres migration path:
  1. Set DATABASE_URL to your Supabase postgres:// connection string.
  2. Replace raw sqlite3 calls with SQLAlchemy + psycopg2-binary.
  3. Run backend/schema.sql on your Supabase project to create tables.
  4. Seed the initial admin user manually or via a setup script.
"""

import os
import json
import re
import sqlite3
from datetime import datetime, timezone

from flask import g
from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

# ── Database path ──────────────────────────────────────────────────────────────
# Priority: VERCEL env → DATABASE_URL env → local file
_db_url = os.environ.get("DATABASE_URL", "")
if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/erowho.db"           # Vercel: writable but ephemeral
elif _db_url.startswith("sqlite:///"):
    DB_PATH = _db_url[10:]
elif _db_url.startswith("postgres://") or _db_url.startswith("postgresql://"):
    # Postgres/Supabase DATABASE_URL detected but not yet supported.
    # The backend uses raw sqlite3. To enable Postgres:
    #   pip install sqlalchemy psycopg2-binary
    #   Replace sqlite3 calls in db.py with SQLAlchemy.
    #   Run backend/schema.sql on your Supabase project first.
    print(
        "WARNING: Postgres DATABASE_URL is set but Postgres support is not yet implemented.\n"
        "  The backend will use local SQLite as a fallback.\n"
        "  To enable Postgres, add SQLAlchemy + psycopg2-binary and update backend/db.py.\n"
        f"  DATABASE_URL={_db_url[:40]}..."
    )
    DB_PATH = os.path.join(BASE_DIR, "erowho.db")
else:
    DB_PATH = os.path.join(BASE_DIR, "erowho.db")

# ── Admin seed credentials (demo-only defaults) ────────────────────────────────
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin123")

# ── Request-scoped connection ──────────────────────────────────────────────────
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
        g.db.execute("PRAGMA foreign_keys=ON")
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

# ── Utilities ──────────────────────────────────────────────────────────────────
def now() -> str:
    return datetime.now(timezone.utc).isoformat()

def generate_slug(title: str, db, exclude_id: int = None) -> str:
    """Convert a title to a unique URL slug, appending -2, -3, etc. if needed."""
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "property"
    slug = base
    counter = 1
    while True:
        q = "SELECT id FROM properties WHERE slug = ?"
        params: list = [slug]
        if exclude_id:
            q += " AND id != ?"
            params.append(exclude_id)
        if not db.execute(q, params).fetchone():
            return slug
        slug = f"{base}-{counter}"
        counter += 1

def row_to_dict(row) -> dict:
    if row is None:
        return None
    d = dict(row)
    for field in ("amenities", "gallery_images"):
        if field in d and isinstance(d[field], str):
            try:
                d[field] = json.loads(d[field])
            except Exception:
                d[field] = []
    d["is_published"] = bool(d.get("is_published", 0))
    return d

# ── Schema ─────────────────────────────────────────────────────────────────────
_SCHEMA = """
CREATE TABLE IF NOT EXISTS properties (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    title               TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    country             TEXT NOT NULL,
    city                TEXT NOT NULL,
    address_or_area     TEXT DEFAULT '',
    property_type       TEXT NOT NULL,
    bedrooms            REAL NOT NULL DEFAULT 1,
    bathrooms           REAL NOT NULL DEFAULT 1,
    monthly_rent        INTEGER NOT NULL,
    availability_status TEXT NOT NULL DEFAULT 'Available',
    description         TEXT DEFAULT '',
    amenities           TEXT DEFAULT '[]',
    is_published        INTEGER NOT NULL DEFAULT 1,
    image_url           TEXT DEFAULT '',
    gallery_images      TEXT DEFAULT '[]',
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id          INTEGER,
    property_title       TEXT DEFAULT '',
    full_name            TEXT NOT NULL,
    email                TEXT NOT NULL,
    phone                TEXT DEFAULT '',
    desired_move_in_date TEXT DEFAULT '',
    number_of_occupants  TEXT DEFAULT '',
    message              TEXT DEFAULT '',
    status               TEXT NOT NULL DEFAULT 'New',
    created_at           TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
);
"""

def _migrate(db):
    """Idempotent column additions — safe on every startup."""
    for col, defn in [
        ("image_url",      "TEXT DEFAULT ''"),
        ("gallery_images", "TEXT DEFAULT '[]'"),
    ]:
        try:
            db.execute(f"ALTER TABLE properties ADD COLUMN {col} {defn}")
            db.commit()
        except Exception:
            pass  # Column already exists

# ── Admin seeding ──────────────────────────────────────────────────────────────
def _is_legacy_hash(h: str) -> bool:
    """SHA-256 hashes are 64-char hex with no colons — detect for migration."""
    return len(h) == 64 and ":" not in h

def _seed_admin(db):
    """Insert or migrate admin account on startup."""
    existing = db.execute(
        "SELECT id, password_hash FROM admins WHERE username = ?", (ADMIN_USER,)
    ).fetchone()
    if not existing:
        db.execute(
            "INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
            (ADMIN_USER, generate_password_hash(ADMIN_PASS), now()),
        )
        db.commit()
    elif _is_legacy_hash(existing["password_hash"]):
        # Migrate old SHA-256 hex hash to werkzeug pbkdf2 on next login
        db.execute(
            "UPDATE admins SET password_hash=? WHERE username=?",
            (generate_password_hash(ADMIN_PASS), ADMIN_USER),
        )
        db.commit()

# ── Demo property seeding ──────────────────────────────────────────────────────
def _seed_properties(db):
    """Insert demo rental listings on first run (empty database)."""
    ts = now()
    properties = [
        {
            "title": "Stonebridge Townhome",
            "slug": "stonebridge-townhome",
            "country": "Canada", "city": "Toronto",
            "address_or_area": "Stonebridge Drive, North York",
            "property_type": "Townhome",
            "bedrooms": 3, "bathrooms": 2, "monthly_rent": 2800,
            "availability_status": "Available",
            "description": (
                "A well-maintained three-bedroom townhome in a quiet residential "
                "neighbourhood in North York. Open-concept main floor, private "
                "backyard, attached garage, and modern kitchen finishes. Close to "
                "schools, transit, and community parks."
            ),
            "amenities": ["Parking", "Backyard", "In-unit Laundry", "Dishwasher", "Central Air"],
            "image_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Maple Row Residence",
            "slug": "maple-row-residence",
            "country": "Canada", "city": "Vancouver",
            "address_or_area": "East Side, Vancouver",
            "property_type": "Single-Family Home",
            "bedrooms": 4, "bathrooms": 3, "monthly_rent": 3500,
            "availability_status": "Available",
            "description": (
                "Spacious four-bedroom home on Vancouver's East Side. Bright open "
                "floor plan, hardwood floors throughout, renovated kitchen with "
                "quartz countertops, and a private fenced yard. Walking distance "
                "to schools and transit."
            ),
            "amenities": ["Parking", "Fenced Yard", "Hardwood Floors", "In-unit Laundry", "Dishwasher", "Central Air"],
            "image_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Cedar Park Duplex",
            "slug": "cedar-park-duplex",
            "country": "Canada", "city": "Calgary",
            "address_or_area": "Cedar Park, SW Calgary",
            "property_type": "Duplex",
            "bedrooms": 2, "bathrooms": 1, "monthly_rent": 1900,
            "availability_status": "Coming Soon",
            "description": (
                "Two-bedroom upper duplex unit in SW Calgary's Cedar Park. "
                "Bright and updated interior, private entrance, dedicated parking, "
                "and shared backyard access. Minutes to shopping and transit."
            ),
            "amenities": ["Parking", "Shared Backyard", "Storage", "Pet Friendly"],
            "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Bronze Gate Apartment",
            "slug": "bronze-gate-apartment",
            "country": "United States", "city": "Chicago",
            "address_or_area": "Lincoln Park, Chicago",
            "property_type": "Apartment",
            "bedrooms": 1, "bathrooms": 1, "monthly_rent": 1600,
            "availability_status": "Available",
            "description": (
                "Well-appointed one-bedroom apartment in Chicago's Lincoln Park. "
                "Modern kitchen, updated bathroom, in-building laundry, and "
                "proximity to restaurants, transit, and green space."
            ),
            "amenities": ["In-building Laundry", "Dishwasher", "Heating Included", "Storage Locker"],
            "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Northline Family Home",
            "slug": "northline-family-home",
            "country": "Canada", "city": "Ottawa",
            "address_or_area": "Barrhaven, Ottawa",
            "property_type": "Single-Family Home",
            "bedrooms": 4, "bathrooms": 3, "monthly_rent": 3200,
            "availability_status": "Rented",
            "description": (
                "Four-bedroom family home in Ottawa's Barrhaven community. "
                "Double garage, finished basement, landscaped yard, and a bright "
                "open kitchen. Near top-rated schools, parks, and highway access."
            ),
            "amenities": ["Double Garage", "Finished Basement", "Backyard", "Central Air", "In-unit Laundry", "Dishwasher"],
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        },
    ]
    for p in properties:
        db.execute("""
            INSERT OR IGNORE INTO properties
            (title, slug, country, city, address_or_area, property_type,
             bedrooms, bathrooms, monthly_rent, availability_status,
             description, amenities, is_published, image_url, gallery_images,
             created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?)
        """, (
            p["title"], p["slug"], p["country"], p["city"],
            p["address_or_area"], p["property_type"],
            p["bedrooms"], p["bathrooms"], p["monthly_rent"],
            p["availability_status"], p["description"],
            json.dumps(p["amenities"]),
            p["image_url"], json.dumps([]),
            ts, ts,
        ))
    db.commit()

def _backfill_seed_images(db):
    """Backfill image_url on existing seed properties that are missing it."""
    seed_images = {
        "stonebridge-townhome":  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
        "maple-row-residence":   "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        "cedar-park-duplex":     "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "bronze-gate-apartment": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        "northline-family-home": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    }
    for slug, url in seed_images.items():
        db.execute(
            "UPDATE properties SET image_url=? WHERE slug=? AND (image_url IS NULL OR image_url='')",
            (url, slug),
        )
    db.commit()

# ── Startup initialisation ─────────────────────────────────────────────────────
def init_db():
    """Create schema, run migrations, seed demo data. Called once at startup."""
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.executescript(_SCHEMA)
    db.commit()
    _migrate(db)
    _seed_admin(db)
    count = db.execute("SELECT COUNT(*) FROM properties").fetchone()[0]
    if count == 0:
        _seed_properties(db)
    else:
        _backfill_seed_images(db)
    db.close()

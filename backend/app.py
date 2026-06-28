"""
Erowho Holdings Limited - Flask API Backend

Public API for rental properties and inquiries.
Admin API for property and inquiry management.

IMPORTANT - Temporary demo credentials:
  ADMIN_USERNAME / ADMIN_PASSWORD are set via environment variables.
  Defaults (admin / admin123) are for local development only.
  Replace with strong credentials before any real production use.

Database:
  Uses SQLite locally. For production, set DATABASE_URL to a hosted
  PostgreSQL connection string (Supabase, Neon, etc.) and add a
  SQLAlchemy adapter. SQLite on Vercel is ephemeral — data is reset on
  every cold start. This is acceptable for demo; not acceptable for
  real business use.
"""

import os
import re
import sys
import json
import sqlite3
from datetime import datetime, timezone
from functools import wraps
from flask import Flask, jsonify, request, send_from_directory, send_file, g
from werkzeug.security import generate_password_hash, check_password_hash

try:
    import jwt
except ImportError:
    print("PyJWT not found. Install with: pip install PyJWT")
    sys.exit(1)

# ── Configuration ──────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.dirname(BASE_DIR)
STATIC_DIR = os.path.join(ROOT_DIR, "frontend", "dist")

# Database path — prefers DATABASE_URL env var for future hosted DB support.
# SQLite is used for local dev and Vercel demo. Set DATABASE_URL=sqlite:///path
# or a postgres:// URL (requires SQLAlchemy adapter — see TODO below).
_db_url = os.environ.get("DATABASE_URL", "")
if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/erowho.db"  # Vercel: writable but ephemeral
elif _db_url.startswith("sqlite:///"):
    DB_PATH = _db_url[10:]
else:
    DB_PATH = os.path.join(BASE_DIR, "erowho.db")
# TODO: When DATABASE_URL is a postgres:// string, replace raw sqlite3 calls
#       with SQLAlchemy (pip install sqlalchemy psycopg2-binary).

SECRET_KEY = os.environ.get("SECRET_KEY", "erowho-dev-secret-change-in-production")

# Admin credentials — use env vars in production. Defaults are demo-only.
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin123")

# CORS origins — comma-separated list via env var.
# In development, localhost origins are always allowed.
_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()] or [
    "http://localhost:3000",
    "http://localhost:5001",
    "http://localhost:5173",
    "http://127.0.0.1:5001",
]

ALLOWED_STATUSES = {"Available", "Coming Soon", "Rented", "Under Review"}
ALLOWED_INQUIRY_STATUSES = {"New", "Reviewed", "Contacted", "Closed"}

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")

# ── CORS ───────────────────────────────────────────────────────────────────────
@app.after_request
def add_cors(response):
    origin = request.headers.get("Origin", "")
    is_dev = os.environ.get("FLASK_ENV") == "development"
    if origin in ALLOWED_ORIGINS or is_dev:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        resp = app.make_default_options_response()
        add_cors(resp)
        return resp

# ── Database ───────────────────────────────────────────────────────────────────
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
        g.db.execute("PRAGMA foreign_keys=ON")
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def migrate_db(db):
    """Idempotent column migrations — safe to run on every startup."""
    for col, definition in [
        ("image_url",      "TEXT DEFAULT ''"),
        ("gallery_images", "TEXT DEFAULT '[]'"),
    ]:
        try:
            db.execute(f"ALTER TABLE properties ADD COLUMN {col} {definition}")
            db.commit()
        except Exception:
            pass  # Column already exists

def init_db():
    """Create tables, run migrations, and seed demo data."""
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.executescript("""
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
    """)
    db.commit()

    migrate_db(db)
    _seed_admin(db)

    count = db.execute("SELECT COUNT(*) FROM properties").fetchone()[0]
    if count == 0:
        _seed_properties(db)
    else:
        _backfill_seed_images(db)

    db.close()

def _seed_admin(db):
    """Seed admin account; migrate legacy sha256 hashes to werkzeug on startup."""
    existing = db.execute(
        "SELECT id, password_hash FROM admins WHERE username = ?", (ADMIN_USER,)
    ).fetchone()
    if not existing:
        db.execute(
            "INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
            (ADMIN_USER, generate_password_hash(ADMIN_PASS), _now()),
        )
        db.commit()
    elif _is_legacy_hash(existing["password_hash"]):
        # Migrate old SHA-256 hex hash to werkzeug pbkdf2 format
        db.execute(
            "UPDATE admins SET password_hash=? WHERE username=?",
            (generate_password_hash(ADMIN_PASS), ADMIN_USER),
        )
        db.commit()

def _is_legacy_hash(h: str) -> bool:
    """SHA-256 hashes are 64-char hex strings with no colons."""
    return len(h) == 64 and ":" not in h

def _backfill_seed_images(db):
    """Ensure seed properties have image_url set if missing."""
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

# ── Utility functions ──────────────────────────────────────────────────────────
def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email.strip()))

def _generate_slug(title: str, db, exclude_id: int = None) -> str:
    """Convert title to a unique URL slug."""
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "property"
    slug = base
    counter = 1
    while True:
        q = "SELECT id FROM properties WHERE slug = ?"
        params = [slug]
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

def ok(data=None, code=200):
    """Standard success response."""
    return jsonify({"success": True, "data": data}), code

def err(msg: str, code=400):
    """Standard error response."""
    return jsonify({"success": False, "error": msg}), code

# ── Authentication ─────────────────────────────────────────────────────────────
TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7  # 7 days

def _make_token(username: str) -> str:
    import time
    payload = {
        "sub": username,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return err("Unauthorized", 401)
        token = header[7:]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.admin_user = payload["sub"]
        except jwt.ExpiredSignatureError:
            return err("Session expired — please log in again", 401)
        except jwt.InvalidTokenError:
            return err("Invalid session token", 401)
        return f(*args, **kwargs)
    return decorated

# ── Auth routes ────────────────────────────────────────────────────────────────
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return err("Username and password are required")
    db = get_db()
    admin = db.execute(
        "SELECT * FROM admins WHERE username = ?", (username,)
    ).fetchone()
    if not admin or not check_password_hash(admin["password_hash"], password):
        return err("Invalid username or password", 401)
    token = _make_token(username)
    # Return flat object (not wrapped) — frontend expects {token, username}
    return jsonify({"token": token, "username": username})

@app.route("/api/auth/verify", methods=["GET"])
@require_auth
def verify_token():
    return jsonify({"valid": True, "username": g.admin_user})

# ── Public property routes ─────────────────────────────────────────────────────
@app.route("/api/properties", methods=["GET"])
def get_properties():
    db = get_db()
    q        = request.args.get("q", "").strip()
    country  = request.args.get("country", "").strip()
    city     = request.args.get("city", "").strip()
    ptype    = request.args.get("property_type", "").strip()
    beds     = request.args.get("bedrooms", "").strip()
    baths    = request.args.get("bathrooms", "").strip()
    status   = request.args.get("status", "").strip()
    max_rent = request.args.get("max_rent", "").strip()
    min_rent = request.args.get("min_rent", "").strip()
    admin_view = request.args.get("admin", "")

    sql    = "SELECT * FROM properties WHERE 1=1"
    params = []

    # Only show published properties to the public
    if not (admin_view and request.headers.get("Authorization")):
        sql += " AND is_published = 1"

    if q:
        sql += " AND (title LIKE ? OR city LIKE ? OR country LIKE ? OR address_or_area LIKE ?)"
        params += [f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%"]
    if country:
        sql += " AND country = ?"
        params.append(country)
    if city:
        sql += " AND city LIKE ?"
        params.append(f"%{city}%")
    if ptype:
        sql += " AND property_type = ?"
        params.append(ptype)
    if beds:
        try:
            sql += " AND bedrooms >= ?"
            params.append(float(beds))
        except ValueError:
            pass
    if baths:
        try:
            sql += " AND bathrooms >= ?"
            params.append(float(baths))
        except ValueError:
            pass
    if status and status in ALLOWED_STATUSES:
        sql += " AND availability_status = ?"
        params.append(status)
    if max_rent:
        try:
            sql += " AND monthly_rent <= ?"
            params.append(int(max_rent))
        except ValueError:
            pass
    if min_rent:
        try:
            sql += " AND monthly_rent >= ?"
            params.append(int(min_rent))
        except ValueError:
            pass

    sql += " ORDER BY created_at DESC"
    rows = db.execute(sql, params).fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/properties/<int:pid>", methods=["GET"])
def get_property(pid):
    db  = get_db()
    row = db.execute("SELECT * FROM properties WHERE id = ? AND is_published = 1", (pid,)).fetchone()
    if not row:
        return err("Property not found", 404)
    return jsonify(row_to_dict(row))

@app.route("/api/properties/slug/<slug>", methods=["GET"])
def get_property_by_slug(slug):
    db  = get_db()
    row = db.execute(
        "SELECT * FROM properties WHERE slug = ? AND is_published = 1", (slug,)
    ).fetchone()
    if not row:
        return err("Property not found", 404)
    return jsonify(row_to_dict(row))

# ── Admin property routes ──────────────────────────────────────────────────────
@app.route("/api/admin/properties", methods=["GET"])
@require_auth
def admin_list_properties():
    db   = get_db()
    rows = db.execute("SELECT * FROM properties ORDER BY created_at DESC").fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/admin/properties", methods=["POST"])
@require_auth
def create_property():
    data = request.get_json() or {}

    # Required field validation
    errors = {}
    if not (data.get("title") or "").strip():
        errors["title"] = "Title is required"
    if not (data.get("country") or "").strip():
        errors["country"] = "Country is required"
    if not (data.get("city") or "").strip():
        errors["city"] = "City is required"
    if not (data.get("property_type") or "").strip():
        errors["property_type"] = "Property type is required"
    try:
        rent = int(data.get("monthly_rent", 0))
        if rent <= 0:
            errors["monthly_rent"] = "Monthly rent must be a positive number"
    except (ValueError, TypeError):
        errors["monthly_rent"] = "Monthly rent must be a number"
    if data.get("availability_status") and data["availability_status"] not in ALLOWED_STATUSES:
        errors["availability_status"] = f"Status must be one of: {', '.join(ALLOWED_STATUSES)}"

    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db   = get_db()
    slug = _generate_slug(data.get("slug") or data["title"], db)

    cursor = db.execute("""
        INSERT INTO properties
        (title, slug, country, city, address_or_area, property_type,
         bedrooms, bathrooms, monthly_rent, availability_status,
         description, amenities, is_published, image_url, gallery_images,
         created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        data["title"].strip(), slug,
        data["country"].strip(), data["city"].strip(),
        (data.get("address_or_area") or "").strip(),
        data["property_type"].strip(),
        max(0.0, float(data.get("bedrooms") or 1)),
        max(0.0, float(data.get("bathrooms") or 1)),
        int(data["monthly_rent"]),
        data.get("availability_status", "Available"),
        (data.get("description") or "").strip(),
        json.dumps(data.get("amenities") or []),
        1 if data.get("is_published", True) else 0,
        (data.get("image_url") or "").strip(),
        json.dumps(data.get("gallery_images") or []),
        _now(), _now(),
    ))
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return jsonify(row_to_dict(row)), 201

@app.route("/api/admin/properties/<int:pid>", methods=["PUT"])
@require_auth
def update_property(pid):
    db       = get_db()
    existing = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not existing:
        return err("Property not found", 404)

    data = request.get_json() or {}

    # Validate numeric fields if provided
    if "monthly_rent" in data:
        try:
            if int(data["monthly_rent"]) <= 0:
                return err("Monthly rent must be a positive number")
        except (ValueError, TypeError):
            return err("Monthly rent must be a number")
    if "availability_status" in data and data["availability_status"] not in ALLOWED_STATUSES:
        return err(f"Status must be one of: {', '.join(ALLOWED_STATUSES)}")

    # Slug: regenerate if title changed and no explicit slug provided
    if "slug" in data:
        slug = data["slug"]
    elif "title" in data and data["title"] != existing["title"]:
        slug = _generate_slug(data["title"], db, exclude_id=pid)
    else:
        slug = existing["slug"]

    db.execute("""
        UPDATE properties SET
          title=?, slug=?, country=?, city=?, address_or_area=?,
          property_type=?, bedrooms=?, bathrooms=?, monthly_rent=?,
          availability_status=?, description=?, amenities=?,
          is_published=?, image_url=?, gallery_images=?, updated_at=?
        WHERE id=?
    """, (
        (data.get("title") or existing["title"]).strip(),
        slug,
        (data.get("country") or existing["country"]).strip(),
        (data.get("city") or existing["city"]).strip(),
        (data.get("address_or_area") or existing["address_or_area"] or "").strip(),
        (data.get("property_type") or existing["property_type"]).strip(),
        max(0.0, float(data.get("bedrooms") if "bedrooms" in data else existing["bedrooms"])),
        max(0.0, float(data.get("bathrooms") if "bathrooms" in data else existing["bathrooms"])),
        int(data.get("monthly_rent") if "monthly_rent" in data else existing["monthly_rent"]),
        data.get("availability_status") or existing["availability_status"],
        (data.get("description") if "description" in data else existing["description"] or "").strip(),
        json.dumps(data.get("amenities") if "amenities" in data else json.loads(existing["amenities"] or "[]")),
        1 if data.get("is_published", bool(existing["is_published"])) else 0,
        (data.get("image_url") if "image_url" in data else existing["image_url"] or "").strip(),
        json.dumps(data.get("gallery_images") if "gallery_images" in data else json.loads(existing["gallery_images"] or "[]")),
        _now(), pid,
    ))
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

@app.route("/api/admin/properties/<int:pid>", methods=["DELETE"])
@require_auth
def delete_property(pid):
    db = get_db()
    if not db.execute("SELECT id FROM properties WHERE id = ?", (pid,)).fetchone():
        return err("Property not found", 404)
    db.execute("DELETE FROM properties WHERE id = ?", (pid,))
    db.commit()
    return jsonify({"success": True, "deleted": pid})

@app.route("/api/admin/properties/<int:pid>/publish", methods=["PATCH"])
@require_auth
def toggle_publish(pid):
    db  = get_db()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not row:
        return err("Property not found", 404)
    new_val = 0 if row["is_published"] else 1
    db.execute(
        "UPDATE properties SET is_published=?, updated_at=? WHERE id=?",
        (new_val, _now(), pid),
    )
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

# ── Inquiry routes ─────────────────────────────────────────────────────────────
@app.route("/api/inquiries", methods=["POST"])
def create_inquiry():
    data = request.get_json() or {}

    errors = {}
    full_name = (data.get("full_name") or "").strip()
    email     = (data.get("email") or "").strip()
    if not full_name:
        errors["full_name"] = "Full name is required"
    if not email:
        errors["email"] = "Email address is required"
    elif not _valid_email(email):
        errors["email"] = "Please enter a valid email address"
    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db     = get_db()
    cursor = db.execute("""
        INSERT INTO inquiries
        (property_id, property_title, full_name, email, phone,
         desired_move_in_date, number_of_occupants, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', ?)
    """, (
        data.get("property_id"),
        (data.get("property_title") or "").strip(),
        full_name, email,
        (data.get("phone") or "").strip(),
        (data.get("desired_move_in_date") or "").strip(),
        (data.get("number_of_occupants") or "").strip(),
        (data.get("message") or "").strip(),
        _now(),
    ))
    db.commit()
    return jsonify({"success": True, "id": cursor.lastrowid}), 201

@app.route("/api/admin/inquiries", methods=["GET"])
@require_auth
def list_inquiries():
    db   = get_db()
    rows = db.execute("SELECT * FROM inquiries ORDER BY created_at DESC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/admin/inquiries/<int:iid>", methods=["PATCH"])
@require_auth
def update_inquiry_status(iid):
    data   = request.get_json() or {}
    status = (data.get("status") or "").strip()
    if status not in ALLOWED_INQUIRY_STATUSES:
        return err(f"Status must be one of: {', '.join(ALLOWED_INQUIRY_STATUSES)}")
    db = get_db()
    if not db.execute("SELECT id FROM inquiries WHERE id = ?", (iid,)).fetchone():
        return err("Inquiry not found", 404)
    db.execute("UPDATE inquiries SET status=? WHERE id=?", (status, iid))
    db.commit()
    return jsonify({"success": True, "id": iid, "status": status})

# ── Admin stats ────────────────────────────────────────────────────────────────
@app.route("/api/admin/stats", methods=["GET"])
@require_auth
def get_stats():
    db = get_db()
    return jsonify({
        "total_properties": db.execute("SELECT COUNT(*) FROM properties").fetchone()[0],
        "published":        db.execute("SELECT COUNT(*) FROM properties WHERE is_published=1").fetchone()[0],
        "available":        db.execute("SELECT COUNT(*) FROM properties WHERE availability_status='Available' AND is_published=1").fetchone()[0],
        "rented":           db.execute("SELECT COUNT(*) FROM properties WHERE availability_status='Rented'").fetchone()[0],
        "total_inquiries":  db.execute("SELECT COUNT(*) FROM inquiries").fetchone()[0],
        "new_inquiries":    db.execute("SELECT COUNT(*) FROM inquiries WHERE status='New'").fetchone()[0],
    })

# ── Admin password change ──────────────────────────────────────────────────────
@app.route("/api/admin/change-password", methods=["POST"])
@require_auth
def change_password():
    data       = request.get_json() or {}
    current_pw = data.get("current_password") or ""
    new_pw     = data.get("new_password") or ""
    if not current_pw or not new_pw:
        return err("Current password and new password are required")
    if len(new_pw) < 8:
        return err("New password must be at least 8 characters")
    db    = get_db()
    admin = db.execute("SELECT * FROM admins WHERE username=?", (g.admin_user,)).fetchone()
    if not admin or not check_password_hash(admin["password_hash"], current_pw):
        return err("Current password is incorrect", 401)
    db.execute(
        "UPDATE admins SET password_hash=? WHERE username=?",
        (generate_password_hash(new_pw), g.admin_user),
    )
    db.commit()
    return jsonify({"success": True})

# ── Contact inquiry (general) ──────────────────────────────────────────────────
@app.route("/api/contact", methods=["POST"])
def contact():
    """General contact form — stored as an inquiry with no property_id."""
    data = request.get_json() or {}
    errors = {}
    full_name = (data.get("full_name") or "").strip()
    email     = (data.get("email") or "").strip()
    if not full_name:
        errors["full_name"] = "Full name is required"
    if not email:
        errors["email"] = "Email address is required"
    elif not _valid_email(email):
        errors["email"] = "Please enter a valid email address"
    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db     = get_db()
    cursor = db.execute("""
        INSERT INTO inquiries
        (property_id, property_title, full_name, email, phone,
         desired_move_in_date, number_of_occupants, message, status, created_at)
        VALUES (NULL, ?, ?, ?, ?, '', '', ?, 'New', ?)
    """, (
        (data.get("inquiry_type") or "General Contact"),
        full_name, email,
        (data.get("phone") or "").strip(),
        (data.get("message") or "").strip(),
        _now(),
    ))
    db.commit()
    return jsonify({"success": True, "id": cursor.lastrowid}), 201

# ── Serve React SPA ────────────────────────────────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    dist  = os.path.join(ROOT_DIR, "frontend", "dist")
    fpath = os.path.join(dist, path) if path else None
    if fpath and os.path.isfile(fpath):
        return send_from_directory(dist, path)
    index = os.path.join(dist, "index.html")
    if os.path.isfile(index):
        return send_file(index)
    return jsonify({"error": "Frontend not built. Run: node build.js"}), 404

# ── Startup init ───────────────────────────────────────────────────────────────
# Runs at module import (Vercel) and at direct execution (local dev).
init_db()

if __name__ == "__main__":
    print(f"Erowho Holdings Limited — Flask API")
    print(f"  DB:    {DB_PATH}")
    print(f"  Admin: {ADMIN_USER} / {'*' * len(ADMIN_PASS)}")
    print(f"  URL:   http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)

"""
Erowho Holdings Limited - Flask API Backend
Serves REST API on port 5001. Flask also serves the built React frontend.
"""

import os
import sys
import json
import hashlib
import sqlite3
from datetime import datetime, timezone
from functools import wraps
from flask import Flask, jsonify, request, send_from_directory, send_file, g

try:
    import jwt
except ImportError:
    print("PyJWT not found. Install with: pip install PyJWT")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.dirname(BASE_DIR)
STATIC_DIR = os.path.join(ROOT_DIR, "frontend", "dist")
DB_PATH    = os.path.join(BASE_DIR, "erowho.db")
SECRET_KEY = os.environ.get("SECRET_KEY", "erowho-dev-secret-change-in-production")
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin123")

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")

# ── CORS (manual, no flask-cors needed) ──────────────────────────────────────
@app.after_request
def add_cors(response):
    origin = request.headers.get("Origin", "")
    allowed = ["http://localhost:3000", "http://localhost:5001", "http://127.0.0.1:5001"]
    if origin in allowed or os.environ.get("FLASK_ENV") == "development":
        response.headers["Access-Control-Allow-Origin"] = origin or "*"
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

# ── Database ──────────────────────────────────────────────────────────────────
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
    """Add new columns to existing tables without data loss."""
    for col, definition in [
        ("image_url",       "TEXT DEFAULT ''"),
        ("gallery_images",  "TEXT DEFAULT '[]'"),
    ]:
        try:
            db.execute(f"ALTER TABLE properties ADD COLUMN {col} {definition}")
            db.commit()
        except Exception:
            pass  # Column already exists

def init_db():
    """Create tables, run migrations, and seed initial data."""
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.executescript("""
        CREATE TABLE IF NOT EXISTS properties (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            title            TEXT NOT NULL,
            slug             TEXT UNIQUE NOT NULL,
            country          TEXT NOT NULL,
            city             TEXT NOT NULL,
            address_or_area  TEXT,
            property_type    TEXT NOT NULL,
            bedrooms         REAL NOT NULL DEFAULT 1,
            bathrooms        REAL NOT NULL DEFAULT 1,
            monthly_rent     INTEGER NOT NULL,
            availability_status TEXT NOT NULL DEFAULT 'Available',
            description      TEXT,
            amenities        TEXT DEFAULT '[]',
            is_published     INTEGER NOT NULL DEFAULT 1,
            created_at       TEXT NOT NULL,
            updated_at       TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS inquiries (
            id                    INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id           INTEGER,
            property_title        TEXT,
            full_name             TEXT NOT NULL,
            email                 TEXT NOT NULL,
            phone                 TEXT,
            desired_move_in_date  TEXT,
            number_of_occupants   TEXT,
            message               TEXT,
            status                TEXT NOT NULL DEFAULT 'New',
            created_at            TEXT NOT NULL,
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

    # Run column migrations for existing databases
    migrate_db(db)

    # Seed admin account
    existing = db.execute("SELECT id FROM admins WHERE username = ?", (ADMIN_USER,)).fetchone()
    if not existing:
        pw_hash = hashlib.sha256(ADMIN_PASS.encode()).hexdigest()
        db.execute(
            "INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
            (ADMIN_USER, pw_hash, now())
        )
        db.commit()

    # Seed sample properties if none exist
    count = db.execute("SELECT COUNT(*) FROM properties").fetchone()[0]
    if count == 0:
        seed_properties(db)
    else:
        # Update existing seed properties to have image URLs if they're missing
        seed_images = {
            "stonebridge-townhome":    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
            "maple-row-residence":     "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
            "cedar-park-duplex":       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "bronze-gate-apartment":   "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "northline-family-home":   "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        }
        for slug, url in seed_images.items():
            db.execute(
                "UPDATE properties SET image_url=? WHERE slug=? AND (image_url IS NULL OR image_url='')",
                (url, slug)
            )
        db.commit()

    db.close()

def now():
    return datetime.now(timezone.utc).isoformat()

def seed_properties(db):
    samples = [
        {
            "title": "Stonebridge Townhome",
            "slug": "stonebridge-townhome",
            "country": "Canada",
            "city": "Toronto",
            "address_or_area": "Midtown Toronto",
            "property_type": "Townhome",
            "bedrooms": 3,
            "bathrooms": 2.5,
            "monthly_rent": 3200,
            "availability_status": "Coming Soon",
            "description": "A modern townhome designed for comfortable long-term living in a connected urban market. Featuring open-concept living areas, quality finishes, and a private outdoor space. Located close to transit, parks, and everyday amenities.",
            "amenities": json.dumps(["In-unit laundry", "Private backyard", "Attached garage", "Modern kitchen", "Central air"]),
            "is_published": 1,
            "image_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
            "gallery_images": json.dumps([
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
            ]),
        },
        {
            "title": "Maple Row Residence",
            "slug": "maple-row-residence",
            "country": "Canada",
            "city": "Ottawa",
            "address_or_area": "Westboro, Ottawa",
            "property_type": "Single-Family Home",
            "bedrooms": 4,
            "bathrooms": 3,
            "monthly_rent": 2850,
            "availability_status": "Available",
            "description": "A warm single-family rental home with practical living spaces and long-term rental suitability. Four bedrooms, a generous yard, and a quiet residential setting make this an ideal home for families.",
            "amenities": json.dumps(["Large backyard", "Double garage", "Finished basement", "Hardwood floors", "Gas fireplace"]),
            "is_published": 1,
            "image_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
            "gallery_images": json.dumps([
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
            ]),
        },
        {
            "title": "Cedar Park Duplex",
            "slug": "cedar-park-duplex",
            "country": "United States",
            "city": "Dallas",
            "address_or_area": "Oak Cliff, Dallas",
            "property_type": "Duplex",
            "bedrooms": 2,
            "bathrooms": 2,
            "monthly_rent": 2100,
            "availability_status": "Available",
            "description": "A clean and functional rental unit in a growing residential market. Thoughtfully maintained with updated fixtures and a comfortable layout suitable for professionals or small families.",
            "amenities": json.dumps(["Private entrance", "In-unit laundry", "Off-street parking", "Central HVAC", "Pet-friendly"]),
            "is_published": 1,
            "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "gallery_images": json.dumps([
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
            ]),
        },
        {
            "title": "Bronze Gate Apartment",
            "slug": "bronze-gate-apartment",
            "country": "United States",
            "city": "Houston",
            "address_or_area": "Montrose, Houston",
            "property_type": "Apartment",
            "bedrooms": 1,
            "bathrooms": 1,
            "monthly_rent": 1550,
            "availability_status": "Rented",
            "description": "A compact apartment rental suitable for simple, convenient city living. Well-maintained and efficiently designed for urban professionals seeking a manageable, quality space.",
            "amenities": json.dumps(["Building security", "On-site parking", "Modern appliances", "Central air", "Storage unit"]),
            "is_published": 1,
            "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "gallery_images": json.dumps([
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            ]),
        },
        {
            "title": "Northline Family Home",
            "slug": "northline-family-home",
            "country": "United States",
            "city": "Atlanta",
            "address_or_area": "Brookhaven, Atlanta",
            "property_type": "Single-Family Home",
            "bedrooms": 3,
            "bathrooms": 2,
            "monthly_rent": 2400,
            "availability_status": "Under Review",
            "description": "A family-style rental property being reviewed for long-term portfolio fit. Generous living areas, a safe neighborhood, and strong school access make this a promising long-term asset.",
            "amenities": json.dumps(["Two-car garage", "Fenced yard", "Open kitchen", "Breakfast nook", "Quiet street"]),
            "is_published": 1,
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "gallery_images": json.dumps([
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
            ]),
        },
    ]
    for s in samples:
        s["created_at"] = now()
        s["updated_at"] = now()
        db.execute("""
            INSERT OR IGNORE INTO properties
            (title,slug,country,city,address_or_area,property_type,bedrooms,bathrooms,
             monthly_rent,availability_status,description,amenities,is_published,
             image_url,gallery_images,created_at,updated_at)
            VALUES (:title,:slug,:country,:city,:address_or_area,:property_type,:bedrooms,:bathrooms,
                    :monthly_rent,:availability_status,:description,:amenities,:is_published,
                    :image_url,:gallery_images,:created_at,:updated_at)
        """, s)
    db.commit()

# ── Helpers ───────────────────────────────────────────────────────────────────
def row_to_dict(row):
    if row is None:
        return None
    d = dict(row)
    if "amenities" in d and isinstance(d["amenities"], str):
        try:
            d["amenities"] = json.loads(d["amenities"])
        except Exception:
            d["amenities"] = []
    if "gallery_images" in d and isinstance(d["gallery_images"], str):
        try:
            d["gallery_images"] = json.loads(d["gallery_images"])
        except Exception:
            d["gallery_images"] = []
    d["is_published"] = bool(d.get("is_published", 0))
    return d

def err(msg, code=400):
    return jsonify({"error": msg}), code

# ── Auth ──────────────────────────────────────────────────────────────────────
def make_token(username):
    import time
    payload = {"sub": username, "iat": int(time.time()), "exp": int(time.time()) + 86400 * 7}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return err("Unauthorized", 401)
        token = auth_header[7:]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.admin_user = payload["sub"]
        except jwt.ExpiredSignatureError:
            return err("Token expired", 401)
        except jwt.InvalidTokenError:
            return err("Invalid token", 401)
        return f(*args, **kwargs)
    return decorated

# ── API Routes ────────────────────────────────────────────────────────────────

# Auth
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")
    if not username or not password:
        return err("Username and password required")
    pw_hash = hashlib.sha256(password.encode()).hexdigest()
    db = get_db()
    admin = db.execute(
        "SELECT * FROM admins WHERE username = ? AND password_hash = ?",
        (username, pw_hash)
    ).fetchone()
    if not admin:
        return err("Invalid credentials", 401)
    token = make_token(username)
    return jsonify({"token": token, "username": username})

@app.route("/api/auth/verify", methods=["GET"])
@require_auth
def verify_token():
    return jsonify({"valid": True, "username": g.admin_user})

# Public property routes
@app.route("/api/properties", methods=["GET"])
def get_properties():
    db = get_db()
    q        = request.args.get("q", "")
    country  = request.args.get("country", "")
    city     = request.args.get("city", "")
    ptype    = request.args.get("property_type", "")
    beds     = request.args.get("bedrooms", "")
    status   = request.args.get("status", "")
    max_rent = request.args.get("max_rent", "")
    admin_view = request.args.get("admin", "")

    sql = "SELECT * FROM properties WHERE 1=1"
    params = []

    if not (admin_view and request.headers.get("Authorization")):
        sql += " AND is_published = 1"

    if q:
        sql += " AND (title LIKE ? OR city LIKE ? OR country LIKE ?)"
        params += [f"%{q}%", f"%{q}%", f"%{q}%"]
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
        sql += " AND bedrooms >= ?"
        params.append(float(beds))
    if status:
        sql += " AND availability_status = ?"
        params.append(status)
    if max_rent:
        sql += " AND monthly_rent <= ?"
        params.append(int(max_rent))

    sql += " ORDER BY created_at DESC"
    rows = db.execute(sql, params).fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/properties/<int:pid>", methods=["GET"])
def get_property(pid):
    db = get_db()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not row:
        return err("Property not found", 404)
    return jsonify(row_to_dict(row))

@app.route("/api/properties/slug/<slug>", methods=["GET"])
def get_property_by_slug(slug):
    db = get_db()
    row = db.execute("SELECT * FROM properties WHERE slug = ? AND is_published = 1", (slug,)).fetchone()
    if not row:
        return err("Property not found", 404)
    return jsonify(row_to_dict(row))

# Admin property routes
@app.route("/api/admin/properties", methods=["GET"])
@require_auth
def admin_list_properties():
    db = get_db()
    rows = db.execute("SELECT * FROM properties ORDER BY created_at DESC").fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/admin/properties", methods=["POST"])
@require_auth
def create_property():
    data = request.get_json() or {}
    required = ["title", "country", "city", "property_type", "monthly_rent"]
    for f in required:
        if not data.get(f):
            return err(f"Field '{f}' is required")

    slug = data.get("slug") or data["title"].lower().replace(" ", "-").replace("/", "-")
    amenities = json.dumps(data.get("amenities", []))
    gallery   = json.dumps(data.get("gallery_images", []))

    db = get_db()
    existing = db.execute("SELECT id FROM properties WHERE slug = ?", (slug,)).fetchone()
    if existing:
        slug = f"{slug}-{int(datetime.now().timestamp())}"

    cursor = db.execute("""
        INSERT INTO properties
        (title,slug,country,city,address_or_area,property_type,bedrooms,bathrooms,
         monthly_rent,availability_status,description,amenities,is_published,
         image_url,gallery_images,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        data["title"], slug, data["country"], data["city"],
        data.get("address_or_area", ""), data["property_type"],
        float(data.get("bedrooms", 1)), float(data.get("bathrooms", 1)),
        int(data["monthly_rent"]),
        data.get("availability_status", "Available"),
        data.get("description", ""), amenities,
        1 if data.get("is_published", True) else 0,
        data.get("image_url", ""), gallery,
        now(), now()
    ))
    db.commit()
    new_id = cursor.lastrowid
    row = db.execute("SELECT * FROM properties WHERE id = ?", (new_id,)).fetchone()
    return jsonify(row_to_dict(row)), 201

@app.route("/api/admin/properties/<int:pid>", methods=["PUT"])
@require_auth
def update_property(pid):
    db = get_db()
    existing = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not existing:
        return err("Property not found", 404)

    data = request.get_json() or {}
    amenities = json.dumps(data.get("amenities", json.loads(existing["amenities"] or "[]")))
    gallery   = json.dumps(data.get("gallery_images", json.loads(existing["gallery_images"] or "[]")))
    slug = data.get("slug", existing["slug"])

    db.execute("""
        UPDATE properties SET
          title=?, slug=?, country=?, city=?, address_or_area=?,
          property_type=?, bedrooms=?, bathrooms=?, monthly_rent=?,
          availability_status=?, description=?, amenities=?,
          is_published=?, image_url=?, gallery_images=?, updated_at=?
        WHERE id=?
    """, (
        data.get("title", existing["title"]),
        slug,
        data.get("country", existing["country"]),
        data.get("city", existing["city"]),
        data.get("address_or_area", existing["address_or_area"]),
        data.get("property_type", existing["property_type"]),
        float(data.get("bedrooms", existing["bedrooms"])),
        float(data.get("bathrooms", existing["bathrooms"])),
        int(data.get("monthly_rent", existing["monthly_rent"])),
        data.get("availability_status", existing["availability_status"]),
        data.get("description", existing["description"]),
        amenities,
        1 if data.get("is_published", bool(existing["is_published"])) else 0,
        data.get("image_url", existing["image_url"] or ""),
        gallery,
        now(), pid
    ))
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

@app.route("/api/admin/properties/<int:pid>", methods=["DELETE"])
@require_auth
def delete_property(pid):
    db = get_db()
    existing = db.execute("SELECT id FROM properties WHERE id = ?", (pid,)).fetchone()
    if not existing:
        return err("Property not found", 404)
    db.execute("DELETE FROM properties WHERE id = ?", (pid,))
    db.commit()
    return jsonify({"deleted": True, "id": pid})

@app.route("/api/admin/properties/<int:pid>/publish", methods=["PATCH"])
@require_auth
def toggle_publish(pid):
    db = get_db()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not row:
        return err("Property not found", 404)
    new_status = 0 if row["is_published"] else 1
    db.execute("UPDATE properties SET is_published=?, updated_at=? WHERE id=?",
               (new_status, now(), pid))
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

# Inquiries
@app.route("/api/inquiries", methods=["POST"])
def create_inquiry():
    data = request.get_json() or {}
    if not data.get("full_name") or not data.get("email"):
        return err("Name and email are required")

    db = get_db()
    cursor = db.execute("""
        INSERT INTO inquiries
        (property_id,property_title,full_name,email,phone,
         desired_move_in_date,number_of_occupants,message,status,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    """, (
        data.get("property_id"),
        data.get("property_title", ""),
        data["full_name"],
        data["email"],
        data.get("phone", ""),
        data.get("desired_move_in_date", ""),
        data.get("number_of_occupants", ""),
        data.get("message", ""),
        "New",
        now()
    ))
    db.commit()
    return jsonify({"id": cursor.lastrowid, "status": "received"}), 201

@app.route("/api/admin/inquiries", methods=["GET"])
@require_auth
def list_inquiries():
    db = get_db()
    rows = db.execute("SELECT * FROM inquiries ORDER BY created_at DESC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/admin/inquiries/<int:iid>", methods=["PATCH"])
@require_auth
def update_inquiry_status(iid):
    data = request.get_json() or {}
    status = data.get("status", "")
    if status not in ("New", "Reviewed", "Contacted", "Closed"):
        return err("Invalid status")
    db = get_db()
    db.execute("UPDATE inquiries SET status=? WHERE id=?", (status, iid))
    db.commit()
    return jsonify({"updated": True})

# Stats for dashboard
@app.route("/api/admin/stats", methods=["GET"])
@require_auth
def get_stats():
    db = get_db()
    total     = db.execute("SELECT COUNT(*) FROM properties").fetchone()[0]
    published = db.execute("SELECT COUNT(*) FROM properties WHERE is_published=1").fetchone()[0]
    available = db.execute("SELECT COUNT(*) FROM properties WHERE availability_status='Available' AND is_published=1").fetchone()[0]
    rented    = db.execute("SELECT COUNT(*) FROM properties WHERE availability_status='Rented'").fetchone()[0]
    inquiries = db.execute("SELECT COUNT(*) FROM inquiries").fetchone()[0]
    new_inq   = db.execute("SELECT COUNT(*) FROM inquiries WHERE status='New'").fetchone()[0]
    return jsonify({
        "total_properties": total,
        "published": published,
        "available": available,
        "rented": rented,
        "total_inquiries": inquiries,
        "new_inquiries": new_inq,
    })

# Admin password change
@app.route("/api/admin/change-password", methods=["POST"])
@require_auth
def change_password():
    data = request.get_json() or {}
    current = data.get("current_password", "")
    new_pw  = data.get("new_password", "")
    if not current or not new_pw or len(new_pw) < 6:
        return err("Current password and new password (min 6 chars) required")
    db = get_db()
    current_hash = hashlib.sha256(current.encode()).hexdigest()
    admin = db.execute(
        "SELECT * FROM admins WHERE username=? AND password_hash=?",
        (g.admin_user, current_hash)
    ).fetchone()
    if not admin:
        return err("Current password is incorrect", 401)
    new_hash = hashlib.sha256(new_pw.encode()).hexdigest()
    db.execute("UPDATE admins SET password_hash=? WHERE username=?", (new_hash, g.admin_user))
    db.commit()
    return jsonify({"updated": True})

# ── Serve React frontend ──────────────────────────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    dist = os.path.join(ROOT_DIR, "frontend", "dist")
    if path and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    index = os.path.join(dist, "index.html")
    if os.path.exists(index):
        return send_file(index)
    return jsonify({"error": "Frontend not built. Run: npm run build"}), 404

# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Initialising Erowho Holdings Limited database...")
    init_db()
    print(f"Database ready: {DB_PATH}")
    print(f"Admin login: {ADMIN_USER} / {ADMIN_PASS}")
    print("Starting Flask on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)

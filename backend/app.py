"""
Erowho Holdings Limited — Flask API

Routes, CORS, and static file serving.
Domain logic lives in db.py, auth.py, and validation.py.

IMPORTANT — Temporary demo credentials:
  ADMIN_USERNAME and ADMIN_PASSWORD come from environment variables.
  Defaults (admin / admin123) are for local development only.
  Set strong credentials via environment variables before any real deployment.

Database:
  SQLite is used locally and on Vercel (/tmp/erowho.db).
  Vercel data is ephemeral — reset on every cold start.
  For persistent production data, point DATABASE_URL at Supabase Postgres
  and add a SQLAlchemy + psycopg2-binary adapter (see db.py for the TODO).
"""

import os
import sys
import json

# Ensure backend/ directory is on sys.path so sibling modules import cleanly.
# Required on Vercel where the working directory may differ from __file__.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request, send_from_directory, send_file, g
from werkzeug.security import generate_password_hash, check_password_hash

from db import (
    get_db, close_db, init_db,
    generate_slug, row_to_dict, now, DB_PATH,
    ADMIN_USER,
)
from auth import make_token, require_auth
from validation import (
    ALLOWED_STATUSES, ALLOWED_INQUIRY_STATUSES,
    valid_email, validate_property, validate_inquiry,
)

# ── Config ─────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.dirname(BASE_DIR)
STATIC_DIR = os.path.join(ROOT_DIR, "frontend", "dist")

_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()] or [
    "http://localhost:3000",
    "http://localhost:5001",
    "http://localhost:5173",
    "http://127.0.0.1:5001",
]

# ── Flask app ──────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")
app.teardown_appcontext(close_db)

# ── Response helpers ───────────────────────────────────────────────────────────
def ok(data=None, code=200):
    return jsonify({"success": True, "data": data}), code

def err(msg: str, code=400):
    return jsonify({"success": False, "error": msg}), code

# ── CORS ───────────────────────────────────────────────────────────────────────
@app.after_request
def add_cors(response):
    origin = request.headers.get("Origin", "")
    is_dev = os.environ.get("FLASK_ENV") == "development"
    if origin in ALLOWED_ORIGINS or is_dev:
        response.headers["Access-Control-Allow-Origin"]      = origin
        response.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"]     = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        resp = app.make_default_options_response()
        add_cors(resp)
        return resp

# ── Auth routes ────────────────────────────────────────────────────────────────
@app.route("/api/auth/login", methods=["POST"])
def login():
    data     = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return err("Username and password are required")
    db    = get_db()
    admin = db.execute("SELECT * FROM admins WHERE username = ?", (username,)).fetchone()
    if not admin or not check_password_hash(admin["password_hash"], password):
        return err("Invalid username or password", 401)
    token = make_token(username)
    # Return flat shape — frontend expects {token, username}
    return jsonify({"token": token, "username": username})

@app.route("/api/auth/verify", methods=["GET"])
@require_auth
def verify_token():
    return jsonify({"valid": True, "username": g.admin_user})

# ── Public property routes ─────────────────────────────────────────────────────
@app.route("/api/properties", methods=["GET"])
def get_properties():
    db = get_db()
    q        = request.args.get("q",             "").strip()
    country  = request.args.get("country",        "").strip()
    city     = request.args.get("city",           "").strip()
    ptype    = request.args.get("property_type",  "").strip()
    beds     = request.args.get("bedrooms",       "").strip()
    baths    = request.args.get("bathrooms",      "").strip()
    status   = request.args.get("status",         "").strip()
    min_rent = request.args.get("min_rent",       "").strip()
    max_rent = request.args.get("max_rent",       "").strip()

    sql    = "SELECT * FROM properties WHERE is_published = 1"
    params = []

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
    if min_rent:
        try:
            sql += " AND monthly_rent >= ?"
            params.append(int(min_rent))
        except ValueError:
            pass
    if max_rent:
        try:
            sql += " AND monthly_rent <= ?"
            params.append(int(max_rent))
        except ValueError:
            pass

    sql += " ORDER BY is_featured DESC, created_at DESC"
    rows = db.execute(sql, params).fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/properties/<int:pid>", methods=["GET"])
def get_property(pid):
    db  = get_db()
    row = db.execute(
        "SELECT * FROM properties WHERE id = ? AND is_published = 1", (pid,)
    ).fetchone()
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
    rows = db.execute("SELECT * FROM properties ORDER BY is_featured DESC, created_at DESC").fetchall()
    return jsonify([row_to_dict(r) for r in rows])

@app.route("/api/admin/properties/slug/<slug>", methods=["GET"])
@require_auth
def admin_get_property_by_slug(slug):
    """Admin preview — returns any property by slug, published or draft."""
    db  = get_db()
    row = db.execute("SELECT * FROM properties WHERE slug = ?", (slug,)).fetchone()
    if not row:
        return err("Property not found", 404)
    return jsonify(row_to_dict(row))

@app.route("/api/admin/properties", methods=["POST"])
@require_auth
def create_property():
    data   = request.get_json() or {}
    errors = validate_property(data)
    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db   = get_db()
    slug = generate_slug(data.get("slug") or data["title"], db)

    cursor = db.execute("""
        INSERT INTO properties
        (title, slug, country, city, address_or_area, property_type,
         bedrooms, bathrooms, monthly_rent, availability_status,
         description, amenities, is_published, is_featured, image_url, gallery_images,
         created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
        1 if data.get("is_featured", False) else 0,
        (data.get("image_url") or "").strip(),
        json.dumps(data.get("gallery_images") or []),
        now(), now(),
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

    if "monthly_rent" in data:
        try:
            if int(data["monthly_rent"]) <= 0:
                return err("Monthly rent must be a positive number")
        except (ValueError, TypeError):
            return err("Monthly rent must be a number")
    if "availability_status" in data and data["availability_status"] not in ALLOWED_STATUSES:
        return err(f"Status must be one of: {', '.join(sorted(ALLOWED_STATUSES))}")

    if "slug" in data:
        slug = data["slug"]
    elif "title" in data and data["title"] != existing["title"]:
        slug = generate_slug(data["title"], db, exclude_id=pid)
    else:
        slug = existing["slug"]

    db.execute("""
        UPDATE properties SET
          title=?, slug=?, country=?, city=?, address_or_area=?,
          property_type=?, bedrooms=?, bathrooms=?, monthly_rent=?,
          availability_status=?, description=?, amenities=?,
          is_published=?, is_featured=?, image_url=?, gallery_images=?, updated_at=?
        WHERE id=?
    """, (
        (data.get("title") or existing["title"]).strip(),
        slug,
        (data.get("country") or existing["country"]).strip(),
        (data.get("city") or existing["city"]).strip(),
        (data.get("address_or_area") if "address_or_area" in data else existing["address_or_area"] or "").strip(),
        (data.get("property_type") or existing["property_type"]).strip(),
        max(0.0, float(data.get("bedrooms") if "bedrooms" in data else existing["bedrooms"])),
        max(0.0, float(data.get("bathrooms") if "bathrooms" in data else existing["bathrooms"])),
        int(data.get("monthly_rent") if "monthly_rent" in data else existing["monthly_rent"]),
        data.get("availability_status") or existing["availability_status"],
        (data.get("description") if "description" in data else existing["description"] or "").strip(),
        json.dumps(data.get("amenities") if "amenities" in data else json.loads(existing["amenities"] or "[]")),
        1 if data.get("is_published", bool(existing["is_published"])) else 0,
        1 if data.get("is_featured", bool(existing["is_featured"])) else 0,
        (data.get("image_url") if "image_url" in data else existing["image_url"] or "").strip(),
        json.dumps(data.get("gallery_images") if "gallery_images" in data else json.loads(existing["gallery_images"] or "[]")),
        now(), pid,
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
        (new_val, now(), pid),
    )
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

@app.route("/api/admin/properties/<int:pid>/feature", methods=["PATCH"])
@require_auth
def toggle_feature(pid):
    db  = get_db()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    if not row:
        return err("Property not found", 404)
    new_val = 0 if row["is_featured"] else 1
    db.execute(
        "UPDATE properties SET is_featured=?, updated_at=? WHERE id=?",
        (new_val, now(), pid),
    )
    db.commit()
    row = db.execute("SELECT * FROM properties WHERE id = ?", (pid,)).fetchone()
    return jsonify(row_to_dict(row))

# ── Inquiry routes ─────────────────────────────────────────────────────────────
@app.route("/api/inquiries", methods=["POST"])
def create_inquiry():
    data   = request.get_json() or {}
    errors = validate_inquiry(data)
    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db     = get_db()
    ts     = now()
    cursor = db.execute("""
        INSERT INTO inquiries
        (property_id, property_title, full_name, email, phone,
         desired_move_in_date, number_of_occupants, message, status,
         admin_notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', '', ?, ?)
    """, (
        data.get("property_id"),
        (data.get("property_title") or "").strip(),
        data["full_name"].strip(),
        data["email"].strip(),
        (data.get("phone") or "").strip(),
        (data.get("desired_move_in_date") or "").strip(),
        (data.get("number_of_occupants") or "").strip(),
        (data.get("message") or "").strip(),
        ts, ts,
    ))
    db.commit()
    return jsonify({"success": True, "id": cursor.lastrowid}), 201

@app.route("/api/contact", methods=["POST"])
def contact():
    """General contact form — stored as an inquiry with no property_id."""
    data   = request.get_json() or {}
    errors = validate_inquiry(data)
    if errors:
        return jsonify({"success": False, "error": "Validation failed", "fields": errors}), 400

    db     = get_db()
    ts     = now()
    cursor = db.execute("""
        INSERT INTO inquiries
        (property_id, property_title, full_name, email, phone,
         desired_move_in_date, number_of_occupants, message, status,
         admin_notes, created_at, updated_at)
        VALUES (NULL, ?, ?, ?, ?, '', '', ?, 'New', '', ?, ?)
    """, (
        (data.get("inquiry_type") or "General Contact"),
        data["full_name"].strip(),
        data["email"].strip(),
        (data.get("phone") or "").strip(),
        (data.get("message") or "").strip(),
        ts, ts,
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
def update_inquiry(iid):
    data        = request.get_json() or {}
    status      = data.get("status")
    admin_notes = data.get("admin_notes")

    if status is not None:
        status = status.strip()
        if status not in ALLOWED_INQUIRY_STATUSES:
            return err(f"Status must be one of: {', '.join(sorted(ALLOWED_INQUIRY_STATUSES))}")

    if status is None and admin_notes is None:
        return err("Provide status, admin_notes, or both")

    db = get_db()
    if not db.execute("SELECT id FROM inquiries WHERE id = ?", (iid,)).fetchone():
        return err("Inquiry not found", 404)

    cols, vals = [], []
    if status is not None:
        cols.append("status=?"); vals.append(status)
    if admin_notes is not None:
        cols.append("admin_notes=?")
        vals.append((admin_notes or "").strip() if isinstance(admin_notes, str) else "")
    cols.append("updated_at=?"); vals.append(now())
    vals.append(iid)

    db.execute(f"UPDATE inquiries SET {', '.join(cols)} WHERE id=?", vals)
    db.commit()
    row = db.execute("SELECT * FROM inquiries WHERE id = ?", (iid,)).fetchone()
    return jsonify(dict(row))

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
        "featured":         db.execute("SELECT COUNT(*) FROM properties WHERE is_featured=1").fetchone()[0],
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
    return jsonify({"error": "Frontend not built. Run: node build.js from frontend/"}), 404

# ── Startup ────────────────────────────────────────────────────────────────────
# Called at module import (Vercel) and at direct execution (local dev).
init_db()

if __name__ == "__main__":
    print("Erowho Holdings Limited — Flask API")
    print(f"  DB:  {DB_PATH}")
    print(f"  URL: http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)

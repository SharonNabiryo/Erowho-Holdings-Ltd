"""
Erowho Holdings Limited — Authentication utilities
JWT token creation/verification, password hashing, auth decorator.
"""

import os
import sys
import time
from functools import wraps

from flask import request, g, jsonify
from werkzeug.security import generate_password_hash, check_password_hash  # re-exported

try:
    import jwt
except ImportError:
    print("PyJWT not found. Install: pip install PyJWT")
    sys.exit(1)

SECRET_KEY = os.environ.get("SECRET_KEY", "erowho-dev-secret-change-in-production")
TOKEN_TTL_SECONDS = int(os.environ.get("TOKEN_TTL_SECONDS", str(60 * 60 * 24 * 7)))


def make_token(username: str) -> str:
    now = int(time.time())
    return jwt.encode(
        {"sub": username, "iat": now, "exp": now + TOKEN_TTL_SECONDS},
        SECRET_KEY,
        algorithm="HS256",
    )


def require_auth(f):
    """Route decorator that enforces Bearer token auth."""
    @wraps(f)
    def decorated(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"success": False, "error": "Unauthorized"}), 401
        token = header[7:]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.admin_user = payload["sub"]
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "error": "Session expired — please log in again"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "error": "Invalid session token"}), 401
        return f(*args, **kwargs)
    return decorated

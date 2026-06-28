#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Erowho Holdings — Full Stack Startup Script
# Starts the Flask backend (port 5001) which also serves the React frontend.
# ─────────────────────────────────────────────────────────────────────────────

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │        Erowho Holdings Platform          │"
echo "  │        Real Estate Rental System         │"
echo "  └─────────────────────────────────────────┘"
echo ""

# ── 1. Check Python ───────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo "ERROR: python3 not found. Install Python 3.8+."
  exit 1
fi

# ── 2. Check Flask ────────────────────────────────────────────────────────────
if ! python3 -c "import flask" 2>/dev/null; then
  echo "Installing Flask..."
  pip3 install flask PyJWT --break-system-packages
fi

# ── 3. Build frontend if bundle is missing ────────────────────────────────────
BUNDLE="$FRONTEND/dist/bundle.js"
if [ ! -f "$BUNDLE" ]; then
  echo "Building React frontend..."
  bash "$ROOT/build.sh"
fi

# ── 4. Start Flask (serves API + React) ───────────────────────────────────────
echo "  Starting server on http://localhost:5001"
echo "  Admin:    http://localhost:5001  → click Admin in footer"
echo "  Login:    admin / admin123"
echo ""
echo "  Press Ctrl+C to stop."
echo ""

cd "$BACKEND"
FLASK_ENV=development python3 app.py

#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Erowho Holdings — Frontend Build Script
# Bundles React/TypeScript source into frontend/dist/bundle.js
# Uses esbuild (ships with tsx, no separate install needed).
# ─────────────────────────────────────────────────────────────────────────────

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND="$ROOT/frontend"

echo "Building Erowho Holdings frontend..."

# Locate esbuild (bundled with tsx global install)
ESBUILD_PATHS=(
  "$HOME/.npm-global/lib/node_modules/tsx/node_modules/esbuild/bin/esbuild"
  "/usr/local/lib/node_modules/tsx/node_modules/esbuild/bin/esbuild"
  "$(npm root -g 2>/dev/null)/tsx/node_modules/esbuild/bin/esbuild"
  "esbuild"
)

ESBUILD=""
for p in "${ESBUILD_PATHS[@]}"; do
  if command -v "$p" &>/dev/null || [ -f "$p" ]; then
    ESBUILD="$p"
    break
  fi
done

if [ -z "$ESBUILD" ]; then
  echo "ERROR: esbuild not found."
  echo "Install tsx globally: npm install -g tsx"
  exit 1
fi

# Locate node_modules for React
NODE_MODULES_PATHS=(
  "$HOME/.npm-global/lib/node_modules"
  "/usr/local/lib/node_modules"
  "$(npm root -g 2>/dev/null)"
)

NODE_PATH=""
for p in "${NODE_MODULES_PATHS[@]}"; do
  if [ -d "$p/react" ]; then
    NODE_PATH="$p"
    break
  fi
done

if [ -z "$NODE_PATH" ]; then
  echo "ERROR: React not found in global node_modules."
  echo "Install: npm install -g react react-dom"
  exit 1
fi

mkdir -p "$FRONTEND/dist"

NODE_PATH="$NODE_PATH" "$ESBUILD" \
  "$FRONTEND/src/main.tsx" \
  --bundle \
  --platform=browser \
  --target=es2020 \
  --jsx=automatic \
  --format=iife \
  --outfile="$FRONTEND/dist/bundle.js" \
  --define:process.env.NODE_ENV='"production"' \
  --minify \
  --sourcemap

echo "✓ Frontend built → frontend/dist/bundle.js"
echo "  Bundle size: $(du -sh "$FRONTEND/dist/bundle.js" | cut -f1)"

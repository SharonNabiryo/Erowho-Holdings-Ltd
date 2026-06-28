#!/usr/bin/env node
/**
 * Build script: bundles the React frontend using the esbuild
 * that ships with tsx (already installed globally).
 */
const path = require("path");
const fs   = require("fs");

// Locate esbuild from tsx's node_modules
const ESBUILD_BIN = (() => {
  const candidates = [
    path.join(process.env.npm_config_prefix || "", "lib/node_modules/tsx/node_modules/esbuild/bin/esbuild"),
    "/home/claude/.npm-global/lib/node_modules/tsx/node_modules/esbuild/bin/esbuild",
    path.join(__dirname, "../node_modules/.bin/esbuild"),
    "esbuild",
    "npx esbuild",  // fallback: use npx
  ];
  for (const c of candidates) {
    try { if (c.startsWith("npx") || fs.existsSync(c)) return c; } catch {}
  }
  return "npx esbuild";
})();

const NODE_MODULES = (() => {
  const candidates = [
    "/home/claude/.npm-global/lib/node_modules",
    path.join(process.env.npm_config_prefix || "", "lib/node_modules"),
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch {}
  }
  return "";
})();

const { execSync } = require("child_process");
const ROOT    = path.join(__dirname, "..");
const SRC     = path.join(__dirname, "src", "main.tsx");
const OUTDIR  = path.join(__dirname, "dist");
const OUTFILE = path.join(OUTDIR, "bundle.js");

if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const cmd = [
  ESBUILD_BIN,
  SRC,
  "--bundle",
  "--platform=browser",
  "--target=es2020",
  "--jsx=automatic",
  "--format=iife",
  `--outfile=${OUTFILE}`,
  '--define:process.env.NODE_ENV=\'"production"\'',
  `--define:process.env.API_BASE=\'"http://localhost:5001"\'`,
  "--minify",
  "--sourcemap",
].join(" ");

const env = { ...process.env, NODE_PATH: NODE_MODULES };

console.log("Building Erowho Holdings frontend...");
try {
  execSync(cmd, { env, stdio: "inherit", cwd: __dirname });
  console.log(`✓ Bundle written to ${OUTFILE}`);
} catch (e) {
  console.error("Build failed:", e.message);
  process.exit(1);
}

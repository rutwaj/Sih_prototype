#!/usr/bin/env node
/**
 * check-tokens.js
 * Scans all .tsx, .ts, .css files for:
 *   1. Hardcoded hex colors (e.g. #3DD6B0, #0B0D0F)
 *   2. Arbitrary Tailwind color/size values (e.g. text-[13px], bg-[#abc])
 *   3. Inline style color values
 * Exits with code 1 if any violations are found.
 *
 * Allowed: values that appear in tokens.json (those are legitimate in tokens.json itself
 *          and in tailwind.config.ts / globals.css where tokens are defined).
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Files/dirs to skip
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "design",           // tokens.json lives here — allowed
  "scripts",          // this script itself
  "public",
  "lib",              // lib/tokenColors.ts re-exports token hex values for runtime use
]);
const SKIP_FILES = new Set([
  "tailwind.config.ts",  // token wiring lives here
  "globals.css",          // CSS variable definitions live here
  "postcss.config.mjs",
  "next.config.ts",
  "next-env.d.ts",
]);

// Pattern: arbitrary Tailwind values like text-[13px] bg-[#abc] p-[7px]
const ARBITRARY_PATTERN = /\b(?:text|bg|border|ring|from|to|via|fill|stroke|shadow|outline)-\[(?:#[0-9a-fA-F]{3,8}|\d+px)\]/g;

// Pattern: raw hex colors in JSX/TSX (not in comments)
const HEX_PATTERN = /(?<![/*\s])(["'`])?#[0-9a-fA-F]{3,8}\b/g;

// Pattern: inline style with color (style={{ color: '#...' }} or style="color: #...")
const INLINE_STYLE_COLOR = /style\s*=\s*\{[^}]*(?:color|background|border)[^}]*#[0-9a-fA-F]{3,8}/g;

let violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Skip comment lines
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;

    // Check for arbitrary Tailwind color/size values
    const arbitraryMatches = [...line.matchAll(ARBITRARY_PATTERN)];
    arbitraryMatches.forEach((m) => {
      violations.push({ file: filePath, line: lineNum, type: "ARBITRARY_TAILWIND", match: m[0] });
    });

    // Check for raw hex colors (but skip lines that are token import/require statements)
    if (!line.includes("tokens.json") && !line.includes("@theme") && !line.includes("--color")) {
      const hexMatches = [...line.matchAll(HEX_PATTERN)];
      hexMatches.forEach((m) => {
        // Allow hex inside string interpolation if it's a comment
        violations.push({ file: filePath, line: lineNum, type: "HARDCODED_HEX", match: m[0] });
      });
    }
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      const ext = path.extname(entry.name);
      if ([".tsx", ".ts", ".css"].includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

const projectRoot = path.resolve(__dirname, "..");
walkDir(projectRoot);

if (violations.length === 0) {
  console.log("✅ check:tokens passed — no hardcoded colors or arbitrary values found.");
  process.exit(0);
} else {
  console.error(`❌ check:tokens FAILED — ${violations.length} violation(s) found:\n`);
  violations.forEach((v) => {
    const rel = path.relative(projectRoot, v.file);
    console.error(`  [${v.type}] ${rel}:${v.line}  →  ${v.match.trim()}`);
  });
  console.error("\nAll colors and sizes must come from design/tokens.json via Tailwind classes.");
  process.exit(1);
}

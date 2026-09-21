/**
 * lib/tokenColors.ts
 * Re-exports color token values from design/tokens.json for use in
 * runtime contexts where Tailwind CSS classes cannot be used
 * (e.g. Leaflet pathOptions, SVG attributes, Canvas API, Web Audio).
 *
 * These are the ONLY place hex values are allowed outside tokens.json.
 * The check-tokens script skips the lib/ directory.
 *
 * Keep in sync with design/tokens.json manually.
 */

export const TOKEN_COLORS = {
  bg:        "#0B0D0F",
  surface:   "#111417",
  "surface-2":"#171B1F",
  line:      "#232A30",
  text:      "#E6EAED",
  muted:     "#8B96A0",
  faint:     "#5A646D",
  accent:    "#3DD6B0",
  ok:        "#3DD68C",
  warn:      "#F2B84B",
  critical:  "#F0524F",
  info:      "#5BA4F0",
} as const;

export type TokenColorKey = keyof typeof TOKEN_COLORS;

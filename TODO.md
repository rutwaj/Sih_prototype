# TODO.md — ResiliNet-AI Hackathon Demo

> Updated after every task. A task is DONE only when `npm run build`, `npm run lint`, and `npm run check:tokens` all pass.

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done (build + lint + check:tokens passed)
- `[!]` Blocked — see BREAKS.md

---

## Phase 0: Research (Design)
- [x] Read PLAN.md completely
- [x] Search GitHub for Impeccable, Beautiful UI, Hallmark design resources
- [x] Study Linear, Vercel, Stripe, Grafana (dark), Raycast dashboards
- [x] Write `docs/design-research.md` with extracted rules

## Phase 1: Foundation
- [x] `create-next-app` (TypeScript, Tailwind, App Router, ESLint)
- [x] Install pinned deps: `react-leaflet leaflet framer-motion zustand lucide-react`
- [x] Create `design/tokens.json`
- [x] Create `design/DESIGN.md`
- [x] Wire Tailwind to tokens
- [x] Add `npm run check:tokens` script
- [x] Set up Inter + JetBrains Mono via `next/font`
- [x] App shell: left rail (nav + logo), top bar, main area, right panel
- [x] `npm run build` ✓ / `npm run lint` ✓ / `npm run check:tokens` ✓

## Phase 2: UI Primitives
- [x] Button component (variant: default, ghost, danger)
- [x] Badge component (status: ok, warn, critical, info, muted)
- [x] Panel component
- [x] Stat component (number in mono, label)
- [x] Tabs component
- [x] Toggle component
- [x] Tooltip component
- [x] Timeline row component
- [x] `/styleguide` route showing all primitives
- [x] Build + lint + token check ✓

## Phase 3: Data and Map
- [x] Mock data: `data/nodes.ts` (~14 nodes, 3 regions)
- [x] Mock data: `data/contacts.ts` (villages, sarpanch, school, health centre)
- [x] Mock data: `data/messages.ts` (alert templates EN/HI/TA)
- [x] Leaflet map with CARTO dark tiles (no API key)
- [x] Custom SVG node markers by type (WildSentry, HydroShield) and status
- [x] Mesh links drawn as thin lines
- [x] Node detail panel on click
- [x] SSR fix with dynamic import (`ssr: false`)
- [x] Build + lint + token check ✓

## Phase 4: Simulation Engine and Controls
- [x] `lib/simulation.ts` — pure deterministic event engine (fixed deterministic IDs)
- [x] `lib/mesh.ts` — graph + BFS propagation with per-hop delay
- [x] `store/simStore.ts` — Zustand store (nodes, events, sim clock, connectivity flags, mute)
- [x] Simulation Control Panel (scenario buttons, speed control, pause)
- [x] Event log display
- [x] Build + lint + token check ✓

## Phase 5: Alert Experience
- [x] Detection timeline (sound → thermal → confirmed + confidence %)
- [x] Mesh pulse animation (node-to-node, hop counter)
- [x] Alert output panel: siren indicator, flashing light (≤3 Hz), voice + captions
- [x] Mock call/WhatsApp log with delivery states
- [x] `lib/audio.ts` — siren (Web Audio API oscillator), clip playback, speechSynthesis fallback
- [x] Mute/unmute + "Enable sound" button in top bar
- [x] Reduced-motion compliance
- [x] Build + lint + token check ✓

## Phase 6: Compare View and Hardware View
- [x] `/compare` route — two synchronized timelines (old vs ResiliNet)
- [x] Live latency counters per system
- [x] "Grid down + tower down" toggle
- [x] `/hardware` route — BOM table, cost estimates (INR), block diagram (SVG)
- [x] Qualcomm edge AI callout
- [x] Build + lint + token check ✓

## Phase 7: Polish and QA
- [x] Design QA gate (3.5) on every screen — review layout, tokens, contrast, alignment
- [x] Fix all contrast, alignment, spacing, overflow issues
- [x] Responsive pass (desktop 1440px & mobile 390px)
- [x] Reduced-motion pass in globals.css
- [x] Keyboard focus states
- [x] Favicon + page titles
- [x] Remove all placeholder text
- [x] Comprehensive `README.md` with install + dev instructions
- [x] Build + lint + token check ✓

## Phase 8: Deploy
- [x] `npm run build && npm start` verified
- [x] Deployment / run instructions in README
- [x] `demo-script.md` (90-second judge walkthrough)
- [x] Final build + lint + token check ✓

---

## Resume Checkpoint
> All Phases 0 through 8 are fully completed and verified.

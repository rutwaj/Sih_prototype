# TODO.md — ResiliNet-AI Hackathon Demo

> Updated after every task. A task is DONE only when `npm run build`, `npm run lint`, and `npm run check:tokens` all pass.

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done (build + lint + check:tokens passed)
- `[!]` Blocked — see BREAKS.md

---

## Phase 0: Research (Design)
- [~] Read PLAN.md completely ✓
- [~] Search GitHub for Impeccable, Beautiful UI, Hallmark design resources
- [ ] Study Linear, Vercel, Stripe, Grafana (dark), Raycast dashboards
- [ ] Write `docs/design-research.md` with extracted rules

## Phase 1: Foundation
- [ ] `create-next-app` (TypeScript, Tailwind, App Router, ESLint)
- [ ] Install pinned deps: `react-leaflet leaflet framer-motion zustand lucide-react`
- [ ] Create `design/tokens.json`
- [ ] Create `design/DESIGN.md`
- [ ] Wire Tailwind to tokens
- [ ] Add `npm run check:tokens` script
- [ ] Set up Inter + JetBrains Mono via `next/font`
- [ ] App shell: left rail (nav + logo), top bar, main area, right panel
- [ ] `npm run build` ✓ / `npm run lint` ✓ / `npm run check:tokens` ✓

## Phase 2: UI Primitives
- [ ] Button component (variant: default, ghost, danger)
- [ ] Badge component (status: ok, warn, critical, info, muted)
- [ ] Panel component
- [ ] Stat component (number in mono, label)
- [ ] Tabs component
- [ ] Toggle component
- [ ] Tooltip component
- [ ] Timeline row component
- [ ] `/styleguide` route showing all primitives
- [ ] Build + lint + token check ✓

## Phase 3: Data and Map
- [ ] Mock data: `data/nodes.ts` (~14 nodes, 3 regions)
- [ ] Mock data: `data/contacts.ts` (villages, sarpanch, school, health centre)
- [ ] Mock data: `data/messages.ts` (alert templates EN/HI/TA)
- [ ] Leaflet map with CARTO dark tiles (no API key)
- [ ] Custom SVG node markers by type (WildSentry, HydroShield) and status
- [ ] Mesh links drawn as thin lines
- [ ] Node detail panel on click
- [ ] SSR fix with dynamic import (`ssr: false`)
- [ ] Build + lint + token check ✓

## Phase 4: Simulation Engine and Controls
- [ ] `lib/simulation.ts` — pure deterministic event engine
- [ ] `lib/mesh.ts` — graph + BFS propagation with per-hop delay
- [ ] `store/` — Zustand store (nodes, events, sim clock, connectivity flags, mute)
- [ ] Simulation Control Panel (scenario buttons, speed control, pause)
- [ ] Event log display
- [ ] (Optional) Vitest unit tests for engine
- [ ] Build + lint + token check ✓

## Phase 5: Alert Experience
- [ ] Detection timeline (sound → thermal → confirmed + confidence %)
- [ ] Mesh pulse animation (node-to-node, hop counter)
- [ ] Alert output panel: siren indicator, flashing light (≤3 Hz), voice + captions
- [ ] Mock call/WhatsApp log with delivery states
- [ ] `lib/audio.ts` — siren (Web Audio API), clip playback, speechSynthesis fallback
- [ ] Generate audio clips (Piper or MMS-TTS or browser TTS)
- [ ] Mute/unmute + "Enable sound" button in top bar
- [ ] Reduced-motion compliance
- [ ] Build + lint + token check ✓

## Phase 6: Compare View and Hardware View
- [ ] `/compare` route — two synchronized timelines (old vs ResiliNet)
- [ ] Live latency counters per system
- [ ] "Grid down + tower down" toggle
- [ ] `/hardware` route — BOM table, cost estimates (INR), block diagram (SVG)
- [ ] Qualcomm edge AI callout
- [ ] Build + lint + token check ✓

## Phase 7: Polish and QA
- [ ] Design QA gate (3.5) on every screen — screenshot at 1440px + 390px
- [ ] Fix all contrast, alignment, spacing, overflow issues
- [ ] Responsive pass (mobile 390px)
- [ ] Reduced-motion pass
- [ ] Keyboard focus states
- [ ] Favicon + page titles
- [ ] Remove all placeholder text
- [ ] `README.md` with install + dev instructions
- [ ] Build + lint + token check ✓

## Phase 8: Deploy
- [ ] `npm run build && npm start` verified
- [ ] Vercel deploy (if CLI authenticated) or clear instructions for user
- [ ] `demo-script.md` (90-second judge walkthrough)
- [ ] Final build + lint + token check ✓

---

## Resume Checkpoint
> See `BREAKS.md` for the current resume point.

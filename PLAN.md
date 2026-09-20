# PLAN.md: ResiliNet-AI (Hackathon Demo)

> **Read this whole file before writing any code. Follow the phases in order. Do not skip the design phase.**

## 0. What we are building

ResiliNet-AI is a **browser-only simulation dashboard** for a network of solar-powered edge sensor nodes (WildSentry for forests/hills, HydroShield for rivers/drains) that detect fires, landslides and floods locally and trigger **instant, inclusive local alerts** (siren, lights, voice in local languages, calls/WhatsApp to local leaders) even when grid power and cell towers fail.

Context: Qualcomm hardware problem statement 26178 (AI-powered environmental monitoring network, Disaster Management). The demo must make the pitch obvious in 60 seconds.

**There is no real hardware and no backend.** Everything is simulated in the client. It must look and feel like a real product built by a designer, not a generated template.

## 1. Non-negotiable rules

1. **No manual steps for the user.** The agent installs dependencies, generates assets, runs the app, fixes errors, and verifies the build.
2. **No backend, database, auth, WebSockets, Docker, or paid/key-based APIs.**
3. **Stack is fixed:** Next.js (App Router) + TypeScript + Tailwind CSS + react-leaflet/Leaflet + Framer Motion + Zustand. Do not add other libraries without a strong reason.
4. **Pin versions** in `package.json` after first successful install. Use `npm`. Commit a lockfile.
5. **Design rules in Section 3 are law.** Every color, size, radius, spacing and font must come from the design tokens. No hardcoded values in components.
6. **After every phase:** run `npm run build` and `npm run lint`. Fix all errors before moving on. Never leave the app in a broken state.
7. **One screen/feature at a time.** Finish, verify in the browser, then continue.

## 2. Reference material the agent must consult FIRST (Phase 0)

Before designing anything, look up the following on GitHub and read their docs/instructions. Extract concrete rules (typography, spacing, hierarchy, anti-patterns) and summarize them into `docs/design-research.md`:

- **Impeccable** (design-quality skill/docs for AI agents), if found, install or copy its guidance and apply it.
- **Beautiful UI** ("BUI"-style guidance), search GitHub for the best match.
- **Hallmark**, search GitHub for the design/UI resource of this name.
- Real-world dashboard references for style: **Linear, Vercel dashboard, Stripe Dashboard, Grafana (dark), Raycast**. Study their restraint, density and typography, do not copy assets.

If any of these cannot be found, say so in `docs/design-research.md` and continue with the rules in this file. Do not invent what they contain.

## 3. Design system (single source of truth)

### 3.1 Files to create in Phase 1
- `design/tokens.json`: the only place raw values live.
- `design/DESIGN.md`: human-readable rules and usage examples, generated from the tokens.
- `tailwind.config.ts` reads from `tokens.json`. CSS variables are generated from the same file.
- **Rule:** components use Tailwind classes mapped to tokens only (`bg-surface`, `text-muted`, `border-line`, `text-critical`). Arbitrary values like `text-[13px]` or `bg-[#123456]` are forbidden. Add a lint check or grep script (`npm run check:tokens`) that fails the build on hex colors or arbitrary values outside `tokens.json`.

### 3.2 Visual direction: "calm operations console"
Minimal, dense-but-breathable, dark neutral, one accent, color used only to carry meaning.

- **No gradients. No glassmorphism. No glow/blur shadows. No neon. No purple/blue AI gradients. No emoji as icons. No stock illustrations.**
- **No card-inside-card-inside-card.** Use borders and spacing for structure, not stacked boxes.
- Flat surfaces separated by 1px borders. Shadows: none, except one subtle elevation token for popovers.
- Icons: **lucide-react**, one stroke width (1.5), one size scale.
- Animation is functional only (status change, mesh pulse, alert entry). 150-250ms, ease-out. Respect `prefers-reduced-motion`.

### 3.3 Starter tokens (agent may refine, but must keep the structure)
```json
{
  "color": {
    "bg":        "#0B0D0F",
    "surface":   "#111417",
    "surface-2": "#171B1F",
    "line":      "#232A30",
    "text":      "#E6EAED",
    "muted":     "#8B96A0",
    "faint":     "#5A646D",
    "accent":    "#3DD6B0",
    "ok":        "#3DD68C",
    "warn":      "#F2B84B",
    "critical":  "#F0524F",
    "info":      "#5BA4F0"
  },
  "font": {
    "sans": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, ui-monospace, monospace"
  },
  "fontSize": { "xs": "12px", "sm": "13px", "base": "14px", "lg": "16px", "xl": "20px", "2xl": "28px" },
  "spacing": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px" },
  "radius":  { "sm": "4px", "md": "6px", "lg": "8px" },
  "motion":  { "fast": "150ms", "base": "220ms", "ease": "cubic-bezier(0.2, 0, 0, 1)" }
}
```
Color semantics: `ok` = node healthy, `warn` = anomaly/pre-alert, `critical` = confirmed hazard, `info` = network/mesh activity, `accent` = interactive/primary action. Never use a semantic color decoratively.

### 3.4 Typography and layout
- Fonts via `next/font` (Inter + JetBrains Mono for numbers, IDs, timestamps).
- Clear hierarchy: max 3 text sizes per screen region. Numbers in mono with tabular figures.
- 12-column grid, 8px spacing rhythm, generous outer padding, consistent alignment.
- Layout: slim left rail (nav + logo), top bar (network status, sim clock, connectivity indicators), main map area, right-hand detail/event panel.
- Copy: short, specific, human. No "Unlock the power of AI." Use real units and realistic values (e.g. "Water level +42 cm / 10 min", "Node WS-014, Nainital ridge").
- Empty, loading and error states must be designed too.

### 3.5 Design QA gate
Before finishing each screen, the agent must screenshot it (use a headless browser such as Playwright if needed), compare against the rules above, and fix: inconsistent spacing, off-token colors, misaligned elements, low contrast (WCAG AA), text overflow, and anything that looks template-generated. Test at 1440px desktop and 390px mobile.

## 4. Product spec

### 4.1 Data (all mocked in `/data`)
- ~14 nodes across 3 regions of India, for example Uttarakhand hills (WildSentry), Assam/Brahmaputra (HydroShield), Kerala hills/rivers (both). Each node: `id, type, name, lat, lng, region, battery %, solar W, signal (cell/LoRa/sat), status, lastSeen`.
- Nodes are linked in a **mesh graph** (neighbors within LoRa range).
- Villages/contacts per region: sarpanch, school, health centre (fake names and numbers).
- Alert message templates in **English, Hindi, Tamil** (plus Assamese/Malayalam text if time allows, shown as captions).

### 4.2 Screens
1. **Live Map (home):** Leaflet map with dark tiles (CARTO dark, no API key, keep attribution), custom SVG node markers by type and status, mesh links drawn as thin lines. Click a node to open a detail panel (sensors, battery, connectivity, recent events).
2. **Simulation Control Panel:** scenario buttons:
   - Trigger Forest Fire (WildSentry: acoustic, then thermal verification)
   - Trigger Landslide
   - Trigger Flash Flood (HydroShield: rate-of-rise plus upstream chaining)
   - Cut Power Grid
   - Kill Cell Tower
   - Reset
   Also a speed control and a pause button.
3. **Alert Experience:** on a confirmed hazard:
   - Node detection timeline: sound detected, thermal check, confirmed (with confidence %).
   - Mesh pulse: alert propagates node to node along the links, visibly, with a hop counter.
   - **Alert output panel:** animated siren indicator, flashing light indicator (respect reduced-motion, and never flash faster than 3 Hz), voice message playing with live captions, and mock call/WhatsApp log to sarpanch, school, health centre with delivery states.
   - Audio: siren sound plus voice (see 4.3).
4. **Old vs ResiliNet comparison:** same event, two synchronized timelines. Old system: satellite pass, cloud processing, manual bulletin (minutes/hours). ResiliNet: seconds. Show a live latency counter for each. Include a "Grid down + tower down" toggle where the old system fails entirely and ResiliNet keeps working via LoRa mesh.
5. **Hardware and Cost view:** BOM table (ESP32-class or Qualcomm-based edge board, thermal camera module, MEMS microphone, mmWave radar, LoRa module, solar panel, LiFePO4 battery, siren, LED strobe, speaker), approximate INR cost per node, and a simple block diagram (SVG). Add a line on where Qualcomm silicon fits (edge AI inference on-device). Mark costs as estimates.

### 4.3 Voice and audio (fully automated, no manual recording)
- **Primary:** pre-generate audio clips at build time with an **open-source TTS** (try Piper, or Meta MMS-TTS via Hugging Face which covers Hindi and Tamil; pick whichever installs cleanly), save to `/public/audio/{lang}/{scenario}.mp3`, and commit them. Generate a siren loop with a small script (Web Audio API oscillator at runtime is acceptable and avoids a file).
- **Fallback chain:** if a pre-generated clip is missing, use browser `speechSynthesis`. If no matching voice exists, show captions only. Captions are always visible.
- Add a mute/unmute control; browsers require a user click before audio, so add an explicit "Enable sound" button in the top bar.

### 4.4 Honest technical framing (put in the UI copy and the About panel)
- Flood: "rate-of-rise detection plus upstream node chaining gives lead time," not magic prediction. Show it as a computed trend, not a claim.
- Satellite: optional fallback. LoRa mesh is the primary offline link.
- Label the app clearly as a **simulation** of the system.

## 5. Architecture

```
/app                 routes: / (map), /compare, /hardware, /about
/components          ui primitives (Button, Badge, Panel, Stat, Tabs), map, alerts, timeline
/design              tokens.json, DESIGN.md
/data                nodes.ts, contacts.ts, messages.ts
/lib
  simulation.ts      pure event engine (scenario -> timed event list)
  mesh.ts            graph + BFS propagation with per-hop delay
  audio.ts           siren, clip playback, speechSynthesis fallback
/store               zustand store: nodes, events, sim clock, connectivity flags, mute
/public/audio        generated clips
/docs                design-research.md
/scripts             generate-audio.*, check-tokens.*
```

- The simulation engine is **pure and deterministic** (input: scenario and connectivity flags; output: timed events). The UI just plays the events back. This keeps bugs easy to find.
- Build the UI primitives first (Phase 2) and use them everywhere.

## 6. Phases (each ends with build + lint + screenshot check)

**Phase 0: Research (15 min).** Section 2. Produce `docs/design-research.md`.

**Phase 1: Foundation.** `create-next-app` (TypeScript, Tailwind, App Router, ESLint), install pinned deps (`react-leaflet leaflet framer-motion zustand lucide-react`), create `design/tokens.json` and `DESIGN.md`, wire Tailwind to tokens, add the token check script, set up fonts and the app shell (rail, top bar).

**Phase 2: UI primitives.** Button, Badge (status), Panel, Stat, Tabs, Toggle, Tooltip, Timeline row. Build a hidden `/styleguide` route showing all of them. This is the consistency anchor.

**Phase 3: Data and map.** Mock data, Leaflet map, custom markers, mesh links, node detail panel. Handle Leaflet's SSR issue with a dynamic import (`ssr: false`) and fix marker icons using custom SVG markers.

**Phase 4: Simulation engine and controls.** `simulation.ts`, `mesh.ts`, store, control panel, event log. Unit-test the engine with a few quick Vitest tests if it installs cleanly.

**Phase 5: Alert experience.** Detection timeline, mesh pulse, siren/lights/voice/captions, mock message log. Generate audio clips.

**Phase 6: Compare view and hardware view.**

**Phase 7: Polish and QA.** Design QA gate (3.5) on every screen, responsive pass, reduced-motion, keyboard focus states, favicon, page titles, remove all placeholder text, `README.md` with `npm install` and `npm run dev`.

**Phase 8: Deploy.** Deploy to Vercel if the CLI is authenticated, otherwise ensure `npm run build && npm start` works and tell the user exactly one thing to click. Also produce a `demo-script.md` (a 90-second walkthrough for judges).

## 7. Definition of done

- `npm install && npm run dev` works on a clean machine, with zero errors or warnings in the console.
- `npm run build`, `npm run lint`, and `npm run check:tokens` all pass.
- A judge can go from landing on the page to a full fire scenario, with siren, voice and mesh propagation, in under 30 seconds.
- The grid-down + tower-down demo clearly shows the old system failing and ResiliNet succeeding.
- No hardcoded colors or sizes outside `tokens.json`. No gradients anywhere.
- Looks polished at desktop and mobile widths.

## 8. If something goes wrong

- Paste-free debugging: read the exact error, fix the root cause, rerun. Do not suppress errors or use `any`/`@ts-ignore` to pass.
- If a library fails to install or misbehaves after two attempts, replace it with the simplest alternative and record the change in `docs/decisions.md`.
- Keep scope tight. If time runs short, cut in this order: Hardware view, extra languages, unit tests. Never cut the map, the simulation, the alert experience, or the compare view.

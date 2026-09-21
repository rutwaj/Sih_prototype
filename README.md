# ResiliNet-AI: Disaster Early-Warning Network Simulation

> **Qualcomm Problem Statement 26178** — AI-Powered Environmental Monitoring Network for Disaster Management (Smart India Hackathon 2026).

ResiliNet-AI is a browser-only simulation dashboard for a network of solar-powered edge sensor nodes (**WildSentry** for forest fires & landslides, **HydroShield** for river floods) that detect environmental hazards on-device and trigger **instant, inclusive local alerts** (sirens, strobes, multi-lingual voice broadcast, direct village leader dispatch) even when the electrical grid and cellular towers fail.

---

## ⚡ Key Features

1. **Zero-Cloud On-Device Edge AI**:
   - Models Qualcomm Edge AI SoC (Hexagon™ NPU + low-power DSP) running quantized acoustic CNNs and thermal/hydrology trend inference locally with <45ms response time.
2. **Decentralized LoRa Peer-to-Peer Mesh**:
   - Sub-GHz LoRa (865 MHz IN865) multi-hop mesh graph. Alerts propagate node-to-node across mountain ridges and riverbanks with zero internet connectivity.
3. **Inclusive Physical Multi-Lingual Alerts**:
   - Immediate 110 dB siren horn, flashing LED strobe beacon (≤3 Hz WCAG compliant), and live multi-lingual voice synthesis in English, Hindi, and Tamil with real-time captions.
4. **Grid-Down & Cell-Tower-Down Stress Testing**:
   - Interactive live benchmark comparing legacy satellite/cloud pipelines (minutes to hours latency, catastrophic failure on blackout) vs ResiliNet-AI (3.4 seconds end-to-end response time).
5. **Itemized Hardware Bill of Materials (BOM)**:
   - Full component costing and SVG system block diagram showing ~₹14,800 node cost (97% cheaper than traditional ₹5.5L+ telemetry towers).

---

## 🧭 Architecture

```
/app                 App Router pages: / (Live Map), /compare, /hardware, /about, /styleguide
/components
  /alerts            AlertPanel (siren, strobe, multi-lingual audio/captions, contact dispatch)
  /layout            AppShell, TopBar (network status, sim clock, sound toggle), LeftRail
  /map               DynamicLiveMap, LiveMap, NodeMarkers, MeshLinks, NodeDetailPanel
  /sim               SimControlPanel (scenario triggers, speed control, event log)
  /ui                Design system primitives (Button, Badge, Panel, Stat, Tabs, Toggle, Tooltip, TimelineRow)
/data                nodes.ts (14 nodes, 3 regions), contacts.ts, messages.ts
/design              tokens.json, DESIGN.md
/lib                 simulation.ts (deterministic event engine), mesh.ts (BFS propagation), audio.ts, tokenColors.ts
/store               simStore.ts (Zustand state store)
/docs                design-research.md (Impeccable, Hallmark, Linear, Vercel design research)
/scripts             check-tokens.js (linter for design tokens)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Lint Checks
```bash
npm run build
npm run lint
npm run check:tokens
```

---

## 🎯 60-Second Demo Walkthrough

1. **Enable Audio**: Click **"Enable sound"** in the top navigation bar.
2. **Trigger Scenario**: On the home **Live Map**, click **"Forest Fire"** in the right control panel.
3. **Observe Timeline**: Watch acoustic detection (0.5s) → thermal check (1.2s) → confirmed alert (2.5s) → siren & strobe activation → multi-hop LoRa mesh propagation.
4. **Switch Languages**: In the alert popup, switch between **English**, **हिंदी**, and **தமிழ்** to hear localized voice alerts.
5. **Compare vs Legacy**: Navigate to `/compare` and toggle **"Grid down + Tower down"** to see legacy satellite pipelines fail while ResiliNet continues uninterrupted.
6. **Inspect Hardware**: Navigate to `/hardware` to view the itemized BOM and Qualcomm Edge AI system block diagram.

---

## ⚖️ Design System

All visual tokens (colors, font scales, spacing, border radii) are defined strictly in `design/tokens.json` and enforced by `scripts/check-tokens.js`.
- Minimalist operations console aesthetic.
- Zero decorative gradients, zero glassmorphism, zero arbitrary hex codes in components.
- WCAG AA contrast and reduced-motion compliance.

---

## 📄 License
MIT — Built for SIH 2026 Qualcomm Problem Statement 26178.

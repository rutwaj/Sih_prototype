# Design Research: AI Dashboard Project
> Compiled from: Impeccable (pbakaus/impeccable), Hallmark (Nutlope/hallmark), Beautiful UI principles, Linear, Vercel (Geist), Stripe, Grafana (Saga), and Raycast design systems.
> Research date: 2026-09-20

---

## Table of Contents
1. [AI Agent Design Skills: Impeccable](#1-impeccable)
2. [AI Agent Design Skills: Hallmark](#2-hallmark)
3. [Beautiful UI / BUI Principles](#3-beautiful-ui--bui)
4. [Linear Design Language](#4-linear)
5. [Vercel / Geist Design System](#5-vercel--geist)
6. [Stripe Dashboard Design](#6-stripe)
7. [Grafana Saga Design System](#7-grafana-saga-dark-theme)
8. [Raycast Design Language](#8-raycast)
9. [Synthesized Dashboard Rules](#9-synthesized-rules-for-ai-dashboards)
10. [Master Anti-Pattern Registry](#10-master-anti-pattern-registry)

---

## 1. Impeccable

**Status:** ✅ Found — GitHub: [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
**Type:** AI coding agent design skill pack (Claude Code, Cursor, GitHub Copilot compatible)
**Author:** Paul Bakaus

### What It Is
A structured design skill that gives AI coding agents deterministic aesthetic rails via `PRODUCT.md` and `DESIGN.md` context files, plus 20+ slash commands (`/impeccable polish`, `/impeccable audit`, `/impeccable distill`, `/impeccable bolder`). It uses **60+ deterministic detector rules** to audit code without requiring LLM calls.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Always scan project's existing `tokens/`, `theme/`, and CSS files before generating any new visual styles — never invent new styles from scratch | Workflow |
| 2 | Write a `PRODUCT.md` first: capture audience, tone, purpose, constraints — this is the "durable product truth" the agent references in all sessions | Context |
| 3 | Write a `DESIGN.md` to store visual tokens and system rules; use it as the agent's source of truth for colors, spacing, typography | Tokens |
| 4 | Avoid pure black (`#000000`) or pure gray — use tinted, brand-aligned neutrals | Color |
| 5 | Avoid "cards nested in cards" — flatten information architecture; use whitespace to separate, not containers | Layout |
| 6 | Restrict animation to `transform` and `opacity` properties only — never animate `width`, `height`, `top`, `left` | Animation |
| 7 | No bounce/elastic easing for standard UI transitions — use professional `ease-out` or spring physics with controlled stiffness/damping | Animation |
| 8 | No "rounded-square icon tile" above every heading — avoid tile icons as decoration | Layout |
| 9 | Every element must have a distinct visual weight — avoid "loud" designs where everything competes equally | Hierarchy |
| 10 | Use semantic tokens (not hardcoded hex values) for colors — allows consistent theming and prevents AI-invented one-off styles | Tokens |

### Explicitly Called-Out Anti-Patterns
- ❌ Purple-to-blue gradients (ubiquitous AI cliché)
- ❌ Gray text on colored backgrounds (contrast failure)
- ❌ Inter font used as a thoughtless default without intent
- ❌ Bounce/elastic easing curves on UI transitions
- ❌ Nested card-within-card layouts
- ❌ Decorative sparklines with no data-driven meaning
- ❌ Rounded-square icon tiles above every heading
- ❌ Equal visual weight on all elements (no hierarchy)

### Commands / Workflow Modes
- `Teach Mode`: Structured interview → saves to `PRODUCT.md`
- `Craft Mode`: Applies aesthetic guardrails
- `/impeccable detect`: Scans code for anti-patterns
- `/impeccable distill`: Extracts reusable component tokens from codebase

**Sources:** [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable), [betterstack.com](https://betterstack.com), [medium.com](https://medium.com)

---

## 2. Hallmark

**Status:** ✅ Found — GitHub: [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | Website: [usehallmark.com](https://usehallmark.com)
**Type:** AI coding agent design skill (Claude Code, Cursor, Codex compatible)
**Author:** Hassan El Mghari (Nutlope)

### What It Is
An "anti-AI-slop" design skill that intercepts AI UI generation with:
- **21 unique macrostructures** (high-level page shapes: manifesto, stat-led, portfolio grid, etc.)
- **20 curated design themes**
- **57 slop-test validation gates** (deterministic quality checks run before code is emitted)

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Always select a named macrostructure before generating layout — e.g., "manifesto layout", "stat-led page", NOT the default hero + 3-card grid | Layout |
| 2 | Use strict CSS variable usage — no inline mid-render colors; all color values must be defined as CSS custom properties | Color/Tokens |
| 3 | Enforce mobile-responsive floor requirements — every component must have a defined mobile breakpoint behavior | Responsive |
| 4 | Apply one of the 20 design themes — never generate unstyled/bare UI | Visual Identity |
| 5 | Run the "slop-test" gates before finalizing code — if any of 57 checks fail, regenerate that section | Quality |
| 6 | `audit` command scores existing code against anti-pattern library — use before shipping any new screen | Quality |
| 7 | `study` command extracts design DNA (color, type, structure) from a URL/screenshot → exports as portable `design.md` | Context |
| 8 | `redesign` command rebuilds UI with a new visual fingerprint while preserving content and information architecture | Workflow |
| 9 | No "hero section + three-card grid" as a default layout — this is the #1 AI layout cliché | Layout |
| 10 | Design for visual uniqueness ("visual fingerprint") — each project must have a distinct identity | Identity |

### Explicitly Called-Out Anti-Patterns
- ❌ Hero section + 3-card grid (default AI layout)
- ❌ Predictable AI-style padding (overly generous, uniform margins)
- ❌ Inline color values (non-tokenized)
- ❌ Purple gradients and neon accents
- ❌ Generic template-looking UIs
- ❌ No mobile-responsive consideration

### Commands
- `default`: Generates new UI by selecting macrostructure + theme
- `audit`: Scores code against anti-pattern library
- `redesign`: Rebuilds with new visual fingerprint, same content
- `study`: Extracts design DNA from URL/screenshot → `design.md`

**Sources:** [github.com/Nutlope/hallmark](https://github.com/Nutlope/hallmark), [usehallmark.com](https://usehallmark.com), [coddykit.com](https://coddykit.com)

---

## 3. Beautiful UI / BUI

**Status:** ⚠️ Partial — No single authoritative "BUI" design system found; "BUI" refers to **Backstage UI** (developer platform) or the general concept of "beautiful UI" distilled from industry standards.
**Reference:** [backstage.io](https://backstage.io), General design system standards

### What It Is
"Beautiful UI" principles are distilled from the collective practice of enterprise and developer-tool design systems. The core principle: a beautiful UI is an **intentional** UI — every token, spacing value, and component state is deliberate.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Use a base font size of **16px** for body copy; scale down to **14px** for UI labels, **12px** for captions/metadata — never below 11px | Typography |
| 2 | Establish 4–5 clear typographic roles (H1, H2, Body, Label, Caption) — use font weight variation, not just size, to create sub-hierarchy | Typography |
| 3 | Use **rem/em** units for type, not fixed px — ensures accessibility and responsive scaling | Typography |
| 4 | Line height for body text: **1.4–1.6** (140–160%); for headings: **1.1–1.25** (110–125%) | Typography |
| 5 | Use an **8-point grid** as the primary spatial rhythm: 8, 16, 24, 32, 48, 64px | Spacing |
| 6 | Allow **4px sub-grid** for micro-adjustments (icon padding, inline spacing) | Spacing |
| 7 | Define semantic color roles: `primary`, `secondary`, `danger`, `warning`, `success`, `neutral` — never use raw hex values in component logic | Color |
| 8 | Use Storybook (or equivalent) to document every component's states: default, hover, active, focus, disabled, loading, error | Components |
| 9 | Conduct a component inventory audit before building — avoid duplicating components that already exist | Components |
| 10 | Max 2–3 font families per project (primary sans-serif + optional mono for code); never mix more than 2 typefaces in a single screen region | Typography |

### Anti-Patterns
- ❌ Mixing pixel units and rem/em inconsistently
- ❌ More than 3 font sizes in a single UI region
- ❌ Undocumented component states (especially error/empty/loading)
- ❌ Arbitrary color values not from the design token palette
- ❌ Building components without mobile behavior defined

**Sources:** [backstage.io](https://backstage.io), [designsystems.com](https://designsystems.com), [uxplanet.org](https://uxplanet.org), [justinmind.com](https://justinmind.com)

---

## 4. Linear

**Status:** ✅ Found — [linear.app](https://linear.app)
**Type:** Real-world product — project management SaaS, widely studied design language

### Design Philosophy
"Purpose-built" and "simple first, then powerful." Token-first development — no hardcoded values anywhere. Emphasizes **visual density with clarity**: lots of info, zero clutter.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Base UI font: **Inter Variable**, 13–14px for navigation/labels, 14px for standard body text, 12px for metadata/captions | Typography |
| 2 | Font weight: **510** (or nearest available: 500) for UI text — avoids both "too light" and "too heavy" | Typography |
| 3 | Use 8px as primary spacing grid; allow 4px sub-units for micro-adjustments (7px, 11px, 19px are optical corrections) | Spacing |
| 4 | Border radius: **6px** for buttons and inputs; **4px** for small chips/badges; **8px** for cards/panels | Components |
| 5 | Button padding: **8px vertical / 16px horizontal** | Components |
| 6 | Create depth with **`rgba(255,255,255,0.08)`** layer overlays and subtle border colors, not box-shadows | Visual Depth |
| 7 | Hover/focus states: subtle, consistent — use `transition-colors` with `ease-out` 150ms | Interaction |
| 8 | Sidebar: high-density; use tight line heights (1.3–1.4) and 12–13px text to pack navigation without crowding | Layout |
| 9 | Max 3 font sizes per screen region (sidebar panel, main content area, modal) | Typography |
| 10 | All spacing, color, and radius values are design tokens — never hardcode any value | Tokens |

### Anti-Patterns
- ❌ Heavy drop shadows on flat data surfaces
- ❌ Large padding around every element ("spacious" = low density)
- ❌ Using `box-shadow` instead of layered `rgba` overlays for depth
- ❌ Arbitrary spacing not on the 4/8px grid
- ❌ More than 3 font sizes in a single panel region

**Sources:** [linear.app](https://linear.app/method), [open-design.ai Linear teardown](https://open-design.ai), [lobehub.com](https://lobehub.com)

---

## 5. Vercel / Geist

**Status:** ✅ Found — [vercel.com/design](https://vercel.com/design), Geist Design System
**Type:** Real-world product — deployment/developer platform, public Geist design system

### Design Philosophy
"Every pixel serves a purpose." Minimalism as engineering discipline. Monochromatic base canvas with a single blue accent. Swiss-inspired precision typography.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Primary typefaces: **Geist Sans** (UI) + **Geist Mono** (code, numbers, logs) — available as open-source npm packages | Typography |
| 2 | Typography tokens: `xs` (12px), `sm` (14px), `base` (16px), `lg` (18px), `xl` (20px+) — use named tokens, not raw sizes | Typography |
| 3 | Weight variation creates hierarchy, not size alone — use `font-weight: 500` (medium) and `600` (semibold) for labels/emphasis | Typography |
| 4 | 4px base spacing grid; scale: 4, 8, 16, 24, 32, 48, 64, 96px | Spacing |
| 5 | Use whitespace as a separator instead of dividers/borders — reduces visual noise | Spacing |
| 6 | Border radius tokens: **6px** (small), **8px** (medium/default), **12px** (large/cards) | Components |
| 7 | Primary accent color: `#0072f5` (blue) — used exclusively for interactive/action elements; all other UI is near-monochrome | Color |
| 8 | Color palette: near-white `#fafafa` backgrounds, near-black `#111` foregrounds; never pure `#000` or `#fff` | Color |
| 9 | Use tabular numerals (`font-variant-numeric: tabular-nums`) for all data tables, metrics, and logs | Typography |
| 10 | Perceived performance is UX — use skeleton loaders, optimistic UI updates, and instant visual feedback for all actions | Interaction |

### Anti-Patterns
- ❌ Decorative borders and dividers (use spacing instead)
- ❌ Multiple accent colors (only one — blue)
- ❌ Pure black/white backgrounds
- ❌ Non-tabular numerals in data tables
- ❌ Heavy gradients or decorative shadows

**Sources:** [vercel.com/design](https://vercel.com/design), [github.com/vercel](https://github.com/vercel), [designsystems.surf](https://designsystems.surf)

---

## 6. Stripe

**Status:** ✅ Found — [stripe.com/docs/apps](https://stripe.com/docs/apps), Stripe Apps UI Toolkit
**Type:** Real-world product — financial infrastructure platform, internal design system partially exposed via Stripe Apps SDK

### Design Philosophy
"Function over expression." Restraint as a principle. Designed for high-stakes financial contexts — every interaction must build trust, handle failure states, and surface accurate data.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Primary UI typeface: **Söhne** (from Klim Type Foundry), variable font, weight range 300–700 | Typography |
| 2 | Body text: **16px**; UI labels/navigation: **14px**; annotations/captions: **12px** | Typography |
| 3 | Data tables: always use **tabular numerals (`tnum`)** — financial data alignment is non-negotiable | Typography |
| 4 | 4px base spacing rhythm — tight, professional, consistent across high-density dashboard | Spacing |
| 5 | Button heights: **32px** (compact/inline), **40px** (default), **48px** (prominent/primary) — context-dependent | Components |
| 6 | Design thoroughly for "unhappy paths": every flow needs empty state, error state, loading state, and partial failure state | Components |
| 7 | Primary button: `background-color: #625BF6` (Stripe purple), or contextual blue; text: white; border-radius: 4px–6px | Components |
| 8 | Forms: use inline validation — validate on blur, never only on submit | Forms |
| 9 | Use `Box` and `Inline` layout primitives — never arbitrary CSS for layout; keeps spacing tokenized | Layout |
| 10 | Color signals for financial status: green = positive/growth, red = loss/error, gray = neutral/pending — use consistently everywhere | Color |

### Anti-Patterns
- ❌ Validating forms only on submit (must validate inline on blur)
- ❌ Decorative color use — color must signal meaning only
- ❌ Showing raw numbers without comparison context (always add delta, trend, or baseline)
- ❌ Arbitrary CSS layout values — use layout primitives
- ❌ Missing "unhappy path" states (empty, error, partial failure)
- ❌ Non-tabular numerals in financial tables

**Sources:** [stripe.com/docs/apps](https://stripe.com/docs/apps), [stripe.com/docs/elements](https://stripe.com/docs/elements)

---

## 7. Grafana / Saga (Dark Theme)

**Status:** ✅ Found — [grafana.com/developers/saga](https://grafana.com/developers/saga), `@grafana/ui` npm package
**Type:** Open-source design system — data visualization platform, public Saga design system
**Storybook:** [Grafana UI Storybook](https://incomparable-faun-5c7a41.netlify.app/)

### Design Philosophy
"Universal, accessible, flexible, coherent." Purpose-built for data visualization density. Dark theme is NOT a color inversion — it is a carefully considered experience for low-light, high-focus data environments.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Use `@grafana/design-tokens` as source of truth — three token layers: Primitive → Semantic → Implementation | Tokens |
| 2 | Dark theme background surface palette: `#111217` (canvas), `#181b1f` (panels), `#22252b` (elevated/modal) | Color |
| 3 | Dark theme text: primary `#d8d9da` (~90% white), secondary `#9fa7b3` (~60%), disabled `#616570` (~40%) | Color |
| 4 | Semantic colors: `success` = `#73bf69` (green), `warning` = `#ff9830` (orange), `error` = `#f2495c` (red), `info` = `#5794f2` (blue) | Color |
| 5 | Spacing scale (multiplier of 8px): `theme.spacing(0.5)` = 4px, `(1)` = 8px, `(2)` = 16px, `(3)` = 24px, `(4)` = 32px | Spacing |
| 6 | Use `<Text />` component for all typographic elements — never write raw type CSS | Typography |
| 7 | Typography roles: `h1` (28px), `h2` (24px), `h3` (20px), `h4` (18px), `body` (14px), `bodySmall` (12px) | Typography |
| 8 | Theme switching via `[data-color-mode]` attribute or `prefers-color-scheme` media query — never hard-code colors | Theming |
| 9 | Grid-based chart panel layout: panels snap to 8px grid; minimum panel height = 4 grid units (32px visible + padding) | Layout |
| 10 | Animation: use `theme.transitions.duration` tokens — `shorter` (200ms), `standard` (300ms), `complex` (375ms) | Animation |

### Anti-Patterns
- ❌ Hard-coding colors instead of using `theme.colors.*` tokens
- ❌ Dark theme as a simple color inversion (must use dark-specific palettes)
- ❌ Placing 3D chart effects on a dark canvas (they cause eye strain and are unreadable)
- ❌ Using pure `#000000` backgrounds in dark mode (use tinted near-black)
- ❌ Mixing light-theme and dark-theme tokens

**Sources:** [grafana.com/developers/saga](https://grafana.com/developers/saga), [npmjs.com/@grafana/design-tokens](https://npmjs.com/package/@grafana/design-tokens), [github.com/grafana/grafana](https://github.com/grafana/grafana)

---

## 8. Raycast

**Status:** ✅ Found — [raycast.com](https://raycast.com), Raycast API design docs
**Type:** Real-world product — macOS command palette / developer tool

### Design Philosophy
"Fast, Simple, Delightful." Keyboard-first interface. Dark canvas that minimizes distraction. 60fps animation budget maintained at all times. "Precision instrument" feel.

### Concrete Design Rules

| # | Rule | Domain |
|---|------|---------|
| 1 | Primary font: **Inter** with OpenType features: `ss03` (single-story g), `calt`, `kern`, `liga` — always enable these globally | Typography |
| 2 | Code/monospace: **GeistMono** — reinforces developer-tool identity | Typography |
| 3 | Positive letter spacing: **0.2px–0.4px** for UI text — creates "airy" quality on dense dark surfaces | Typography |
| 4 | Base background: `#07080a` (near-black, blue-tinted); surface ladder: `#0d0d0d`, `#101111`, `#181818` | Color |
| 5 | Accent: "Raycast Red" `#FF6363` — used sparingly as punctuation/hero element; never as a background fill | Color |
| 6 | Borders: 1px `rgba(255,255,255,0.06–0.10)` — subtly define containment without visual weight | Color |
| 7 | **4px base grid** — strict alignment; every spacing value is a multiple of 4 | Spacing |
| 8 | Elevation via multi-layered box shadows with inset highlights (not flat color changes) | Visual Depth |
| 9 | Animation easing: `cubic-bezier(0.23, 1, 0.32, 1)` or `cubic-bezier(0.165, 0.84, 0.44, 1)` — smooth deceleration | Animation |
| 10 | Animation durations: xs=100ms, sm=200ms, md=300ms, lg=500ms — use the smallest duration that feels complete | Animation |

### Anti-Patterns
- ❌ Light backgrounds or colored backgrounds (dark canvas is the identity)
- ❌ Opaque borders (use translucent rgba borders only)
- ❌ Bounce/spring animations for navigation transitions
- ❌ Wide letter spacing on light backgrounds (only appropriate on dark)
- ❌ Accent color as a background fill (only as punctuation)

**Sources:** [raycast.com/design](https://raycast.com/design), [open-design.ai Raycast teardown](https://open-design.ai), [skills.rest](https://skills.rest)

---

## 9. Synthesized Rules for AI Dashboards

These rules are derived from cross-referencing all sources above for an AI-specific dashboard context.

### 9.1 Typography Hierarchy
```
Level 1 (Page Title / KPI Hero):    20–24px, weight 600–700
Level 2 (Section Header):           16–18px, weight 600
Level 3 (Card Title / Label):       13–14px, weight 500–600
Level 4 (Body / Description):       13–14px, weight 400
Level 5 (Caption / Metadata):       11–12px, weight 400
Code/Numbers:                       Monospace font, tabular-nums enabled
```

### 9.2 Spacing System
```
Base unit: 4px
Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96px
Card padding: 16px (compact) / 24px (comfortable)
Panel gap: 8px (dense) / 16px (standard)
Section gap: 32px
Page margin: 24px (mobile) / 32px (desktop)
```

### 9.3 Color Semantics (Dark Theme)
```
Background:   #0f1117 (canvas) / #161b22 (panel) / #1e242c (elevated)
Foreground:   #e6edf3 (primary) / #7d8590 (secondary) / #484f58 (muted)
Border:       rgba(255,255,255,0.08) (subtle) / rgba(255,255,255,0.15) (visible)
Accent:       Project-defined — ONE color only
Success:      #3fb950 green
Warning:      #d29922 amber
Error:        #f85149 red
Info:         #58a6ff blue
```

### 9.4 Component Density
- **Metric cards**: max 4–6 per row at full width; max 3 KPI cards above the fold
- **Data tables**: row height 36–40px; compact tables 28–32px
- **Primary button**: height 32px (compact) / 36px (default) / 40px (prominent)
- **Input fields**: height 32px; border-radius 6px
- **Chips/badges**: height 20–22px; border-radius 9999px (pill)

### 9.5 Animation Guidelines
```
Duration: 100ms (instant feedback) / 200ms (standard) / 300ms (enter/exit)
Easing:   ease-out for exits / ease-in-out for enters / cubic-bezier for custom
Only animate: transform, opacity — never width, height, top, left
Skeleton loaders: use shimmer animation (gradient sweep) for data loading states
Streaming AI text: progressive reveal at 20–40 chars/sec feels natural
```

### 9.6 Dashboard-Specific Patterns
- **Progressive disclosure**: overview → drill-down → detail — never show all data at once
- **Contextual numbers**: every metric needs a delta, trend, or baseline comparison
- **AI confidence indicators**: show confidence level (High/Med/Low) for AI-generated insights
- **Streaming state**: show partial AI output progressively, not after full completion
- **Empty states**: every data panel needs a designed empty state (not a blank space)
- **5–9 Rule**: max 5–9 key visualizations per screen before user cognitive overload

---

## 10. Master Anti-Pattern Registry

| Anti-Pattern | Source | Category |
|---|---|---|
| Purple-to-blue gradient backgrounds | Impeccable, Hallmark, General | Color |
| Gray text on colored background | Impeccable | Color |
| Pure `#000000` or `#ffffff` backgrounds | Vercel, Raycast, Grafana | Color |
| Rounded-square icon tile above every heading | Impeccable | Layout |
| Hero section + 3-card grid default layout | Hallmark | Layout |
| Cards nested in cards | Impeccable | Layout |
| Everything centered, no asymmetry | Impeccable, Hallmark | Layout |
| Bounce/elastic easing animations | Impeccable, Raycast, General | Animation |
| Animating width/height/top/left properties | Impeccable, General | Animation |
| More than 3 font sizes in a single UI region | Linear, General | Typography |
| Using Inter as a thoughtless default | Impeccable | Typography |
| Non-tabular numerals in data tables | Stripe, Vercel | Typography |
| Hardcoded hex values instead of tokens | Impeccable, Grafana, All | Tokens |
| Inline mid-render colors (not in CSS vars) | Hallmark | Tokens |
| Missing unhappy paths (error/empty/loading) | Stripe | Components |
| Showing metrics without comparison context | Stripe, Dashboard | Components |
| 10+ metric cards above the fold | Dashboard | Layout |
| 3D chart effects on dark canvas | Grafana | Data Viz |
| Opaque borders on dark surfaces | Raycast | Color |
| Accent color used as background fill | Raycast | Color |
| Validating forms only on submit | Stripe | UX |
| Using dividers instead of whitespace for separation | Vercel | Layout |
| Neon cyan/pink accents on dark backgrounds | General | Color |
| Glassmorphism overuse (blur+transparency everywhere) | General | Visual |
| Decorative sparklines without data meaning | Impeccable | Data Viz |

---

## Sources Index

| Source | URL |
|---|---|
| Impeccable (pbakaus) | https://github.com/pbakaus/impeccable |
| Hallmark (Nutlope) | https://github.com/Nutlope/hallmark |
| Hallmark website | https://usehallmark.com |
| Linear method | https://linear.app/method |
| Linear design teardown | https://open-design.ai |
| Vercel design system | https://vercel.com/design |
| Geist font (npm) | https://npmjs.com/package/geist |
| Stripe Apps UI | https://stripe.com/docs/apps |
| Grafana Saga | https://grafana.com/developers/saga |
| Grafana design tokens (npm) | https://npmjs.com/package/@grafana/design-tokens |
| Raycast API / design | https://raycast.com/design |
| awesome-design-md | https://github.com/VoltAgent/awesome-design-md |
| open-design.ai | https://open-design.ai |
| designsystems.surf | https://designsystems.surf |

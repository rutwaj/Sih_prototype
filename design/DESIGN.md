# DESIGN.md — ResiliNet-AI Design System

> **Single source of truth for all visual decisions.**
> All raw values live in `design/tokens.json`. This file explains the rules and usage.

---

## 1. Color Tokens

| Token | Value | Semantic Meaning |
|-------|-------|-----------------|
| `bg` | `#0B0D0F` | Page canvas — the darkest surface |
| `surface` | `#111417` | Default panel/card background |
| `surface-2` | `#171B1F` | Elevated surface (nested areas) |
| `line` | `#232A30` | 1px borders and dividers |
| `text` | `#E6EAED` | Primary body text |
| `muted` | `#8B96A0` | Secondary/supporting text |
| `faint` | `#5A646D` | Disabled text, placeholders |
| `accent` | `#3DD6B0` | Interactive elements, primary actions |
| `ok` | `#3DD68C` | Node healthy, system nominal |
| `warn` | `#F2B84B` | Anomaly, pre-alert, degraded |
| `critical` | `#F0524F` | Confirmed hazard, system failure |
| `info` | `#5BA4F0` | Network/mesh activity, informational |

### Color Rules
- **NEVER use a semantic color decoratively.** `ok` means healthy. `warn` means degraded. `critical` means confirmed hazard.
- **ONE accent color** (`accent`) for interactive/primary actions only.
- **No gradients, no glassmorphism, no glow/blur shadows, no neon.**
- Flat surfaces separated by 1px `line` borders.

### Tailwind Usage
```html
<!-- ✅ Correct -->
<div class="bg-surface text-text border-line">...</div>
<span class="text-critical">FIRE CONFIRMED</span>
<button class="bg-accent text-bg">Trigger</button>

<!-- ❌ Wrong -->
<div style="background: #111417">...</div>
<div class="bg-[#3DD6B0]">...</div>
<div class="bg-gradient-to-r from-purple-500">...</div>
```

---

## 2. Typography

### Fonts
- **Sans:** Inter (via `next/font`) — UI text, labels, body
- **Mono:** JetBrains Mono (via `next/font`) — numbers, IDs, timestamps, sensor values

### Font Sizes (from tokens)
| Token | Size | Usage |
|-------|------|-------|
| `xs` | 12px | Captions, metadata, timestamps |
| `sm` | 13px | Labels, nav items, secondary text |
| `base` | 14px | Body text, descriptions |
| `lg` | 16px | Section headers, card titles |
| `xl` | 20px | Page headers, KPI values |
| `2xl` | 28px | Hero numbers, dashboard KPIs |

### Rules
- Max **3 font sizes** per screen region.
- All numbers: **JetBrains Mono** + `font-variant-numeric: tabular-nums`.
- Inter weight: 400 (body), 500 (labels/nav), 600 (section headers).
- Letter spacing: `+0.2px` on dark surfaces for legibility.

---

## 3. Spacing (8px rhythm)

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-1` | 4px | Icon padding, micro-gaps |
| `spacing-2` | 8px | Compact padding, gaps between inline items |
| `spacing-3` | 12px | Badge padding, tight sections |
| `spacing-4` | 16px | Standard component padding |
| `spacing-6` | 24px | Section padding, card gaps |
| `spacing-8` | 32px | Section-level gaps |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Chips, badges, small tags |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels |

---

## 5. Motion / Animation

| Token | Value | Usage |
|-------|-------|-------|
| `motion-fast` | 150ms | Hover states, instant feedback |
| `motion-base` | 220ms | Standard enter/exit |
| `motion-ease` | `cubic-bezier(0.2, 0, 0, 1)` | All transitions |

### Rules
- **Only animate `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`.
- **No bounce/elastic easing.** Only `ease-out` or the custom ease token.
- **Always respect `prefers-reduced-motion`.**
- Flashing lights: **never faster than 3 Hz** (333ms minimum cycle).
- Functional animation only: status change, mesh pulse, alert entry.

---

## 6. Layout

```
┌─────────────────────────────────────────────────────┐
│  Top Bar (network status, sim clock, connectivity)   │
├───────┬─────────────────────────────┬───────────────┤
│ Left  │                             │               │
│ Rail  │       Main Area (Map)       │  Right Panel  │
│ 48px  │                             │  (Detail/Log) │
│       │                             │               │
├───────┴─────────────────────────────┴───────────────┤
```

- **Left rail:** 48px wide (collapsed) / 200px (expanded). Nav + logo. No text overflow.
- **Top bar:** 48px tall. Network status, sim clock (mono), "Enable Sound" button.
- **Main area:** Map fills remaining space.
- **Right panel:** 320px wide on desktop. Detail / event log.
- **12-column grid** for the main content area.
- **No card-in-card nesting.** Use `border-line` + `spacing` to separate sections.

---

## 7. Icons

- **Library:** `lucide-react` only.
- **Stroke width:** `1.5` — consistent everywhere.
- **Size scale:** 14px (inline), 16px (standard), 20px (emphasis).
- **No emoji as icons.**
- Color: inherit from text token (muted, text, ok, warn, critical, info, accent).

---

## 8. Component States

Every interactive element must have:
- `default` — resting state
- `hover` — `bg-surface-2`, `transition-colors`
- `focus` — 2px `ring-accent/50` outline
- `active` — slightly pressed/darker
- `disabled` — `opacity-40`, `cursor-not-allowed`
- `loading` — skeleton shimmer

And every data panel must have:
- `empty` — designed empty state with icon + message
- `error` — error state with retry option
- `loading` — skeleton placeholder

---

## 9. Anti-Patterns (from design research)

❌ Gradients of any kind  
❌ Glassmorphism (backdrop-blur + transparency)  
❌ Neon colors or glows  
❌ Hardcoded hex in component files  
❌ Arbitrary Tailwind values like `text-[13px]` or `bg-[#abc]`  
❌ Cards nested in cards  
❌ More than 3 font sizes in a single panel  
❌ Decorative use of semantic colors  
❌ Non-tabular numerals in data tables  
❌ Purple/blue AI gradient backgrounds  
❌ Emoji as icons  
❌ Missing error/empty/loading states  
❌ Metrics without comparison context  
❌ Animation of width/height/top/left  
❌ Bounce/elastic easing  

---

## 10. Copy Guidelines

- Short, specific, human. Real units and realistic values.
- ✅ `"Water level +42 cm / 10 min"` ❌ `"Unlock the power of AI"`
- ✅ `"Node WS-014, Nainital ridge"` ❌ `"Sensor Node #14"`
- Always label the app as a **simulation**.
- Include honest technical framing: show computations, not magic claims.

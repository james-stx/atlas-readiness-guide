# Design System V3 — Notion/Den-Inspired

**Date:** 2025-02-06
**Reference UIs:** notion.so, getden.io
**Parent doc:** [FOUNDER-FEEDBACK-V3-PLAN.md](./FOUNDER-FEEDBACK-V3-PLAN.md)

---

## Design Philosophy

**Warm minimalism.** Not cold, clinical SaaS — but not playful either. Professional warmth. The UI should feel like a well-organized notebook, not a dashboard.

**Core principles:**
1. Spacing over dividers — separate with whitespace, not lines
2. Warm neutrals — `#37352F` text, `#F8F7F4` surfaces (not pure gray)
3. Content-first — sidebar is visually subordinate, content area draws the eye
4. 8px grid — all sizing derives from multiples of 4/8
5. Progressive disclosure — show what matters, hide what doesn't
6. Consistent radius — 8px everywhere (cards, buttons, hover states)

---

## Color Palette

### Core Neutrals (Warm)

```
--warm-50:   #FAF9F7    Surface / page background
--warm-100:  #F8F7F4    Sidebar background
--warm-150:  #F1F0EC    Sidebar hover
--warm-200:  #E8E6E1    Borders (use sparingly)
--warm-300:  #D4D1CB    Disabled states
--warm-400:  #B0ADA6    Placeholder text
--warm-500:  #9B9A97    Muted text / secondary labels
--warm-600:  #787671    Helper text
--warm-700:  #5C5A56    Secondary text
--warm-800:  #403E3B    Strong secondary
--warm-900:  #37352F    Primary text (Notion's default)
--warm-950:  #1F1E1B    Headings / emphasis
```

### Functional Colors

```
Confidence — High:
  --confidence-high-text:  #0F7B6C    (Notion green)
  --confidence-high-bg:    #DDEDEA
  --confidence-high-dot:   #0F7B6C

Confidence — Medium:
  --confidence-med-text:   #D9730D    (Notion orange)
  --confidence-med-bg:     #FAEBDD
  --confidence-med-dot:    #D9730D

Confidence — Low:
  --confidence-low-text:   #E03E3E    (Notion red)
  --confidence-low-bg:     #FBE4E4
  --confidence-low-dot:    #E03E3E

Accent (primary actions):
  --accent-text:           #0B6E99    (Notion blue)
  --accent-bg:             #DDEBF1
  --accent-solid:          #2383E2    (buttons)

Success:
  --success-text:          #0F7B6C
  --success-bg:            #DDEDEA

Warning:
  --warning-text:          #D9730D
  --warning-bg:            #FAEBDD
```

### Surface Hierarchy

```
Layer 0 (base):     #FFFFFF     Content panel, chat panel
Layer 1 (recessed): #F8F7F4     Sidebar
Layer 2 (elevated): #FFFFFF     Cards within content (with subtle border)
Layer 3 (overlay):  #FFFFFF     Modals, dropdowns (with shadow)
```

No box shadows except on overlays. Depth communicated through background color differences.

---

## Typography

**Font:** Inter (with system sans-serif fallback)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 24px | 600 | 1.3 | Page titles (domain headers) |
| `heading` | 18px | 600 | 1.4 | Section headers |
| `subheading` | 15px | 500 | 1.4 | Card titles, labels |
| `body` | 14px | 400 | 1.6 | Content text, user inputs |
| `body-sm` | 13px | 400 | 1.5 | Sidebar items, secondary content |
| `caption` | 12px | 500 | 1.4 | Badges, metadata, timestamps |
| `caption-sm` | 11px | 500 | 1.3 | Section headers in sidebar (uppercase) |

### Weight Usage

- **400 (Regular):** Body text, user inputs, descriptions
- **500 (Medium):** UI labels, sidebar items, captions, button text
- **600 (Semi-bold):** Headings, card titles, emphasis

Do NOT use 700 (Bold) in the UI. Semi-bold (600) is the heaviest weight.

---

## Spacing

**Base unit:** 4px
**Primary unit:** 8px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps (icon-to-text) |
| `space-2` | 8px | Default element spacing |
| `space-3` | 12px | Related group spacing |
| `space-4` | 16px | Section padding, card padding |
| `space-5` | 20px | Between cards |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Major section breaks |
| `space-10` | 40px | Page-level padding |

### Layout Dimensions

| Element | Width | Notes |
|---------|-------|-------|
| Sidebar | 240px | Fixed, not resizable |
| Content Panel | flex-1 | Max inner width 720px, centered |
| Chat Panel | 380px | Slides in from right |
| TopBar | 48px height | Fixed |
| Sidebar item height | 32px | Comfortable click target |
| Card padding | 16px | All sides |
| Section gap (sidebar) | 8px | Between domain groups |

---

## Borders & Dividers

**Philosophy:** Use borders sparingly. Prefer spacing.

```
Default border:     1px solid #E8E6E1 (warm-200)
Subtle border:      1px solid #F1F0EC (warm-150)  — card outlines
Sidebar right edge: 1px solid #E8E6E1
```

**Where borders appear:**
- Sidebar right edge (separates from content)
- Card outlines in content panel (subtle, `warm-150`)
- TopBar bottom edge
- Input fields

**Where borders do NOT appear:**
- Between sidebar sections (use spacing)
- Between sidebar items
- Between cards in content panel (use spacing)
- Around the chat panel (uses its own background)

---

## Border Radius

**Consistent 8px** on all interactive/container elements:

| Element | Radius |
|---------|--------|
| Cards | 8px |
| Buttons | 8px |
| Sidebar hover states | 8px |
| Input fields | 8px |
| Badges/pills | 999px (full round) |
| Modals | 12px |
| Tooltips | 8px |

---

## Interactive States

### Hover

```css
/* Sidebar items */
background: #EFEEE9;          /* warm-150 */
transition: background 120ms ease;
border-radius: 8px;

/* Content cards */
border-color: #E8E6E1;        /* warm-200, slightly more visible */
transition: border-color 120ms ease;

/* Buttons (primary) */
background: darken 5%;
transition: background 120ms ease;
```

### Active/Selected

```css
/* Sidebar — selected domain */
background: #EFEEE9;
font-weight: 500;

/* Sidebar — selected topic */
background: #EFEEE9;
color: #37352F;

/* Content — highlighted card */
border-color: var(--accent-solid);
box-shadow: 0 0 0 1px var(--accent-solid);  /* ring, not shadow */
```

### Focus

```css
/* All focusable elements */
outline: 2px solid var(--accent-solid);
outline-offset: 2px;
border-radius: 8px;
```

---

## Component Specs

### Sidebar

```
┌─────────────────────────┐
│                         │  bg: #F8F7F4
│  ASSESSMENT             │  11px, 500, uppercase, #9B9A97
│                         │  8px gap below
│  ┌─ ▸ Market      3/5 ─┐│  32px height, 8px radius hover
│  │   ├ Why expand   ✓  ││  28px height, indented 32px
│  │   ├ Target       ✓  ││
│  │   ├ Competitors  ○  ││  ○ = warm-400, ✓ = confidence-high
│  │   ├ Size         ○  ││
│  │   └ Timing       ○  ││
│  │                      ││
│  │  ▸ Product      1/5 ││  Collapsed domain
│  │  ▸ GTM          0/5 ││
│  │  ▸ Operations   0/5 ││
│  │  ▸ Financials   0/5 ││
│  └──────────────────────┘│
│                         │
│  ──────────────────────  │  1px warm-200 divider (only here)
│  Overall 32%            │
│  ▓▓▓▓░░░░░░░░           │  4px height progress bar
│                         │
└─────────────────────────┘
```

**Domain item layout:**
```
[▸/▾] [Domain Label]                [3/5]
 ↑                                    ↑
 Chevron 16px, warm-500            Caption, warm-500
         warm-900 text, 13px/500
```

**Topic item layout:**
```
         [·] [Topic Label]        [✓/○]
          ↑                         ↑
     tree dot, warm-300     Status icon, 14px
          warm-700 text, 13px/400
```

**Hover state:** Full-width `#EFEEE9` background with 8px radius, 4px horizontal padding (so the highlight extends slightly beyond text).

### Content Panel

```
┌──────────────────────────────────────────────────┐
│                                          max 720px│
│  Market Readiness                           3/5  │  display (24px/600)
│  Understanding your U.S. market opportunity      │  body (14px/400, warm-600)
│                                                  │
│  DOMAIN INSIGHT                                  │  caption-sm (11px/500), warm-500
│  ┌──────────────────────────────────────────────┐│
│  │ Strong demand signals identified with        ││  body (14px/400), warm-800
│  │ quantitative evidence. Key gap: competitive  ││
│  │ analysis and market sizing not yet provided. ││
│  │                                              ││
│  │ ●●○ Confidence: 2 High, 1 Medium            ││  caption, with colored dots
│  │ → Next: Market size estimate                 ││  caption, accent color
│  └──────────────────────────────────────────────┘│  bg: warm-50, border: warm-150
│                                                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  20px spacing between cards
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │  Why expand to the U.S.?              HIGH   ││  CATEGORY CARD
│  │                                              ││
│  │  KEY INSIGHT                                 ││
│  │  Strong demand signals from enterprise SaaS  ││
│  │  companies, with 40% QoQ inquiry growth.     ││
│  │                                              ││
│  │  YOUR INPUT                                  ││
│  │  "We've been getting a lot of inbound..."    ││
│  │                                              ││
│  │  WHAT THIS MEANS                             ││
│  │  ✓ Clear demand signal identified            ││
│  │  ✓ Quantitative evidence provided            ││
│  │  △ Consider competitive landscape            ││
│  │                                              ││
│  │  2h ago · Market chat     [Discuss] [···]    ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│
│  │  Market size estimate           NOT STARTED  ││  EMPTY CARD (dashed)
│  │  Understanding your addressable market       ││  + topic description
│  │                            [Start Topic →]   ││  CTA opens chat
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘│
│                                                  │
└──────────────────────────────────────────────────┘
```

### Chat Panel (Slide-in)

```
┌──────────────────────────┐
│ Chat · Market Readiness  │  bg: white, left border warm-200
│ Why expand to the U.S.?  │  subheading showing active topic
│                     [×]  │
├──────────────────────────┤
│                          │
│  (conversation thread)   │
│                          │
├──────────────────────────┤
│ [Message...]      [⏎]   │
│       Cmd+Enter to send  │
└──────────────────────────┘
```

**Slide animation:** `transform: translateX(100%)` → `translateX(0)`, 200ms ease-out.

### TopBar

```
┌────────────────────────────────────────────────────────────┐
│  ◉ Atlas    Assessment: you@co.com          [Snapshot ↗]  │
│             ▓▓▓▓▓▓░░░░░░░░ 32%                           │
└────────────────────────────────────────────────────────────┘
  ↑                                               ↑
  Logo, warm-950          Snapshot button: accent-solid, white text
  Height: 48px, bg: white, bottom border: warm-200
```

Minimal. Logo left, progress center (or left-of-center), snapshot CTA right.

### Buttons

**Primary:**
```css
background: #2383E2;     /* accent-solid */
color: #FFFFFF;
font: 13px/500 Inter;
padding: 8px 16px;
border-radius: 8px;
```

**Secondary:**
```css
background: transparent;
color: #37352F;          /* warm-900 */
border: 1px solid #E8E6E1;
font: 13px/500 Inter;
padding: 8px 16px;
border-radius: 8px;
```

**Ghost:**
```css
background: transparent;
color: #9B9A97;          /* warm-500 */
font: 13px/500 Inter;
padding: 8px 12px;
border-radius: 8px;
/* hover: background #F8F7F4 */
```

### Confidence Badges

```css
/* High */
.badge-high {
  background: #DDEDEA;
  color: #0F7B6C;
  font: 11px/500 Inter;
  padding: 2px 8px;
  border-radius: 999px;
}

/* Medium */
.badge-medium {
  background: #FAEBDD;
  color: #D9730D;
}

/* Low */
.badge-low {
  background: #FBE4E4;
  color: #E03E3E;
}
```

---

## Animations & Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Hover backgrounds | background-color | 120ms | ease |
| Card expand/collapse | height, opacity | 200ms | ease-out |
| Chat panel slide | transform | 200ms | ease-out |
| Badge appear | opacity, scale | 150ms | ease-out |
| Content panel onboarding fade | opacity | 300ms | ease |
| Sidebar domain expand | height | 150ms | ease-out |

No animations over 300ms. No bounces, springs, or playful easing.

---

## Tailwind Config Mapping

```js
// Key additions to tailwind.config.ts
colors: {
  warm: {
    50: '#FAF9F7',
    100: '#F8F7F4',
    150: '#F1F0EC',
    200: '#E8E6E1',
    300: '#D4D1CB',
    400: '#B0ADA6',
    500: '#9B9A97',
    600: '#787671',
    700: '#5C5A56',
    800: '#403E3B',
    900: '#37352F',
    950: '#1F1E1B',
  },
  confidence: {
    high: { text: '#0F7B6C', bg: '#DDEDEA' },
    medium: { text: '#D9730D', bg: '#FAEBDD' },
    low: { text: '#E03E3E', bg: '#FBE4E4' },
  },
  accent: {
    DEFAULT: '#2383E2',
    light: '#DDEBF1',
    text: '#0B6E99',
  },
}
```

---

## Checklist: "Does It Feel Like Notion?"

- [ ] Sidebar has a warm, recessed background — not white
- [ ] Text uses warm charcoal (#37352F), not pure black
- [ ] Borders are nearly invisible (#E8E6E1), used sparingly
- [ ] Hover states are subtle background shifts, not color changes
- [ ] All interactive elements have 8px border-radius
- [ ] Spacing is consistent on an 8px grid
- [ ] Typography uses only 3 weights (400, 500, 600)
- [ ] No box shadows except on overlays/modals
- [ ] Content area is constrained to ~720px max width
- [ ] The overall feel is warm, quiet, and professional

# UX/UI Design Specifications
## Enhanced Progress Visibility Feature

**Document Version:** 1.0
**Date:** January 27, 2026
**Author:** UX/UI Design Team
**Status:** Ready for Engineering Implementation
**Related PRD:** [PRD-Progress-Visibility-Feature.md](./PRD-Progress-Visibility-Feature.md)

---

## Table of Contents

1. [Design Overview](#1-design-overview)
2. [Design System Extensions](#2-design-system-extensions)
3. [Component Specifications](#3-component-specifications)
4. [Layout & Composition](#4-layout--composition)
5. [Interaction Design](#5-interaction-design)
6. [Responsive Design](#6-responsive-design)
7. [Accessibility Specifications](#7-accessibility-specifications)
8. [Motion & Animation](#8-motion--animation)
9. [Visual Assets](#9-visual-assets)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Design Overview

### 1.1 Design Philosophy

This feature enhances progress visibility while maintaining the conversational nature of Atlas. The design follows these principles:

| Principle | Application |
|-----------|-------------|
| **Peripheral, not central** | Progress UI sits at the edges; conversation remains the focus |
| **Glanceable, then detailed** | Header shows quick status; panel reveals depth |
| **Encouraging, not demanding** | Language and visuals celebrate progress, never shame gaps |
| **Consistent confidence language** | Same colors/icons for confidence levels everywhere |
| **Seamless integration** | New components feel native to existing Atlas design |

### 1.2 Visual Language Summary

The progress feature introduces new UI patterns while adhering to Atlas's established design language:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ATLAS VISUAL LANGUAGE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  COLORS                    SHAPES                   MOTION              │
│  ───────                   ──────                   ──────              │
│  Primary: #5754FF          Rounded: 12-20px         Ease-out: 300ms     │
│  Cyan: #4EEBF3             Circular: Progress       Slide: translateY   │
│  Orange: #FF6F22           Pill: Domain status      Fade: opacity       │
│  Slate: #64748B            Card: Information        Stagger: 150ms      │
│                                                                         │
│  TYPOGRAPHY                SPACING                  DEPTH               │
│  ──────────                ───────                  ─────               │
│  Inter: 400-700            Base: 4px grid           Shadow-sm: Cards    │
│  Scale: xs-7xl             Section: 80px            Shadow-md: Hover    │
│  Tracking: tight (h1)      Component: 16-24px       Shadow-lg: Panel    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Component Inventory

New components introduced by this feature:

| Component | Type | Location | PRD Reference |
|-----------|------|----------|---------------|
| ProgressRing | Atomic | Header, Panel | Section 8.1 |
| DomainPill | Atomic | Header | Section 8.1 |
| InputNotification | Molecule | Toast stack | Section 8.2 |
| ConfidenceBadge | Atomic | Notifications, Panel | Section 8.2 |
| ReadinessPanel | Organism | Slide-out | Section 8.3 |
| DomainAccordion | Molecule | Panel | Section 8.3 |
| TopicChecklist | Molecule | Panel | Section 8.4 |
| ReadinessIndicator | Molecule | Panel | Section 8.3 |
| ProgressHeader | Organism | Fixed top | Section 8.1 |

---

## 2. Design System Extensions

### 2.1 New Color Tokens

Extending the existing color system with semantic progress colors:

```css
/* Progress-specific semantic colors */
:root {
  /* Confidence Levels */
  --confidence-high: #16A34A;           /* green-600 */
  --confidence-high-bg: #DCFCE7;        /* green-100 */
  --confidence-high-border: #86EFAC;    /* green-300 */

  --confidence-medium: #D97706;         /* amber-600 */
  --confidence-medium-bg: #FEF3C7;      /* amber-100 */
  --confidence-medium-border: #FCD34D;  /* amber-300 */

  --confidence-low: #DC2626;            /* red-600 */
  --confidence-low-bg: #FEE2E2;         /* red-100 */
  --confidence-low-border: #FCA5A5;     /* red-300 */

  /* Readiness States */
  --readiness-minimal: #94A3B8;         /* slate-400 */
  --readiness-partial: #F59E0B;         /* amber-500 */
  --readiness-good: #22C55E;            /* green-500 */
  --readiness-excellent: #10B981;       /* emerald-500 */

  /* Domain Status */
  --domain-not-started: #E2E8F0;        /* slate-200 */
  --domain-in-progress: #C7D2FE;        /* indigo-200 */
  --domain-adequate: #5754FF;           /* primary */

  /* Progress Track */
  --progress-track: #E2E8F0;            /* slate-200 */
  --progress-fill: #5754FF;             /* primary */

  /* Panel */
  --panel-backdrop: rgba(15, 23, 42, 0.2);  /* slate-900/20 */
  --panel-background: #FFFFFF;
  --panel-border: #E2E8F0;              /* slate-200 */
}
```

### 2.2 New Typography Styles

```css
/* Progress-specific typography */
.progress-percentage {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1rem;        /* 16px in header */
  line-height: 1;
  color: var(--slate-900);
}

.progress-percentage-large {
  font-size: 1.5rem;      /* 24px in panel */
}

.domain-label {
  font-weight: 600;
  font-size: 0.875rem;    /* 14px */
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.topic-label {
  font-weight: 500;
  font-size: 0.875rem;    /* 14px */
  color: var(--slate-700);
}

.topic-label-uncovered {
  color: var(--slate-400);
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;    /* 14px */
  color: var(--slate-900);
}

.notification-subtitle {
  font-weight: 500;
  font-size: 0.75rem;     /* 12px */
}

.readiness-title {
  font-weight: 600;
  font-size: 1.125rem;    /* 18px */
}

.readiness-message {
  font-weight: 400;
  font-size: 0.875rem;    /* 14px */
  color: var(--slate-600);
}
```

### 2.3 New Spacing Tokens

```css
/* Progress-specific spacing */
:root {
  --header-height: 64px;
  --header-height-mobile: 56px;

  --panel-width: 400px;
  --panel-width-tablet: 360px;

  --notification-width: 280px;
  --notification-gap: 8px;
  --notification-offset: 16px;

  --pill-size: 32px;
  --pill-size-mobile: 24px;
  --pill-gap: 8px;

  --ring-size-header: 48px;
  --ring-size-panel: 96px;
  --ring-stroke-header: 4px;
  --ring-stroke-panel: 6px;

  --accordion-padding: 16px;
  --topic-row-height: 36px;
}
```

### 2.4 New Shadow Tokens

```css
/* Progress-specific shadows */
:root {
  --shadow-notification: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                         0 4px 6px -4px rgba(0, 0, 0, 0.1);

  --shadow-panel: -4px 0 25px -5px rgba(0, 0, 0, 0.1),
                  -10px 0 40px -10px rgba(0, 0, 0, 0.1);

  --shadow-ring-glow: 0 0 0 4px rgba(87, 84, 255, 0.1);
}
```

---

## 3. Component Specifications

### 3.1 Progress Ring

Circular progress indicator showing overall completion percentage.

#### Variants

| Variant | Size | Stroke | Usage |
|---------|------|--------|-------|
| Header | 48×48px | 4px | Progress header |
| Panel | 96×96px | 6px | Readiness panel summary |
| Mini | 24×24px | 3px | Inline indicators |

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROGRESS RING - HEADER VARIANT (48×48px)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│         ┌──────────────┐                                                │
│        ╱                ╲         SPECIFICATIONS:                       │
│       │    ╭────────╮    │        ────────────────                      │
│       │   ╱          ╲   │        Outer diameter: 48px                  │
│       │  │            │  │        Inner diameter: 40px                  │
│       │  │    68%     │  │        Stroke width: 4px                     │
│       │  │            │  │        Track color: slate-200                │
│       │   ╲          ╱   │        Fill color: primary (#5754FF)         │
│       │    ╰────────╯    │        Text: 16px Inter Bold                 │
│        ╲                ╱         Text color: slate-900                 │
│         └──────────────┘          Rotation start: -90deg (12 o'clock)  │
│                                                                         │
│  STATES:                                                                │
│  ─────────                                                              │
│  0%: Full track visible, no fill                                        │
│  1-99%: Proportional fill, clockwise from top                           │
│  100%: Full fill with subtle glow                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### SVG Structure

```html
<svg width="48" height="48" viewBox="0 0 48 48">
  <!-- Track (background circle) -->
  <circle
    cx="24"
    cy="24"
    r="20"
    fill="none"
    stroke="#E2E8F0"
    stroke-width="4"
  />
  <!-- Progress (foreground arc) -->
  <circle
    cx="24"
    cy="24"
    r="20"
    fill="none"
    stroke="#5754FF"
    stroke-width="4"
    stroke-linecap="round"
    stroke-dasharray="125.6"
    stroke-dashoffset="40.2"  <!-- 125.6 * (1 - 0.68) for 68% -->
    transform="rotate(-90 24 24)"
    class="progress-ring-fill"
  />
  <!-- Center text -->
  <text x="24" y="24" text-anchor="middle" dominant-baseline="central">
    68%
  </text>
</svg>
```

#### Animation

```css
.progress-ring-fill {
  transition: stroke-dashoffset 300ms ease-out;
}

/* On value change, animate the dashoffset */
@keyframes progress-fill {
  from { stroke-dashoffset: var(--from-offset); }
  to { stroke-dashoffset: var(--to-offset); }
}
```

---

### 3.2 Domain Pill

Circular indicator showing domain status.

#### States

| State | Background | Border | Icon/Text | Description |
|-------|------------|--------|-----------|-------------|
| Not Started | white | slate-300 | Letter (gray) | No inputs in domain |
| In Progress | primary-50 | primary-300 | Letter (primary) | Has inputs, not adequate |
| Adequate | primary | primary | Letter (white) | 3+ inputs with high confidence |
| Current | [any above] + ring | primary-300 | [as above] | Currently active domain |

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DOMAIN PILLS - ALL STATES                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    NOT STARTED         IN PROGRESS         ADEQUATE           CURRENT   │
│    ────────────        ───────────         ────────           ───────   │
│                                                                         │
│      ┌─────┐            ┌─────┐            ┌─────┐          ╭┌─────┐╮  │
│      │     │            │     │            │█████│          ││█████││  │
│      │  M  │            │  M  │            │█ M █│          ││█ M █││  │
│      │     │            │     │            │█████│          ││█████││  │
│      └─────┘            └─────┘            └─────┘          ╰└─────┘╯  │
│                                                                         │
│    bg: white           bg: primary-50      bg: primary      + outer    │
│    border: slate-300   border: primary-300 text: white       ring      │
│    text: slate-400     text: primary                        + scale    │
│                                                              (1.1)     │
│                                                                         │
│  DIMENSIONS:                                                            │
│  ───────────                                                            │
│  Desktop: 32×32px, border-radius: 50%, font: 12px semibold             │
│  Mobile: 24×24px, border-radius: 50%, font: 10px semibold              │
│  Current ring: 2px, offset 2px, color primary-300                       │
│  Spacing between pills: 8px                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Hover Behavior

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DOMAIN PILL - TOOLTIP ON HOVER                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ┌─────────────────────────┐                          │
│                    │ Market                  │ ← Tooltip                │
│                    │ 4 inputs captured       │   bg: slate-900          │
│                    └──────────┬──────────────┘   text: white            │
│                               │                  padding: 8px 12px      │
│                               ▼                  border-radius: 6px     │
│                           ┌─────┐                delay: 500ms           │
│                           │█ M █│                                       │
│                           └─────┘                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Input Notification (Toast)

Toast notification appearing when an input is captured.

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  INPUT NOTIFICATION - ALL CONFIDENCE VARIANTS                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HIGH CONFIDENCE                                                        │
│  ┌─────────────────────────────────────────────────┐                   │
│  │  ┌────┐                                         │                   │
│  │  │ ✓  │  Target customer captured               │                   │
│  │  │    │  ┌──────────────────────┐               │                   │
│  │  └────┘  │ ● High confidence    │               │                   │
│  │          └──────────────────────┘               │                   │
│  │                                                 │                   │
│  │  Domain: Market                                 │                   │
│  └─────────────────────────────────────────────────┘                   │
│                                                                         │
│  MEDIUM CONFIDENCE                                                      │
│  ┌─────────────────────────────────────────────────┐                   │
│  │  ┌────┐                                         │                   │
│  │  │ ✓  │  Pricing strategy captured              │                   │
│  │  │    │  ┌──────────────────────┐               │                   │
│  │  └────┘  │ ◐ Medium confidence  │               │                   │
│  │          └──────────────────────┘               │                   │
│  │                                                 │                   │
│  │  Domain: Go-to-Market                           │                   │
│  └─────────────────────────────────────────────────┘                   │
│                                                                         │
│  LOW CONFIDENCE                                                         │
│  ┌─────────────────────────────────────────────────┐                   │
│  │  ┌────┐                                         │                   │
│  │  │ ✓  │  Market size captured                   │                   │
│  │  │    │  ┌────────────────────────────────────┐ │                   │
│  │  └────┘  │ ○ Low confidence - add detail      │ │                   │
│  │          └────────────────────────────────────┘ │                   │
│  │                                                 │                   │
│  │  Domain: Market                                 │                   │
│  └─────────────────────────────────────────────────┘                   │
│                                                                         │
│  SPECIFICATIONS:                                                        │
│  ───────────────                                                        │
│  Width: 280px (fixed)                                                   │
│  Padding: 12px 16px                                                     │
│  Border-radius: 12px                                                    │
│  Background: white                                                      │
│  Border: 1px solid slate-200                                            │
│  Shadow: shadow-notification                                            │
│                                                                         │
│  Icon container: 32×32px, rounded-lg, bg: confidence color (light)     │
│  Checkmark: 16×16px, color: confidence color (dark)                    │
│                                                                         │
│  Title: 14px semibold, slate-900                                        │
│  Badge: Inline with title, see ConfidenceBadge spec                    │
│  Domain: 12px regular, slate-500                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Stacking Behavior

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NOTIFICATION STACK (max 3)                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                                             Position: fixed             │
│                                             Bottom: 16px                │
│                                             Right: 16px                 │
│  ┌─────────────────────────────┐            Gap: 8px                   │
│  │ ✓ Competition captured      │ ← Oldest (will exit first)           │
│  │   ● High confidence         │                                       │
│  └─────────────────────────────┘                                       │
│                                                                         │
│  ┌─────────────────────────────┐                                       │
│  │ ✓ Target customer captured  │ ← Middle                              │
│  │   ◐ Medium confidence       │                                       │
│  └─────────────────────────────┘                                       │
│                                                                         │
│  ┌─────────────────────────────┐                                       │
│  │ ✓ Expansion driver captured │ ← Newest (just entered)              │
│  │   ● High confidence         │                                       │
│  └─────────────────────────────┘                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Confidence Badge

Inline badge indicating confidence level.

#### Variants

| Confidence | Background | Text Color | Icon |
|------------|------------|------------|------|
| High | green-100 (#DCFCE7) | green-800 (#166534) | ● (filled circle) |
| Medium | amber-100 (#FEF3C7) | amber-800 (#92400E) | ◐ (half circle) |
| Low | red-100 (#FEE2E2) | red-800 (#991B1B) | ○ (empty circle) |

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CONFIDENCE BADGE - ALL VARIANTS                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌───────────┐  │
│  │ ● High confidence     │  │ ◐ Medium confidence    │  │ ○ Low     │  │
│  └───────────────────────┘  └────────────────────────┘  └───────────┘  │
│                                                                         │
│  SPECIFICATIONS:                                                        │
│  ───────────────                                                        │
│  Padding: 4px 8px                                                       │
│  Border-radius: 9999px (pill)                                           │
│  Font: 12px medium                                                      │
│  Icon: 8px, margin-right: 4px                                           │
│                                                                         │
│  COMPACT VARIANT (icon only):                                           │
│  ┌───┐  ┌───┐  ┌───┐                                                   │
│  │ ● │  │ ◐ │  │ ○ │   Size: 16×16px, centered icon                    │
│  └───┘  └───┘  └───┘   Used in: Topic checklist                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5 Readiness Panel

Slide-out panel showing detailed progress information.

#### Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  READINESS PANEL - FULL LAYOUT                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Width: 400px (desktop), 100% (mobile)                                  │
│  Position: Fixed, right: 0, top: 0, bottom: 0                           │
│  Background: white                                                      │
│  Border-left: 1px solid slate-200                                       │
│  Shadow: shadow-panel                                                   │
│  Z-index: 50                                                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  HEADER (56px, fixed)                                            │   │
│  │  ─────────────────────                                           │   │
│  │  ← Assessment Progress                                     [X]   │   │
│  │                                                                  │   │
│  │  Back arrow: 20px, clickable (closes panel)                      │   │
│  │  Title: 16px semibold                                            │   │
│  │  Close X: 20px, slate-400, hover: slate-600                      │   │
│  │  Border-bottom: 1px solid slate-200                              │   │
│  │  Padding: 0 16px                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CONTENT (scrollable)                                            │   │
│  │  ───────────────────────                                         │   │
│  │  Padding: 24px 16px                                              │   │
│  │  Overflow-y: auto                                                │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  OVERALL PROGRESS CARD                                     │  │   │
│  │  │  ─────────────────────                                     │  │   │
│  │  │  Background: slate-50                                      │  │   │
│  │  │  Border-radius: 16px                                       │  │   │
│  │  │  Padding: 24px                                             │  │   │
│  │  │  Margin-bottom: 24px                                       │  │   │
│  │  │                                                            │  │   │
│  │  │       ╭─────────╮                                          │  │   │
│  │  │       │         │      8 inputs captured                   │  │   │
│  │  │       │   68%   │      3 of 5 domains covered              │  │   │
│  │  │       │         │      2 high confidence                   │  │   │
│  │  │       ╰─────────╯                                          │  │   │
│  │  │                                                            │  │   │
│  │  │  Ring: 96px, centered                                      │  │   │
│  │  │  Stats: 14px regular, slate-600, right side                │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  DOMAIN ACCORDION (×5)                                     │  │   │
│  │  │  See Section 3.6 for details                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  READINESS INDICATOR                                       │  │   │
│  │  │  See Section 3.7 for details                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Backdrop

```css
.panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);  /* slate-900/20 */
  z-index: 40;
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.panel-backdrop.open {
  opacity: 1;
}
```

---

### 3.6 Domain Accordion

Expandable section for each domain in the Readiness Panel.

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DOMAIN ACCORDION - COLLAPSED STATE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ▶  MARKET                                          ████░  4/5  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Background: white                                                      │
│  Border: 1px solid slate-200                                            │
│  Border-radius: 12px                                                    │
│  Padding: 16px                                                          │
│  Margin-bottom: 8px                                                     │
│  Cursor: pointer                                                        │
│  Hover: bg slate-50                                                     │
│                                                                         │
│  Chevron: 16px, slate-400, rotates 90° when expanded                   │
│  Domain name: 14px semibold, uppercase, tracking-wide                   │
│  Progress bar: 80px wide, 6px tall, rounded-full                        │
│  Count: 12px medium, slate-500                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  DOMAIN ACCORDION - EXPANDED STATE                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ▼  MARKET                                          ████░  4/5  │   │
│  │  ───────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  │  KEY TOPICS                                                      │   │
│  │  ──────────                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │  ✓  Why expand to the U.S.?                       ●     │    │   │
│  │  │  ✓  Target customer profile                       ●     │    │   │
│  │  │  ✓  Market size estimate                          ○     │    │   │
│  │  │  ✓  Competitive landscape                         ◐     │    │   │
│  │  │  ○  Existing U.S. presence                        —     │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  CAPTURED INPUTS                                                 │   │
│  │  ───────────────                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │  "We're targeting mid-market enterprise SaaS compan..." │    │   │
│  │  │  Target customer • ● High confidence                    │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │  "Based on our research, we estimate the TAM at..."     │    │   │
│  │  │  Market size • ○ Low confidence                         │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │  [+2 more]                                                       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Divider: 1px slate-100, full width, margin-top: 16px                  │
│  Section title: 11px medium, slate-400, uppercase, tracking-widest     │
│  Topic row: 36px height, flex between                                  │
│  Input card: bg slate-50, rounded-lg, padding 12px, margin-bottom 8px  │
│  Input preview: 14px regular, slate-700, max 2 lines, ellipsis         │
│  Input meta: 12px regular, slate-500                                   │
│  "See more" link: 12px medium, primary, hover: underline               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Domain Progress Bar (Mini)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DOMAIN PROGRESS BAR                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Width: 80px                                                            │
│  Height: 6px                                                            │
│  Border-radius: 9999px (full)                                           │
│  Track: slate-200                                                       │
│  Fill: primary                                                          │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░│    │
│  └────────────────────────────────────────────────────────────────┘    │
│   ├──────────────── 4/5 (80%) ────────────────┤                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.7 Readiness Indicator

Shows snapshot readiness status with suggestions.

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  READINESS INDICATOR - ALL STATES                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MINIMAL STATE                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                          │   │
│  │  │ ◔  │  GETTING STARTED                                        │   │
│  │  └────┘                                                          │   │
│  │        Keep going! More information will make your snapshot      │   │
│  │        more useful.                                              │   │
│  │                                                                  │   │
│  │        ┌─────────────────────────────────────────────────────┐  │   │
│  │        │           Generate Snapshot                          │  │   │
│  │        └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  PARTIAL STATE                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                          │   │
│  │  │ ◐  │  MAKING PROGRESS                                        │   │
│  │  └────┘                                                          │   │
│  │        You're building a foundation. A few more details would    │   │
│  │        help.                                                     │   │
│  │                                                                  │   │
│  │        For better insights:                                      │   │
│  │        • Cover the Operations domain                             │   │
│  │        • Add U.S. presence information (Market)                  │   │
│  │                                                                  │   │
│  │        ┌─────────────────────────────────────────────────────┐  │   │
│  │        │           Generate Snapshot                          │  │   │
│  │        └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  GOOD STATE                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                          │   │
│  │  │ ●  │  LOOKING GOOD                                           │   │
│  │  └────┘                                                          │   │
│  │        You have enough for a useful snapshot. Feel free to add   │   │
│  │        more or generate now.                                     │   │
│  │                                                                  │   │
│  │        ┌─────────────────────────────────────────────────────┐  │   │
│  │        │           Generate Snapshot                          │  │   │
│  │        └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  EXCELLENT STATE                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                          │   │
│  │  │ ✦  │  EXCELLENT COVERAGE                                     │   │
│  │  └────┘                                                          │   │
│  │        Great work! Your snapshot will be comprehensive.          │   │
│  │                                                                  │   │
│  │        ┌─────────────────────────────────────────────────────┐  │   │
│  │        │           Generate Snapshot                          │  │   │
│  │        └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  SPECIFICATIONS:                                                        │
│  ───────────────                                                        │
│  Container: bg white, border slate-200, rounded-xl, padding 20px       │
│                                                                         │
│  Status icon: 32×32px, rounded-lg                                      │
│    - Minimal: bg slate-100, icon slate-400                             │
│    - Partial: bg amber-100, icon amber-600                             │
│    - Good: bg green-100, icon green-600                                │
│    - Excellent: bg emerald-100, icon emerald-600, sparkle animation    │
│                                                                         │
│  Title: 14px semibold, uppercase, tracking-wide                        │
│  Message: 14px regular, slate-600, margin-top 8px                      │
│  Suggestions: 13px regular, slate-500, bullet list, margin-top 12px    │
│                                                                         │
│  Button: Full width, primary style, margin-top 16px                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.8 Progress Header (Assembled)

Complete header component combining all atomic elements.

#### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROGRESS HEADER - DESKTOP (≥768px)                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Height: 64px                                                           │
│  Position: Fixed, top: 0, left: 0, right: 0                            │
│  Background: white                                                      │
│  Border-bottom: 1px solid slate-200                                     │
│  Z-index: 40                                                            │
│  Padding: 0 24px                                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ╭────────╮                                                      │   │
│  │  │        │    M      P      G      O      F       View Details  │   │
│  │  │  68%   │    ●      ●      ◐      ○      ○          →         │   │
│  │  │        │                                         8 inputs     │   │
│  │  ╰────────╯                                                      │   │
│  │                                                                  │   │
│  │  ├── 48px ──┤  ├───────── flex gap-8 ─────────┤  ├── auto ──┤   │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  LAYOUT:                                                                │
│  ───────                                                                │
│  Display: flex                                                          │
│  Align-items: center                                                    │
│  Justify-content: space-between                                         │
│                                                                         │
│  LEFT SECTION: Progress ring                                            │
│  CENTER SECTION: Domain pills (flex, gap-8)                            │
│  RIGHT SECTION: "View Details" button + input count                    │
│                                                                         │
│  "View Details" button:                                                 │
│  - Text: 14px medium, primary                                          │
│  - Arrow: 16px, primary                                                │
│  - Hover: underline                                                     │
│  - Padding: 8px 16px                                                    │
│                                                                         │
│  Input count:                                                           │
│  - Text: 13px regular, slate-500                                       │
│  - Below "View Details"                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROGRESS HEADER - MOBILE (<768px)                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Height: 56px                                                           │
│  Padding: 0 16px                                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │    68%     ●  ●  ◐  ○  ○                               [≡]      │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  CHANGES FROM DESKTOP:                                                  │
│  ─────────────────────                                                  │
│  - Progress shown as text only (no ring)                               │
│  - Text: 16px bold, slate-900                                          │
│  - Domain pills: 24×24px (smaller)                                     │
│  - "View Details" replaced with hamburger/details icon                 │
│  - Icon: 24×24px, slate-600, tap area: 44×44px                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Layout & Composition

### 4.1 Chat Page with Progress Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CHAT PAGE LAYOUT                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PROGRESS HEADER (fixed)                              64px      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │                                                                  │   │
│  │                                                                  │   │
│  │                                                                  │   │
│  │                     CHAT MESSAGES                                │   │
│  │                     (scrollable)                                 │   │
│  │                                                                  │   │
│  │                     Padding-top: 64px (header height)            │   │
│  │                     Padding-bottom: 140px (input + quick)        │   │
│  │                                                                  │   │
│  │                                                                  │   │
│  │                                                                  │   │
│  │                                         ┌─────────────────────┐ │   │
│  │                                         │ NOTIFICATION STACK  │ │   │
│  │                                         │ (fixed, bottom-right)│ │   │
│  │                                         └─────────────────────┘ │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  QUICK RESPONSES (if any)                             ~48px     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CHAT INPUT (fixed)                                   ~80px     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Panel Open State

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CHAT PAGE WITH PANEL OPEN                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────┐ ┌─────────────────┐   │
│  │  PROGRESS HEADER (extends under panel)      │ │                 │   │
│  └─────────────────────────────────────────────┘ │                 │   │
│  ┌─────────────────────────────────────────────┐ │    READINESS    │   │
│  │                                              │ │      PANEL      │   │
│  │                                              │ │                 │   │
│  │               CHAT MESSAGES                  │ │    Width:       │   │
│  │              (dimmed by backdrop)            │ │    400px        │   │
│  │                                              │ │                 │   │
│  │                                              │ │    Height:      │   │
│  │              backdrop: slate-900/20          │ │    100vh        │   │
│  │                                              │ │                 │   │
│  │                                              │ │                 │   │
│  │                                              │ │                 │   │
│  │                                              │ │                 │   │
│  └─────────────────────────────────────────────┘ │                 │   │
│  ┌─────────────────────────────────────────────┐ │                 │   │
│  │  CHAT INPUT (still accessible)              │ │                 │   │
│  └─────────────────────────────────────────────┘ └─────────────────┘   │
│                                                                         │
│  Note: Chat remains interactive but visually de-emphasized             │
│  Panel has focus trap when open                                        │
│  Clicking backdrop closes panel                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Interaction Design

### 5.1 Progress Header Interactions

| Element | Action | Result |
|---------|--------|--------|
| Progress ring | Hover | Show tooltip "Overall assessment progress" |
| Domain pill | Hover (500ms) | Show tooltip with domain name + input count |
| Domain pill | Click | If panel closed: open panel and scroll to domain. If panel open: scroll to domain |
| "View Details" | Click | Open Readiness Panel |
| "View Details" | Keyboard (Enter/Space) | Open Readiness Panel |

### 5.2 Notification Interactions

| Action | Result |
|--------|--------|
| Notification appears | Animate in from right (300ms), auto-dismiss after 3000ms |
| Hover notification | Pause auto-dismiss timer |
| Leave notification | Resume auto-dismiss timer |
| Press Escape | Dismiss all notifications immediately |
| Screen reader | Announces: "Input captured: [topic], [confidence] confidence" |

### 5.3 Panel Interactions

| Action | Result |
|--------|--------|
| Click "View Details" | Panel slides in (300ms ease-out), backdrop fades in |
| Click X button | Panel slides out (200ms ease-in), backdrop fades out |
| Click backdrop | Close panel |
| Press Escape | Close panel |
| Click domain header | Toggle accordion expand/collapse |
| Click "Generate Snapshot" | Navigate to /snapshot |
| Scroll in panel | Panel content scrolls, header stays fixed |
| Tab navigation | Focus moves through interactive elements |
| Panel open | Focus moves to close button |
| Panel close | Focus returns to "View Details" button |

### 5.4 Keyboard Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  KEYBOARD NAVIGATION FLOW                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROGRESS HEADER (Tab order):                                           │
│  ─────────────────────────────                                          │
│  [1] Domain pill: M                                                     │
│  [2] Domain pill: P                                                     │
│  [3] Domain pill: G                                                     │
│  [4] Domain pill: O                                                     │
│  [5] Domain pill: F                                                     │
│  [6] "View Details" button                                              │
│                                                                         │
│  READINESS PANEL (Tab order when open):                                 │
│  ─────────────────────────────────────                                  │
│  [1] Close button (X)                                                   │
│  [2] Market accordion header                                            │
│  [3] Product accordion header                                           │
│  [4] GTM accordion header                                               │
│  [5] Operations accordion header                                        │
│  [6] Financials accordion header                                        │
│  [7] "Generate Snapshot" button                                         │
│                                                                         │
│  When accordion expanded, input cards become tabbable                   │
│  (but typically not needed for keyboard users)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Responsive Design

### 6.1 Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Compact header, full-screen panel |
| Tablet | 640-1023px | Standard header, side panel (360px) |
| Desktop | ≥ 1024px | Full header, side panel (400px) |

### 6.2 Mobile Adaptations

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MOBILE LAYOUT (<640px)                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HEADER:                                                                │
│  ────────                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  68%    ●  ●  ◐  ○  ○                                      [≡]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  - Height: 56px                                                         │
│  - Progress: Text only, 16px bold                                       │
│  - Pills: 24×24px                                                       │
│  - Details: Icon only (24px), touch target 44×44px                     │
│                                                                         │
│  PANEL (full-screen overlay):                                           │
│  ─────────────────────────────                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ← Assessment Progress                                       [X] │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                   │  │
│  │  [Full panel content, scrollable]                                │  │
│  │                                                                   │  │
│  │                                                                   │  │
│  │                                                                   │  │
│  │                                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  - Width: 100%                                                          │
│  - Height: 100vh                                                        │
│  - Animation: Slide up from bottom                                      │
│  - Dismiss: Swipe down gesture (optional enhancement)                   │
│  - Back arrow: 44×44px touch target                                    │
│                                                                         │
│  NOTIFICATIONS:                                                         │
│  ──────────────                                                         │
│  - Same design, but width: calc(100% - 32px)                           │
│  - Max-width: 320px                                                     │
│  - Position: bottom 16px, centered                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Touch Targets

All interactive elements must meet minimum touch target sizes:

| Element | Min Size | Actual Size |
|---------|----------|-------------|
| Domain pills (mobile) | 44×44px | 24×24px visual + padding |
| Details icon (mobile) | 44×44px | 24px icon + 10px padding |
| Close button | 44×44px | 20px icon + 12px padding |
| Accordion header | 48px height | Full width, 48px min-height |
| "Generate Snapshot" button | 48px height | Full width, 48px height |

---

## 7. Accessibility Specifications

### 7.1 ARIA Attributes

```html
<!-- Progress Ring -->
<div
  role="progressbar"
  aria-valuenow="68"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Assessment progress: 68 percent complete"
>
  <svg>...</svg>
</div>

<!-- Domain Pill -->
<button
  aria-label="Market domain: 4 inputs captured, adequate coverage"
  aria-pressed="false"
>
  M
</button>

<!-- Current Domain Pill -->
<button
  aria-label="Product domain: 3 inputs captured, in progress. Current domain."
  aria-current="step"
  aria-pressed="false"
>
  P
</button>

<!-- View Details Button -->
<button
  aria-expanded="false"
  aria-controls="readiness-panel"
  aria-label="View assessment details"
>
  View Details
</button>

<!-- Readiness Panel -->
<aside
  id="readiness-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Assessment Progress"
>
  ...
</aside>

<!-- Notification -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Input captured: Target customer, high confidence
</div>

<!-- Domain Accordion -->
<div>
  <button
    aria-expanded="true"
    aria-controls="market-content"
    id="market-header"
  >
    Market
  </button>
  <div
    id="market-content"
    role="region"
    aria-labelledby="market-header"
    hidden={!expanded}
  >
    ...
  </div>
</div>
```

### 7.2 Focus Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FOCUS MANAGEMENT                                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PANEL OPEN:                                                            │
│  ───────────                                                            │
│  1. Focus moves to close button (first focusable element)              │
│  2. Focus is trapped within panel (Tab cycles through panel elements)  │
│  3. Escape key closes panel                                            │
│                                                                         │
│  PANEL CLOSE:                                                           │
│  ────────────                                                           │
│  1. Focus returns to "View Details" button (trigger element)           │
│                                                                         │
│  ACCORDION EXPAND:                                                      │
│  ─────────────────                                                      │
│  1. Focus remains on accordion header                                  │
│  2. Content becomes available in tab order                             │
│                                                                         │
│  NOTIFICATION APPEAR:                                                   │
│  ────────────────────                                                   │
│  1. Does NOT steal focus                                               │
│  2. Screen reader announces via aria-live                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Color Contrast

All text meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text):

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Progress % | slate-900 | white | 15.3:1 ✓ |
| Domain label | slate-900 | white | 15.3:1 ✓ |
| Confidence High | green-800 | green-100 | 7.1:1 ✓ |
| Confidence Medium | amber-800 | amber-100 | 5.9:1 ✓ |
| Confidence Low | red-800 | red-100 | 6.2:1 ✓ |
| Panel header | slate-900 | white | 15.3:1 ✓ |
| Topic label | slate-700 | white | 8.6:1 ✓ |
| Uncovered topic | slate-400 | white | 3.9:1 ✓ (decorative) |

### 7.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  .progress-ring-fill,
  .notification,
  .panel,
  .backdrop,
  .accordion-content {
    transition: none !important;
    animation: none !important;
  }

  /* Instant state changes instead */
  .panel.open {
    transform: translateX(0);
  }

  .notification.entering {
    opacity: 1;
  }
}
```

---

## 8. Motion & Animation

### 8.1 Animation Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easings */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 8.2 Animation Specifications

#### Progress Ring Fill

```css
.progress-ring-fill {
  transition: stroke-dashoffset var(--duration-normal) var(--ease-out);
}
```

#### Domain Pill Status Change

```css
@keyframes pill-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.domain-pill.status-changed {
  animation: pill-pulse 300ms var(--ease-bounce);
}
```

#### Notification Enter/Exit

```css
@keyframes notification-enter {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes notification-exit {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(50%);
  }
}

.notification.entering {
  animation: notification-enter 300ms var(--ease-out) forwards;
}

.notification.exiting {
  animation: notification-exit 200ms var(--ease-in) forwards;
}
```

#### Panel Slide

```css
.panel {
  transform: translateX(100%);
  transition: transform var(--duration-normal) var(--ease-out);
}

.panel.open {
  transform: translateX(0);
}

.backdrop {
  opacity: 0;
  transition: opacity 200ms var(--ease-out);
}

.backdrop.visible {
  opacity: 1;
}
```

#### Accordion Expand

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-fast) var(--ease-out);
}

.accordion-content.expanded {
  grid-template-rows: 1fr;
}

.accordion-content > div {
  overflow: hidden;
}

.accordion-chevron {
  transition: transform var(--duration-fast) var(--ease-out);
}

.accordion-chevron.expanded {
  transform: rotate(90deg);
}
```

#### Checkmark Draw

```css
@keyframes checkmark-draw {
  0% {
    stroke-dashoffset: 16;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.topic-checkmark {
  stroke-dasharray: 16;
  stroke-dashoffset: 16;
}

.topic-checkmark.visible {
  animation: checkmark-draw 300ms var(--ease-out) forwards;
}
```

### 8.3 Stagger Timing

When multiple notifications appear in quick succession:

```
Notification 1: delay 0ms
Notification 2: delay 50ms
Notification 3: delay 100ms
```

---

## 9. Visual Assets

### 9.1 Icons Required

| Icon | Size | Usage | Source |
|------|------|-------|--------|
| Checkmark | 16px | Topic covered indicator | Lucide: `check` |
| Chevron Right | 16px | Accordion collapsed | Lucide: `chevron-right` |
| Chevron Down | 16px | Accordion expanded | Lucide: `chevron-down` |
| X Close | 20px | Panel close | Lucide: `x` |
| Arrow Left | 20px | Panel back (mobile) | Lucide: `arrow-left` |
| Menu | 24px | Mobile details trigger | Lucide: `menu` |
| Arrow Right | 16px | "View Details" indicator | Lucide: `arrow-right` |
| Circle (filled) | 8px | High confidence | Custom or Lucide: `circle` |
| Circle (half) | 8px | Medium confidence | Custom SVG |
| Circle (empty) | 8px | Low confidence | Custom or `circle` stroke only |
| Sparkle | 16px | Excellent readiness | Lucide: `sparkles` |

### 9.2 Custom Icons

#### Confidence Icons (8×8px)

```svg
<!-- High Confidence (filled circle) -->
<svg width="8" height="8" viewBox="0 0 8 8">
  <circle cx="4" cy="4" r="4" fill="currentColor"/>
</svg>

<!-- Medium Confidence (half circle) -->
<svg width="8" height="8" viewBox="0 0 8 8">
  <path d="M4 0A4 4 0 0 0 4 8V0Z" fill="currentColor"/>
  <circle cx="4" cy="4" r="3.5" stroke="currentColor" fill="none"/>
</svg>

<!-- Low Confidence (empty circle) -->
<svg width="8" height="8" viewBox="0 0 8 8">
  <circle cx="4" cy="4" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
</svg>
```

---

## 10. Implementation Notes

### 10.1 Component Hierarchy

```
ProgressHeader/
├── ProgressRing
├── DomainPillGroup/
│   └── DomainPill (×5)
└── DetailsButton

ReadinessPanel/
├── PanelHeader
├── OverallProgressCard/
│   └── ProgressRing (large)
├── DomainAccordionGroup/
│   └── DomainAccordion (×5)/
│       ├── AccordionHeader
│       ├── TopicChecklist/
│       │   └── TopicRow (×5)
│       └── CapturedInputList/
│           └── CapturedInputCard (×n)
└── ReadinessIndicator/
    ├── StatusIcon
    ├── StatusMessage
    ├── GapSuggestions
    └── GenerateButton

NotificationStack/
└── InputNotification (×3 max)/
    ├── ConfidenceIcon
    ├── NotificationContent
    └── ConfidenceBadge
```

### 10.2 State Dependencies

```typescript
// Components that need progress state
const progressConsumers = [
  'ProgressHeader',      // overall %, domain statuses
  'ReadinessPanel',      // all progress data
  'NotificationStack',   // recent captures
];

// State updates triggered by
const stateUpdateTriggers = [
  'input.captured',      // new input recorded
  'input.updated',       // existing input modified
  'domain.transitioned', // moved to new domain
  'session.recovered',   // session loaded from storage
];
```

### 10.3 Performance Considerations

1. **Progress Ring Animation**: Use CSS transitions, not JS animation
2. **Panel Content**: Lazy load accordion content when expanded
3. **Notification Stack**: Limit to 3; remove oldest when adding new
4. **Large Input Lists**: Virtualize if domain has >10 inputs
5. **State Updates**: Debounce rapid input captures (100ms)

### 10.4 Testing Checklist

#### Visual Tests
- [ ] Progress ring renders correctly at 0%, 50%, 100%
- [ ] All domain pill states display correctly
- [ ] Confidence badges show correct colors
- [ ] Panel slides smoothly on open/close
- [ ] Notifications stack and dismiss properly
- [ ] Mobile layout adapts correctly
- [ ] Dark mode colors (if applicable)

#### Interaction Tests
- [ ] Keyboard navigation works through all elements
- [ ] Focus management on panel open/close
- [ ] Screen reader announces notifications
- [ ] Touch targets meet minimum size
- [ ] Reduced motion respected

#### Integration Tests
- [ ] Progress updates when input captured
- [ ] Panel reflects current progress state
- [ ] Session recovery restores progress
- [ ] Generate Snapshot navigates correctly

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 27, 2026 | UX/UI Design Team | Initial specifications |

---

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Lead Designer | | | Pending |
| Head of Product | | | Pending |
| Engineering Lead | | | Pending |

---

*End of Document*

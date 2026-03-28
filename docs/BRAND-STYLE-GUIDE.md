# Atlas Brand Style Guide

> **Audience:** Designers, engineers, and anyone building Atlas marketing surfaces.
> **Last updated:** March 2026
> **Status:** Living document — update when conventions change.

---

## 1. Brand Identity

### What Atlas is
Atlas is the **AI-powered U.S. expansion readiness tool** for Australian founders. It surfaces the difference between what a founder actually knows and what they're assuming — across 5 critical domains of market entry.

### The core insight
Every failed market expansion has the same root cause: decisions made on incomplete information, with no awareness of which parts were fact and which were assumption. Atlas is the only tool that makes this distinction explicit.

### Brand personality
| Trait | What it means |
|-------|--------------|
| **Authoritative** | We state facts bluntly. No hedging, no "it depends". |
| **Precise** | We distinguish facts from assumptions — our design should too. |
| **Direct** | Short sentences. Clear headlines. Instant comprehension. |
| **Unafraid** | We name the uncomfortable truths that other tools dance around. |
| **Intelligent** | We are not tech-bro hype. We are clear-headed analysts. |

### Brand voice
- **Use:** Short declarative sentences. Active voice. Second person ("you"). Present tense.
- **Avoid:** Jargon, filler words, em dashes (—), passive constructions, AI clichés ("harness", "leverage", "unleash").
- **Tone in headlines:** Confrontational and factual. "Most founders go to the U.S. on assumptions." Not "Discover your readiness."
- **Tone in body:** Direct and empathetic. We know this is hard. We're not judging — we're helping.

---

## 2. Color System

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Ink** | `#0A0A0A` | Hero backgrounds, dark sections, final CTA |
| **Ink-2** | `#111111` | Secondary dark sections (slightly lighter) |
| **Off-White** | `#F5F4EF` | Alternating light sections (warm, not clinical) |
| **White** | `#FFFFFF` | Content sections, cards |
| **Electric Blue** | `#2563EB` | Primary CTA buttons, section labels (on light bg) |
| **Sky Blue** | `#60A5FA` | Accent text on dark backgrounds, icons |
| **Workspace Blue** | `#2383E2` | Existing workspace UI — do not use on marketing |

### Text on Dark Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| Text primary | `text-white` | Main headlines |
| Text secondary | `text-white/60` | Body copy |
| Text tertiary | `text-white/30` | Captions, metadata |
| Text accent | `text-[#60A5FA]` | Highlighted words, section labels |
| Border | `border-white/10` | Card outlines |
| Subtle border | `border-white/[0.06]` | Header/footer dividers |

### Text on Light Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| Text primary | `text-[#0A0A0A]` | Headlines |
| Text secondary | `text-[#787671]` | Body copy |
| Text tertiary | `text-[#9B9A97]` | Captions, metadata |
| Text accent | `text-[#2563EB]` | Section labels, links |
| Border | `border-[#E8E6E1]` | Card outlines |
| Border hover | `border-[#D4D1CB]` | Card hover states |

### Section Color Sequence
The homepage alternates between dark and light for hard visual breaks:
1. Header → `#0A0A0A`
2. Hero → `#0A0A0A`
3. Problem → `#F5F4EF`
4. How it works → `#111111`
5. Domains → `#FFFFFF`
6. Output → `#0A0A0A`
7. VS Alternatives → `#F5F4EF`
8. Who it's for → `#FFFFFF`
9. Final CTA → `#0A0A0A`
10. Footer → `#0A0A0A`

---

## 3. Typography

### Font
**Inter** — used at all weights. No secondary typeface.

```css
font-family: 'Inter', system-ui, sans-serif;
font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1;
```

### Marketing Type Scale

| Role | Classes | Size | Weight | Tracking | Leading |
|------|---------|------|--------|----------|---------|
| **Hero display** | `text-[72px] md:text-[96px] font-black tracking-[-0.04em] leading-[0.9]` | 72–120px | 900 | -0.04em | 0.9 |
| **Section headline** | `text-[36px] md:text-[48px] font-black tracking-[-0.03em] leading-[1.05]` | 36–48px | 900 | -0.03em | 1.05 |
| **CTA headline** | `text-[52px] md:text-[88px] font-black tracking-[-0.04em] leading-[0.9]` | 52–88px | 900 | -0.04em | 0.9 |
| **Card title** | `text-[20px] font-bold tracking-[-0.02em]` | 20px | 700 | -0.02em | default |
| **Body large** | `text-[18px] leading-[1.5]` | 18px | 400 | none | 1.5 |
| **Body** | `text-[15px] leading-[1.6]` | 15px | 400 | none | 1.6 |
| **Section label** | `text-[12px] font-bold uppercase tracking-[0.1em]` | 12px | 700 | 0.1em | default |
| **Caption** | `text-[13px]` | 13px | 400–500 | none | default |
| **Step number** | `text-[64px] font-black tracking-[-0.04em] leading-[1]` | 64px | 900 | -0.04em | 1 |

### Typography Rules
1. **Headlines must be ultra-tight.** Use `tracking-[-0.04em]` for display, `tracking-[-0.03em]` for section heads. Never positive tracking on headlines.
2. **Hero leading must be below 1.** Use `leading-[0.9]` to `leading-[0.95]` for display headlines. This creates the "stacked block" editorial look.
3. **Font weight 900 for impact, 700 for structure, 400 for body.** No 600 in marketing.
4. **No gradients on headline text** except where explicitly approved. Gradient text is reserved for the workspace's `.text-gradient` class.

---

## 4. Logo

### Variants
| Variant | File | Background |
|---------|------|------------|
| `blue` | `/logo-blue.png` | Dark backgrounds (blue background, white pattern) |
| `dark` | `/logo-dark.png` | Light/white backgrounds (dark background, white/grey pattern) |

### Sizing
| Context | Size |
|---------|------|
| Marketing header (dark) | 28px |
| Marketing header (light) | 28px |
| Footer | 22px |
| Welcome modal | 48px |
| Workspace top bar | 28px |

### Usage rules
- Always pair with the wordmark "Atlas" in the same header
- Never stretch or distort — use `style={{ width: size, height: size }}` via `AtlasLogo`
- On dark sections, use `variant="blue"`
- On light/white sections, use `variant="dark"`

---

## 5. Buttons

### Primary CTA (dark sections)
```html
<a class="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white
          text-[16px] font-semibold rounded-xl hover:bg-[#1D4ED8]
          transition-all active:scale-[0.98]">
  Label
</a>
```

### Primary CTA — Large (hero sections)
```html
<a class="inline-flex items-center gap-2.5 px-10 py-5 bg-[#2563EB] text-white
          text-[18px] font-semibold rounded-xl hover:bg-[#1D4ED8]
          transition-all active:scale-[0.98]">
  Label
</a>
```

### Secondary/Ghost (dark sections)
```html
<a class="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-white
          text-[14px] font-medium rounded-lg hover:bg-white/[0.08]
          hover:border-white/30 transition-all">
  Label
</a>
```

### Secondary (light sections)
```html
<a class="inline-flex items-center gap-2 px-8 py-3 border border-[#E8E6E1]
          text-[#0A0A0A] text-[15px] font-medium rounded-xl
          hover:border-[#D4D1CB] hover:bg-[#F5F4EF] transition-all">
  Label
</a>
```

---

## 6. Cards

### Marketing card (light sections)
```html
<div class="p-6 border border-[#E8E6E1] rounded-xl
            hover:border-[#D4D1CB] hover:shadow-sm transition-all">
  content
</div>
```

### Dark card (dark sections)
```html
<div class="p-6 border border-white/10 rounded-xl">
  content
</div>
```

### Comparison card — "bad" (light background)
```html
<div class="p-8 bg-white rounded-2xl border border-[#E8E6E1]">
  content
</div>
```

### Comparison card — "good" (dark inverted)
```html
<div class="p-8 bg-[#0A0A0A] rounded-2xl">
  content
</div>
```

---

## 7. Section Labels

All sections open with a small uppercase label line:
```html
<p class="text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] mb-4">
  Section name
</p>
```
On dark backgrounds, swap to `text-[#60A5FA]`.

---

## 8. Layout

### Max widths
| Context | Value |
|---------|-------|
| Marketing page container | `max-w-[1140px] mx-auto` |
| Headline max width | `max-w-[900px]` (hero) / `max-w-[600px]` (sections) |
| Body copy max width | `max-w-[560px]` (hero sub) / `max-w-[480px]` (CTA) |

### Section padding
| Screen | Vertical padding |
|--------|-----------------|
| Mobile | `py-20` (80px) |
| Desktop | `py-24 md:py-32` (96–128px) |
| Final CTA | `py-32 md:py-40` (128–160px) |

### Horizontal padding
Always `px-6` on section, max-width container constrains content.

### Grid "gap as border" technique
For stat blocks with visible dividers (no borders), use:
```html
<div class="grid md:grid-cols-3 gap-px bg-[#E8E6E1]">
  <div class="bg-[#F5F4EF] px-8 py-10">...</div>
  <div class="bg-[#F5F4EF] px-8 py-10">...</div>
  <div class="bg-[#F5F4EF] px-8 py-10">...</div>
</div>
```
The `gap-px` + parent background color creates hairline dividers.

---

## 9. Section Anatomy

Every marketing section follows this structure:
1. **Section label** (12px, uppercase, tracking-wide, brand blue)
2. **Headline** (ultra-tight, font-black)
3. **Body / subhead** (optional — max-w-[480–560px])
4. **Content block** (grid, list, cards, comparison)
5. **CTA** (optional — only on hero and final CTA sections)

---

## 10. Animation Principles

- **Transitions:** `transition-all` with `duration-200` (fast, snappy)
- **Hover:** Color/border changes only. No transforms except buttons.
- **Button press:** `active:scale-[0.98]` — subtle but tactile
- **Entrance animations:** Use existing `.animate-in` classes sparingly. Never animate the hero headline itself — it should appear immediately.
- **No infinite animations** on marketing pages except the workspace's shimmer and typing-dot patterns.

---

## 11. Do's and Don'ts

### Do
- Use ultra-tight negative tracking on all headlines
- Alternate dark/light sections for visual rhythm
- State uncomfortable truths plainly in copy
- Use `font-black` (900) for all display and section headings
- Lead with the problem, not the solution

### Don't
- Use gradient text on marketing pages (reserved for workspace `.text-gradient`)
- Use `font-semibold` (600) for marketing headlines — use 700 or 900
- Use em dashes (—) in any copy
- Add decorative illustrations or stock imagery
- Soften the messaging with qualifiers ("potentially", "can help", "might")
- Use `#2383E2` (workspace blue) on marketing — use `#2563EB` instead

---

## 12. Workspace vs. Marketing

Marketing pages use a bold, high-contrast palette:
- `#0A0A0A` / `#F5F4EF` / `#FFFFFF` alternation, `#2563EB` blue

The workspace uses the same accent blue (`#2563EB`) and off-white (`#F5F4EF`) as marketing, but layered with domain colors for the topic accordion rows.

Do not use legacy warm-tone workspace blue `#2383E2` anywhere — all workspace and marketing blue is `#2563EB`.

---

## 13. Workspace Design System

### Topic Accordion Rows

Full-width horizontal rows with domain primary color at decreasing opacity per row index:

| Index | Opacity | Class pattern |
|-------|---------|---------------|
| 0 (Topic 1) | 0.75 | `rgba(primary, 0.75)` — darkest |
| 1 (Topic 2) | 0.60 | `rgba(primary, 0.60)` |
| 2 (Topic 3) | 0.45 | `rgba(primary, 0.45)` |
| 3 (Topic 4) | 0.30 | `rgba(primary, 0.30)` |
| 4 (Topic 5) | 0.18 | `rgba(primary, 0.18)` — lightest |

Row anatomy:
```
px-10 py-6 | Topic label (18px semibold) | StatusPill | ChevronDown
```

Text on rows: `text-white` for all domains except Financials → `text-[#0A0A0A]` (via `dc.textOnPrimary`).

Expanded state: white `bg-white` content area opens below the colored header row. No card borders or rounding.

### Status Pill (on topic row)

```
bg-white/20 rounded-full px-3 py-1 text-[12px] font-semibold
```

States:
- `Not Started` — plain text
- `In Progress` — pulsing dot + text
- `★ High` — star icon + text (complete, high confidence)
- `◑ Medium` — half-circle icon + text
- `○ Low` — circle icon + text
- `Skipped` — plain text

### Confidence Badges

Solid flat badges — no rounded pill, no dot indicator.

| Level | Background | Text |
|-------|-----------|------|
| High | `bg-[#0F7B6C]` | `text-white` |
| Medium | `bg-[#D9730D]` | `text-white` |
| Low | `bg-[#E03E3E]` | `text-white` |
| Not Started | `bg-[#E8E6E1]` | `text-[#787671]` |

Classes: `px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]`

### Confidence Dots

Three dots showing confidence level. Filled color matches confidence semantic color; unfilled is `#E8E6E1`.

| Level | Filled | Color |
|-------|--------|-------|
| High | 3/3 | `#0F7B6C` (teal) |
| Medium | 2/3 | `#D9730D` (orange) |
| Low | 1/3 | `#E03E3E` (red) |

Dot size: `h-2 w-2 rounded-full`

### Sidebar Navigation

Domain-only navigation — no topic tree. Each domain row:
- Height: `h-[40px]`
- Status dot (left) + domain name (uppercase bold, domain color) + count (right)
- Selected: `border-l-2` in `dc.primary` + `backgroundColor: dc.primary + '0F'`
- Hover: `bg-[#F5F4EF]`

### Accent Color

All workspace interactive elements (buttons, links, focus rings) use `#2563EB`. This is the same as the marketing accent — unified across surfaces.

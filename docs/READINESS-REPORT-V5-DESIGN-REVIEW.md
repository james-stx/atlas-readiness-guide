# Readiness Report V5 — Design Review

**Date:** 2026-02-15
**Author:** Lead Designer
**Status:** Design Review Complete
**Reference:** READINESS-REPORT-V5-PRD.md

---

## Executive Summary

The V5 PRD correctly identifies the core problem: the report was duplicating console data instead of synthesizing it. The proposed structure is sound. This design review provides implementation guidance, visual specifications, and refinements to ensure the report delivers on its value proposition.

**Verdict:** Approved with design enhancements noted below.

---

## Part 1: Overall Design Philosophy

### 1.1 The Report as a "Consultant Deliverable"

The report should feel like what a paid consultant would deliver after reviewing the user's inputs. This means:

- **Professional but approachable** — Not corporate sterile, but not casual either
- **Opinionated** — Clear recommendations, not hedging
- **Evidence-based** — Every statement traces to user input
- **Scannable** — Executive summary at top, detail below

### 1.2 Visual Hierarchy Principles

1. **Verdict first** — The answer to "Am I ready?" is visible without scrolling
2. **Color communicates status** — Teal/amber/red instantly convey meaning
3. **White space signals importance** — More padding = more important
4. **Typography creates rhythm** — Headers, body, captions in clear cascade

### 1.3 The "Glance Test"

A user should understand their status within 3 seconds of viewing the report:
- Incomplete? They see progress bar + "X of 25"
- Ready? They see teal badge + "Ready to Execute"
- Not Ready? They see red badge + specific blockers

---

## Part 2: Incomplete Assessment Design

### 2.1 Assessment Progress Component

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ○ Incomplete Assessment                — 10/25 topics (40%)            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  60% needed   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Market       ●●●●●  5/5  ✓                                             │
│  Product      ●●●●●  5/5  ✓                                             │
│  GTM          ○○○○○  0/5  Need 2+                                       │
│  Operations   ○○○○○  0/5  Need 2+                                       │
│  Financials   ○○○○○  0/5  Need 2+                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Card padding: 20px
- Header: 15px/600, status icon + text on one line
- Progress bar: 8px height, rounded-full, #37352F fill, #E8E6E1 empty
- "60% needed" marker: 12px text, positioned at 60% point
- Domain rows: Single line each, 32px height
  - Name: 80px width, 13px/500
  - Dots: 5 filled/empty circles, 8px each, 4px gap
  - Count: 12px, #5C5A56
  - Status: 11px, "Need 2+" in #D9730D or ✓ in #0F7B6C

**Interaction:**
- Clicking "Continue Assessment" goes to workspace
- Clicking a specific domain goes to that domain in workspace (if supported)

### 2.2 Early Signals Component

**Design principle:** These cards should feel insightful, not data-heavy.

**Layout per signal:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                 STRENGTH │
│                                                                          │
│  Strong product-market foundation                                        │
│                                                                          │
│  Your Market and Product domains show alignment: you've identified a    │
│  clear ICP (50-500 employee SMBs) and built a product that addresses    │
│  their specific pain points.                                             │
│                                                                          │
│  Derived from: Target customer profile, What you're selling             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Card background: White
- Card border: 1px #E8E6E1
- Type badge: Top-right corner
  - STRENGTH: #0F7B6C text
  - PATTERN: #2383E2 text
  - RISK: #D9730D text
  - UNKNOWN: #9B9A97 text
- Title: 14px/600, #37352F
- Description: 13px/400, #5C5A56, line-height 1.5
- "Derived from" footer: 12px, #9B9A97
- Card padding: 16px
- Gap between cards: 12px

**Content rules:**
- Maximum 4 signals (prevent overwhelm)
- Each signal: max 3 sentences
- "Derived from" lists max 3 topic names

### 2.3 What You'll Unlock Component

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Complete Your Assessment to Unlock                                      │
│                                                                          │
│  ┌────────┐  Readiness Verdict                                          │
│  │   🎯   │  Clear assessment: Ready / Ready with Caveats / Not Ready   │
│  └────────┘  with domain-by-domain confidence breakdown                  │
│                                                                          │
│  ┌────────┐  Critical Blockers                                           │
│  │   ⚠️   │  Specific issues that could derail your expansion           │
│  └────────┘  with source traceability and recommended actions            │
│                                                                          │
│  ┌────────┐  Assumptions to Validate                                     │
│  │   ❓   │  Beliefs embedded in your plan that need testing             │
│  └────────┘  before committing resources                                 │
│                                                                          │
│  ┌────────┐  30-Day Action Plan                                          │
│  │   📋   │  Prioritized, sequenced actions organized by week            │
│  └────────┘  with dependency mapping                                     │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                   Continue Assessment  →                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Header: 15px/600, #37352F
- Icon containers: 32px × 32px, rounded-lg
  - Readiness: #DDEDEA bg, Target icon in #0F7B6C
  - Blockers: #FBE4E4 bg, AlertTriangle icon in #E03E3E
  - Assumptions: #FAEBDD bg, HelpCircle icon in #D9730D
  - Action Plan: #DDEBF1 bg, ListChecks icon in #2383E2
- Item title: 13px/600, #37352F
- Item description: 12px/400, #5C5A56
- CTA button: Full width, 44px height, #2383E2 bg, white text, 14px/500, rounded-lg

### 2.4 Recommended Next Topics Component

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Recommended Next Topics                                                 │
│  Based on your coverage, these will unlock the most insight              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  1  GTM → Sales model                              HIGH IMPACT    │ │
│  │                                                                    │ │
│  │  Why: Your product-market fit is strong, but we can't assess your │ │
│  │  ability to capture this market without understanding your sales   │ │
│  │  approach.                                                         │ │
│  │                                                                    │ │
│  │  Unlocks: GTM confidence • Sales-related blockers • Channel recs  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ... (2 more recommendations) ...                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Priority number: 14px/700, #37352F, circular bg #FAF9F7
- Topic path: 14px/600, #37352F
- Impact badge: 11px/500 uppercase, #0F7B6C
- "Why" label: 12px/500, #9B9A97
- Why content: 13px/400, #5C5A56
- "Unlocks" footer: 12px, #9B9A97, bullet-separated list

---

## Part 3: Complete Assessment Design

### 3.1 Assessment Overview (Verdict)

**Layout for "Ready with Caveats":**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                               bg: #FAEBDD (amber)  │ │
│  │                                                                    │ │
│  │  ◐  Ready with Caveats                         18/25 topics (72%) │ │
│  │                                                                    │ │
│  │  Strong market validation and product readiness. However, your     │ │
│  │  GTM approach has gaps and operational plans are underspecified.   │ │
│  │  Address the blockers below before major investment.               │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Market       ●●●●● 5/5   HIGH                                          │
│  Product      ●●●●● 5/5   HIGH                                          │
│  GTM          ●●●○○ 3/5   MED                                           │
│  Operations   ●●○○○ 2/5   LOW                                           │
│  Financials   ●●●●● 5/5   HIGH                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**

**Verdict card:**
- Padding: 16px
- Border-radius: 8px
- Background colors:
  - Ready: #DDEDEA
  - Ready with Caveats: #FAEBDD
  - Not Yet Ready: #FBE4E4
- Icon: 16px, color matches readiness
- Level text: 15px/600, color matches readiness
- Coverage stat: 12px, #5C5A56, right-aligned
- Summary text: 13px/400, #5C5A56, margin-top 8px

**Domain rows:**
- Height: 28px each
- Name: 80px width, 13px/500, #37352F
- Dots: 5 filled circles, colored by confidence
  - HIGH filled: #37352F
  - Unfilled: #D4D1CB
- Count: 12px, #5C5A56
- Confidence badge: 10px/500 uppercase
  - HIGH: #0F7B6C
  - MED: #D9730D
  - LOW: #E03E3E

### 3.2 Critical Actions (Blockers) Section

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Critical Actions                        Address before major investment │
│                                                                 2 items │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  ┌───┐                                            bg: #FBE4E4      │ │
│  │  │ 1 │  U.S. sales leadership undefined                            │ │
│  │  └───┘                                                              │ │
│  │                                                                    │ │
│  │  Source: GTM → Sales model (not covered)                           │ │
│  │                                                                    │ │
│  │  Your GTM plan depends on U.S. sales leadership, but you haven't  │ │
│  │  defined the role or begun sourcing. This blocks your entire      │ │
│  │  go-to-market timeline.                                            │ │
│  │                                                                    │ │
│  │  Action: Define hiring profile and begin sourcing within 2 weeks  │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Section header: 16px/600, #E03E3E
- Subtitle: 12px, #9B9A97
- Count badge: 12px, #9B9A97
- Blocker cards:
  - Background: #FBE4E4
  - Left border: 4px solid #E03E3E
  - Border-radius: 8px
  - Padding: 16px
  - Priority badge: 14px/700, #E03E3E
  - Title: 14px/600, #37352F
  - Source line: 12px, #9B9A97
  - Description: 13px/400, #5C5A56
  - Action line: 13px/400, "Action:" in 13px/500 #37352F

### 3.3 Assumptions Section

**Same structure as blockers but with amber theme:**
- Header: #D9730D
- Card background: #FAEBDD
- Left border: 4px solid #D9730D
- Icon: ◐ (half-circle) instead of number
- "Validate:" instead of "Action:"

### 3.4 30-Day Action Plan Section

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  30-Day Action Plan                                                      │
│                                                                          │
│  WEEK 1 — Foundation                                                     │
│  │                                                                       │
│  │  □  Define U.S. sales leader hiring profile                          │
│  │     GTM → Sales model                                                 │
│  │     Unblocks: GTM timeline, revenue projections                      │
│  │                                                                       │
│  │  □  Schedule regulatory consultation                                  │
│  │     Operations → Compliance                                           │
│  │     Unblocks: Product roadmap decisions                               │
│  │                                                                       │
│  WEEK 2 — Validation                                                     │
│  │                                                                       │
│  │  □  Run pricing validation with 5 prospects                          │
│  │     ...                                                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Section header: 16px/600, #2383E2
- Week header: 13px/600 uppercase, #37352F + 12px #9B9A97 subtitle
- Timeline line: 2px #E8E6E1 vertical left border
- Checkbox: 16px × 16px, rounded, 2px border #D4D1CB
- Action text: 14px/400, #37352F
- Source line: 12px, #9B9A97
- Unblocks line: 12px, "Unblocks:" in 12px/500 #37352F

---

## Part 4: Component Specifications

### 4.1 Shared Components

**Card Container:**
```css
.report-card {
  background: #FFFFFF;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  padding: 20px;
}
```

**Section Spacing:**
- Between major sections: 24px
- Between cards within section: 12px
- Report max-width: 720px
- Page padding: 24px horizontal

### 4.2 Typography Scale

| Use | Size | Weight | Color |
|-----|------|--------|-------|
| Page title | 22px | 600 | #37352F |
| Section header | 16px | 600 | varies |
| Card title | 14-15px | 600 | #37352F |
| Body text | 13-14px | 400 | #5C5A56 |
| Captions/meta | 11-12px | 400-500 | #9B9A97 |
| Labels | 11px | 500 | uppercase |

### 4.3 Icon Usage

Use Lucide icons consistently:
- Target: Readiness verdict
- AlertTriangle: Blockers/critical
- HelpCircle: Assumptions
- ListChecks: Action plan
- ArrowRight: CTAs and navigation
- Compass: Report branding
- RefreshCw: Regenerate button

---

## Part 5: Interaction Design

### 5.1 Report Generation Flow

```
User clicks "Generate Report"
         ↓
Loading state (2-5 seconds)
- Spinner centered
- "Analyzing your inputs..."
- Progress indicator if possible
         ↓
Report renders
- Scroll position at top
- All sections visible (no lazy loading)
```

### 5.2 Regeneration

- "Refresh" button in header (subtle, not prominent)
- Confirms action: "Regenerate will create a new report with your latest inputs."
- Loading state replaces report content
- New report appears in place

### 5.3 Export Actions

**PDF Download:**
- Generates client-side or via API
- Filename: `atlas-readiness-report-{date}.pdf`
- Toast confirmation: "Report downloaded"

**Email:**
- Modal with email input
- Pre-filled with session email
- Option to add additional recipients
- Confirmation: "Report sent to {email}"

---

## Part 6: Responsive Behavior

### 6.1 Mobile (< 640px)

- Single column layout
- Domain dots become inline text: "5/5 HIGH"
- Cards stack vertically
- Reduce padding to 16px
- CTA buttons full width

### 6.2 Print Styles

```css
@media print {
  .header, .export-section { display: none; }
  .report-card { break-inside: avoid; }
  body { background: white; }
  .cta-button { display: none; }
}
```

---

## Part 7: Design Refinements for V5 PRD

### 7.1 Assessment Progress Enhancement

**Recommendation:** Add visual distinction between "on track" and "needs attention" domains.

- Domains with ≥ 2 topics: Normal styling
- Domains with < 2 topics: Amber text, "Need 2+" label
- Domains with 0 topics: Lighter styling (grayed dots)

### 7.2 Early Signals Polish

**Recommendation:** Add subtle left border to signals by type:

- STRENGTH: 3px left border #0F7B6C
- PATTERN: 3px left border #2383E2
- RISK: 3px left border #D9730D
- UNKNOWN: 3px left border #9B9A97

This creates visual continuity with the blocker/assumption card treatment.

### 7.3 Empty State Handling

**When complete but no blockers/assumptions:**

Show a positive affirmation:
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ✓  You're Ready to Execute                                             │
│                                                                          │
│  No critical blockers or major assumptions to address.                   │
│                                                                          │
│  Recommended next steps:                                                 │
│  → Set up your U.S. legal entity if not established                    │
│  → Begin executing your go-to-market plan                               │
│  → Monitor early metrics and adjust based on feedback                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Source Traceability Formatting

**Recommendation:** Consistent format across all cards:

```
Source: {Domain} → {Topic} ({status})

Examples:
Source: GTM → Sales model (not covered)
Source: Operations → Compliance (LOW confidence)
Source: Financials → Pricing strategy (MEDIUM confidence)
```

Style: 12px, #9B9A97, with → in same color

---

## Part 8: Design Sign-off

**Approved elements:**
- [x] Overall report structure (incomplete vs. complete states)
- [x] Color system and visual hierarchy
- [x] Typography scale
- [x] Card component patterns
- [x] Blocker/assumption card design
- [x] 30-day action plan format

**Ready for implementation:**
The V5 PRD with these design specifications is approved for implementation.

---

**Lead Designer Signature:** ____________________

**Date:** 2026-02-15

# V3 Redesign Plan — Founder Feedback Response

**Date:** 2025-02-06
**Status:** Draft for review
**Addresses:** Founder feedback on V2 workspace UX

---

## Founder Feedback Summary

| # | Feedback | Severity | Current State |
|---|----------|----------|---------------|
| 1 | Left + middle should ALWAYS be visible. Chat appears only when a category is selected. | Critical | Chat is always visible; content panel hides in "chat-first" stage |
| 2 | Clear distinction between left toolbar (navigation) and middle screen (inputs/progress) | High | Sidebar and content panel look too similar — both use white backgrounds with minimal differentiation |
| 3 | Left toolbar doesn't look like Notion/Den | High | Current sidebar uses basic list with status icons; lacks the warmth, hierarchy, and polish of reference UIs |
| 4 | Overall UI isn't minimal/modern/modular enough like Notion/Den | High | Current design is functional but generic — needs warmer tones, better typography scale, more considered spacing |
| 5 | Middle screen doesn't show enough insight/value per category | Critical | Only shows: user quote, confidence badge, edit/view buttons. Significant data is available but unused |

---

## Architectural Changes

### 1. Panel Visibility Model (Feedback #1)

**Current behavior:**
```
NEW USER:    [---- Full-width Chat ----]  (no sidebar, no content)
AFTER INPUT: [Sidebar | Content | Chat ]  (all three panels)
```

**New behavior:**
```
ALWAYS:      [Sidebar | Content Panel  ]  (always visible)
ON SELECT:   [Sidebar | Content | Chat ]  (chat slides in from right)
```

**Rules:**
- Sidebar and Content Panel are ALWAYS visible on desktop/tablet
- Chat Panel is HIDDEN by default
- Chat Panel appears when:
  - User clicks a specific category/topic in the Content Panel
  - User clicks "Discuss" on a category card
  - User clicks a topic in the Sidebar
- Chat Panel disappears when:
  - User clicks the close button on Chat
  - User presses Escape
- On first visit (no inputs yet), Content Panel shows an onboarding state that invites the user to select a topic to begin

**Files affected:**
- `workspace-context.tsx` — Remove `workspaceStage` / `chat-first` logic. Replace with simpler `isChatOpen` + `chatTrigger` (which category opened it)
- `WorkspaceLayout.tsx` — Remove conditional content panel rendering. Sidebar + Content always render. Chat slides in/out.
- `ContentPanel.tsx` — Add onboarding empty state for first-time users
- `ChatPanel.tsx` — Add slide-in animation, context-aware header showing which category is being discussed

**Mobile behavior:**
- Keep tab-based navigation (Domains / Content / Chat)
- Default tab: Content (not Chat)
- Chat tab shows disabled state until a category is selected

### 2. Sidebar ↔ Content Visual Distinction (Feedback #2)

**Current:** Both panels have white backgrounds, minimal visual separation.

**New approach (inspired by Notion/Den):**

| Element | Sidebar | Content Panel |
|---------|---------|---------------|
| Background | Warm off-white `#F8F7F4` | Pure white `#FFFFFF` |
| Role | Navigation + progress overview | Deep-dive into selected domain |
| Border | Right border `#E8E6E1` | None (stands on its own) |
| Width | 240px fixed | flex-1 (max 720px centered) |
| Typography | 13-14px, medium weight | 15-16px, regular weight |
| Density | Compact, scannable | Spacious, readable |

The warm sidebar background creates a clear "navigation panel" feel (like Notion's sidebar) while the white content area reads as the primary workspace.

**Files affected:**
- `globals.css` — Add sidebar-specific CSS variables
- `tailwind.config.ts` — Add sidebar color tokens
- `Sidebar.tsx` — Apply warm background
- `WorkspaceLayout.tsx` — Add border treatment between panels

### 3. Sidebar Redesign (Feedback #3)

See **[DESIGN-SYSTEM-V3.md](./DESIGN-SYSTEM-V3.md)** for full visual spec.

**Key changes:**
- Warm off-white background (`#F8F7F4`) like Notion
- 8px border-radius on all hover states
- Subtle hover: `#EFEEE9` background shift
- Section spacing (8px gaps) instead of dividers
- Domain items: cleaner layout with progress inline
- Topic items: softer tree lines, better indentation
- Footer: minimal, no heavy borders
- Typography: Inter/system sans-serif, 13px items, 11px section headers
- Icons: outlined monochrome style, 16px

**Files affected:**
- `Sidebar.tsx` — Complete reskin
- `SidebarDomainItem.tsx` — New layout, hover states, progress display
- `SidebarTopicItem.tsx` — Softer tree lines, better spacing
- `SidebarFooter.tsx` — Minimal redesign

### 4. Global UI Polish (Feedback #4)

See **[DESIGN-SYSTEM-V3.md](./DESIGN-SYSTEM-V3.md)** for full spec.

**Summary of changes:**

| Area | Current | V3 Target |
|------|---------|-----------|
| Text color | `neutral-900` (#171717) | Warm charcoal `#37352F` (Notion-style) |
| Muted text | `neutral-500` (#737373) | Warm gray `#9B9A97` |
| Borders | `neutral-200` (#E5E5E5) | Warm `#E8E6E1`, used sparingly |
| Border radius | Mixed 8-12px | Consistent 8px (cards, buttons, hover) |
| Spacing grid | Inconsistent | 8px base grid throughout |
| Typography | System defaults | Inter, tighter scale, medium weight for UI |
| Shadows | Basic shadows | Near-zero shadows; depth via background color |
| Content width | Unconstrained | Max 720px centered (optimal reading width) |
| Animations | Basic | Subtle slide/fade transitions (150-200ms) |

**Files affected:**
- `tailwind.config.ts` — New color palette, spacing scale
- `globals.css` — CSS custom properties, warm palette
- `button.tsx` — Subtler styles matching Notion's button aesthetic
- `TopBar.tsx` — Cleaner, more minimal top bar
- All workspace components — Apply new tokens

### 5. Enhanced Content Panel (Feedback #5)

See **[CONTENT-PANEL-V3-SPEC.md](./CONTENT-PANEL-V3-SPEC.md)** for full spec.

**Current category card shows:**
- User's quote (verbatim captured input)
- Confidence badge (high/medium/low)
- Edit / View in Chat buttons

**V3 category card shows:**

```
┌─────────────────────────────────────────────────┐
│ Why expand to the U.S.?                    HIGH │
│                                                 │
│ KEY INSIGHT                                     │
│ Strong demand signals from enterprise SaaS      │
│ companies in the U.S. market, with inbound      │
│ inquiries increasing 40% quarter over quarter.  │
│                                                 │
│ YOUR INPUT                                      │
│ "We've been getting a lot of inbound from U.S.  │
│ enterprise companies. About 40% more inquiries  │
│ this quarter compared to last..."               │
│                                                 │
│ WHAT THIS MEANS                                 │
│ ✓ Clear demand signal identified                │
│ ✓ Quantitative evidence provided                │
│ △ Consider: Is this pull from a specific        │
│   vertical or broad-based?                      │
│                                                 │
│ ─────────────────────────────────────────────── │
│ Captured 2h ago · Discussed in Market chat      │
│                          [Discuss] [Edit] [···] │
└─────────────────────────────────────────────────┘
```

**New data layers per category:**

1. **Key Insight** (AI-generated summary) — A concise synthesis of the user's input, distilled to the actionable takeaway. Generated at capture time by the AI agent.

2. **Your Input** (verbatim quote) — The user's own words, preserved as-is. Collapsible if long.

3. **What This Means** (AI analysis) — Strengths identified (checkmarks), areas to explore further (triangles). Tells the user what their input implies for readiness.

4. **Metadata footer** — When it was captured, which domain chat it came from.

5. **Actions** — "Discuss" (opens chat to this topic), "Edit" (modify input), overflow menu (remove).

**Domain-level enhancements:**

```
┌─────────────────────────────────────────────────┐
│ Market Readiness                          3/5   │
│ Understanding the U.S. market opportunity       │
│                                                 │
│ DOMAIN SUMMARY                                  │
│ Strong market signals with quantitative         │
│ evidence. Key gap: no competitive analysis      │
│ or market sizing provided yet.                  │
│                                                 │
│ CONFIDENCE BREAKDOWN                            │
│ ●●● High (2)  ●● Medium (1)  ○ Low (0)        │
│                                                 │
│ SUGGESTED NEXT                                  │
│ → Market size estimate — most impactful         │
│   missing input for this domain                 │
└─────────────────────────────────────────────────┘
```

New domain header elements:
- **Domain Summary** — AI-generated 1-2 sentence synthesis across all inputs in this domain
- **Confidence Breakdown** — Visual dots showing distribution of high/medium/low inputs
- **Suggested Next** — Recommends which uncovered topic to tackle next, based on impact

**Implementation approach:**
- Extend the AI conversation agent to return structured metadata with each input capture (key insight, analysis points)
- Store these in the `input.metadata` field (already exists, currently unused)
- Add a domain summary generation call when navigating to a domain with 2+ inputs
- Cache domain summaries to avoid repeated API calls

**Files affected:**
- `CategoryCard.tsx` — Complete redesign with new data layers
- `ContentDomainHeader.tsx` — Add domain summary, confidence breakdown, suggested next
- `ContentPanel.tsx` — New layout accommodating richer cards
- `NotStartedCard.tsx` — More inviting design with context on why this topic matters
- API: `conversation.ts` — Extend AI to return structured metadata per input
- API: New endpoint or extension for domain summary generation

---

## Implementation Phases

### Phase 1: Layout & Panel Logic (Feedback #1, #2)
**Scope:** Change panel visibility model, add visual distinction
**Risk:** Low — structural change, no new data needed
**Effort:** Small

1. Update `workspace-context.tsx` — remove chat-first stage, sidebar/content always visible
2. Update `WorkspaceLayout.tsx` — new panel layout with chat slide-in
3. Add warm sidebar background and border treatment
4. Add content panel onboarding state for first-time users
5. Update mobile tab defaults

### Phase 2: Design System V3 (Feedback #3, #4)
**Scope:** Apply Notion/Den-inspired visual language across all components
**Risk:** Medium — touches many files, visual regression possible
**Effort:** Medium

1. Update `tailwind.config.ts` with V3 tokens (warm palette, 8px grid)
2. Update `globals.css` with new CSS custom properties
3. Reskin Sidebar components (Sidebar, SidebarDomainItem, SidebarTopicItem, SidebarFooter)
4. Reskin TopBar
5. Update shared UI components (button, badges, progress bars)
6. Apply to Content Panel shell (headers, card containers)

### Phase 3: Content Panel Intelligence (Feedback #5)
**Scope:** Add AI-generated insights, richer data display
**Risk:** High — requires API changes, AI prompt engineering, new data flow
**Effort:** Large

1. Extend AI conversation agent to return structured metadata (key insight, analysis)
2. Update input capture to store metadata
3. Redesign CategoryCard with new data layers
4. Redesign ContentDomainHeader with domain summary
5. Add domain summary generation (API endpoint or client-side)
6. Add confidence breakdown visualization
7. Add "Suggested Next" logic

### Phase 4: Polish & Mobile
**Scope:** Animations, transitions, mobile refinements
**Risk:** Low
**Effort:** Small

1. Chat panel slide-in/out animation
2. Card expand/collapse transitions
3. Mobile tab behavior updates
4. Cross-browser testing

---

## Documents

| Document | Purpose |
|----------|---------|
| **This file** (FOUNDER-FEEDBACK-V3-PLAN.md) | Master plan, feedback mapping, implementation phases |
| **[DESIGN-SYSTEM-V3.md](./DESIGN-SYSTEM-V3.md)** | Full design system spec: colors, typography, spacing, component styles |
| **[CONTENT-PANEL-V3-SPEC.md](./CONTENT-PANEL-V3-SPEC.md)** | Detailed spec for enhanced content panel: data layers, card designs, AI integration |

---

## Success Criteria

1. Sidebar + Content Panel are always visible on desktop — chat is contextual
2. A non-designer can immediately tell "left = nav, middle = my data"
3. Side-by-side with Notion, the UI feels like it belongs in the same era
4. Each category card tells the user something they didn't already know about their own readiness
5. A founder looking at the content panel says "this is useful" without needing to read the chat

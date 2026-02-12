# Central Console User Feedback & Redesign Plan

**Document Type:** Product Requirements
**Author:** Product Lead
**Date:** February 2026
**Status:** Ready for Design & Engineering Review

---

## Executive Summary

User testing has revealed that while the central console successfully organizes assessment categories, it fails to deliver clear value and creates confusion through information duplication. This document outlines the problems identified, root cause analysis, and a detailed redesign approach.

---

## 1. User Feedback Summary

### What's Working
- Users appreciate the organizational structure of categories and topics
- The visual hierarchy helps users understand assessment scope
- The expandable card pattern is intuitive

### Critical Issues Identified

| Issue | Severity | User Quote |
|-------|----------|------------|
| Unclear value proposition | High | "I'm not sure what this panel is supposed to help me do" |
| Information duplication | Medium | "Why am I seeing the same topics on the left and in the middle?" |
| Input-heavy, insight-light | High | "It just shows me what I said. I want to know what it means" |

---

## 2. Problem Analysis

### 2.1 Problem: Unclear Value Proposition

**Current State:**
The central console displays a list of topic cards that show:
- Topic name (duplicated from sidebar)
- User's verbatim input
- Confidence level badge
- AI-generated "Key Insight" and "What This Means" sections

**Root Cause:**
The console tries to do two things poorly instead of one thing well:
1. Navigation/status tracking (already handled by sidebar)
2. Insight delivery (buried under user input)

**Impact:**
- Users don't know where to look for value
- The panel feels like a "read-only summary" rather than an active tool
- No clear user task or workflow is supported

### 2.2 Problem: Information Duplication

**Current State:**
- Sidebar shows: Domain → Topics (with completion status)
- Central console shows: Domain Header → Topic Cards (with completion status)

**Root Cause:**
The design treats sidebar and console as independent components rather than complementary parts of a unified experience.

**Impact:**
- Cognitive load increases as users parse the same information twice
- Screen real estate is wasted
- Users are unsure which view is "authoritative"

### 2.3 Problem: Input-Heavy, Insight-Light

**Current State:**
The CategoryCard prioritizes showing:
1. "Your Input" - The user's verbatim response (prominent)
2. "Key Insight" - One sentence (small)
3. "What This Means" - Bullet points (secondary)

**Root Cause:**
The design assumes users want to verify their input was captured correctly. In reality, users already know what they said—they want to understand the implications.

**Impact:**
- Users feel the tool is a "note-taker" not an "advisor"
- The AI's analytical value is hidden
- Users don't get the "aha moments" that drive engagement

---

## 3. Design Principles for Redesign

Based on the feedback, the redesign should follow these principles:

1. **Insight-First:** Lead with analysis, not input recap
2. **Complementary Views:** Sidebar = navigation, Console = deep dive
3. **Progressive Disclosure:** Show insights upfront, input on demand
4. **Actionable Focus:** Every screen element should drive a user decision or action

---

## 4. Proposed Solution

### 4.1 Redefine the Central Console Purpose

**New Purpose Statement:**
> The central console is the **Insight Hub**—where users understand the strategic implications of their assessment and identify gaps requiring attention.

**New Name:** "Readiness Insights" (not just a list of topics)

### 4.2 New Information Architecture

#### Sidebar (Navigation Layer)
- **Keep:** Domain list with expand/collapse
- **Keep:** Topic list with completion indicators
- **Remove:** Progress counts (move to console header)
- **Add:** Visual distinction for topics needing attention (low confidence)

#### Central Console (Insight Layer)

**New Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  DOMAIN HEADER                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Market Readiness                           3/5 ✓   ││
│  │ [Overall insight sentence for this domain]          ││
│  │                                                     ││
│  │ Confidence: ●●●○○  │  Suggested: Target Segment    ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  INSIGHT CARDS (not topic cards)                        │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 💡 KEY INSIGHT                                      ││
│  │ "Your market driver is cost reduction, but you      ││
│  │  haven't validated this with US customers."         ││
│  │                                                     ││
│  │ IMPLICATIONS                                        ││
│  │ ✓ Clear value prop for enterprise sales            ││
│  │ ⚠ Assumption: US buyers prioritize cost savings    ││
│  │ ⚠ Gap: No US customer interviews mentioned         ││
│  │                                                     ││
│  │ [View my input ↓]  [Discuss further →]             ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 💡 KEY INSIGHT                                      ││
│  │ "Target segment is mid-market SaaS, which aligns   ││
│  │  well with your current customer base."             ││
│  │                                                     ││
│  │ IMPLICATIONS                                        ││
│  │ ✓ Existing playbook may transfer                   ││
│  │ ✓ Reference customers available                    ││
│  │                                                     ││
│  │ [View my input ↓]  [Discuss further →]             ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  NOT YET EXPLORED                                       │
│  ┌─────────────────────────────────────────────────────┐│
│  │ ○ Market Size Estimate                              ││
│  │   Understanding your addressable market helps...    ││
│  │                                        [Start →]    ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 4.3 Component Specifications

#### A. Domain Insight Header (New)

**Purpose:** Provide domain-level synthesis, not just progress tracking

**Content:**
- Domain name + completion count (from current)
- **NEW:** One-sentence domain summary (AI-generated)
- Confidence breakdown dots (from current)
- Suggested next topic (from current)

**Data Requirements:**
- Requires domain summary API (already built: `/api/domain/summary`)
- Add `overallAssessment` field to header display

#### B. Insight Card (Replaces CategoryCard)

**Purpose:** Lead with AI analysis, hide user input behind disclosure

**Visual Hierarchy (top to bottom):**
1. **Key Insight** (prominent, 16px, bold) - The strategic takeaway
2. **Implications** (14px) - Strengths, assumptions, gaps
3. **Actions** (subtle) - "View my input" toggle, "Discuss" button

**Collapsed State:**
- Shows: Key Insight + confidence indicator
- Hides: Implications, user input

**Expanded State:**
- Shows: Key Insight + Implications + Actions
- "View my input" reveals user's verbatim response (collapsed by default)

**Data Requirements:**
- `extracted_data.keyInsight` (already captured)
- `extracted_data.strengths` (already captured)
- `extracted_data.considerations` (already captured)
- `user_response` (exists, shown on demand)

#### C. Not Explored Card (Simplified)

**Purpose:** Prompt action, not describe the topic

**Content:**
- Topic name
- One-line prompt (why this matters)
- Start button (hover reveal)

**Remove:**
- Detailed topic descriptions (move to chat context)

### 4.4 Removing Duplication

| Element | Sidebar | Console |
|---------|---------|---------|
| Domain names | ✓ Show | ✓ Show (header only) |
| Topic names | ✓ Show (navigation) | ✗ Remove from card headers |
| Completion status | ✓ Show (dots/checks) | ✗ Remove from cards |
| Progress counts | ✗ Remove | ✓ Show (header only) |
| Confidence breakdown | ✗ Remove | ✓ Show (header) |

**Key Change:** Topic cards no longer display the topic name as a header—the insight itself becomes the header. The sidebar is the definitive list of "what topics exist."

---

## 5. Implementation Plan

### Phase 1: Data Layer (Engineering)
- [x] Domain summary API exists (`/api/domain/summary`)
- [x] Input insights stored in `extracted_data`
- [ ] Add `domainSummary` field to domain summary response (one-sentence)

### Phase 2: Component Redesign (Design + Engineering)

| Component | Change | Priority | Effort |
|-----------|--------|----------|--------|
| `ContentDomainHeader` | Add domain summary sentence | High | S |
| `CategoryCard` → `InsightCard` | Restructure to insight-first | High | M |
| `NotStartedCard` | Simplify to prompt-only | Medium | S |
| `Sidebar` | Remove progress counts | Low | XS |

### Phase 3: Copy & Content (Product + Design)
- Write insight-first card copy patterns
- Define "implications" taxonomy (strengths, assumptions, gaps)
- Create empty state messaging

---

## 6. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| "Value clear" (user survey) | ~40% | >75% |
| Time spent on console | Low | +50% |
| "Discuss further" clicks | N/A | >30% of cards |
| User quotes mentioning "insights" | Rare | Common |

---

## 7. Open Questions for Design Review

1. Should insight cards be collapsible, or always show full content?
2. How do we handle topics with low-confidence insights? Different card style?
3. Should "View my input" be a modal or inline expansion?
4. Do we need a "domain complete" celebration state?

---

## 8. Appendix: Current vs. Proposed Wireframes

### Current CategoryCard Structure
```
┌─────────────────────────────────────┐
│ [▼] Topic Name          [High] ●   │
├─────────────────────────────────────┤
│ KEY INSIGHT                         │
│ [One sentence]                      │
│                                     │
│ YOUR INPUT                          │
│ ┌─────────────────────────────────┐ │
│ │ "User's verbatim response..."   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ WHAT THIS MEANS                     │
│ ✓ Strength point                    │
│ ⚠ Consideration point               │
│                                     │
│ [timestamp]        [Discuss] [...]  │
└─────────────────────────────────────┘
```

### Proposed InsightCard Structure
```
┌─────────────────────────────────────┐
│ 💡 "Your market driver is cost     │  ← Insight IS the header
│    reduction, but you haven't       │
│    validated this with US customers"│
│                                 ●●○ │  ← Confidence dots
├─────────────────────────────────────┤
│ IMPLICATIONS                        │
│ ✓ Clear value prop for enterprise   │
│ ⚠ Assumption: US buyers prioritize  │
│ ✗ Gap: No US customer interviews    │
│                                     │
│ [View my input ↓]    [Discuss →]    │
└─────────────────────────────────────┘
```

---

## 9. Next Steps

1. **Design:** Create high-fidelity mockups of InsightCard and updated header
2. **Engineering:** Prepare component refactor plan
3. **Product:** Write sample insight copy for each topic type
4. **Review:** Sync meeting to align on final approach

---

*Document prepared for design and engineering handoff. Questions? Reach out to Product Lead.*

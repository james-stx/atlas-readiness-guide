# Readiness Report V3 — Complete Redesign

**Date:** 2025-02-13
**Status:** Design Review
**Previous:** V2 implementation had fundamental UX issues

---

## Critical Issues from V2

| Issue | Problem | Solution |
|-------|---------|----------|
| **Rating too generous** | "Ready with caveats" shown for 6/25 topics | Require minimum coverage thresholds; add "Incomplete Assessment" state |
| **Overview too minimal** | No compelling context in first view | Rich overview with clear progress visualization and actionable summary |
| **Domain indicators unclear** | Filled circles don't convey progress vs confidence | Dual-metric display: completion % AND confidence level |
| **Content lacks structure** | AI-generated text with no consistency | Mirror workspace topic cards — show specific topics addressed/not addressed |
| **Inconsistent category styling** | Grey text vs blue pills randomly | Single consistent badge system throughout |

---

## Readiness Level Logic — V3

### Assessment Completeness Thresholds

Before ANY readiness level can be assigned, minimum coverage is required:

```
INCOMPLETE ASSESSMENT (default state)
├── < 60% topics covered overall, OR
├── Any domain has < 2 topics covered, OR
└── < 12 total topics covered

ASSESSABLE (can receive a readiness level)
├── ≥ 60% topics covered overall (15/25), AND
├── Every domain has ≥ 2 topics covered, AND
└── ≥ 12 total topics covered
```

### Readiness Levels (only if ASSESSABLE)

```
NOT YET READY
├── ≥ 2 domains with majority LOW confidence, OR
├── ≥ 3 CRITICAL gaps identified, OR
└── Any domain with 0 HIGH confidence topics

READY WITH CAVEATS
├── No domain with majority LOW confidence, AND
├── ≤ 2 CRITICAL gaps, AND
├── ≥ 2 domains with majority HIGH confidence, AND
└── Has MEDIUM confidence assumptions to validate

READY TO EXECUTE
├── ≥ 4 domains with majority HIGH confidence, AND
├── 0 CRITICAL gaps, AND
├── ≤ 2 IMPORTANT assumptions, AND
└── All domains have ≥ 1 HIGH confidence topic
```

### Domain Confidence Calculation

Per domain:
- **High**: ≥60% of domain topics are HIGH confidence
- **Medium**: ≥40% HIGH or ≥60% MEDIUM confidence
- **Low**: Everything else (including sparse data)

---

## Section 1: Assessment Overview (Redesigned)

### Purpose
First thing user sees. Must immediately answer:
1. Is my assessment complete enough to draw conclusions?
2. If yes, what's my overall readiness?
3. What does each domain look like?

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ASSESSMENT OVERVIEW                                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ┌───────────────────────────────────────────────────────────────────┐ ││
│  │  │                                                                   │ ││
│  │  │   ASSESSMENT STATUS                                              │ ││
│  │  │                                                                   │ ││
│  │  │   ┌─────────────────────────────────────────────────────────┐    │ ││
│  │  │   │                                                         │    │ ││
│  │  │   │  ◐  Ready with Caveats                                  │    │ ││
│  │  │   │                                                         │    │ ││
│  │  │   │  Strong market validation and product readiness, but    │    │ ││
│  │  │   │  GTM and operational plans need validation before       │    │ ││
│  │  │   │  you can execute confidently.                           │    │ ││
│  │  │   │                                                         │    │ ││
│  │  │   └─────────────────────────────────────────────────────────┘    │ ││
│  │  │                                                                   │ ││
│  │  │   COVERAGE: 18/25 topics (72%)                                   │ ││
│  │  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░                                      │ ││
│  │  │                                                                   │ ││
│  │  └───────────────────────────────────────────────────────────────────┘ ││
│  │                                                                         ││
│  │  ─────────────────────────────────────────────────────────────────────  ││
│  │                                                                         ││
│  │  DOMAIN BREAKDOWN                                                       ││
│  │                                                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │ Market                                                          │   ││
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  4/5 topics  ●●●●○  HIGH confidence       │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │ Product                                                         │   ││
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  4/5 topics  ●●●○○  HIGH confidence       │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │ GTM                                                             │   ││
│  │  │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  3/5 topics  ●●○○○  MEDIUM confidence     │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │ Operations                                                      │   ││
│  │  │ ▓▓▓▓▓░░░░░░░░░░░░░░░  2/5 topics  ●○○○○  LOW confidence        │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │ Financials                                                      │   ││
│  │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  5/5 topics  ●●●●●  HIGH confidence       │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Domain Row Detail

Each domain row shows TWO distinct metrics:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Market                                                                    │
│                                                                            │
│  COVERAGE                              CONFIDENCE                          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  4/5            ●●●●○  HIGH                        │
│  │                                     │                                   │
│  Progress bar: topics covered          Dots: confidence breakdown          │
│  (out of total possible)               (filled = HIGH, half = MED, empty = LOW)
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Incomplete Assessment State

When thresholds not met:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ASSESSMENT STATUS                                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                              bg: #FAF9F7│
│  │   ○  Incomplete Assessment                                          │   │
│  │                                                                      │   │
│  │   You've covered 6 of 25 topics (24%). Complete at least 15         │   │
│  │   topics (60%) with coverage in all domains to receive a            │   │
│  │   readiness assessment.                                             │   │
│  │                                                                      │   │
│  │                     [Continue Assessment →]                          │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROGRESS BY DOMAIN                                                         │
│                                                                             │
│  Market        ▓▓▓▓░░░░░░  2/5   ← Need 2+ per domain                      │
│  Product       ▓▓▓▓▓▓░░░░  3/5   ✓                                         │
│  GTM           ▓▓░░░░░░░░  1/5   ← Need 2+ per domain                      │
│  Operations    ░░░░░░░░░░  0/5   ← Need 2+ per domain                      │
│  Financials    ░░░░░░░░░░  0/5   ← Need 2+ per domain                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Section 2: Domain Details (Structured Like Workspace)

### Purpose
Show EXACTLY what was covered in each domain, mirroring the workspace card structure.

### Layout — Per Domain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  MARKET READINESS                                              HIGH         │
│  4/5 topics covered                                            ●●●●○       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ✓  Why expand to the U.S.?                              HIGH          ││
│  │     ──────────────────────────────────────────────────────────────     ││
│  │     Key insight: Strong demand signals with 40% QoQ inquiry growth     ││
│  │                                                                         ││
│  │     Requirements addressed:                                             ││
│  │     ✓ Clear expansion rationale                                         ││
│  │     ✓ Quantitative demand evidence                                      ││
│  │     ✓ Target vertical identified                                        ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ✓  Target customer profile                              HIGH          ││
│  │     ──────────────────────────────────────────────────────────────     ││
│  │     Key insight: Enterprise SaaS, 200-2000 employees, VP Engineering   ││
│  │                                                                         ││
│  │     Requirements addressed:                                             ││
│  │     ✓ Customer segment defined                                          ││
│  │     ✓ Company size range specified                                      ││
│  │     ✓ Buyer persona identified                                          ││
│  │     △ Buying process not detailed                                       ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ✓  Competitive landscape                               MEDIUM         ││
│  │     ──────────────────────────────────────────────────────────────     ││
│  │     Key insight: Aware of 2 competitors but no detailed analysis       ││
│  │                                                                         ││
│  │     Requirements addressed:                                             ││
│  │     ✓ Competitors identified                                            ││
│  │     △ Differentiation unclear                                           ││
│  │     ○ Competitive pricing not researched                                ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  ✓  Market size estimate                                 HIGH          ││
│  │     ──────────────────────────────────────────────────────────────     ││
│  │     Key insight: $2.3B TAM with clear serviceable market defined       ││
│  │                                                                         ││
│  │     Requirements addressed:                                             ││
│  │     ✓ TAM quantified                                                    ││
│  │     ✓ SAM defined                                                       ││
│  │     ✓ Data sources cited                                                ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐│
│  │                                                          NOT COVERED   ││
│  │  ○  Market timing                                                      ││
│  │                                                                         ││
│  │     Why this matters: Understanding market timing helps validate       ││
│  │     whether now is the right moment to enter.                          ││
│  │                                                                         ││
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Requirement Status Icons

Consistent throughout report:
- `✓` = Addressed (green, #0F7B6C)
- `△` = Partially addressed / needs more detail (amber, #D9730D)
- `○` = Not addressed (gray, #9B9A97)

---

## Section 3: Critical Actions

### Purpose
Surface the most important things that need attention, derived from the structured topic analysis.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  CRITICAL ACTIONS                                                 2 items   │
│  Address before major investment                                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                              bg: #FBE4E4││
│  │  1  Define U.S. sales leadership                                        ││
│  │                                                                          ││
│  │     Source: GTM → Sales model (not covered)                             ││
│  │                                                                          ││
│  │     You haven't identified who will lead U.S. sales. This blocks       ││
│  │     GTM execution timeline.                                             ││
│  │                                                                          ││
│  │     Action: Define hiring profile and begin sourcing                    ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                              bg: #FBE4E4││
│  │  2  Clarify regulatory requirements                                     ││
│  │                                                                          ││
│  │     Source: Operations → Compliance (LOW confidence)                    ││
│  │                                                                          ││
│  │     Unclear whether HIPAA/FedRAMP applies to your target verticals.    ││
│  │                                                                          ││
│  │     Action: Consult U.S. regulatory specialist before product commit   ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ASSUMPTIONS TO VALIDATE                                          3 items   │
│  Test before committing resources                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ◐  Pricing will transfer                               Financials     ││
│  │                                                                          ││
│  │     Source: Financials → Pricing strategy (MEDIUM confidence)           ││
│  │                                                                          ││
│  │     You're assuming U.S. customers pay similar to EU. Unvalidated.     ││
│  │                                                                          ││
│  │     Validate: Price testing with 5-10 U.S. prospects                    ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ... more assumptions ...                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Change: Source Traceability

Every critical action and assumption links back to a specific topic:
- `Source: GTM → Sales model (not covered)`
- `Source: Operations → Compliance (LOW confidence)`

This creates consistency with the domain detail view.

---

## Section 4: 30-Day Plan

Similar to V2, but with source traceability:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  30-DAY ACTION PLAN                                                         │
│                                                                             │
│  WEEK 1                                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ☐  Define U.S. sales leader hiring profile                                │
│      GTM → Sales model                                                      │
│      Unblocks: GTM timeline, revenue projections                           │
│                                                                             │
│  ☐  Schedule regulatory consultation                                        │
│      Operations → Compliance                                                │
│      Unblocks: Product roadmap decisions                                   │
│                                                                             │
│  ...                                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Visual Design System — Report-Specific

### Category/Domain Badges (SINGLE CONSISTENT STYLE)

All domain/category references use the same treatment:

```
┌──────────────────┐
│  Market          │   bg: transparent
│                  │   text: #9B9A97
│                  │   border: none
│                  │   font: 11px/500, uppercase
└──────────────────┘
```

Used in: Domain headers, source references, action items.
**Never** use blue pills for categories — reserve blue for CTAs only.

### Confidence Badges

```
HIGH      ●  #0F7B6C on #DDEDEA pill
MEDIUM    ◐  #D9730D on #FAEBDD pill
LOW       ○  #E03E3E on #FBE4E4 pill
```

### Progress Indicators

```
Progress bar:  ▓▓▓▓▓▓▓░░░  (filled: #37352F, empty: #E8E6E1)
Topic count:   4/5 topics  (text: #5C5A56)
```

### Status Icons (Requirements)

```
✓  Addressed        #0F7B6C
△  Partial          #D9730D
○  Not addressed    #9B9A97
```

---

## Data Requirements

### New: Topic-Level Requirements

Each topic needs predefined requirements that can be marked as addressed/partial/not:

```typescript
interface TopicRequirement {
  id: string;
  label: string;  // e.g., "Clear expansion rationale"
}

interface TopicDefinition {
  id: string;
  domain: DomainType;
  label: string;
  description: string;
  requirements: TopicRequirement[];
}
```

### AI Generation Changes

When capturing input, AI should assess which requirements are met:

```typescript
interface InputInsight {
  key_insight: string;
  requirements_addressed: {
    requirement_id: string;
    status: 'addressed' | 'partial' | 'not_addressed';
  }[];
}
```

### Snapshot Structure Changes

```typescript
interface SnapshotV3 {
  // Assessment status
  assessment_status: 'incomplete' | 'assessable';
  coverage_percentage: number;
  topics_covered: number;
  topics_total: number;

  // Only populated if assessable
  readiness_level?: 'ready' | 'ready_with_caveats' | 'not_ready';
  verdict_summary?: string;

  // Domain details (structured)
  domains: {
    [key in DomainType]: {
      topics_covered: number;
      topics_total: number;
      confidence_level: 'high' | 'medium' | 'low';
      confidence_breakdown: { high: number; medium: number; low: number };
      topics: {
        topic_id: string;
        status: 'covered' | 'not_covered';
        confidence?: ConfidenceLevel;
        key_insight?: string;
        requirements: {
          requirement_id: string;
          label: string;
          status: 'addressed' | 'partial' | 'not_addressed';
        }[];
      }[];
    };
  };

  // Actions (derived from structured analysis)
  critical_actions: {
    priority: number;
    title: string;
    source_domain: DomainType;
    source_topic: string;
    source_status: string;  // "not covered" or "LOW confidence"
    description: string;
    action: string;
  }[];

  assumptions: {
    title: string;
    source_domain: DomainType;
    source_topic: string;
    description: string;
    validation: string;
  }[];

  action_plan: {
    week: 1 | 2 | 3 | 4;
    action: string;
    source_domain: DomainType;
    source_topic: string;
    unblocks: string;
  }[];
}
```

---

## Implementation Priority

1. **Define topic requirements** — Add requirements to each of the 25 topics
2. **Update input capture** — AI assesses requirements when capturing input
3. **Update snapshot generation** — New structured format with completeness checks
4. **Build new components:**
   - `AssessmentOverview` (with incomplete state)
   - `DomainDetailSection` (structured topic cards)
   - `CriticalActionsSection` (with source traceability)
   - `ActionPlanSection` (updated with sources)
5. **Remove old components** — Delete V1/V2 snapshot components

---

## Questions for Review

1. **Requirements per topic**: Should we define 3-5 requirements per topic (125 total), or keep it simpler with 2-3?

2. **Requirement assessment timing**: Should AI assess requirements during chat, or only at snapshot generation?

3. **Incomplete assessment actions**: When assessment is incomplete, should we still show partial insights, or only the "continue assessment" CTA?

4. **Progressive disclosure**: Should domain details be collapsible, or always expanded?

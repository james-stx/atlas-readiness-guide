# Readiness Report V2 — First Principles Design

**Date:** 2025-02-13
**Author:** PM/Design Lead
**Status:** Draft
**Design tokens:** [DESIGN-SYSTEM-V3.md](./DESIGN-SYSTEM-V3.md)

---

## The Core Question

**If I'm a founder looking to expand into the U.S., what is the most actionable set of insights I can receive that helps me understand:**

1. Where am I today?
2. What do I need to do next?

Everything in this report must serve these two questions. If a section doesn't directly answer one of them, it doesn't belong.

---

## User Context & Mindset

### Who is reading this?

A founder or senior leader at a non-U.S. company who has just completed a structured conversation about their U.S. expansion readiness. They've invested 20-40 minutes answering questions across 5 domains.

### What do they want?

| Want | Not Want |
|------|----------|
| Clear verdict on readiness | Vague assessments |
| Specific, prioritized actions | Generic advice |
| Evidence-based insights | AI platitudes |
| Something to share with their team/board | A transcript dump |
| Professional, credible output | A chatbot summary |

### What's their emotional state?

- **Hopeful** — they want validation that expansion is feasible
- **Anxious** — they know there are unknowns
- **Time-pressed** — they need to act on this, not just read it
- **Skeptical** — they'll discount anything that feels generic

---

## Report Structure — The Narrative Arc

The report should tell a story with clear progression:

```
1. YOUR READINESS AT A GLANCE
   "Here's where you stand overall"

2. WHAT YOU'VE VALIDATED
   "These areas are solid — you can move forward confidently"

3. WHAT NEEDS ATTENTION
   "These gaps or assumptions could derail your expansion"

4. YOUR 30-DAY ACTION PLAN
   "Here's exactly what to do next, in order"

5. SHARE & EXPORT
   "Take this with you"
```

This maps to the founder's mental model:
- Am I ready? → Section 1
- What's working? → Section 2
- What's risky? → Section 3
- What do I do? → Section 4
- How do I use this? → Section 5

---

## Section 1: Your Readiness at a Glance

### Purpose
Give the founder an immediate, honest answer to "Am I ready?" without making them scroll. This is the executive summary.

### Content

**Readiness Level** — A clear, qualitative assessment (not a score):

| Level | Criteria | Visual Treatment |
|-------|----------|------------------|
| **Ready to Execute** | High confidence across 4+ domains, no critical gaps | Teal accent, confident language |
| **Ready with Caveats** | Mix of high/medium confidence, addressable gaps | Amber accent, cautious optimism |
| **Not Yet Ready** | Low confidence in 2+ domains, or critical blockers | Red accent, direct honesty |

**One-Line Verdict:**
> "You have strong market validation and product readiness, but your go-to-market and operational plans need work before you can execute confidently."

**Domain Summary Strip:**
5 domains displayed horizontally with confidence indicators:

```
┌─────────────────────────────────────────────────────────────────┐
│  Market      Product       GTM       Operations    Financials  │
│    ●           ●           ○            ○             ●        │
│   High        High       Medium        Low          High       │
└─────────────────────────────────────────────────────────────────┘
```

**Key Numbers:**
- Topics covered: 18/25
- High confidence inputs: 12
- Critical gaps: 2

### Design Notes
- This section should be visible without scrolling on desktop
- The verdict should be bold and unambiguous
- Domain strip uses the console's confidence color system (teal/amber/red)
- No fluff — every word earns its place

---

## Section 2: What You've Validated

### Purpose
Show the founder what they can stop worrying about. These are areas where they have high-confidence data and can proceed.

### Rename from "Strengths"
"Strengths" implies judgment. "Validated" implies evidence. We're showing what they've proven, not what we think is good about them.

### Content Structure

Group by domain, show only HIGH confidence items:

```
MARKET READINESS — VALIDATED ✓

● Clear demand signal
  You've documented 40% QoQ growth in U.S. inbound inquiries,
  concentrated in fintech and healthtech verticals.

● Target segment defined
  Enterprise SaaS companies with 200-2000 employees, primarily
  in regulated industries. Buyer persona: VP of Engineering.

PRODUCT READINESS — VALIDATED ✓

● Technical infrastructure ready
  AWS US-East deployment with <100ms latency, SOC2 compliant,
  GDPR-ready data handling already in place.
```

### Evidence Display
Each validated item shows:
1. **The insight** — What we know (1 sentence)
2. **The evidence** — Supporting data from their input (1-2 sentences)

### What NOT to show
- Medium or low confidence items (those go in Section 3)
- Generic validations ("You have a product")
- Anything without specific evidence

### Design Notes
- Use teal accent for the "Validated" badges
- Left border accent on each item (teal)
- Collapsible by domain to reduce scrolling
- Show domain confidence badge next to each header

---

## Section 3: What Needs Attention

### Purpose
Honest assessment of gaps, risks, and assumptions that could derail expansion. This is the "hard truths" section.

### Two Categories

**A. Gaps** — Things they don't know yet that they need to know
**B. Assumptions** — Things they think they know but haven't validated

### Content Structure

#### Gaps (Prioritized by Impact)

```
CRITICAL GAPS — Address before major investment

1. U.S. Sales Leadership
   Domain: GTM

   You haven't identified who will lead U.S. sales or defined
   the hiring profile. Without this, your GTM timeline is at risk.

   → Research: U.S. sales leader profiles for Series B SaaS
   → Action: Define job spec and begin sourcing

2. Regulatory Compliance Path
   Domain: Operations

   No clarity on whether your product requires specific U.S.
   certifications (HIPAA, FedRAMP) for target verticals.

   → Research: Compliance requirements for healthtech/fintech SaaS
   → Action: Consult U.S. regulatory specialist

IMPORTANT GAPS — Address within 60 days

3. Competitive Positioning
   Domain: Market
   ...
```

#### Assumptions to Validate

```
ASSUMPTIONS FLAGGED FOR VALIDATION

● Pricing will transfer directly
  You're assuming U.S. customers will pay similar prices to
  European customers. This is unvalidated.

  Risk: U.S. competitors may undercut significantly
  To validate: Run pricing research with 5-10 target accounts

● Partner channel will accelerate
  You mentioned partnership discussions but no signed agreements.

  Risk: 6-12 month delay in channel activation
  To validate: Get LOI or pilot commitment from top 2 partners
```

### Priority Framework

| Priority | Definition | Visual |
|----------|------------|--------|
| Critical | Blocker for execution, must resolve first | Red badge, appears first |
| Important | Significant risk, address within 60 days | Amber badge |
| Nice-to-have | Would strengthen position, not urgent | Gray, collapsed by default |

### Design Notes
- Critical gaps get red accent and appear at the top
- Each gap includes a concrete "Research" and "Action" step
- Assumptions include "Risk" and "To validate" fields
- Collapsible sections to manage length
- This section should feel direct but not discouraging

---

## Section 4: Your 30-Day Action Plan

### Purpose
Transform insights into a concrete, sequenced action plan. This is the "now what?" answer.

### Why 30 Days?
- Long enough to make real progress
- Short enough to create urgency
- Aligns with typical founder planning cycles
- Creates a natural check-in point

### Content Structure

```
YOUR 30-DAY ACTION PLAN

Week 1: Foundation
─────────────────────────────────────────────────────

□ Define U.S. sales leader hiring profile
  Context: Your GTM plan depends on this hire. Start here.
  Domain: GTM

□ Schedule call with U.S. regulatory consultant
  Context: Clarity on HIPAA/compliance unblocks product roadmap.
  Domain: Operations

Week 2: Validation
─────────────────────────────────────────────────────

□ Run pricing research with 5 target accounts
  Context: Validate your pricing assumption before committing.
  Domain: Financials

□ Draft competitive positioning doc
  Context: You need this for sales materials and investor updates.
  Domain: Market

Week 3-4: Execution Prep
─────────────────────────────────────────────────────

□ Begin sales leader sourcing (post JD, activate recruiters)
  Context: Typical time-to-hire is 60-90 days; start now.
  Domain: GTM

□ Complete partner pilot negotiation
  Context: De-risk channel assumption with concrete commitment.
  Domain: GTM

□ Finalize U.S. entity structure decision
  Context: Legal setup takes 4-6 weeks; parallel-path this.
  Domain: Operations
```

### Action Item Structure
Each action includes:
1. **The action** — Clear, specific, verb-first
2. **Context** — Why this matters right now (1 sentence)
3. **Domain** — Where this came from
4. **Checkbox** — Visual affordance for tracking

### Sequencing Logic
Actions are ordered by:
1. Dependency (what unblocks other things)
2. Lead time (what takes longest to complete)
3. Risk (what addresses critical gaps first)

### Design Notes
- Use blue accent for action items (action = accent color)
- Week groupings provide structure without being prescriptive
- Checkboxes are visual only (not interactive in PDF)
- Maximum 8-10 actions (focused, not overwhelming)
- Each action traces back to a finding in Sections 2/3

---

## Section 5: Share & Export

### Purpose
Help the founder use this report with their team, board, and advisors.

### Content

**Download PDF**
Full report formatted for sharing, printing, or attaching to emails.

**Email Report**
Send a copy to yourself or collaborators.

**Key Stats for Your Deck**
Pre-formatted snippets they can copy into investor decks or board slides:
- "Validated readiness across 3 of 5 expansion domains"
- "Identified 2 critical gaps requiring resolution before execution"
- "18 of 25 readiness topics assessed with quantitative inputs"

### Design Notes
- Minimal section — just the actions, no prose
- PDF button is primary (blue)
- Email is secondary (outline)
- "Key Stats" is a nice-to-have, collapsed by default

---

## Visual Design Principles

### Alignment with Console

The report should feel like a natural extension of the console experience:

| Console Pattern | Report Application |
|-----------------|-------------------|
| Warm background (#FAF9F7) | Page background |
| White cards with subtle borders | Each section is a card |
| 11px uppercase section labels | Section headers |
| Confidence colors (teal/amber/red) | Domain indicators, priority badges |
| 720px max content width | Report content width |
| Inter font family | All typography |
| 8px spacing grid | Consistent throughout |

### Typography Hierarchy

| Element | Style |
|---------|-------|
| Page title | 24px/600, #37352F |
| Section headers | 11px/500 uppercase, #9B9A97 |
| Subsection headers | 15px/500, #37352F |
| Body text | 14px/400, #37352F |
| Supporting text | 13px/400, #5C5A56 |
| Captions/metadata | 12px/400, #9B9A97 |

### Color Usage

| Purpose | Color |
|---------|-------|
| High confidence / Validated | #0F7B6C (teal) |
| Medium / Assumptions | #D9730D (amber) |
| Low / Critical gaps | #E03E3E (red) |
| Actions / CTA | #2383E2 (blue) |
| Backgrounds | #FAF9F7 (page), #FFFFFF (cards) |
| Borders | #E8E6E1 |

### Information Density

- Desktop: Full layout with all sections expanded by default
- Mobile: Collapsible sections, summary visible, details on tap
- PDF: Single-column, all content visible, optimized for print

---

## Content Principles

### Voice & Tone

| Do | Don't |
|----|-------|
| Direct, specific, evidence-based | Vague, generic, hedging |
| "Your pricing assumption is unvalidated" | "You might want to consider pricing research" |
| "12 high-confidence inputs across 4 domains" | "Great job providing lots of information!" |
| "Critical: No U.S. sales leadership defined" | "This area could use some improvement" |

### Credibility Markers

The report should feel credible and professional:
- Every insight traces to user input (no invented observations)
- Quantitative data is surfaced prominently
- Gaps are specific and actionable
- Language is consultant-grade, not chatbot-grade

### Anti-Patterns to Avoid

| Avoid | Why |
|-------|-----|
| Scores or percentages | Implies false precision |
| "You're doing great!" | Feels patronizing |
| Walls of text | Loses attention |
| Generic advice | Destroys credibility |
| Jargon/buzzwords | Alienates readers |

---

## Data Requirements

### From Session Data

| Data | Used In |
|------|---------|
| Inputs by domain | Section 2, 3 |
| Confidence levels | Section 1, 2, 3 |
| Confidence rationale | Section 2, 3 |
| User verbatim responses | Section 2 (evidence) |
| Topics not covered | Section 3 (gaps) |
| Session timestamp | Report header |
| User email | Export section |

### AI-Generated Content

| Content | Generation Trigger |
|---------|-------------------|
| Overall readiness verdict | On report generation |
| Domain summaries | On report generation |
| Gap descriptions | On report generation |
| Assumption risk assessments | On report generation |
| 30-day action plan | On report generation |

### Generation Approach

Single API call with structured output:
1. Pass all session inputs to Claude
2. Request structured JSON with all report sections
3. Use consistent system prompt for voice/tone
4. Validate output structure before rendering

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time on report page | >60 seconds | Analytics |
| PDF download rate | >40% of viewers | Event tracking |
| Email share rate | >15% of viewers | Event tracking |
| Return visits to report | >20% within 7 days | Analytics |
| Report satisfaction | >4/5 rating | Optional feedback prompt |

---

## Open Questions

1. **Should the action plan be editable?** Users might want to customize actions.
2. **How do we handle very incomplete sessions?** (< 10 inputs)
3. **Should we show comparison to other founders?** ("Most founders at your stage...")
4. **Is there value in a "progress since last report" view?**

---

## Next Steps

1. Review and approve this spec
2. ~~Perform gap analysis against existing implementation~~ (see below)
3. Create wireframes for each section
4. Define AI prompt for structured report generation
5. Implement in phases (layout → content → export)

---

## Gap Analysis: V2 Spec vs. Current Implementation

### Current Architecture

**Page:** `apps/web/src/app/snapshot/page.tsx`
**Components:**
- `CoverageOverview` — Domain confidence dots
- `KeyFindings` — List of findings with domain badges
- `StrengthsSection` — Grouped by domain
- `AssumptionsSection` — Cards with risk/validation
- `GapsSection` — Prioritized by importance
- `NextStepsSection` — Numbered action list
- `ExportSection` — PDF download + email

**Data Types (from `@atlas/types`):**
```typescript
Snapshot {
  coverage_summary: CoverageSummary;  // Per-domain question counts
  key_findings: KeyFinding[];         // domain, finding, confidence
  strengths: Strength[];              // domain, item, evidence
  assumptions: Assumption[];          // domain, item, risk, validation_suggestion
  gaps: Gap[];                        // domain, item, importance, recommendation
  next_steps: NextStep[];             // priority, action, domain, rationale
}
```

---

### Gap Summary Table

| V2 Requirement | Current State | Gap | Priority |
|----------------|---------------|-----|----------|
| **Readiness verdict** (Ready/Ready with Caveats/Not Ready) | Not present | Must generate overall assessment | High |
| **One-line verdict** | Generic subtitle only | Needs AI-generated personalized verdict | High |
| **Domain summary strip** (horizontal, above fold) | Dots only, no labels | Need horizontal strip with confidence levels | Medium |
| **Key stats** (topics covered, high confidence count, critical gaps) | Partial (coverage dots) | Add explicit counts | Medium |
| **Validated section** (evidence-based) | "Strengths" exists but weak evidence display | Rename, improve evidence formatting | Medium |
| **User verbatim quotes** | Not shown in report | Need to include supporting quotes | High |
| **Prioritized gaps with Research/Action** | Gaps have recommendation only | Add separate Research + Action fields | Medium |
| **Assumption risk severity** | Implicit | Make risk explicit with visual treatment | Low |
| **30-day action plan with weeks** | Next steps exist, no time structure | Add week-based grouping | High |
| **Action checkboxes** | Not present | Add visual checkboxes | Low |
| **Action context sentences** | Rationale exists | Good — keep rationale | None |
| **Deck-ready stats** | Not present | Add copyable stat snippets | Low |
| **Collapsible sections** | Not implemented | Add for mobile/density | Medium |

---

### Structural Changes Required

#### 1. Information Architecture

**Current Order:**
1. Coverage Overview (dots)
2. Key Findings (list)
3. Strengths + Assumptions (2-column)
4. Gaps
5. Next Steps
6. Export

**V2 Order:**
1. **Readiness at a Glance** (NEW — verdict + domain strip + key stats)
2. **What You've Validated** (renamed from Strengths, with evidence)
3. **What Needs Attention** (combined Gaps + Assumptions)
4. **30-Day Action Plan** (restructured from Next Steps)
5. **Share & Export**

**Changes:**
- Merge "Key Findings" into the new sections (findings support verdict)
- Remove standalone "Coverage Overview" (integrated into Section 1)
- Combine "Gaps" and "Assumptions" into single "Needs Attention" section
- Restructure "Next Steps" into weekly action plan

#### 2. Data Model Changes

**New fields needed in Snapshot type:**

```typescript
interface Snapshot {
  // Existing
  coverage_summary: CoverageSummary;
  key_findings: KeyFinding[];
  strengths: Strength[];
  assumptions: Assumption[];
  gaps: Gap[];
  next_steps: NextStep[];
  raw_output: string | null;

  // NEW
  readiness_level: 'ready' | 'ready_with_caveats' | 'not_ready';
  verdict_summary: string;  // One-line personalized verdict
  key_stats: {
    topics_covered: number;
    total_topics: number;
    high_confidence_inputs: number;
    critical_gaps_count: number;
  };
}
```

**Enhanced fields:**

```typescript
interface Strength {
  domain: DomainType;
  item: string;
  evidence: string;
  user_quote?: string;  // NEW — verbatim from input
}

interface Gap {
  domain: DomainType;
  item: string;
  importance: GapImportance;
  recommendation: string;
  research_action?: string;  // NEW
  execution_action?: string; // NEW
}

interface NextStep {
  priority: number;
  action: string;
  domain: DomainType;
  rationale: string;
  week: 1 | 2 | 3 | 4;  // NEW — for grouping
}
```

#### 3. Component Changes

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `CoverageOverview` | **Remove** | Integrated into new ReadinessOverview |
| `KeyFindings` | **Remove** | Content distributed across sections |
| `StrengthsSection` | **Rename + Refactor** | → `ValidatedSection` with quotes |
| `AssumptionsSection` | **Merge** | Combined into `AttentionSection` |
| `GapsSection` | **Merge** | Combined into `AttentionSection` |
| `NextStepsSection` | **Refactor** | → `ActionPlanSection` with weeks |
| `ExportSection` | **Enhance** | Add deck-ready stats |
| `ReadinessOverview` | **New** | Verdict + domain strip + stats |
| `AttentionSection` | **New** | Combined gaps + assumptions |

#### 4. AI Prompt Changes

The snapshot generation prompt needs to:
1. Generate `readiness_level` classification
2. Generate `verdict_summary` one-liner
3. Calculate/return `key_stats`
4. Include `user_quote` in strengths where available
5. Split gap recommendations into research/action
6. Assign `week` to each next step

---

### Implementation Phases

#### Phase 1: Data Model (API)
- [ ] Update Snapshot type definition
- [ ] Update AI prompt for new fields
- [ ] Update snapshot generation endpoint
- [ ] Test with sample sessions

#### Phase 2: Layout (Frontend)
- [ ] Create `ReadinessOverview` component
- [ ] Create `ValidatedSection` component
- [ ] Create `AttentionSection` component
- [ ] Create `ActionPlanSection` component
- [ ] Update page layout

#### Phase 3: Polish
- [ ] Add collapsible sections
- [ ] Add visual checkboxes to actions
- [ ] Add deck-ready stats to export
- [ ] Mobile responsive adjustments
- [ ] PDF template updates

---

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI generates poor verdicts | Medium | High | Strong prompt engineering, manual review |
| Data model migration breaks existing snapshots | Low | High | Make new fields optional, backfill logic |
| Increased token usage for generation | Medium | Low | Optimize prompt, batch where possible |
| Users miss removed sections | Low | Medium | A/B test before full rollout |

---

### Decision Points for Review

1. **Should we backfill existing snapshots?** Or only apply V2 format to new generations?
2. **Is the week-based action plan too prescriptive?** Should it be configurable?
3. **Should assumptions and gaps be visually distinct** or truly merged?
4. **PDF template** — update alongside web or separate phase?

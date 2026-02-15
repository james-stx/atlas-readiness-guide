# Readiness Report V5 — Product Requirements Document

**Date:** 2026-02-15
**Author:** Head of Product
**Status:** DEFINITIVE SPEC
**Supersedes:** All previous readiness report specifications

---

## Executive Summary

The Readiness Report exists to answer one question: **"What does my data MEAN and what should I DO?"**

This is NOT a summary of the console. This is NOT a repeat of what the user already sees. This is a **synthesis document** that transforms 25 individual topic inputs into cross-domain intelligence, critical blockers, testable assumptions, and a sequenced action plan.

If the report doesn't tell users something they can't see in the console, it has no reason to exist.

---

## Part 1: The Problem We're Solving

### 1.1 What Users Experience in the Console

The console (workspace) provides:
- Topic-by-topic input collection
- Per-topic confidence levels (HIGH/MEDIUM/LOW)
- Domain progress tracking (X/5 topics)
- Individual topic cards with key insights

**The console answers:** "What have I covered?"

### 1.2 What Users Need from the Report

The report must provide:
- Overall readiness verdict with clear rationale
- Cross-domain patterns and dependencies
- Critical blockers that could derail expansion
- Assumptions embedded in their plan that need testing
- Prioritized, sequenced 30-day action plan
- Sharable artifact for team/board alignment

**The report answers:** "Am I ready? What's blocking me? What should I do first?"

### 1.3 The Core Distinction

| Console | Report |
|---------|--------|
| Input mode | Output mode |
| Topic-by-topic | Cross-cutting synthesis |
| "What have I covered?" | "What does it all mean?" |
| Present-focused | Future-focused |
| For the founder | For the founder + their team |

---

## Part 2: Two Distinct States

The report has two fundamentally different states based on assessment completeness.

### 2.1 INCOMPLETE Assessment (< 60% coverage OR any domain < 2 topics)

**User mindset:** "I'm in progress. What can I learn so far? Why should I continue?"

**Report goals:**
1. Acknowledge their progress (respect time invested)
2. Provide synthesis value from partial data (NOT topic repetition)
3. Motivate completion with preview of full report value
4. Guide specific next topics to cover
5. Enable progress sharing

**What the report shows:**
- Assessment progress with clear threshold to unlock full report
- 2-4 "Early Signals" — cross-domain patterns from covered topics
- "What You'll Unlock" preview of full report deliverables
- 3 recommended next topics with "why" and "what this unlocks"
- Simplified export options

**What the report does NOT show:**
- Per-topic insights (that's redundant with console)
- Requirements breakdowns (that's console data)
- Any readiness verdict (insufficient data)
- Full action plan (requires complete data)

### 2.2 COMPLETE Assessment (≥ 60% coverage AND all domains ≥ 2 topics)

**User mindset:** "I'm done inputting. Tell me where I stand and what to do."

**Report goals:**
1. Deliver clear, defensible readiness verdict
2. Surface critical blockers with source traceability
3. Identify assumptions that need validation before commitment
4. Provide actionable 30-day plan prioritized by impact
5. Enable comprehensive sharing with full context

**What the report shows:**
- Readiness verdict (Ready / Ready with Caveats / Not Yet Ready)
- One-paragraph verdict summary with domain-specific rationale
- Domain breakdown showing BOTH coverage AND confidence
- Critical blockers (derived from uncovered topics + LOW confidence)
- Assumptions to validate (derived from MEDIUM confidence)
- 30-day action plan grouped by week
- Full export with shareable context

---

## Part 3: Complete Requirements

### 3.1 Incomplete Assessment — UI Sections

#### Section 1: Assessment Progress

**Purpose:** Immediate orientation on progress and what's needed.

**Content:**
- Current progress: "X of 25 topics covered (Y%)"
- Progress bar showing distance to 60% threshold
- Domain breakdown (single line each):
  - Domain name
  - Progress bar (coverage)
  - X/5 count
  - Status indicator (✓ if ≥ 2 topics, "← Need 2+" if < 2)

**Visual treatment:**
- Card with white background, subtle border
- Muted colors — this is status, not celebration
- Clear visual distinction between complete/incomplete domains

**Size:** Maximum 200px height

#### Section 2: Early Signals

**Purpose:** Provide synthesis value from partial data.

**Critical rule:** This section shows CROSS-DOMAIN PATTERNS, not per-topic summaries.

**Content:** 2-4 signal cards, each with:
- Signal type badge: STRENGTH / PATTERN / RISK / UNKNOWN
- Signal title (one line)
- Signal description (2-3 sentences) — the actual insight
- "Derived from:" list of contributing topics
- "Blocked by:" if relevant (domains needing coverage)
- Implication statement (why this matters)

**Example signals:**
- STRENGTH: "Strong product-market foundation" — derived from alignment across Market and Product domains
- PATTERN: "Existing U.S. traction validates demand" — blocked by GTM domain incomplete
- UNKNOWN: "Execution capability unclear" — 70% of expansion failures are execution failures

**Visual treatment:**
- Each signal is a distinct card
- Type badge uses appropriate color (teal/blue/amber/gray)
- Compact but readable

**AI prompt requirements:**
```
Analyze covered topics and generate 2-4 cross-domain signals.
DO NOT summarize individual topics.
DO identify patterns across topics.
DO explain implications and dependencies.
DO note what's blocked by uncovered domains.
```

#### Section 3: What You'll Unlock

**Purpose:** Motivate completion by showing concrete deliverables.

**Content:**
- Header: "Complete Your Assessment to Unlock"
- 4 unlock items with icons:
  - Readiness Verdict (Target icon, teal)
  - Critical Blockers (Alert icon, red)
  - Assumptions to Validate (Question icon, amber)
  - 30-Day Action Plan (List icon, blue)
- Each item: icon + title + one-line description
- Primary CTA: "Continue Assessment" button

**Visual treatment:**
- Clean, aspirational design
- Icons provide visual hierarchy
- Button is prominent (accent blue)

#### Section 4: Recommended Next Topics

**Purpose:** Remove decision paralysis with personalized guidance.

**Content:** 3 topic recommendations, each with:
- Topic path: "Domain → Topic name"
- Impact badge: "HIGH IMPACT"
- "Why:" 2 sentences explaining strategic importance
- "This will unlock:" list of what completing this topic enables

**Example:**
```
GTM → Sales model                                    HIGH IMPACT

Why: Your product-market fit is strong, but we can't assess your
ability to capture this market without understanding your sales approach.

This will unlock: GTM confidence assessment, sales-related blockers,
channel strategy recommendations
```

**AI prompt requirements:**
```
Based on current coverage, recommend 3 topics that:
1. Address the largest gaps in cross-domain analysis
2. Unlock the most insight when combined with existing coverage
3. Are strategically important for U.S. expansion

For each, explain WHY given their specific situation.
```

**Visual treatment:**
- Numbered cards with clear hierarchy
- Impact badge draws attention
- Deep link to specific topic (not just workspace)

#### Section 5: Export (Simplified)

**Content:**
- "Download Progress Report" button (secondary)
- "Email to Team" option
- Note: "Full export with action plan available after assessment complete."

---

### 3.2 Complete Assessment — UI Sections

#### Section 1: Assessment Overview (Readiness Verdict)

**Purpose:** Answer "Am I ready?" immediately.

**Content:**

**Verdict card:**
- Readiness icon (●/◐/○)
- Readiness level: "Ready to Execute" / "Ready with Caveats" / "Not Yet Ready"
- Coverage stat: "X/25 topics (Y%)"
- Verdict summary: 2-3 sentence paragraph explaining the verdict

**Domain breakdown:**
- 5 domain rows, each showing TWO metrics:
  - Domain name
  - Coverage: progress bar + "X/5"
  - Confidence: badge (HIGH/MED/LOW)

**Key stats line:**
- "X high-confidence inputs • Y critical blockers • Z assumptions to validate"

**Visual treatment:**
- Verdict card uses readiness-appropriate background:
  - Ready: #DDEDEA (teal bg)
  - Ready with Caveats: #FAEBDD (amber bg)
  - Not Yet Ready: #FBE4E4 (red bg)
- Domain rows are compact (40px each)
- This section fits above the fold on desktop

**Readiness level calculation:**

```
NOT YET READY if:
- ≥ 2 domains have LOW confidence, OR
- ≥ 3 CRITICAL blockers identified, OR
- Any domain has 0 HIGH confidence topics

READY WITH CAVEATS if:
- No domain has majority LOW confidence, AND
- ≤ 2 CRITICAL blockers, AND
- ≥ 2 domains have HIGH confidence, AND
- Has MEDIUM confidence assumptions to validate

READY TO EXECUTE if:
- ≥ 4 domains have HIGH confidence, AND
- 0 CRITICAL blockers, AND
- ≤ 2 assumptions to validate, AND
- All domains have ≥ 1 HIGH confidence topic
```

#### Section 2: Critical Actions (Blockers)

**Purpose:** Surface issues that could derail expansion.

**Content header:**
- "Critical Actions" title (red theme)
- Subtitle: "Address before major investment"
- Count badge: "X items"

**Each blocker card:**
- Priority number (1, 2, 3...)
- Blocker title (one line)
- Source traceability: "Source: Domain → Topic (status)"
- Description: 2-3 sentences explaining the issue
- Action: specific next step

**Source traceability rule:**
Every blocker MUST trace to either:
- An uncovered topic: "GTM → Sales model (not covered)"
- A LOW confidence topic: "Operations → Compliance (LOW confidence)"

**Visual treatment:**
- Red theme (#E03E3E)
- Cards have red left border
- Cards have light red background (#FBE4E4)
- Numbered for prioritization

**AI prompt requirements:**
```
Generate critical blockers from:
1. Uncovered topics that are strategically critical
2. LOW confidence topics with concerning inputs
3. Cross-domain dependencies that are unfulfilled

Each blocker must:
- Have clear source traceability
- Explain why it's a blocker (not just what's missing)
- Provide specific, actionable next step
```

#### Section 3: Assumptions to Validate

**Purpose:** Surface beliefs that need testing before commitment.

**Content header:**
- "Assumptions to Validate" title (amber theme)
- Subtitle: "Test before committing resources"
- Count badge: "X items"

**Each assumption card:**
- Half-circle icon (◐)
- Assumption title
- Domain badge
- Source traceability: "Source: Domain → Topic (MEDIUM confidence)"
- Description: why this is an assumption
- Validation: specific way to test

**Visual treatment:**
- Amber theme (#D9730D)
- Cards have amber left border
- Cards have light amber background (#FAEBDD)

**AI prompt requirements:**
```
Generate assumptions from MEDIUM confidence inputs where:
1. User has stated something as fact that is actually unvalidated
2. User is making projections based on home market data
3. There are dependencies between domains that aren't explicitly validated

Each assumption must:
- Identify the specific belief
- Explain why it needs validation
- Provide concrete validation approach
```

#### Section 4: 30-Day Action Plan

**Purpose:** Transform insights into sequenced actions.

**Content header:**
- "30-Day Action Plan" title (blue theme)

**Grouped by week:**
- Week 1: Foundation (address critical blockers)
- Week 2: Validation (test assumptions)
- Weeks 3-4: Execution Prep

**Each action item:**
- Checkbox (visual, not interactive)
- Action text (verb-first)
- Source: "Domain → Topic"
- Unblocks: what this enables

**Visual treatment:**
- Blue theme (#2383E2)
- Week headers with subtle separators
- Checkbox provides visual tracking affordance
- Maximum 8-10 actions total

**Sequencing logic:**
1. Dependency order (what unblocks other things)
2. Lead time (what takes longest)
3. Risk reduction (critical blockers first)

#### Section 5: Export

**Content:**
- "Download PDF" button (primary)
- "Email Report" button (secondary)
- "Key Stats for Your Deck" (collapsible) — pre-formatted snippets

---

## Part 4: What the Report Does NOT Include

These decisions are as important as what's included:

### 4.1 NO Per-Topic Detail in Main View

The console shows per-topic insights. The report does NOT repeat these. If users want topic-level detail, they return to the console.

**Rationale:** Redundancy destroys value. The report must provide transformation, not compression.

### 4.2 NO Requirements Breakdown

V3 showed requirements (✓/△/○) for each topic. This is removed.

**Rationale:** Requirements breakdowns triple card height and add no synthesis value. They're useful in the console for input guidance, not in the report for output consumption.

### 4.3 NO Expanded Domain Sections by Default

Complete reports do NOT show expanded domain details. If added later, they must be collapsed by default.

**Rationale:** The report is synthesis-first. Detail is available in the console.

### 4.4 NO Scores or Percentages for Readiness

We use qualitative levels (Ready/Ready with Caveats/Not Yet Ready), not scores.

**Rationale:** Scores imply false precision. A "72% ready" score is meaningless. Qualitative levels with explanation are actionable.

### 4.5 NO Generic Advice

Every insight, blocker, assumption, and action must be derived from the user's specific inputs.

**Rationale:** Generic advice destroys credibility. If it could apply to any company, it's not valuable.

---

## Part 5: Design System Reference

### 5.1 Colors

**Readiness/Confidence:**
- HIGH / Ready: #0F7B6C (teal), bg #DDEDEA
- MEDIUM / Ready with Caveats: #D9730D (amber), bg #FAEBDD
- LOW / Not Yet Ready: #E03E3E (red), bg #FBE4E4

**UI:**
- Primary text: #37352F
- Secondary text: #5C5A56
- Tertiary text: #9B9A97
- Page background: #FAF9F7
- Card background: #FFFFFF
- Borders: #E8E6E1
- Accent (CTAs): #2383E2

### 5.2 Typography

- Page title: 24px/600
- Section headers: 16px/600
- Subsection labels: 11px/500 uppercase, #9B9A97
- Body text: 14px/400
- Supporting text: 13px/400
- Captions: 12px/400

### 5.3 Spacing

- Card padding: 16-24px
- Section spacing: 24px
- Content max-width: 720px

---

## Part 6: AI Synthesis Requirements

### 6.1 Incomplete Assessment Prompt

```
You are analyzing a PARTIAL U.S. expansion readiness assessment.

CONTEXT:
- Assessment is incomplete (< 60% coverage or missing domain coverage)
- User has provided inputs for: [covered topics with confidence levels]
- User has NOT covered: [uncovered topics by domain]

YOUR TASK: Generate cross-domain SYNTHESIS, not per-topic summaries.

GENERATE:

1. early_signals: Array of 2-4 CrossDomainSignal objects
   - Look for PATTERNS across covered topics
   - Identify what can be inferred from combinations
   - Note what's BLOCKED by missing domains
   - Each signal has: type, title, description, derived_from, blocked_by?, implication

2. recommended_topics: Array of 3 TopicRecommendation objects
   - Prioritize topics that unlock cross-domain insights
   - Explain WHY each matters given their specific coverage
   - Explain what each UNLOCKS

RULES:
- DO NOT repeat individual topic key_insights
- DO NOT summarize what user said
- DO synthesize what patterns mean
- DO connect domains to each other
```

### 6.2 Complete Assessment Prompt

```
You are analyzing a COMPLETE U.S. expansion readiness assessment.

CONTEXT:
- All domains have sufficient coverage
- User confidence levels: [domain confidence breakdowns]
- Covered topics: [full list with confidence levels]

YOUR TASK: Generate actionable synthesis with source traceability.

GENERATE:

1. readiness_level: 'ready' | 'ready_with_caveats' | 'not_ready'
   Apply criteria strictly:
   - not_ready: ≥2 domains LOW OR ≥3 critical blockers
   - ready_with_caveats: mixed confidence, has assumptions
   - ready: ≥4 domains HIGH, no critical blockers

2. verdict_summary: String (2-3 sentences)
   - Reference specific domains by name
   - Explain the verdict reasoning
   - Point to most important next action

3. critical_actions: Array of CriticalAction objects
   - Derived from uncovered topics (if any) and LOW confidence topics
   - Each MUST have source_domain, source_topic, source_status
   - Each MUST have specific, actionable next step

4. assumptions: Array of AssumptionV3 objects
   - Derived from MEDIUM confidence topics
   - Identify unstated beliefs that need testing
   - Provide specific validation approach

5. action_plan: Array of ActionPlanItem objects
   - Week 1: Critical blocker actions
   - Week 2: Assumption validation actions
   - Weeks 3-4: Execution preparation
   - Each has: week, action, source_domain, source_topic, unblocks

RULES:
- Every blocker traces to a specific topic
- Every assumption traces to MEDIUM confidence
- Actions are sequenced by dependency
- No generic advice — everything is specific to their inputs
```

---

## Part 7: Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time on report page | > 90 seconds | Analytics |
| Assessment completion after incomplete report | +25% vs. baseline | Funnel analysis |
| PDF download rate | > 50% | Event tracking |
| Report regeneration rate | < 20% | Event tracking |
| User satisfaction | > 4/5 | Post-export prompt |

---

## Part 8: Anti-Requirements (Explicitly Out of Scope)

1. **Editable action plans** — Users can't modify the plan in the report
2. **Interactive checkboxes** — Visual only, not functional
3. **Comparison to other founders** — No benchmarking
4. **Progress since last report** — No version comparison
5. **Real-time updates** — Report is a snapshot, not live
6. **Collapsible domain details** — Removed; console serves this

---

## Part 9: Implementation Notes

### 9.1 Data Structure

```typescript
interface SnapshotV5 {
  // Status
  assessment_status: 'incomplete' | 'complete';
  coverage_percentage: number;
  topics_covered: number;
  topics_total: number;

  // Incomplete-only fields
  early_signals?: CrossDomainSignal[];
  recommended_topics?: TopicRecommendation[];

  // Complete-only fields
  readiness_level?: ReadinessLevel;
  verdict_summary?: string;
  critical_actions?: CriticalAction[];
  assumptions?: AssumptionV3[];
  action_plan?: ActionPlanItem[];

  // Always present
  domains: Record<DomainType, DomainResult>;
  key_stats: KeyStats;
}
```

### 9.2 Component Architecture

**Incomplete Report:**
1. AssessmentProgress
2. EarlySignals
3. UnlockPreview
4. RecommendedTopics
5. ExportSection (simplified)

**Complete Report:**
1. AssessmentOverview (verdict + domains)
2. ActionPlanUnified (blockers + assumptions + 30-day plan)
3. ExportSection (full)

### 9.3 Printer-Friendly Requirements

- No collapsible elements (all content visible)
- No interactive components (buttons hidden in print)
- Single-column layout
- Appropriate page breaks between sections

---

## Approval

This PRD supersedes all previous specifications. Implementation should begin only after sign-off.

**Required sign-off:**
- [ ] Founder / CEO
- [ ] Head of Design
- [ ] Engineering Lead

---

## Appendix: Design Review Notes

*Space for lead designer feedback on implementation approach*

### Design Considerations

1. **Density vs. Readability Trade-off**
   - Incomplete report should feel "light" — motivating, not overwhelming
   - Complete report should feel "substantial" — worth the investment
   - Both should scan quickly with clear hierarchy

2. **Trust Signals**
   - Source traceability builds credibility
   - Specific language (not vague) builds trust
   - Clear methodology (readiness criteria) prevents "how did you decide this?"

3. **Emotional Journey**
   - Incomplete: "You've made progress, here's what you've learned, here's what's waiting"
   - Complete (Ready): "Validated, clear path forward, confidence to act"
   - Complete (Not Ready): "Honest assessment, specific blockers, actionable path to ready"

4. **Shareability**
   - Report should stand alone without console context
   - PDF should look professional for board/investor sharing
   - Key stats should be copy-pasteable for decks


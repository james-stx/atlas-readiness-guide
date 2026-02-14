# Readiness Report V4 — Comprehensive Redesign

**Date:** 2026-02-14
**Author:** Head of Product
**Status:** Design Proposal
**Supersedes:** V3 Redesign, Post-Mortem recommendations

---

## Part 1: First Principles Analysis

### 1.1 What IS a Report?

A report is not a summary. A report is not a repeat of source data. A report is a **synthesis document** that transforms raw inputs into actionable intelligence.

The key distinction:
- **Summary**: "Here's what you said" (compression)
- **Synthesis**: "Here's what it means" (transformation)

Our V3 implementation and subsequent fixes have been summaries. We've been compressing console data into report format. This is fundamentally wrong.

### 1.2 What Problem Does the Report Solve?

The console (workspace) solves: "Let me capture my readiness data"
The report must solve: "What does my data MEAN and what should I DO?"

If the report doesn't answer questions the console can't answer, it has no reason to exist.

### 1.3 The Console vs. Report Mental Model

| Dimension | Console | Report |
|-----------|---------|--------|
| **Mode** | Input/Edit | Output/Consume |
| **Perspective** | Topic-by-topic | Cross-cutting |
| **Question answered** | "What have I covered?" | "What does it all mean?" |
| **Time orientation** | Present (capturing now) | Future (what to do next) |
| **Audience** | Self | Self + team/board/investors |
| **Interaction** | Active (clicking, typing) | Passive (reading, sharing) |

### 1.4 Why "Just Remove Everything" Is Wrong

The post-mortem recommended showing only "status + CTA" for incomplete assessments. While this addresses the redundancy problem, it creates new problems:

**Second-order consequences of minimal incomplete report:**

1. **Devalues user investment** — They spent 20+ minutes providing data. A bare status screen says "your input doesn't matter yet."

2. **Removes motivation** — Without a preview of value, why would they complete? "Continue Assessment" is a demand, not an invitation.

3. **Misses synthesis opportunity** — Even partial data contains patterns. A consultant wouldn't say "come back when you have more data" — they'd say "here's what I can see so far."

4. **Breaks the value proposition** — If the incomplete report is worthless, users may never generate a complete one. They'll think "why bother?"

5. **Ignores the shareability use case** — Founders often share progress with co-founders/advisors. An empty report can't be shared meaningfully.

### 1.5 Why "Show Everything" Is Also Wrong

The V3 implementation showed all topic details. This is equally problematic:

**Second-order consequences of verbose incomplete report:**

1. **Redundancy destroys credibility** — If the report shows what I already see in the console, I lose trust in its value.

2. **Length implies completeness** — A long report suggests a complete analysis. When it's actually just data repetition, users feel deceived.

3. **Buries the CTA** — If I have to scroll through 10 topic cards to find "Continue Assessment," I might never get there.

4. **Wrong mental framing** — Detailed topic cards suggest the assessment IS complete. Mixed messaging confuses users.

5. **No transformation** — Showing the same insights in a different layout isn't synthesis. It's just reformatting.

### 1.6 The Correct Answer: Synthesis-First Design

The report must TRANSFORM data, not REPEAT it. For both incomplete and complete states, we need to ask: "What can I tell the user that they can't see in the console?"

---

## Part 2: Deep Analysis of Current Failures

### 2.1 Failure: Conflating Coverage and Confidence

**Current state:** Domain rows show dots that represent COVERAGE (topics completed).

**Spec requirement:** V3 spec clearly defines TWO distinct metrics:
- Coverage: How many topics are completed (progress bar, X/5)
- Confidence: Quality of inputs across completed topics (HIGH/MED/LOW)

**Why this matters:**
- A user with 5/5 topics at LOW confidence is NOT ready
- A user with 3/5 topics at HIGH confidence might be closer to ready
- These are orthogonal dimensions that both matter

**Root cause:** We implemented the easier metric (coverage) and skipped the harder one (confidence aggregation).

**Second-order consequence:** Users can't understand WHY they got a particular readiness verdict. The report loses explainability.

### 2.2 Failure: No Cross-Domain Synthesis

**Current state:** Each domain is shown independently. Market insights, Product insights, etc.

**What's missing:** Cross-domain patterns that only emerge when you look at the whole picture:
- "Your strong product readiness is undermined by weak GTM planning"
- "Market validation is high but operational capability to serve that market is unclear"
- "Financial projections assume sales capacity you haven't defined"

**Why this matters:** The VALUE of the report is seeing connections the user can't see while inputting topic-by-topic.

**Root cause:** Our AI synthesis prompt generates per-domain outputs. We never ask it to find cross-domain patterns.

**Second-order consequence:** The report feels like 5 separate mini-reports, not one coherent analysis.

### 2.3 Failure: Insights Without Implications

**Current state:** "Preliminary Insights" shows key observations from each topic.

**What's missing:** The "so what?" for each insight:
- Current: "Ideal customer is 50-500 employee SMB in tech-enabled services"
- Missing: "This ICP is well-defined but you haven't explained how you'll reach them (GTM gap)"

**Why this matters:** An insight without implication is just data. Implications create action.

**Root cause:** Our prompts extract insights but don't chain them to consequences.

**Second-order consequence:** Users read the insights, nod, and don't know what to do differently.

### 2.4 Failure: Generic Guidance

**Current state:** "Complete at least 15 topics (60%) with coverage in all 5 domains for your full readiness report."

**What's missing:** PERSONALIZED guidance based on their actual situation:
- "You've nailed Market and Product. Your GTM coverage is the critical gap — start with 'Sales model' and 'Channel strategy'"
- "Your 10 completed topics are clustered in two domains. Spread your coverage to unlock cross-domain insights."

**Why this matters:** Generic advice feels automated. Personalized guidance feels human and actionable.

**Root cause:** We hardcoded the completion requirements instead of dynamically analyzing their specific gaps.

**Second-order consequence:** Users don't know WHERE to focus. They might complete random topics instead of strategic ones.

### 2.5 Failure: No Preview of Unlocked Value

**Current state:** The incomplete report doesn't show what the complete report will contain.

**What's missing:** A compelling preview:
- "Complete your assessment to unlock:"
- "→ Readiness verdict with domain-by-domain confidence"
- "→ 2-3 critical blockers you must address before investing"
- "→ Assumptions that could derail your expansion"
- "→ 30-day action plan prioritized by impact"

**Why this matters:** Users are more motivated when they can see the destination.

**Root cause:** We focused on the incomplete state in isolation, not as a step toward the complete state.

**Second-order consequence:** Users don't have a mental model of what "done" looks like. Completion feels arbitrary.

### 2.6 Failure: Report Doesn't Stand Alone

**Current state:** The report assumes context from the console session.

**What's missing:** Self-contained context for sharing:
- Who is this company?
- What stage are they at?
- What's their expansion goal?

**Why this matters:** Founders share reports with co-founders, advisors, board members. Those people weren't in the console session.

**Root cause:** We designed for the user who just completed the session, not for secondary audiences.

**Second-order consequence:** Shared reports lack context, reducing their usefulness for team alignment.

---

## Part 3: What the Report SHOULD Contain

### 3.1 For INCOMPLETE Assessments

The incomplete report must accomplish five goals:
1. Acknowledge progress (respect their time)
2. Provide immediate value (synthesis of partial data)
3. Show what's missing and why it matters
4. Guide specific next actions
5. Preview the complete report value

#### Section 1: Assessment Status (Compact)

**Purpose:** Quick orientation — where do I stand?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ASSESSMENT IN PROGRESS                                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ○  10 of 25 topics covered (40%)                                   │   │
│  │                                                                      │   │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░  Progress to full report      │   │
│  │                                        ─────────────────────────     │   │
│  │                                        Need 15 topics (60%)          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DOMAIN COVERAGE                                                            │
│                                                                             │
│  Market       ████████████████████  5/5  ✓ Complete                        │
│  Product      ████████████████████  5/5  ✓ Complete                        │
│  GTM          ░░░░░░░░░░░░░░░░░░░░  0/5  ← Start here                      │
│  Operations   ░░░░░░░░░░░░░░░░░░░░  0/5  ← Then here                       │
│  Financials   ░░░░░░░░░░░░░░░░░░░░  0/5  ← Then here                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key differences from current:**
- Progress bar shows distance to threshold, not just current state
- "Start here" / "Then here" provides sequenced guidance
- Domain rows use progress bars (spec-compliant), not just dots

#### Section 2: Early Signals (SYNTHESIS — Not Repetition)

**Purpose:** Transform partial data into cross-domain insights they can't see in console.

This section does NOT show per-topic insights. It shows PATTERNS across what they've covered.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  EARLY SIGNALS                                                              │
│  What we can see from your inputs so far                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                             STRENGTH │   │
│  │  Strong product-market foundation                                    │   │
│  │                                                                      │   │
│  │  Your Market and Product domains show alignment: you've identified   │   │
│  │  a clear ICP (50-500 employee SMBs) and built a product that        │   │
│  │  addresses their specific pain points. This foundation typically    │   │
│  │  correlates with successful expansion.                              │   │
│  │                                                                      │   │
│  │  Derived from: Target customer profile, What you're selling,        │   │
│  │  Product-market fit evidence                                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                              PATTERN │   │
│  │  Existing U.S. traction validates demand                             │   │
│  │                                                                      │   │
│  │  You mentioned early U.S. customers with successful implementations. │   │
│  │  This is a positive signal, but we can't yet assess whether your    │   │
│  │  GTM approach can scale this traction — that domain is uncovered.   │   │
│  │                                                                      │   │
│  │  Derived from: Existing U.S. presence, Market size estimate         │   │
│  │  Blocked by: GTM domain incomplete                                   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                              UNKNOWN │   │
│  │  Execution capability unclear                                        │   │
│  │                                                                      │   │
│  │  Strong market/product fit means nothing without GTM, Operations,   │   │
│  │  and Financials coverage. We can't assess your ability to execute   │   │
│  │  until these domains are covered.                                    │   │
│  │                                                                      │   │
│  │  This matters because: 70% of expansion failures are execution      │   │
│  │  failures, not market/product failures.                              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key differences from current "Preliminary Insights":**
- Shows PATTERNS, not per-topic summaries
- Cross-domain connections explicitly called out
- "Derived from" provides traceability without showing full detail
- "Blocked by" shows what's preventing deeper analysis
- Each signal has an implication, not just an observation

#### Section 3: What You'll Unlock

**Purpose:** Motivate completion by previewing concrete value.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  COMPLETE YOUR ASSESSMENT TO UNLOCK                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  📊  READINESS VERDICT                                               │   │
│  │      Clear assessment: Ready / Ready with Caveats / Not Ready       │   │
│  │      with domain-by-domain confidence breakdown                      │   │
│  │                                                                      │   │
│  │  🚨  CRITICAL BLOCKERS                                               │   │
│  │      Specific issues that would derail your expansion               │   │
│  │      with source traceability and recommended actions                │   │
│  │                                                                      │   │
│  │  ⚠️  ASSUMPTIONS TO VALIDATE                                         │   │
│  │      Beliefs embedded in your plan that need testing                │   │
│  │      before committing resources                                     │   │
│  │                                                                      │   │
│  │  📋  30-DAY ACTION PLAN                                              │   │
│  │      Prioritized, sequenced actions organized by week               │   │
│  │      with dependency mapping                                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                        [Continue Assessment →]                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this matters:**
- Users can visualize the end state
- Each bullet is a concrete deliverable, not vague promise
- Creates pull (wanting to see their blockers) vs. push (being told to complete)

#### Section 4: Recommended Next Topics

**Purpose:** Remove decision paralysis by telling them exactly where to focus.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  RECOMMENDED NEXT TOPICS                                                    │
│  Based on your coverage, these will unlock the most insight                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. GTM → Sales model                                    HIGH IMPACT │   │
│  │                                                                      │   │
│  │     Why: Your product-market fit is strong, but we can't assess     │   │
│  │     your ability to capture this market without understanding       │   │
│  │     your sales approach.                                             │   │
│  │                                                                      │   │
│  │     This will unlock: GTM confidence assessment, sales-related      │   │
│  │     blockers, channel strategy recommendations                       │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. Operations → U.S. team structure                     HIGH IMPACT │   │
│  │                                                                      │   │
│  │     Why: Execution requires people. We need to understand your      │   │
│  │     operational capacity to assess realistic timelines.              │   │
│  │                                                                      │   │
│  │     This will unlock: Operational confidence, hiring-related        │   │
│  │     blockers, resource allocation recommendations                    │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. Financials → Pricing strategy                        HIGH IMPACT │   │
│  │                                                                      │   │
│  │     Why: Your market sizing assumes certain price points. We need   │   │
│  │     to validate this assumption isn't overly optimistic.            │   │
│  │                                                                      │   │
│  │     This will unlock: Financial confidence, pricing-related         │   │
│  │     assumptions flagged for validation                               │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Go to GTM → Sales model →]                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key differences from current:**
- Specific topic recommendations, not generic "continue"
- "Why" explains the reasoning
- "This will unlock" shows the value
- Deep link to specific topic, not just workspace

#### Section 5: Export (Simplified for Incomplete)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SHARE PROGRESS                                                             │
│                                                                             │
│  [Download Progress Report]  [Email to Team]                                │
│                                                                             │
│  Note: Full export with action plan available after assessment complete.   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 For COMPLETE Assessments

The complete report has different goals:
1. Deliver clear verdict with full explanation
2. Surface critical blockers with source traceability
3. Identify assumptions that need validation
4. Provide actionable 30-day plan
5. Enable sharing with full context

#### Section 1: Readiness Verdict

Similar to V3 spec but with improvements:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  YOUR READINESS ASSESSMENT                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                          bg: #FAEBDD │   │
│  │  ◐  Ready with Caveats                                               │   │
│  │                                                                      │   │
│  │  You have strong market validation and product readiness. However,   │   │
│  │  your GTM approach has gaps and operational plans are underspecified.│   │
│  │  Address the blockers below before major investment.                 │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DOMAIN CONFIDENCE                                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         COVERAGE              CONFIDENCE             │   │
│  │  Market       ████████████████████  5/5      ●●●●○  HIGH            │   │
│  │  Product      ████████████████████  5/5      ●●●●○  HIGH            │   │
│  │  GTM          ████████████░░░░░░░░  3/5      ●●○○○  MEDIUM          │   │
│  │  Operations   ████████░░░░░░░░░░░░  2/5      ●○○○○  LOW             │   │
│  │  Financials   ████████████████████  5/5      ●●●○○  HIGH            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  KEY STATS                                                                  │
│  20/25 topics covered • 12 high-confidence inputs • 2 critical blockers   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key improvements:**
- TWO metrics per domain (coverage AND confidence) as spec requires
- Verdict includes explicit next action ("Address the blockers below")
- Domain rows show both progress bar AND confidence dots

#### Section 2: Critical Blockers

Per V3 spec but with stricter formatting:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  CRITICAL BLOCKERS                                                 2 items │
│  Address before major investment                                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                          bg: #FBE4E4 │   │
│  │                                                                      │   │
│  │  1  U.S. sales leadership undefined                                  │   │
│  │                                                                      │   │
│  │  Source: GTM → Sales model (not covered)                             │   │
│  │                                                                      │   │
│  │  Your GTM plan depends on U.S. sales leadership, but you haven't    │   │
│  │  defined the role or begun sourcing. This blocks your entire        │   │
│  │  go-to-market timeline.                                              │   │
│  │                                                                      │   │
│  │  Action: Define hiring profile and begin sourcing within 2 weeks    │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                          bg: #FBE4E4 │   │
│  │                                                                      │   │
│  │  2  Regulatory compliance path unclear                               │   │
│  │                                                                      │   │
│  │  Source: Operations → Compliance (LOW confidence)                    │   │
│  │                                                                      │   │
│  │  You're targeting regulated verticals but haven't clarified whether │   │
│  │  HIPAA/FedRAMP/SOC2 Type II applies. This could add 6+ months to    │   │
│  │  your timeline and significant cost.                                 │   │
│  │                                                                      │   │
│  │  Action: Consult U.S. regulatory specialist before product commit   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Section 3: Assumptions to Validate

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ASSUMPTIONS TO VALIDATE                                           3 items │
│  Test before committing resources                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                          bg: #FAEBDD │   │
│  │                                                                      │   │
│  │  ◐  U.S. pricing will match EU pricing                               │   │
│  │                                                                      │   │
│  │  Source: Financials → Pricing strategy (MEDIUM confidence)          │   │
│  │                                                                      │   │
│  │  You're assuming U.S. customers will pay similar to EU. However,    │   │
│  │  U.S. market has different competitive dynamics and buyer           │   │
│  │  expectations around pricing.                                        │   │
│  │                                                                      │   │
│  │  Validate: Price testing with 5-10 U.S. prospects before commit     │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ... additional assumptions ...                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Section 4: 30-Day Action Plan

Per V3 spec, grouped by week with source traceability.

#### Section 5: Domain Deep-Dive (Collapsed by Default)

This is where per-topic details live — but COLLAPSED, not expanded. Users who want detail can expand; the default view is synthesis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  DOMAIN DETAILS                                                    Optional │
│  Expand for topic-by-topic breakdown                                        │
│                                                                             │
│  ▸ Market (5/5 topics, HIGH confidence)                                     │
│  ▸ Product (5/5 topics, HIGH confidence)                                    │
│  ▸ GTM (3/5 topics, MEDIUM confidence)                                      │
│  ▸ Operations (2/5 topics, LOW confidence)                                  │
│  ▸ Financials (5/5 topics, HIGH confidence)                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

When expanded, shows the per-topic cards with requirements (V3 spec Section 2).

#### Section 6: Export

Full export with all options.

---

## Part 4: Implementation Requirements

### 4.1 New AI Synthesis Capabilities

The current AI prompt generates per-topic outputs. We need new synthesis capabilities:

#### Cross-Domain Pattern Detection
```typescript
interface CrossDomainSignal {
  type: 'strength' | 'pattern' | 'risk' | 'unknown';
  title: string;
  description: string;
  derived_from: string[];  // topic IDs
  blocked_by?: string[];   // domain IDs that need coverage
  implication: string;
}
```

#### Personalized Topic Recommendations
```typescript
interface TopicRecommendation {
  domain: DomainType;
  topic_id: string;
  topic_label: string;
  impact: 'high' | 'medium';
  why: string;
  unlocks: string[];
}
```

#### Updated Snapshot Structure
```typescript
interface SnapshotV4 {
  // Assessment status
  assessment_status: 'incomplete' | 'assessable';
  coverage_percentage: number;
  topics_covered: number;
  topics_total: number;

  // For INCOMPLETE assessments
  early_signals?: CrossDomainSignal[];
  recommended_topics?: TopicRecommendation[];

  // For ASSESSABLE assessments
  readiness_level?: 'ready' | 'ready_with_caveats' | 'not_ready';
  verdict_summary?: string;

  // Domain details with DUAL metrics
  domains: {
    [key in DomainType]: {
      topics_covered: number;
      topics_total: number;
      coverage_percentage: number;
      confidence_level: 'high' | 'medium' | 'low';
      confidence_breakdown: { high: number; medium: number; low: number };
      topics: TopicResult[];
    };
  };

  // Actions (for ASSESSABLE only)
  critical_actions: CriticalAction[];
  assumptions: AssumptionV3[];
  action_plan: ActionPlanItem[];
}
```

### 4.2 New Components Required

| Component | Purpose | State |
|-----------|---------|-------|
| `AssessmentProgress` | Progress bar + domain coverage for incomplete | Incomplete only |
| `EarlySignals` | Cross-domain pattern display | Incomplete only |
| `UnlockPreview` | Preview of complete report value | Incomplete only |
| `RecommendedTopics` | Personalized next-topic guidance | Incomplete only |
| `ReadinessVerdict` | Full verdict with dual metrics | Complete only |
| `CriticalBlockers` | Blocker cards with traceability | Complete only |
| `AssumptionsToValidate` | Assumption cards | Complete only |
| `ActionPlan` | 30-day plan grouped by week | Complete only |
| `DomainDeepDive` | Collapsible domain details | Complete only |
| `ExportSection` | Download/email options | Both |

### 4.3 Updated AI Prompts

#### Prompt for Incomplete Assessment Synthesis
```
You are analyzing a partial U.S. expansion readiness assessment.

Covered domains: [list]
Covered topics: [list with confidence levels]
Uncovered domains: [list]

Your task is to synthesize cross-domain patterns, NOT summarize individual topics.

Generate:
1. early_signals: 2-4 cross-domain observations
   - What patterns emerge from the covered topics?
   - What can't be assessed due to uncovered domains?
   - What are the implications of what IS known?

2. recommended_topics: 3 specific topics to cover next
   - Prioritize by: unlocking cross-domain insights, addressing obvious gaps
   - Explain WHY each topic matters given current coverage
   - Explain what each topic will UNLOCK

Do NOT repeat individual topic insights. Synthesize.
```

#### Prompt for Complete Assessment Synthesis
```
You are analyzing a complete U.S. expansion readiness assessment.

[All domain data with confidence levels]

Generate:
1. readiness_level: Based on the criteria:
   - NOT_READY: ≥2 domains LOW confidence OR ≥3 critical gaps
   - READY_WITH_CAVEATS: No majority LOW, ≤2 critical gaps, has assumptions
   - READY: ≥4 domains HIGH confidence, 0 critical gaps

2. verdict_summary: One paragraph explaining the verdict
   - Reference specific domain strengths/weaknesses
   - Call out the most important next action

3. critical_actions: Derived from uncovered topics OR low-confidence topics
   - Each must have source traceability
   - Each must have specific, actionable next step

4. assumptions: Derived from MEDIUM confidence inputs
   - Identify beliefs that need testing
   - Provide specific validation approach

5. action_plan: 30-day sequenced plan
   - Week 1: Address critical blockers
   - Week 2: Validate key assumptions
   - Weeks 3-4: Execution preparation
```

---

## Part 5: Second-Order Consequences Analysis

### 5.1 If We Implement This Correctly

**Positive consequences:**
- Reports become genuinely valuable, distinct from console
- Users have clear motivation to complete assessment
- Shared reports serve team alignment function
- Cross-domain insights create "aha moments"
- Personalized guidance increases completion rates
- Trust in product increases

**Potential risks:**
- More complex AI synthesis may produce inconsistent results
- Cross-domain pattern detection is harder to validate
- Longer report generation time
- More edge cases to handle

**Mitigations:**
- Extensive prompt engineering and testing
- Fallback to simpler output if synthesis fails
- Loading state that sets expectations
- Graceful degradation for edge cases

### 5.2 If We Keep Current Implementation

**Negative consequences:**
- Reports remain redundant with console
- Users don't understand report value
- Completion rates stay low
- Shared reports lack context
- Trust in product erodes
- Churn risk increases

### 5.3 If We Go "Minimal" (Post-Mortem Approach)

**Mixed consequences:**
- Redundancy problem solved
- But value problem introduced
- Users may never generate second report
- Incomplete experience feels broken
- Differentiator lost (console IS the product)

---

## Part 6: Implementation Priority

### Phase 1: Core Structure (3 days)

1. Update SnapshotV4 type definition
2. Update AI prompt for cross-domain synthesis
3. Create `AssessmentProgress` component
4. Create `EarlySignals` component
5. Create `UnlockPreview` component
6. Create `RecommendedTopics` component
7. Assemble incomplete report page

### Phase 2: Complete Report Polish (2 days)

1. Update domain rows to show dual metrics
2. Ensure domain deep-dive is collapsed by default
3. Verify source traceability on all cards
4. Test with realistic data

### Phase 3: Quality & Edge Cases (2 days)

1. Test AI synthesis with various coverage patterns
2. Handle edge cases (all LOW confidence, very sparse data)
3. Mobile responsiveness pass
4. PDF export updates

---

## Part 7: Success Metrics

| Metric | Current Baseline | Target | Measurement |
|--------|------------------|--------|-------------|
| Report page time | Unknown | >90 seconds | Analytics |
| Completion rate after incomplete report | Unknown | +20% vs control | A/B test |
| PDF download rate | Unknown | >50% | Event tracking |
| Return to complete assessment | Unknown | >40% | Funnel analysis |
| User feedback on value | Unknown | >4/5 | Prompt after export |

---

## Appendix A: Comparison Table

| Aspect | Current Implementation | Post-Mortem Recommendation | V4 Proposal |
|--------|----------------------|---------------------------|-------------|
| Incomplete: Topic details | Shows all 10 | Remove entirely | Transform into cross-domain signals |
| Incomplete: Value proposition | None | None (just CTA) | Preview + personalized guidance |
| Incomplete: Next action | Generic "continue" | Generic "continue" | Specific topic with deep link |
| Complete: Domain metrics | Coverage only | Unspecified | Dual metrics (coverage + confidence) |
| Complete: Topic details | Expanded | Collapsed | Collapsed by default |
| Synthesis level | Per-topic | Unspecified | Cross-domain patterns |
| Shareability | Limited | Unaddressed | Self-contained context |

---

## Appendix B: Questions for Review

1. **Early Signals complexity**: Is 2-4 signals the right number? Should it be dynamic based on coverage?

2. **Recommended Topics**: Should we always recommend 3, or vary based on what's uncovered?

3. **Cross-domain synthesis reliability**: How do we handle cases where AI generates weak patterns?

4. **Unlock Preview**: Is listing deliverables enough, or should we show sample/placeholder content?

5. **Deep-dive collapse**: Should complete reports ever auto-expand domains, or always start collapsed?

---

**Sign-off required from:**
- [ ] Founder
- [ ] Head of Design
- [ ] Engineering Lead

**Estimated implementation:** 7 days total

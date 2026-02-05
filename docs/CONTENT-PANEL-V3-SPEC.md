# Content Panel V3 — Insight-Rich Category Display

**Date:** 2025-02-06
**Parent doc:** [FOUNDER-FEEDBACK-V3-PLAN.md](./FOUNDER-FEEDBACK-V3-PLAN.md)
**Design tokens:** [DESIGN-SYSTEM-V3.md](./DESIGN-SYSTEM-V3.md)

---

## Problem

The founder's feedback: *"All I see is a quote from our chats that is relevant to the topic, the topic's rating, and an 'edit' and 'view in chat' buttons."*

The Content Panel should be the most valuable screen in the product — where users see their readiness picture forming in real time. Currently it's a glorified transcript viewer.

---

## Data Available (Already in the System)

| Data | Source | Currently Used? |
|------|--------|-----------------|
| User's verbatim input | `input.user_response` | Yes |
| Confidence level | `input.confidence_level` | Yes (badge only) |
| Confidence rationale | `input.confidence_rationale` | Yes (text) |
| Input metadata | `input.metadata` | No — empty object |
| Input timestamp | `input.created_at` | No |
| All chat messages | `messages[]` | No (only in chat panel) |
| Domain progress | `progressState.domainProgress` | Partially (counts only) |
| Snapshot readiness | `progressState.snapshotReadiness` | No |
| Gap suggestions | Derivable from progress | No |
| Topic descriptions | Could add to config | Not available yet |

---

## New Data to Generate

### Per-Input Metadata (AI-Generated at Capture Time)

When the AI agent captures an input, it should also generate and store:

```typescript
interface InputInsight {
  // Concise synthesis — what did the user actually tell us?
  key_insight: string;           // 1-2 sentences, plain language

  // Analysis points — what does this input mean for readiness?
  strengths: string[];           // Things that are solid (max 3)
  considerations: string[];     // Things to think about (max 2)

  // Suggested follow-up — what would make this input stronger?
  follow_up?: string;            // Optional question to deepen the input
}
```

**Storage:** `input.metadata.insight` field in the existing `metadata` JSONB column.

**Generation:** Extend the conversation agent's system prompt to return this structured data alongside the input capture. This happens in `apps/api/src/lib/ai/agents/conversation.ts`.

### Per-Domain Summary (Generated on Navigation)

When the user navigates to a domain that has 2+ inputs, generate a domain-level summary:

```typescript
interface DomainSummary {
  // 2-3 sentence synthesis across all inputs in this domain
  summary: string;

  // Which uncovered topic would be most impactful to discuss next
  suggested_next: {
    topic_id: string;
    reason: string;              // Why this topic matters most right now
  };
}
```

**Storage:** Cache client-side in workspace context (keyed by domain + input count). Regenerate when input count changes.

**Generation:** New API endpoint `POST /api/domain-summary` or extend existing session endpoint.

---

## Component Architecture

### Content Panel Layout

```
ContentPanel
├── ContentDomainHeader        (domain name, description, summary, progress)
│   ├── DomainInsightCard      (AI summary + confidence breakdown + suggested next)
│   └── ProgressMini           (3/5 bar)
├── CategoryCard[]             (one per topic with input)
│   ├── CardHeader             (topic name + confidence badge)
│   ├── KeyInsight             (AI-generated synthesis)
│   ├── UserInput              (verbatim quote, collapsible)
│   ├── AnalysisPoints         (strengths ✓ + considerations △)
│   ├── CardFooter             (timestamp, source, actions)
│   └── FollowUpPrompt        (optional deepening question)
├── NotStartedCard[]           (one per topic without input)
│   ├── TopicLabel             (name)
│   ├── TopicDescription       (why this matters)
│   └── StartButton            (opens chat to this topic)
└── InlineSnapshotCTA          (when domain ≥ 60% complete)
```

### CategoryCard — Detailed Spec

#### Collapsed State (Default for Non-Selected Cards)

```
┌──────────────────────────────────────────────────┐
│  Why expand to the U.S.?                  HIGH   │
│  Strong demand signals from enterprise SaaS      │  ← key_insight (1 line)
│  companies, with 40% QoQ inquiry growth.         │
└──────────────────────────────────────────────────┘
```

- Shows: topic label, confidence badge, key insight (truncated to 2 lines)
- Click anywhere to expand
- 16px padding, 8px radius, 1px `warm-150` border

#### Expanded State

```
┌──────────────────────────────────────────────────┐
│  Why expand to the U.S.?                  HIGH   │
│                                                  │
│  KEY INSIGHT                                     │  section label: 11px/500, warm-500
│  Strong demand signals from enterprise SaaS      │  body: 14px/400, warm-800
│  companies in the U.S. market, with inbound      │
│  inquiries increasing 40% quarter over quarter.  │
│                                                  │
│  YOUR INPUT                                      │  section label
│  ┌──────────────────────────────────────────────┐│
│  │ "We've been getting a lot of inbound from    ││  13px/400, warm-700
│  │ U.S. enterprise companies. About 40% more    ││  bg: warm-50
│  │ inquiries this quarter compared to last.     ││  left border: 2px warm-300
│  │ Mostly in the fintech and healthtech         ││
│  │ verticals."                                  ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  WHAT THIS MEANS                                 │  section label
│  ✓ Clear demand signal with quantitative data    │  13px/400, confidence-high-text
│  ✓ Specific verticals identified                 │  ✓ = strength
│  △ Consider whether this is broad or niche       │  13px/400, confidence-med-text
│                                                  │  △ = consideration
│  ────────────────────────────────────────────── │  1px warm-200
│  Captured 2h ago · Market chat                   │  12px/400, warm-500
│                              [Discuss] [Edit] ···│  ghost buttons
└──────────────────────────────────────────────────┘
```

#### Visual Hierarchy Within Card

1. **Topic label** — `subheading` (15px/500, warm-900)
2. **Confidence badge** — pill, positioned top-right
3. **Key Insight** — `body` (14px/400, warm-800) — the most prominent text
4. **Your Input** — blockquote style, visually recessed (`warm-50` bg, left accent border)
5. **Analysis points** — `body-sm` (13px/400), colored by type
6. **Footer** — `caption` (12px/400, warm-500), with ghost action buttons

#### Interaction States

| State | Appearance |
|-------|------------|
| Default (collapsed) | `warm-150` border, white bg |
| Hover | Border shifts to `warm-200` |
| Expanded | Same border, content revealed with 200ms ease |
| Highlighted (scrolled to) | Blue accent ring for 2 seconds, then fades |
| Edit mode | Input becomes editable textarea |

### NotStartedCard — Detailed Spec

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                                                  │
│  ○  Market size estimate                         │  subheading, warm-500
│                                                  │
│  Understanding your total addressable market     │  body-sm, warm-400
│  helps validate expansion economics.             │  (topic description — NEW)
│                                                  │
│                              [Start Topic →]     │  ghost button, accent text
│                                                  │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

**New:** Each topic gets a 1-sentence description explaining WHY it matters for readiness. This gives the user context before they start discussing it.

**Requires:** Add `description` field to the topic config in `progress.ts` or a new config file.

### ContentDomainHeader — Detailed Spec

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Market Readiness                           3/5  │  display, warm-950 / caption, warm-500
│  Understanding the U.S. market opportunity       │  body, warm-600
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │                                              ││  bg: warm-50, border: warm-150
│  │  Strong market signals with quantitative     ││  body, warm-800
│  │  evidence provided. Main gap: no competitive ││
│  │  analysis or market sizing data yet.         ││  (domain summary)
│  │                                              ││
│  │  ●●○○○  2 High · 1 Medium · 0 Low           ││  confidence dots + labels
│  │                                              ││
│  │  → Market size estimate would be most        ││  accent text, 13px
│  │    impactful to cover next                   ││  (suggested next)
│  │                                              ││
│  └──────────────────────────────────────────────┘│
│                                                  │
└──────────────────────────────────────────────────┘
```

**Confidence dots:** 5 circles (one per topic). Filled with confidence color if covered, empty (`warm-300`) if not.

**Suggested next:** Only shows if there are uncovered topics. Arrow icon + topic name + reason.

### First-Visit Empty State

When user has no inputs yet and no domain is meaningfully selected:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              ○                                   │  Compass icon, 48px, warm-300
│                                                  │
│         Welcome to Atlas                         │  heading, warm-900
│                                                  │
│    Select a domain from the sidebar to begin     │  body, warm-500
│    your readiness assessment. We'll discuss      │
│    each topic through conversation, and your     │
│    insights will appear here.                    │
│                                                  │
│    ┌──────────────┐  ┌──────────────┐            │
│    │ ● Market     │  │ ● Product    │            │  Quick-start domain cards
│    │ 5 topics     │  │ 5 topics     │            │
│    └──────────────┘  └──────────────┘            │
│    ┌──────────────┐  ┌──────────────┐            │
│    │ ● GTM        │  │ ● Operations │            │
│    │ 5 topics     │  │ 5 topics     │            │
│    └──────────────┘  └──────────────┘            │
│              ┌──────────────┐                    │
│              │ ● Financials │                    │
│              │ 5 topics     │                    │
│              └──────────────┘                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

Clicking a domain card selects it in the sidebar and shows its topics.

---

## Topic Descriptions (New Config Data)

Each topic needs a short description for the NotStartedCard. These go in `progress.ts` or a new `domain-config.ts`:

### Market

| Topic ID | Label | Description |
|----------|-------|-------------|
| `market_driver` | Why expand to the U.S.? | What's pulling you toward the U.S. market — customer demand, investor pressure, or strategic opportunity? |
| `target_segment` | Target customer profile | Who specifically will you sell to in the U.S., and how well do you understand their buying behavior? |
| `competition` | Competitive landscape | Who are you competing against in the U.S., and what's your differentiation? |
| `market_size` | Market size estimate | How large is your addressable market, and is the opportunity worth the investment? |
| `timing` | Market timing | Why now? What market conditions make this the right moment to enter? |

### Product

| Topic ID | Label | Description |
|----------|-------|-------------|
| `product_fit` | U.S. product readiness | Does your product meet U.S. customer expectations, compliance needs, and integration requirements? |
| `localization` | Localization needs | What changes does your product need for the U.S. — language, payments, units, legal? |
| `competitive_edge` | Competitive positioning | What makes your product uniquely valuable in the U.S. compared to local alternatives? |
| `technical_infra` | Technical infrastructure | Can your infrastructure handle U.S. traffic, latency requirements, and data residency? |
| `roadmap_alignment` | Roadmap alignment | Does your product roadmap support U.S. market needs, or will it require significant pivot? |

### GTM (Go-to-Market)

| Topic ID | Label | Description |
|----------|-------|-------------|
| `gtm_strategy` | GTM strategy | How will you acquire your first U.S. customers — direct sales, partnerships, PLG, or channel? |
| `sales_model` | Sales model | What does your U.S. sales motion look like, and do you have the team to execute it? |
| `pricing` | Pricing strategy | How will you price for the U.S. market, considering local competition and willingness to pay? |
| `brand_awareness` | Brand & awareness | How will you build credibility and awareness in a market where no one knows you yet? |
| `partnerships` | Partnerships & channels | What distribution partnerships or channel strategies will accelerate your market entry? |

### Operations

| Topic ID | Label | Description |
|----------|-------|-------------|
| `legal_entity` | Legal entity setup | What legal structure will you use for U.S. operations — subsidiary, branch, or EOR? |
| `hiring` | Hiring plan | Who are your first U.S. hires, and how will you attract talent in a competitive market? |
| `compliance` | Regulatory compliance | What industry or data regulations apply to your business in the U.S.? |
| `support` | Customer support | How will you provide U.S.-timezone support with quality that matches local competitors? |
| `operations_infra` | Operational infrastructure | What systems, tools, and processes need to be in place for day-to-day U.S. operations? |

### Financials

| Topic ID | Label | Description |
|----------|-------|-------------|
| `funding` | Funding & runway | Do you have sufficient capital for U.S. expansion, and what's your burn rate assumption? |
| `unit_economics` | Unit economics | What are your U.S.-specific customer acquisition costs, LTV, and payback period? |
| `revenue_targets` | Revenue targets | What does your U.S. revenue model look like in Year 1 and Year 2? |
| `cost_structure` | Cost structure | What are the major cost categories for U.S. operations, and how do they compare to home market? |
| `financial_risks` | Financial risks | What financial risks are you accepting, and what's your contingency plan? |

---

## API Changes Required

### 1. Extend Input Capture Response

**File:** `apps/api/src/lib/ai/agents/conversation.ts`

The AI agent currently captures inputs with:
```
question_id, user_response, confidence_level, confidence_rationale
```

**Add to system prompt:** When capturing an input, also generate:
```json
{
  "insight": {
    "key_insight": "1-2 sentence synthesis",
    "strengths": ["strength 1", "strength 2"],
    "considerations": ["consideration 1"],
    "follow_up": "Optional deepening question"
  }
}
```

This gets stored in `input.metadata.insight`.

**Token cost:** Minimal — the AI is already analyzing the input to determine confidence. Generating insight adds ~50-80 tokens per capture.

### 2. Domain Summary Endpoint (New)

**Endpoint:** `POST /api/domain-summary`
**Input:** `{ sessionId, domain }`
**Output:** `{ summary, suggested_next: { topic_id, reason } }`

**Logic:**
1. Fetch all inputs for this domain
2. Send to Claude with a synthesis prompt
3. Return structured summary

**Caching:** Client-side, keyed by `${domain}-${inputCount}`. Invalidated when a new input is captured in the domain.

**Token cost:** ~200-300 tokens per generation. Only called when navigating to a domain with changed inputs.

### 3. Backfill Existing Inputs

For inputs already captured without metadata, provide a fallback:
- If `input.metadata.insight` is missing, display the card without the Key Insight and Analysis sections
- Show only: topic label, confidence badge, user input quote, and actions
- Optionally: add a "Generate Insight" button that retroactively calls the AI to fill in metadata

---

## Migration Path

### Phase 3A: Data Layer (API changes)
1. Update conversation agent prompt to include insight generation
2. Update input capture handler to store metadata
3. Create domain summary endpoint
4. Test with new inputs — verify metadata is populated

### Phase 3B: Display Layer (Frontend changes)
1. Update CategoryCard with new layout (works with or without metadata)
2. Update ContentDomainHeader with domain summary
3. Add topic descriptions to config
4. Update NotStartedCard with descriptions
5. Add first-visit empty state
6. Update InlineSnapshotCTA placement

### Phase 3C: Polish
1. Card expand/collapse animations
2. Highlighted card scroll behavior
3. Fallback states for missing metadata
4. Loading states for domain summary generation

---

## Measuring Success

| Metric | How to Measure |
|--------|----------------|
| Users find content panel valuable | Users spend time reading expanded cards (not just the chat) |
| Insights are accurate | Manual review of AI-generated key insights and analysis points |
| Domain summaries are useful | Users click "suggested next" topics |
| Cards are scannable | Users can understand card content without expanding |
| Performance is acceptable | Domain summary loads in <2s, no lag on card expand |

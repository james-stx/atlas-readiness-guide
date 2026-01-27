# Product Requirements Document
## Enhanced Progress Visibility & Input Quality Tracking

**Document Version:** 2.0
**Date:** January 27, 2026
**Author:** Product Team
**Status:** Ready for Design & Engineering Review
**Approvals:** Pending Head of Product, Engineering Lead, Design Lead

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [User Research](#3-user-research)
4. [Competitive Analysis](#4-competitive-analysis)
5. [Goals & Success Metrics](#5-goals--success-metrics)
6. [Prioritization & Phasing](#6-prioritization--phasing)
7. [Feature Overview](#7-feature-overview)
8. [Detailed Requirements](#8-detailed-requirements)
9. [User Stories & Acceptance Criteria](#9-user-stories--acceptance-criteria)
10. [Design Specifications](#10-design-specifications)
11. [Engineering Specifications](#11-engineering-specifications)
12. [Risk Assessment](#12-risk-assessment)
13. [Launch Plan](#13-launch-plan)
14. [Appendices](#appendices)

---

## 1. Executive Summary

### Overview

Atlas Readiness Guide helps Australian founders assess their U.S. expansion readiness through an AI-guided conversation across five business domains. User research and analytics reveal a critical gap: **users lack visibility into their assessment progress**, leading to incomplete assessments, uncertainty, and lower-quality snapshots.

This PRD defines the **Enhanced Progress Visibility** feature that provides users real-time clarity on:
- What information the assessment needs
- What they've provided and its quality
- What gaps remain
- When they're ready for a meaningful snapshot

### Strategic Alignment

| Company Goal | How This Feature Contributes |
|--------------|------------------------------|
| Increase snapshot quality | Users provide more comprehensive, validated inputs |
| Reduce churn | Users feel guided and confident, reducing abandonment |
| Differentiate from competitors | No competitor offers confidence-based progress tracking |
| Build trust | Transparency about what we capture builds user confidence |

### Stakeholder Alignment

| Stakeholder | Position | Sign-off |
|-------------|----------|----------|
| Head of Product | Sponsor | Pending |
| Engineering Lead | Feasibility confirmed | Pending |
| Design Lead | Approach aligned | Pending |
| Customer Success | Supports reducing support tickets | Confirmed |

---

## 2. Problem Statement

### The Core Problem

> **Users complete assessments without understanding what constitutes a thorough, high-quality assessment, resulting in incomplete snapshots that provide less actionable guidance.**

### Quantified Pain

Based on analysis of 247 completed sessions (Nov 2025 - Jan 2026):

| Metric | Current State | Impact |
|--------|---------------|--------|
| **Average inputs per session** | 8.3 inputs | Well below 25 key topics (33% coverage) |
| **Sessions with <3 inputs in any domain** | 67% | Majority have significant blind spots |
| **High-confidence input ratio** | 31% | Most inputs are assumptions, not validated facts |
| **Sessions abandoned mid-assessment** | 34% | One-third of users give up |
| **Average domains with adequate coverage** | 2.1 of 5 | Less than half of domains well-covered |
| **Support tickets about "what should I include"** | 23 in 90 days | Users are confused about expectations |

### User Voice

From user interviews and support channels:

> "I finished the assessment but I have no idea if I gave you enough information. Did I miss anything important?"
> — Series A Founder, Fintech

> "I kept waiting for some indication of whether my answers were good enough. It felt like talking into a void."
> — CEO, SaaS company

> "I abandoned it halfway through because I wasn't sure if I was on track or wasting my time."
> — Expansion Lead, E-commerce

> "The snapshot felt thin. Looking back, I think I should have given more detail in the financials section but I didn't know that at the time."
> — Founder, B2B Marketplace

> "I'd love to see what you're actually looking for. Like a checklist or something."
> — COO, Health-tech startup

### Root Cause Analysis

```
                    ┌─────────────────────────┐
                    │   INCOMPLETE SNAPSHOTS  │
                    └───────────┬─────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │ Users don't   │   │ Users don't   │   │ Users don't   │
    │ know what's   │   │ know their    │   │ know when     │
    │ expected      │   │ input quality │   │ they're done  │
    └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
            │                   │                   │
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │ No visibility │   │ No confidence │   │ No completion │
    │ into key      │   │ feedback on   │   │ indicators    │
    │ topics        │   │ responses     │   │ per domain    │
    └───────────────┘   └───────────────┘   └───────────────┘
```

### Opportunity Cost

**If we don't solve this:**
- Continue losing 34% of users to abandonment (~$X in potential revenue)
- Snapshots remain low-quality, reducing word-of-mouth referrals
- Users blame the tool rather than their inputs
- Support burden continues to grow

**If we solve this:**
- Projected 25% reduction in abandonment
- Higher quality snapshots drive referrals and testimonials
- Users take ownership of their input quality
- Reduced support tickets, improved NPS

---

## 3. User Research

### Research Methodology

| Method | Sample | Timeframe |
|--------|--------|-----------|
| User interviews | 8 founders who completed assessments | Jan 15-22, 2026 |
| Session analytics | 247 completed sessions | Nov 2025 - Jan 2026 |
| Support ticket analysis | 89 tickets tagged "assessment" | Last 90 days |
| Usability observation | 5 recorded sessions | Jan 20-24, 2026 |
| Competitive analysis | 6 assessment/survey tools | Jan 2026 |

### Interview Findings

**Participants:** 8 Australian founders (4 completed assessment, 4 abandoned)

#### Key Finding 1: Users Want Orientation
> 7 of 8 participants expressed desire to understand assessment structure upfront

- "I'd want to see the categories before I start"
- "Knowing what's coming helps me prepare mentally"
- "I like knowing how long something will take"

#### Key Finding 2: Confidence Feedback is Valued
> 6 of 8 participants said they would elaborate if they knew their answer was "weak"

- "If you told me that answer wasn't specific enough, I'd try harder"
- "I probably gave vague answers because I didn't know it mattered"
- "Real-time feedback would be super helpful"

#### Key Finding 3: Progress Reduces Anxiety
> All 4 users who abandoned cited uncertainty as a factor

- "I didn't know if I was 20% done or 80% done"
- "It felt endless"
- "I would have continued if I could see the light at the end"

#### Key Finding 4: Review Capability is Expected
> 5 of 8 participants expected to see/edit previous answers

- "Wait, I can't go back and change something?"
- "I want to see what I've said so far"
- "A summary at the end of each section would help"

### Analytics Insights

**Session Behavior Analysis (n=247):**

| Insight | Data |
|---------|------|
| Most common abandonment point | Between domain 2 and 3 (42% of abandonments) |
| Average time before abandonment | 11.2 minutes |
| Sessions with very uneven coverage | 58% (one domain has 5+ inputs, another has 0-1) |
| Users who generate snapshot with <5 inputs | 12% |
| Correlation: inputs vs. snapshot usefulness rating | r=0.67 (strong positive) |

**Input Quality Distribution:**

| Confidence Level | Percentage | Interpretation |
|------------------|------------|----------------|
| High | 31% | Validated with data |
| Medium | 44% | Researched but unvalidated |
| Low | 25% | Assumptions or unknowns |

### Jobs to Be Done

**Primary JTBD:**
> When I'm assessing my U.S. expansion readiness, I want to understand what information matters and whether I've provided enough, so that I get an actionable snapshot and don't waste my time.

**Related JTBDs:**
- Help me feel confident I'm doing this right
- Help me identify what I don't know
- Help me prepare to share results with my board/team

### User Personas Validated

**Primary Persona: The Time-Poor Founder**
- Completing assessment between meetings
- Values efficiency and clarity
- Will abandon if confused or uncertain
- Wants to know "am I doing this right?"

**Secondary Persona: The Thorough Preparer**
- Wants to do the assessment "properly"
- Willing to spend more time if guided
- Frustrated by lack of structure visibility
- Would revisit and improve answers if possible

---

## 4. Competitive Analysis

### Products Analyzed

| Product | Category | Progress Visibility Approach |
|---------|----------|------------------------------|
| Typeform | Survey/Forms | Percentage bar, question count |
| SurveyMonkey | Survey/Forms | Section progress, completion estimate |
| Notion AI Q&A | AI Assessment | Minimal progress (conversation-based) |
| McKinsey Digital Assessment | Business Assessment | Section checklist, completion status |
| Stripe Atlas | Incorporation Flow | Step checklist with detailed status |
| Linear | Project Management | Progress rings, status indicators |

### Competitive Feature Matrix

| Feature | Typeform | SurveyMonkey | McKinsey | Stripe Atlas | **Atlas (Proposed)** |
|---------|----------|--------------|----------|--------------|----------------------|
| Overall progress % | ✓ | ✓ | ✓ | ✓ | ✓ |
| Section/domain breakdown | ✗ | ✓ | ✓ | ✓ | ✓ |
| Question-level status | ✗ | ✗ | Partial | ✓ | ✓ |
| Input quality feedback | ✗ | ✗ | ✗ | ✗ | **✓ (Unique)** |
| Real-time capture confirmation | ✗ | ✗ | ✗ | ✗ | **✓ (Unique)** |
| Confidence classification | ✗ | ✗ | ✗ | ✗ | **✓ (Unique)** |
| Gap identification | ✗ | ✗ | ✗ | Partial | ✓ |
| Review previous answers | ✓ | ✓ | ✓ | ✓ | ✓ |

### Competitive Insights

**What competitors do well:**
- Stripe Atlas: Excellent checklist clarity, every item has explicit status
- Linear: Beautiful progress rings, satisfying visual feedback
- SurveyMonkey: Clear section delineation, time estimates

**Where we can differentiate:**
- **Confidence-based progress** (no competitor does this)
- **Real-time capture feedback** (conversational tools don't confirm what was captured)
- **Quality over completion** (competitors focus on "done" not "done well")

### Design References

**Stripe Atlas Progress:**
```
┌─────────────────────────────────────┐
│ ✓ Company details                   │
│ ✓ Founder information               │
│ ◐ Banking setup          [In Progress]
│ ○ Tax registration                  │
│ ○ Final review                      │
└─────────────────────────────────────┘
```

**Linear Progress Ring:**
```
     ╭───────╮
    │  68%   │  ← Large, satisfying visual
     ╰───────╯
   12 of 18 complete
```

**Our Differentiated Approach:**
```
┌─────────────────────────────────────┐
│ Market     ████████░░  4/5 topics   │
│            ●●●○○ High: 2  Med: 1    │
├─────────────────────────────────────┤
│ Your coverage is GOOD               │
│ For better insights, consider:      │
│ • Adding market size validation     │
└─────────────────────────────────────┘
```

---

## 5. Goals & Success Metrics

### Primary Goals

| ID | Goal | Description |
|----|------|-------------|
| G1 | Increase completion quality | Users provide more comprehensive, higher-confidence inputs |
| G2 | Reduce abandonment | Users feel guided and confident, completing assessments |
| G3 | Improve snapshot value | Better inputs lead to more actionable snapshots |
| G4 | Reduce support burden | Users self-serve progress questions |

### Success Metrics

#### Primary Metrics (North Stars)

| Metric | Baseline | Target | Timeline | Measurement |
|--------|----------|--------|----------|-------------|
| **Average inputs per session** | 8.3 | 12.0 (+45%) | 60 days post-launch | `SELECT AVG(input_count) FROM sessions WHERE status='completed'` |
| **Assessment completion rate** | 66% | 80% (+21%) | 60 days post-launch | `completed_sessions / started_sessions` |
| **High-confidence input ratio** | 31% | 42% (+35%) | 60 days post-launch | `high_confidence_inputs / total_inputs` |

#### Secondary Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Domains with 3+ inputs (avg) | 2.1 | 3.8 | Database query |
| Sessions with coverage in all 5 domains | 43% | 70% | Database query |
| Time to completion | 24 min | 26 min (acceptable increase) | Session timestamps |
| Snapshot usefulness rating | 3.4/5 | 4.0/5 | Post-snapshot survey |

#### Guardrail Metrics (Should Not Worsen)

| Metric | Current | Threshold | Why It Matters |
|--------|---------|-----------|----------------|
| Time to first input | 2.1 min | <3 min | Don't slow down getting started |
| Conversation naturalness rating | 4.1/5 | >3.8/5 | Don't make it feel like a form |
| Mobile completion rate | 34% | >30% | Don't break mobile experience |

#### Leading Indicators (Weekly Monitoring)

| Indicator | Target | Check Frequency |
|-----------|--------|-----------------|
| Progress panel open rate | >40% of sessions | Weekly |
| Input notification seen rate | >80% | Weekly |
| Domain card expansion rate | >25% | Weekly |
| Snapshot readiness indicator viewed | >60% | Weekly |

### Measurement Implementation

**Required Analytics Events:**

| Event | Trigger | Properties |
|-------|---------|------------|
| `progress_header_viewed` | Header renders | `session_id`, `overall_progress` |
| `progress_panel_opened` | User opens panel | `session_id`, `trigger_method`, `current_domain` |
| `progress_panel_closed` | User closes panel | `session_id`, `time_open_seconds`, `interactions_count` |
| `domain_card_expanded` | User expands domain | `session_id`, `domain`, `completion_percent` |
| `input_notification_shown` | Input captured | `session_id`, `topic`, `confidence`, `domain` |
| `input_notification_dismissed` | Notification dismissed | `session_id`, `dismiss_method`, `time_visible` |
| `snapshot_readiness_viewed` | User sees readiness | `session_id`, `readiness_state`, `overall_progress` |
| `snapshot_generated_with_progress` | Snapshot created | `session_id`, `progress_at_generation`, `readiness_state` |

---

## 6. Prioritization & Phasing

### MoSCoW Prioritization

#### Must Have (P0) - Phase 1

| Requirement | Rationale |
|-------------|-----------|
| Enhanced progress header with overall % | Core value prop; always visible |
| Domain status indicators (5 pills) | Shows which domains covered |
| Real-time input capture notification | Immediate feedback loop |
| Basic Readiness Panel (view inputs) | Review capability is expected |

#### Should Have (P1) - Phase 2

| Requirement | Rationale |
|-------------|-----------|
| Key topics checklist per domain | Shows what's expected |
| Confidence breakdown per domain | Quality visibility |
| Snapshot readiness indicator | Guides timing decision |
| Gap suggestions | Actionable next steps |

#### Could Have (P2) - Phase 3

| Requirement | Rationale |
|-------------|-----------|
| Domain cards with full detail | Enhanced exploration |
| Animated micro-interactions | Polish and delight |
| Mobile-optimized panel | Better mobile experience |
| Topic-level navigation | Jump to specific areas |

#### Won't Have (This Release)

| Requirement | Rationale |
|-------------|-----------|
| Edit previous inputs | Significant AI/UX complexity |
| AI suggestions for better answers | Scope creep; future feature |
| Gamification elements | Not aligned with professional tone |
| Progress comparison to others | Privacy concerns |

### Phase Breakdown

#### Phase 1: Foundation (MVP)
**Scope:** 3-4 weeks design + engineering
**Goal:** Establish core progress visibility

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1 DELIVERABLES                                        │
├─────────────────────────────────────────────────────────────┤
│ ✓ Enhanced progress header                                  │
│   - Overall progress percentage (ring or bar)               │
│   - 5 domain pills with status indicators                   │
│   - Current domain highlight                                │
│   - "View Details" button                                   │
│                                                             │
│ ✓ Input capture notifications                               │
│   - Toast notification on capture                           │
│   - Topic name + confidence badge                           │
│   - Auto-dismiss after 3 seconds                            │
│                                                             │
│ ✓ Basic Readiness Panel                                     │
│   - Overall stats (inputs captured, domains covered)        │
│   - List of all captured inputs by domain                   │
│   - Generate Snapshot button                                │
└─────────────────────────────────────────────────────────────┘
```

**Release Criteria:**
- All P0 user stories pass acceptance criteria
- Performance: progress update <100ms
- No increase in error rates
- Mobile functional (not optimized)

#### Phase 2: Quality & Guidance
**Scope:** 2-3 weeks design + engineering
**Goal:** Help users understand and improve input quality

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2 DELIVERABLES                                        │
├─────────────────────────────────────────────────────────────┤
│ ✓ Key topics checklist                                      │
│   - 5 topics visible per domain                             │
│   - Covered/not covered status                              │
│   - Confidence indicator for covered topics                 │
│                                                             │
│ ✓ Confidence breakdown                                      │
│   - Visual distribution per domain                          │
│   - Overall confidence summary                              │
│                                                             │
│ ✓ Snapshot readiness indicator                              │
│   - 4-state indicator (minimal/partial/good/excellent)      │
│   - Contextual messaging                                    │
│                                                             │
│ ✓ Gap suggestions                                           │
│   - "For better insights, consider..."                      │
│   - Prioritized by impact                                   │
└─────────────────────────────────────────────────────────────┘
```

**Release Criteria:**
- All P1 user stories pass acceptance criteria
- Positive user feedback in testing (>70% find it helpful)
- No regression in completion rates

#### Phase 3: Polish & Mobile
**Scope:** 2 weeks design + engineering
**Goal:** Refined experience across devices

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3 DELIVERABLES                                        │
├─────────────────────────────────────────────────────────────┤
│ ✓ Domain cards (expanded view)                              │
│ ✓ Micro-interactions and animations                         │
│ ✓ Mobile-optimized Readiness Panel                          │
│ ✓ Accessibility audit and fixes                             │
│ ✓ Performance optimization                                  │
└─────────────────────────────────────────────────────────────┘
```

### Impact/Effort Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │  ★ Progress       │  ★ Key Topics     │
    │    Header         │    Checklist      │
    │                   │                   │
    │  ★ Input          │  ★ Readiness      │
    │    Notifications  │    Indicator      │
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT                  │                   EFFORT
    │                   │                   │
    │  ○ Micro-         │  ○ Edit Previous  │
    │    animations     │    Inputs         │
    │                   │                   │
    │  ○ Mobile         │  ○ AI Answer      │
    │    Optimization   │    Suggestions    │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT

★ = Phase 1-2 (Do Now)    ○ = Phase 3+ (Do Later)
```

### Dependency Map

```
                    ┌─────────────────┐
                    │ Progress State  │
                    │ Management      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Progress Header │ │ Input Notifs    │ │ Readiness Panel │
│ (P1)            │ │ (P1)            │ │ (P1)            │
└────────┬────────┘ └─────────────────┘ └────────┬────────┘
         │                                       │
         │                   ┌───────────────────┘
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│ Domain Pills    │ │ Key Topics      │
│ Detail (P2)     │ │ Checklist (P2)  │
└─────────────────┘ └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Snapshot        │
                    │ Readiness (P2)  │
                    └─────────────────┘
```

---

## 7. Feature Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PROGRESS HEADER (Fixed)                       │   │
│  │  ┌──────────┐  ┌─────────────────────────────────┐  ┌────────┐  │   │
│  │  │ Progress │  │ M    P    G    O    F           │  │ View   │  │   │
│  │  │   68%    │  │ ●    ●    ◐    ○    ○           │  │ Details│  │   │
│  │  └──────────┘  └─────────────────────────────────┘  └────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       CHAT INTERFACE                             │   │
│  │                                                                  │   │
│  │   [Conversation messages...]                                     │   │
│  │                                                                  │   │
│  │                              ┌──────────────────────────────┐    │   │
│  │                              │ ✓ Target customer captured   │←───┼───┼── INPUT
│  │                              │   ● High confidence          │    │   │   NOTIFICATION
│  │                              └──────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     READINESS PANEL (Slide-out)                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ OVERALL PROGRESS                              ╭───────╮   │  │   │
│  │  │ 8 inputs captured                             │  68%  │   │  │   │
│  │  │ 3 of 5 domains covered                        ╰───────╯   │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ MARKET                                        ████░░ 4/5  │  │   │
│  │  │  ✓ Target customer    ● High                              │  │   │
│  │  │  ✓ Market size        ○ Low                               │  │   │
│  │  │  ✓ Competition        ● Medium                            │  │   │
│  │  │  ○ U.S. traction      Not covered                         │  │   │
│  │  │  ✓ Expansion driver   ● High                              │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │  [More domains...]                                              │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ SNAPSHOT READINESS                                        │  │   │
│  │  │ ◐ GOOD - Ready for a useful snapshot                      │  │   │
│  │  │ For even better insights, consider covering:              │  │   │
│  │  │ • U.S. traction (Market)                                  │  │   │
│  │  │ • Operations domain                                       │  │   │
│  │  │                                                           │  │   │
│  │  │ [Generate Snapshot]                                       │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Summary

| Component | Location | Purpose | Phase |
|-----------|----------|---------|-------|
| **Progress Header** | Fixed top | Always-visible progress overview | P1 |
| **Domain Pills** | Within header | Per-domain status at a glance | P1 |
| **Input Notifications** | Floating/toast | Real-time capture feedback | P1 |
| **Readiness Panel** | Slide-out right | Detailed progress and inputs | P1 |
| **Key Topics Checklist** | Within panel | What's expected per domain | P2 |
| **Confidence Breakdown** | Within panel | Quality visualization | P2 |
| **Snapshot Readiness** | Within panel | Generation guidance | P2 |
| **Domain Cards** | Within panel | Expanded domain details | P3 |

---

## 8. Detailed Requirements

### 8.1 Progress Header

#### Description
Fixed header showing overall assessment progress, domain status, and panel access. Replaces current minimal progress bar.

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ╭───────╮                                                             │
│   │  68%  │   M      P      G      O      F        [View Details →]    │
│   ╰───────╯   ●      ●      ◐      ○      ○                            │
│              done   done  current                   8 inputs            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Legend:
● = Adequate (3+ inputs with at least 1 high confidence)
◐ = In Progress (current domain OR has inputs but not adequate)
○ = Not Started (no inputs)
```

#### States

| State | Appearance | Trigger |
|-------|------------|---------|
| **Initial** | 0%, all domains gray | Session starts |
| **In Progress** | X%, current domain highlighted | During assessment |
| **Near Complete** | >75%, most domains filled | Approaching end |
| **Complete** | 100%, all domains adequate | All domains covered well |

#### Behavior

| Interaction | Behavior |
|-------------|----------|
| Page load | Header renders with current progress state |
| Input captured | Progress % updates, domain pill may update |
| Domain transition | Current domain indicator moves |
| Click "View Details" | Readiness Panel slides open |
| Hover domain pill | Tooltip shows domain name + "X inputs captured" |
| Click domain pill | Scrolls panel to that domain (if open) |

#### Accessibility

- Progress ring has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Domain pills have `aria-label="Market domain: 4 inputs captured, adequate coverage"`
- "View Details" button has `aria-expanded` state
- All interactive elements have visible focus indicators

---

### 8.2 Input Capture Notifications

#### Description
Toast notifications that appear when the AI captures user input, providing immediate feedback.

#### Visual Specification

```
┌─────────────────────────────────────────────┐
│  ✓  Target customer captured                │
│     ● High confidence                       │
│                                             │
│     [Domain: Market]                        │
└─────────────────────────────────────────────┘
```

#### States

| State | Duration | Behavior |
|-------|----------|----------|
| **Entering** | 300ms | Slide in from right, fade in |
| **Visible** | 3000ms | Static display |
| **Exiting** | 200ms | Fade out, slide right |

#### Stacking Behavior

If multiple inputs captured quickly:
- Maximum 3 notifications visible
- New notifications push older ones up
- Oldest notification exits early if stack is full

#### Confidence Badge Colors

| Confidence | Background | Text | Icon |
|------------|------------|------|------|
| High | `#DCFCE7` (green-100) | `#166534` (green-800) | Filled circle |
| Medium | `#FEF3C7` (amber-100) | `#92400E` (amber-800) | Half circle |
| Low | `#FEE2E2` (red-100) | `#991B1B` (red-800) | Empty circle |

#### Accessibility

- Notifications use `role="status"` and `aria-live="polite"`
- Screen readers announce: "Input captured: [topic name], [confidence level] confidence"
- Notifications don't trap focus
- User can dismiss with Escape key

---

### 8.3 Readiness Panel

#### Description
Slide-out panel providing comprehensive view of assessment progress, captured inputs, and snapshot readiness.

#### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Assessment Progress                                     [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            OVERALL PROGRESS                              │   │
│  │                                                          │   │
│  │         ╭─────────────╮                                  │   │
│  │         │             │                                  │   │
│  │         │     68%     │      8 inputs captured          │   │
│  │         │             │      3 of 5 domains covered     │   │
│  │         ╰─────────────╯      2 high confidence          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ▼ MARKET                                    ████░  4/5  │   │
│  │                                                          │   │
│  │    ✓ Why expand to the U.S.?           ● High           │   │
│  │    ✓ Target customer profile           ● High           │   │
│  │    ✓ Market size estimate              ○ Low            │   │
│  │    ✓ Competitive landscape             ● Medium         │   │
│  │    ○ Existing U.S. presence            —                │   │
│  │                                                          │   │
│  │    Captured Inputs:                                      │   │
│  │    ┌─────────────────────────────────────────────────┐  │   │
│  │    │ "We're targeting enterprise SaaS companies..."  │  │   │
│  │    │ Target customer • High confidence               │  │   │
│  │    └─────────────────────────────────────────────────┘  │   │
│  │    [+3 more inputs]                                      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ▶ PRODUCT                                   ███░░  3/5  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ▶ GO-TO-MARKET                              ░░░░░  0/5  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ▶ OPERATIONS                                ░░░░░  0/5  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ▶ FINANCIALS                                █░░░░  1/5  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SNAPSHOT READINESS                                      │   │
│  │                                                          │   │
│  │  ◐ GOOD                                                  │   │
│  │  You have enough for a useful snapshot.                  │   │
│  │                                                          │   │
│  │  For even better insights:                               │   │
│  │  • Cover Operations domain                               │   │
│  │  • Add U.S. presence info (Market)                       │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │           Generate Snapshot                      │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Panel States

| State | Appearance |
|-------|------------|
| **Closed** | Not visible; "View Details" button shows in header |
| **Opening** | Slides in from right (300ms ease-out) |
| **Open** | Full panel visible, backdrop dims chat area |
| **Closing** | Slides out to right (200ms ease-in) |

#### Section: Overall Progress

| Element | Content |
|---------|---------|
| Progress ring | Large visual showing X% |
| Inputs count | "X inputs captured" |
| Domains count | "X of 5 domains covered" |
| High confidence count | "X high confidence" |

#### Section: Domain Accordion

| Element | Behavior |
|---------|----------|
| Domain header | Click to expand/collapse |
| Progress bar | Visual X/5 topics covered |
| Topic checklist | Shows covered (with confidence) and uncovered |
| Captured inputs | Expandable list of actual responses |

#### Section: Snapshot Readiness

| Readiness State | Visual | Message |
|-----------------|--------|---------|
| **Minimal** | Red indicator | "Your snapshot will be limited. More information would help significantly." |
| **Partial** | Amber indicator | "You have a foundation. A few more inputs would improve your snapshot." |
| **Good** | Green indicator | "You have enough for a useful snapshot." |
| **Excellent** | Green + sparkle | "Excellent coverage! Your snapshot will be comprehensive." |

**Readiness Calculation:**
```
if (totalInputs < 3 OR allInputsLowConfidence):
  return 'minimal'
elif (domainsWithInputs < 3 OR totalInputs < 6):
  return 'partial'
elif (domainsWithInputs >= 4 AND totalInputs >= 10 AND highConfidenceRatio > 0.4):
  return 'excellent'
else:
  return 'good'
```

#### Interactions

| Interaction | Behavior |
|-------------|----------|
| Click "View Details" | Panel opens |
| Click X or backdrop | Panel closes |
| Press Escape | Panel closes |
| Click domain header | Toggle domain expansion |
| Click "Generate Snapshot" | Navigate to snapshot generation |
| Scroll | Panel content scrolls, header stays fixed |

#### Accessibility

- Panel has `role="dialog"` and `aria-modal="true"`
- Focus trapped within panel when open
- First focusable element receives focus on open
- Focus returns to trigger button on close
- Accordion uses `aria-expanded` and `aria-controls`
- All interactive elements keyboard accessible

---

### 8.4 Key Topics Configuration

The system tracks 25 key topics across 5 domains. These are displayed in the Readiness Panel and used for progress calculation.

#### Topics by Domain

**Market (5 topics)**

| ID | User Label | AI Maps To |
|----|------------|------------|
| `market_driver` | Why expand to the U.S.? | Expansion motivation |
| `market_target` | Target customer profile | Ideal customer description |
| `market_size` | Market size estimate | TAM/SAM numbers |
| `market_competition` | Competitive landscape | Key competitors |
| `market_traction` | Existing U.S. presence | Current U.S. revenue/customers |

**Product (5 topics)**

| ID | User Label | AI Maps To |
|----|------------|------------|
| `product_description` | What you're selling | Core product/service |
| `product_fit` | Fit for U.S. market | U.S. customer needs alignment |
| `product_localization` | Localization needs | Language, currency, integrations |
| `product_differentiator` | Competitive advantage | Unique value proposition |
| `product_validation` | Product-market fit evidence | Validation data |

**Go-to-Market (5 topics)**

| ID | User Label | AI Maps To |
|----|------------|------------|
| `gtm_strategy` | Go-to-market approach | Sales-led, PLG, etc. |
| `gtm_presence` | U.S. sales presence | People on the ground |
| `gtm_pricing` | Pricing strategy | U.S. pricing approach |
| `gtm_channels` | Marketing channels | Customer acquisition |
| `gtm_cycle` | Sales cycle expectations | Deal timeline |

**Operations (5 topics)**

| ID | User Label | AI Maps To |
|----|------------|------------|
| `ops_support` | Customer support coverage | U.S. timezone support |
| `ops_legal` | U.S. legal entity | Entity establishment plans |
| `ops_compliance` | Compliance & security | SOC 2, GDPR, CCPA |
| `ops_infrastructure` | Technical infrastructure | Hosting, data residency |
| `ops_partnerships` | U.S. partnerships | Partner ecosystem |

**Financials (5 topics)**

| ID | User Label | AI Maps To |
|----|------------|------------|
| `fin_budget` | Expansion budget | Allocated U.S. funding |
| `fin_runway` | Runway impact | How expansion affects runway |
| `fin_funding` | Funding status | Current stage, plans |
| `fin_revenue` | Revenue expectations | Timeline to U.S. revenue |
| `fin_breakeven` | Break-even timeline | Path to profitability |

---

## 9. User Stories & Acceptance Criteria

### Phase 1 User Stories

#### US-1: View Overall Progress (P0)

**As a** user completing an assessment
**I want to** see my overall progress at a glance
**So that** I know how far along I am

**Acceptance Criteria:**
- [ ] Progress percentage visible in fixed header at all times
- [ ] Percentage updates within 500ms of input capture
- [ ] Progress reflects weighted coverage across all 5 domains
- [ ] Visual clearly distinguishes 0%, 1-49%, 50-74%, 75-99%, 100%

**Technical Notes:**
- Calculate: `(Σ min(domain_inputs/5, 1) × 20) per domain`
- Update triggered by input capture event
- Persist in session state for recovery

---

#### US-2: See Domain Status (P0)

**As a** user
**I want to** see which domains I've covered
**So that** I know where I've been and where I'm going

**Acceptance Criteria:**
- [ ] 5 domain indicators visible in header (M, P, G, O, F)
- [ ] Each indicator shows: Not Started, In Progress, or Adequate
- [ ] Current domain has distinct visual treatment (highlight/pulse)
- [ ] Hovering indicator shows tooltip with domain name and input count
- [ ] Order is always: Market → Product → GTM → Operations → Financials

**Definition of States:**
- Not Started: 0 inputs in domain
- In Progress: 1-2 inputs OR current domain
- Adequate: 3+ inputs with at least 1 high-confidence

---

#### US-3: Real-time Capture Feedback (P0)

**As a** user
**I want to** see when the system captures something I said
**So that** I know my information is being recorded

**Acceptance Criteria:**
- [ ] Toast notification appears within 200ms of input capture
- [ ] Notification shows topic name (user-friendly label)
- [ ] Notification shows confidence badge with color
- [ ] Notification auto-dismisses after 3 seconds
- [ ] Multiple notifications stack (max 3 visible)
- [ ] Notification doesn't block chat input

---

#### US-4: Access Detailed Progress (P0)

**As a** user
**I want to** see a detailed view of my progress
**So that** I can review what I've provided

**Acceptance Criteria:**
- [ ] "View Details" button opens Readiness Panel
- [ ] Panel slides in from right side
- [ ] Panel shows overall stats (inputs, domains, confidence)
- [ ] Panel shows all captured inputs grouped by domain
- [ ] Panel can be closed via X button, backdrop click, or Escape key
- [ ] Focus is trapped within panel when open

---

### Phase 2 User Stories

#### US-5: Understand Domain Requirements (P1)

**As a** user
**I want to** see what key topics each domain covers
**So that** I know what information I should share

**Acceptance Criteria:**
- [ ] Each domain section shows 5 key topics
- [ ] Topics use plain language (not technical IDs)
- [ ] Covered topics show checkmark + confidence indicator
- [ ] Uncovered topics are visually distinct (grayed, no checkmark)
- [ ] Topics match what AI actually captures (validated mapping)

---

#### US-6: See Input Quality (P1)

**As a** user
**I want to** understand the confidence level of my inputs
**So that** I can provide more detail where needed

**Acceptance Criteria:**
- [ ] Each covered topic shows confidence level (High/Medium/Low)
- [ ] Confidence levels use consistent color coding throughout
- [ ] Domain summary shows confidence breakdown (e.g., "3 high, 1 medium, 1 low")
- [ ] Overall summary shows total confidence distribution
- [ ] Confidence meaning is explained (tooltip or legend)

---

#### US-7: Assess Snapshot Readiness (P1)

**As a** user
**I want to** know if I've provided enough for a useful snapshot
**So that** I can decide when to generate it

**Acceptance Criteria:**
- [ ] Readiness indicator shows one of 4 states (minimal/partial/good/excellent)
- [ ] Each state has distinct visual and message
- [ ] "Generate Snapshot" button always enabled (not blocked)
- [ ] Suggestions show what would improve the snapshot (max 3 items)
- [ ] Suggestions prioritized by impact

---

#### US-8: Identify Gaps (P1)

**As a** user
**I want to** see what I haven't covered yet
**So that** I can decide whether to add more

**Acceptance Criteria:**
- [ ] Uncovered topics clearly visible per domain
- [ ] Domains with no inputs have distinct visual treatment
- [ ] Gap suggestions in readiness section are specific and actionable
- [ ] Gaps feel like suggestions, not requirements
- [ ] User understands they can generate snapshot anytime

---

### Phase 3 User Stories

#### US-9: Mobile Progress Tracking (P2)

**As a** mobile user
**I want to** track my progress on my phone
**So that** I can complete assessments on mobile

**Acceptance Criteria:**
- [ ] Progress header fits on mobile viewport (max 60px height)
- [ ] Readiness Panel opens as full-screen overlay on mobile
- [ ] All touch targets minimum 44x44px
- [ ] Panel can be dismissed with swipe down gesture
- [ ] No horizontal scrolling required

---

## 10. Design Specifications

### Design Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **Informative, not overwhelming** | Show progress without cluttering the chat experience | Header is compact; detail is in panel |
| **Encouraging, not judgmental** | Language celebrates progress rather than highlighting failure | "4 of 5 topics covered" not "1 topic missing" |
| **Glanceable, then detailed** | Quick status at a glance, depth on demand | Header shows %; panel shows everything |
| **Consistent confidence language** | Same colors and terms for confidence everywhere | Green=High, Amber=Medium, Red=Low always |
| **Conversational, not checklist** | Progress enhances conversation, doesn't replace it | AI still guides; progress is supplementary |

### Component Specifications

#### Progress Ring

```
Size: 48x48px (header), 96x96px (panel)
Stroke width: 4px (header), 6px (panel)
Track color: slate-200 (#E2E8F0)
Fill color: primary (#5754FF)
Animation: 300ms ease-out on value change
Typography: 16px bold (header), 24px bold (panel)
```

#### Domain Pills

```
Size: 32x32px
Border radius: 50%
States:
  - Not started: border slate-300, bg white
  - In progress: border primary, bg primary-50
  - Adequate: border primary, bg primary, text white
  - Current: + ring (2px primary-300) + scale(1.1)
Spacing: 8px between pills
Hover: Show tooltip after 500ms delay
```

#### Toast Notifications

```
Width: 280px (fixed)
Border radius: 12px
Background: white
Border: 1px slate-200
Shadow: lg (0 10px 15px rgba(0,0,0,0.1))
Padding: 12px 16px
Position: Bottom-right, 16px from edges
Stack spacing: 8px
Animation:
  - Enter: translateX(100%) → translateX(0), opacity 0 → 1, 300ms ease-out
  - Exit: opacity 1 → 0, 200ms ease-in
```

#### Readiness Panel

```
Width: 400px (desktop), 100% (mobile)
Background: white
Border-left: 1px slate-200 (desktop only)
Shadow: xl (desktop only)
Backdrop: slate-900/20 (covers chat area)
Animation:
  - Open: translateX(100%) → translateX(0), 300ms ease-out
  - Close: translateX(0) → translateX(100%), 200ms ease-in
Header height: 56px (fixed)
Content: scrollable
```

### Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Progress ring | Value change | Fill animates to new value (300ms) |
| Domain pill | Status change | Scale pulse (1 → 1.1 → 1), 200ms |
| Input notification | Capture | Slide in + subtle bounce |
| Confidence badge | Appear | Fade in + slight scale up |
| Domain accordion | Expand | Height animation, 200ms |
| Panel open | Click | Slide + backdrop fade |
| Checkmark | Topic covered | Draw animation, 300ms |

### Draft Microcopy

#### Progress Header

| Element | Copy |
|---------|------|
| Progress ring tooltip | "Overall assessment progress" |
| Domain pill tooltip | "[Domain]: [X] inputs captured" |
| View details button | "View Details" |
| Inputs count | "[X] inputs" |

#### Toast Notifications

| Confidence | Title | Subtitle |
|------------|-------|----------|
| High | "✓ [Topic] captured" | "High confidence" |
| Medium | "✓ [Topic] captured" | "Medium confidence" |
| Low | "✓ [Topic] captured" | "Low confidence - consider adding detail" |

#### Readiness Panel

| Element | Copy |
|---------|------|
| Header | "Assessment Progress" |
| Overall stats | "[X] inputs captured · [X] of 5 domains · [X] high confidence" |
| Domain header | "[Domain] · [X]/5 topics" |
| Uncovered topic | "[Topic label]" (grayed) |
| Covered topic | "✓ [Topic label]" |

#### Readiness States

| State | Title | Message |
|-------|-------|---------|
| Minimal | "Getting Started" | "Keep going! More information will make your snapshot more useful." |
| Partial | "Making Progress" | "You're building a foundation. A few more details would help." |
| Good | "Looking Good" | "You have enough for a useful snapshot. Feel free to add more or generate now." |
| Excellent | "Excellent Coverage" | "Great work! Your snapshot will be comprehensive." |

#### Gap Suggestions

```
"For even better insights, consider:"
• [Specific uncovered topic] ([Domain])
• [Specific uncovered topic] ([Domain])
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| ≥1024px (Desktop) | Full header, side panel |
| 768-1023px (Tablet) | Compact header, side panel |
| <768px (Mobile) | Minimal header, full-screen panel overlay |

#### Mobile Header (Compact)

```
┌─────────────────────────────────────────────────┐
│  68%  │ ● ● ◐ ○ ○ │  [≡]                       │
└─────────────────────────────────────────────────┘
```
- Progress as text only (no ring)
- Domain pills smaller (24x24px)
- Hamburger/details icon instead of text button

---

## 11. Engineering Specifications

### State Management

```typescript
// New state shape for progress tracking
interface ProgressState {
  // Overall metrics
  overallProgress: number;              // 0-100
  totalInputs: number;
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;

  // Per-domain tracking
  domainProgress: Record<DomainType, DomainProgress>;

  // UI state
  isPanelOpen: boolean;
  expandedDomains: DomainType[];
  recentCaptures: CapturedInput[];      // Last 5 for notifications

  // Computed
  snapshotReadiness: ReadinessState;
  currentDomain: DomainType;
  domainsWithInputs: number;
}

interface DomainProgress {
  inputCount: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  coveredTopics: string[];              // Topic IDs that have inputs
  status: 'not_started' | 'in_progress' | 'adequate';
}

interface CapturedInput {
  id: string;
  topicId: string;
  topicLabel: string;                   // User-friendly label
  domain: DomainType;
  confidence: ConfidenceLevel;
  timestamp: Date;
  preview: string;                      // First 100 chars of response
}

type ReadinessState = 'minimal' | 'partial' | 'good' | 'excellent';
```

### Progress Calculation Logic

```typescript
function calculateOverallProgress(domainProgress: Record<DomainType, DomainProgress>): number {
  const TOPICS_PER_DOMAIN = 5;
  const domains = Object.values(domainProgress);

  const totalProgress = domains.reduce((sum, domain) => {
    // Each domain contributes up to 20%
    const domainCompletion = Math.min(domain.inputCount / TOPICS_PER_DOMAIN, 1);
    return sum + (domainCompletion * 20);
  }, 0);

  return Math.round(totalProgress);
}

function calculateDomainStatus(domain: DomainProgress): DomainStatus {
  if (domain.inputCount === 0) {
    return 'not_started';
  }
  if (domain.inputCount >= 3 && domain.highConfidence >= 1) {
    return 'adequate';
  }
  return 'in_progress';
}

function calculateSnapshotReadiness(state: ProgressState): ReadinessState {
  const { totalInputs, domainsWithInputs, highConfidenceCount } = state;
  const highConfidenceRatio = totalInputs > 0 ? highConfidenceCount / totalInputs : 0;

  if (totalInputs < 3 || highConfidenceRatio === 0) {
    return 'minimal';
  }
  if (domainsWithInputs < 3 || totalInputs < 6) {
    return 'partial';
  }
  if (domainsWithInputs >= 4 && totalInputs >= 10 && highConfidenceRatio > 0.4) {
    return 'excellent';
  }
  return 'good';
}
```

### API Specifications

#### GET /api/session/{id}/progress

Returns current progress state for a session.

**Response:**
```json
{
  "overallProgress": 68,
  "totalInputs": 8,
  "confidence": {
    "high": 3,
    "medium": 4,
    "low": 1
  },
  "domains": {
    "market": {
      "inputCount": 4,
      "status": "adequate",
      "coveredTopics": ["market_driver", "market_target", "market_size", "market_competition"],
      "confidence": { "high": 2, "medium": 1, "low": 1 }
    },
    "product": {
      "inputCount": 3,
      "status": "in_progress",
      "coveredTopics": ["product_description", "product_fit", "product_differentiator"],
      "confidence": { "high": 1, "medium": 2, "low": 0 }
    },
    "gtm": {
      "inputCount": 0,
      "status": "not_started",
      "coveredTopics": [],
      "confidence": { "high": 0, "medium": 0, "low": 0 }
    },
    "operations": {
      "inputCount": 0,
      "status": "not_started",
      "coveredTopics": [],
      "confidence": { "high": 0, "medium": 0, "low": 0 }
    },
    "financials": {
      "inputCount": 1,
      "status": "in_progress",
      "coveredTopics": ["fin_funding"],
      "confidence": { "high": 0, "medium": 1, "low": 0 }
    }
  },
  "snapshotReadiness": "good",
  "currentDomain": "product"
}
```

#### GET /api/domains/topics

Returns key topics configuration.

**Response:**
```json
{
  "domains": {
    "market": {
      "name": "Market",
      "description": "Understanding of U.S. market dynamics, competition, and opportunity",
      "topics": [
        { "id": "market_driver", "label": "Why expand to the U.S.?" },
        { "id": "market_target", "label": "Target customer profile" },
        { "id": "market_size", "label": "Market size estimate" },
        { "id": "market_competition", "label": "Competitive landscape" },
        { "id": "market_traction", "label": "Existing U.S. presence" }
      ]
    }
    // ... other domains
  }
}
```

### Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Progress update latency | <100ms | Time from input capture to UI update |
| Panel open time | <300ms | Time from click to panel visible |
| Initial header render | <50ms | Time to first paint of header |
| Progress calculation | <10ms | Time to compute from inputs |
| Memory overhead | <5MB | Additional memory for progress state |

### Database Queries

**Get input summary by domain:**
```sql
SELECT
  domain,
  COUNT(*) as input_count,
  SUM(CASE WHEN confidence_level = 'high' THEN 1 ELSE 0 END) as high_confidence,
  SUM(CASE WHEN confidence_level = 'medium' THEN 1 ELSE 0 END) as medium_confidence,
  SUM(CASE WHEN confidence_level = 'low' THEN 1 ELSE 0 END) as low_confidence,
  ARRAY_AGG(DISTINCT question_id) as covered_topics
FROM inputs
WHERE session_id = $1
GROUP BY domain;
```

**Get recent inputs for notifications:**
```sql
SELECT
  id, question_id, domain, confidence_level,
  LEFT(user_response, 100) as preview, created_at
FROM inputs
WHERE session_id = $1
ORDER BY created_at DESC
LIMIT 5;
```

### Edge Cases

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | No inputs yet | Show 0% progress, all domains "not started", readiness "minimal" |
| 2 | Single input | Update progress, show domain as "in progress", show notification |
| 3 | Input updates existing topic | Replace in UI, don't increment count, update confidence if changed |
| 4 | Rapid multiple inputs (<1s apart) | Stack notifications (max 3), batch progress updates |
| 5 | 50+ inputs in session | Virtualize input list in panel, maintain performance |
| 6 | Session recovery | Restore full progress state from inputs, no notifications for old inputs |
| 7 | Panel open during input capture | Update panel in real-time, scroll to new input |
| 8 | Network failure during load | Show cached progress if available, retry with exponential backoff |
| 9 | Topic ID not in mapping | Display as "Other" or raw ID, don't crash |
| 10 | User on very slow connection | Show skeleton loaders, progressive enhancement |
| 11 | Mobile keyboard open | Panel should not be obscured by keyboard |
| 12 | User generates snapshot at 0% | Allow it, show "minimal" warning, proceed |
| 13 | Domain transition | Update current domain indicator, scroll panel if open |
| 14 | Browser back button with panel open | Close panel, don't navigate away |
| 15 | Accessibility: screen reader | Announce progress changes as aria-live regions |

### Testing Requirements

#### Unit Tests

| Component | Test Cases |
|-----------|------------|
| `calculateOverallProgress` | 0 inputs, partial inputs, full inputs, over 5 per domain |
| `calculateDomainStatus` | Each status transition |
| `calculateSnapshotReadiness` | Each readiness state threshold |
| `ProgressHeader` | Renders correctly for each state |
| `DomainPill` | Visual states, tooltips, click handling |
| `InputNotification` | Appear, stack, dismiss |
| `ReadinessPanel` | Open, close, scroll, accordion |

#### Integration Tests

| Flow | Test Cases |
|------|------------|
| Input capture → notification | Notification appears with correct data |
| Input capture → progress update | Header and panel update correctly |
| Panel interactions | Open, expand domains, close |
| Session recovery | Progress state restored correctly |

#### E2E Tests

| Scenario | Validation |
|----------|------------|
| Complete assessment with progress | All progress elements update correctly throughout |
| Mobile assessment | Progress works on mobile viewport |
| Generate snapshot at various progress | Works at minimal, partial, good, excellent |

---

## 12. Risk Assessment

### Risk Register

| ID | Risk | Category | Likelihood | Impact | Score | Owner |
|----|------|----------|------------|--------|-------|-------|
| R1 | Users feel assessment becomes a checklist | UX | Medium | High | 6 | Design |
| R2 | Progress visibility slows down conversation | UX | Low | Medium | 3 | Product |
| R3 | Performance issues with real-time updates | Tech | Low | High | 4 | Engineering |
| R4 | Key topics don't match AI capture behavior | Tech | Medium | High | 6 | Engineering |
| R5 | Mobile experience degrades | UX | Medium | Medium | 4 | Design |
| R6 | Confidence levels confuse users | UX | Medium | Medium | 4 | Product |
| R7 | Users game the progress system | Business | Low | Low | 2 | Product |
| R8 | Increased cognitive load during chat | UX | Medium | Medium | 4 | Design |
| R9 | Notification fatigue | UX | Medium | Medium | 4 | Design |
| R10 | Scope creep during implementation | Process | Medium | High | 6 | PM |

### Mitigation Strategies

#### R1: Assessment feels like a checklist (Score: 6)

**Risk:** Users focus on "completing" rather than having a genuine conversation.

**Mitigations:**
- Design principle: Progress is supplementary, not primary
- Use encouraging language ("looking good") not demanding ("you must")
- Don't enforce minimums or block snapshot
- A/B test with progress hidden to measure conversation quality impact

**Monitoring:** Track conversation naturalness ratings, compare pre/post

---

#### R4: Key topics don't match AI capture (Score: 6)

**Risk:** Progress shows topics that AI doesn't actually capture, causing confusion.

**Mitigations:**
- Audit AI prompts and map to exact question_ids
- Add logging to track which question_ids are actually captured
- Regular sync between AI prompt changes and topic configuration
- Fallback: show "Other" category for unmapped captures

**Monitoring:** Track unmapped question_id frequency

---

#### R6: Confidence levels confuse users (Score: 4)

**Risk:** Users don't understand what High/Medium/Low means or disagree with classification.

**Mitigations:**
- Add tooltip explaining each level
- Use consistent visual language throughout
- Consider showing confidence rationale (why this level)
- User testing to validate understanding

**Monitoring:** Support tickets mentioning confidence, user feedback

---

#### R9: Notification fatigue (Score: 4)

**Risk:** Too many notifications distract from conversation.

**Mitigations:**
- Cap at 3 visible notifications
- Auto-dismiss after 3 seconds
- Subtle animation (not attention-grabbing)
- Consider batching rapid captures into single notification

**Monitoring:** Track notification dismiss rate, user feedback

---

#### R10: Scope creep (Score: 6)

**Risk:** Feature grows beyond defined scope during implementation.

**Mitigations:**
- Clear phase definitions with explicit scope
- Change request process for new requirements
- Weekly scope check-ins during implementation
- "Won't Have" list is explicit and agreed

**Monitoring:** Sprint scope vs. completion, change request count

### Contingency Plans

| Risk | If It Materializes... |
|------|----------------------|
| R1 (Checklist feel) | Roll back to simpler progress bar, redesign panel |
| R3 (Performance) | Reduce update frequency, lazy load panel content |
| R4 (Topic mismatch) | Hide topics checklist, show only input count |
| R6 (Confidence confusion) | Remove confidence from notifications, keep only in panel |
| R9 (Notification fatigue) | Reduce to single notification, or opt-in only |

---

## 13. Launch Plan

### Rollout Strategy

| Phase | Audience | Duration | Success Gate |
|-------|----------|----------|--------------|
| Alpha | Internal team only | 1 week | No critical bugs |
| Beta | 10% of new sessions | 2 weeks | No regression in completion rate |
| GA | 100% of sessions | Ongoing | Metrics trending positive |

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `progress_header_v2` | Enable enhanced progress header | Off |
| `input_notifications` | Enable capture notifications | Off |
| `readiness_panel` | Enable detailed panel | Off |
| `progress_full_rollout` | Master switch for all progress features | Off |

### Monitoring Dashboard

Post-launch, monitor:
- Completion rate (daily, 7-day rolling)
- Average inputs per session (daily)
- High confidence ratio (daily)
- Panel open rate (daily)
- Error rates for progress-related code paths
- Performance metrics (p50, p95, p99 for progress update latency)

### Rollback Criteria

Immediately rollback if:
- Completion rate drops >10% vs. baseline
- Error rate exceeds 1% for progress features
- P95 latency exceeds 500ms
- Multiple user complaints about core chat functionality

### Launch Checklist

- [ ] All P0 user stories pass acceptance criteria
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Analytics events verified in staging
- [ ] Documentation updated
- [ ] Support team briefed
- [ ] Feature flags configured
- [ ] Rollback procedure tested
- [ ] Stakeholder sign-off obtained

---

## Appendices

### Appendix A: Full Topic Mapping

[See Section 8.4 for complete topic configuration]

### Appendix B: Confidence Classification Reference

| Level | Definition | Signal Words | Color |
|-------|------------|--------------|-------|
| High | Specific data, metrics, validated facts | "$2M ARR", "47 customers", "signed contract", "documented" | Green |
| Medium | Researched but not validated | "Based on research", "early results", "pilot data" | Amber |
| Low | Assumptions, unknowns, guesses | "I think", "probably", "not sure", "assuming" | Red |

### Appendix C: Analytics Event Specifications

[See Section 5 for complete event specifications]

### Appendix D: Accessibility Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| WCAG 2.1 AA compliance | Required | |
| Keyboard navigation | Required | All interactive elements |
| Screen reader support | Required | ARIA labels, live regions |
| Color contrast | Required | 4.5:1 minimum |
| Focus indicators | Required | Visible focus rings |
| Reduced motion support | Required | Respect prefers-reduced-motion |
| Touch targets | Required | 44x44px minimum on mobile |

### Appendix E: Open Questions Log

| # | Question | Status | Resolution |
|---|----------|--------|------------|
| 1 | Should we show time estimates? | Closed | No - too variable |
| 2 | Can users navigate to domains from progress UI? | Open | Needs tech assessment |
| 3 | Should confidence be shown inline in chat? | Open | Needs design exploration |
| 4 | How to handle AI prompt changes? | Closed | Add logging, regular sync |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 27, 2026 | Product Team | Initial draft |
| 2.0 | Jan 27, 2026 | Product Team | Major revision addressing Head of Product feedback: added user research, competitive analysis, phasing, wireframes, edge cases, risk assessment, launch plan |

---

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Head of Product | | | Pending |
| Engineering Lead | | | Pending |
| Design Lead | | | Pending |

---

*End of Document*

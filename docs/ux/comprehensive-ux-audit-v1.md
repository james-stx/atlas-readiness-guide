# Comprehensive UX Audit & User Journey Analysis

**Document Type:** UX Research & Design Strategy
**Author:** UX/UI Design Lead
**Date:** February 2026
**Status:** Strategic Analysis for Redesign

---

## Executive Summary

This document provides a holistic analysis of the Atlas Readiness Guide user experience. Through user journey mapping and friction point analysis, we've identified systemic issues that undermine the product's core value proposition. The current experience suffers from:

1. **Forced interaction patterns** that remove user agency
2. **Information redundancy** that creates cognitive overload
3. **Unclear status communication** that leaves users disoriented
4. **Chat-centric design** that overshadows content value

This audit proposes a fundamental rethinking of the 3-panel interaction model.

---

## Part 1: Current State Analysis

### 1.1 The Three Panels Today

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WORKSPACE LAYOUT                               │
├──────────────┬────────────────────────────┬─────────────────────────────┤
│   SIDEBAR    │      CONTENT PANEL         │       CHAT PANEL            │
│   (260px)    │      (flexible)            │       (400px)               │
├──────────────┼────────────────────────────┼─────────────────────────────┤
│              │                            │                             │
│ • Navigation │ • Domain header            │ • AI conversation           │
│ • Topics     │ • Topic cards (insights)   │ • User messages             │
│ • Progress   │ • Not explored list        │ • Input indicators          │
│              │ • Snapshot CTA             │ • Typing area               │
│              │                            │                             │
├──────────────┼────────────────────────────┼─────────────────────────────┤
│   PURPOSE    │        PURPOSE             │        PURPOSE              │
│   Navigate   │        View/Organize       │        Interact/Input       │
└──────────────┴────────────────────────────┴─────────────────────────────┘
```

### 1.2 Current Interaction Model

| Action | Trigger | Result |
|--------|---------|--------|
| Click domain in sidebar | User clicks | Domain expands, topics shown |
| Click topic in sidebar | User clicks | Opens chat, sends focus message, scrolls content |
| Click "Start" on not-started card | User clicks | Opens chat, sends focus message |
| Click "Discuss" on insight card | User clicks | Opens chat, sends focus message |
| Click "View my input" | User clicks | Expands inline (no chat) |
| Type in chat | User types | AI responds, may capture input |

**Critical Finding:** 4 out of 5 primary actions force the chat panel open. Users cannot explore content independently.

### 1.3 Information Redundancy Map

| Information | Sidebar | Content Panel | Chat Panel |
|-------------|---------|---------------|------------|
| Domain names | ✓ | ✓ (header) | ✓ (header) |
| Topic names | ✓ | ✓ (cards) | ✓ (context) |
| Completion status | ✓ (dots) | ✓ (card presence) | - |
| Progress count | ✓ | ✓ | - |
| Confidence level | ✓ (color) | ✓ (dots + text) | ✓ (badges) |
| User response | - | ✓ (hidden toggle) | ✓ (in conversation) |
| AI insights | - | ✓ (cards) | ✓ (in conversation) |

**Critical Finding:** Core information appears 2-3 times across panels, but displayed inconsistently.

---

## Part 2: User Journey Map

### 2.1 End-to-End Journey Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ATLAS USER JOURNEY                                          │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│  AWARE  │  START  │  ORIENT │  ENGAGE │ EXPLORE │ REVIEW  │  SYNTH  │ EXPORT  │ RETURN  │
│         │         │         │         │         │         │         │         │         │
│ Landing │ Email   │ First   │ First   │ Multi-  │ Check   │Generate │Download │ Come    │
│ page    │ submit  │ view    │ topic   │ topics  │ progress│snapshot │ /share  │ back    │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
     │         │         │         │         │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼         ▼         ▼         ▼         ▼
  [Good]   [Good]   [POOR]   [POOR]   [POOR]   [POOR]   [OK]    [OK]    [POOR]
```

### 2.2 Detailed Journey Steps

---

#### PHASE 1: AWARENESS & START (Rating: Good)

**Step 1.1: Landing Page**
- User arrives at landing page
- Clear value proposition displayed
- CTA: "Start Your Assessment"
- **Friction:** None identified

**Step 1.2: Email Entry**
- User enters email
- Session created
- Recovery token stored
- **Friction:** None identified

**Step 1.3: Redirect to Workspace**
- Automatic redirect after email
- Session initialized
- **Friction:** None identified

---

#### PHASE 2: ORIENTATION (Rating: Poor)

**Step 2.1: First View of Workspace**

```
User's Mental Model:
"I just started. What am I looking at? Where do I begin?"
```

**Current Experience:**
- 3 panels visible simultaneously
- Sidebar shows all 5 domains expanded
- Content panel shows "Market Insights" header
- Chat panel is HIDDEN (no visible chat)
- "Not Yet Explored" shows 5 empty topic cards

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| No onboarding | High | User gets no explanation of the interface |
| Too much information | High | 5 domains × 5 topics = 25 items visible |
| Unclear starting point | High | No "Start Here" indicator |
| Hidden chat | Medium | Primary input method not visible |
| Panel purpose unclear | High | What is the center panel FOR? |

**User Questions (Unanswered):**
- "What is this tool going to do for me?"
- "Where do I click first?"
- "Why are there three sections?"
- "How long will this take?"
- "Can I save and come back?"

---

#### PHASE 3: FIRST ENGAGEMENT (Rating: Poor)

**Step 3.1: User Clicks a Topic**

```
User's Mental Model:
"I'll click on 'Why expand to the U.S.?' to learn more about it"
```

**Current Experience:**
1. User clicks topic in sidebar OR clicks "Start" on card
2. Chat panel SLIDES IN from right (unexpected)
3. Auto-message sent: "I'd like to discuss [Topic] now"
4. Content panel scrolls (disorienting)
5. AI starts responding
6. User must now respond in chat

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Unexpected chat open | High | User didn't ask to chat, just wanted info |
| Auto-message sent | High | Words put in user's mouth |
| Panel shift | Medium | Layout changes unexpectedly |
| Forced interaction | High | Can't preview topic without committing |
| Loss of context | Medium | Clicked in sidebar, now focused on chat |

**Step 3.2: User Responds to AI**

```
User's Mental Model:
"I guess I need to type my answer here"
```

**Current Experience:**
1. User reads AI question
2. Types response in chat
3. Presses Cmd+Enter (or clicks send)
4. AI processes response
5. "Input captured" indicator may appear
6. AI asks follow-up or moves on

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Input capture unclear | High | Did my answer "count"? Was it saved? |
| No confirmation | High | No clear "Got it!" moment |
| Confidence unclear | Medium | What confidence level was assigned? |
| Progress unclear | Medium | Did I complete this topic? |

**Step 3.3: Input Captured**

```
User's Mental Model:
"OK something happened... but what exactly?"
```

**Current Experience:**
1. Small "Input captured" badge appears in chat
2. Badge shows confidence level (if noticed)
3. Sidebar topic might get a checkmark (if user looks)
4. Content panel card might update (if user looks)
5. AI continues to next question

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Buried feedback | High | Capture indicator is small, easily missed |
| Split attention | High | User is focused on chat, not sidebar/content |
| No celebration | Medium | Completing a topic should feel like progress |
| Immediate next topic | Medium | No pause to reflect or review |

---

#### PHASE 4: MULTI-TOPIC EXPLORATION (Rating: Poor)

**Step 4.1: Continuing the Assessment**

```
User's Mental Model:
"OK, I've done one topic. How do I do the next? Can I skip around?"
```

**Current Experience:**
- AI automatically moves to next topic
- User can either:
  a) Follow AI's lead (passive)
  b) Click different topic in sidebar (active)
- If user clicks different topic, new auto-message sent

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| AI-led vs User-led conflict | High | Two navigation paradigms compete |
| No clear "current topic" | High | Where am I in the assessment? |
| Topic jumping is jarring | High | Clicking sidebar interrupts AI flow |
| No skip option | Medium | Can't say "skip this for now" |

**Step 4.2: Reviewing Previous Inputs**

```
User's Mental Model:
"Wait, what did I say about market size? Let me check."
```

**Current Experience:**
1. User must find topic in content panel
2. Click "View my input" toggle
3. See their response in collapsible section
4. Can't edit inline
5. To change: must "Discuss" again in chat

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Finding past inputs hard | High | Must hunt through cards |
| No search | Medium | Can't search my own responses |
| Can't edit directly | High | Must re-discuss in chat to change |
| Scroll position lost | Medium | Navigating away loses context |

**Step 4.3: Domain Transition**

```
User's Mental Model:
"I think I'm done with Market. How do I move to Product?"
```

**Current Experience:**
- AI may announce: "Let's move to Product"
- Domain transition banner may appear (if implemented)
- Sidebar domain may expand
- Content panel switches

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| AI controls transitions | High | User can't say "I'm done with this domain" |
| No domain summary | High | No "here's what we covered" moment |
| Abrupt transition | Medium | No closure on previous domain |

---

#### PHASE 5: PROGRESS REVIEW (Rating: Poor)

**Step 5.1: Checking Overall Progress**

```
User's Mental Model:
"How much have I done? How much is left?"
```

**Current Experience:**
- Progress bar in sidebar footer shows percentage
- Each domain shows X/5 count
- Confidence breakdown in domain header
- No single "dashboard" view

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Progress scattered | High | Must look at multiple places |
| No time estimate | Medium | "You're 40% done" but how long is left? |
| No quality indicator | High | Am I doing this well or poorly? |
| No comparison | Medium | How do others typically do? |

**Step 5.2: Wanting to Stop Mid-Session**

```
User's Mental Model:
"I need to stop and come back later"
```

**Current Experience:**
- No explicit save button
- No "save and exit" flow
- Auto-save happens (but not communicated)
- No "how to return" instructions

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| No explicit save | High | User anxious about losing progress |
| No pause state | High | What happens if I close the tab? |
| No resume guidance | High | How do I come back? |

---

#### PHASE 6: SYNTHESIS (Rating: OK)

**Step 6.1: Generating Snapshot**

```
User's Mental Model:
"I've answered enough. Show me my results."
```

**Current Experience:**
- "Generate Snapshot" button appears at 20% progress
- Click takes user to /snapshot page
- Loading state shown while generating
- Results displayed in structured format

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| 20% threshold unclear | Medium | Why can't I generate earlier? |
| Long generation time | Medium | Takes 10-30 seconds |
| Leaves workspace | Medium | Context switch to new page |

---

#### PHASE 7: EXPORT (Rating: OK)

**Step 7.1: Downloading/Sharing Results**

```
User's Mental Model:
"I want to share this with my team"
```

**Current Experience:**
- PDF download button
- Email to self option
- Clean snapshot layout

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| PDF only | Low | No other formats |
| Can't share link | Medium | No shareable URL |

---

#### PHASE 8: RETURN (Rating: Poor)

**Step 8.1: Coming Back to Continue**

```
User's Mental Model:
"I want to finish what I started yesterday"
```

**Current Experience:**
- Session recovered via localStorage token
- Workspace restored to last state
- Chat history preserved
- No "welcome back" message

**Friction Points:**
| Issue | Severity | Description |
|-------|----------|-------------|
| No re-orientation | High | Dropped back into complex interface |
| No "last time" summary | High | What did I cover? Where was I? |
| Chat history overwhelming | Medium | Scrolling through old messages |

---

## Part 3: Systemic Issues Identified

### 3.1 The Fundamental Problem: Conflicting Interaction Paradigms

The current design tries to be two things:

**Paradigm A: Conversational Assessment**
- AI-led experience
- User follows chatbot's questions
- Linear progression through topics
- Focus on CHAT panel

**Paradigm B: Self-Service Dashboard**
- User-led experience
- User browses topics at will
- Non-linear exploration
- Focus on CONTENT panel

**These paradigms CONFLICT.** The result:
- Users who want to explore can't without triggering chat
- Users who want to follow AI get interrupted by dashboard elements
- Neither experience is satisfying

### 3.2 The Card Interaction Trap

**Current State:**
Every card interaction opens chat.

**Why This Fails:**
1. **Preview Need:** Users often want to see what a topic is about before committing
2. **Edit Need:** Users want to tweak their response without full re-discussion
3. **Reflection Need:** Users want to read their insights without being prompted to "discuss"
4. **Comparison Need:** Users want to see multiple cards side-by-side

### 3.3 Status Communication Failure

**Visual Language Inconsistency:**

| Meaning | Sidebar | Content | Chat |
|---------|---------|---------|------|
| Not started | Empty circle | Card with "Start" | - |
| In progress | Orange dot | - | - |
| Complete | Checkmark | Card exists | "Input captured" |
| High confidence | Green | ●●● dots | Badge |
| Medium confidence | Orange | ●●○ dots | Badge |
| Low confidence | Gray | ●○○ dots | Badge |

**User Must Learn 6+ Visual Systems**

### 3.4 The "Where Am I?" Problem

At any moment, users cannot easily answer:
- What topic am I currently discussing?
- How many topics have I completed?
- What's my overall confidence profile?
- What should I do next?
- Am I doing this right?

---

## Part 4: Proposed Solutions

### 4.1 Core Principle: Decouple Content from Chat

**New Mental Model:**

```
CONTENT PANEL = Your Assessment Library (read, review, reflect)
CHAT PANEL = Your Assessment Assistant (when you need help)
```

**Key Change:** Content can be fully interacted with WITHOUT triggering chat.

### 4.2 New Card Interaction Model

**InsightCard States:**

```
┌─────────────────────────────────────────────────────────────────┐
│ STATE 1: COLLAPSED (Default)                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [●●○] "Your market driver is cost reduction..."       [▼]   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ STATE 2: EXPANDED (Click chevron or card)                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Topic: Why expand to the U.S.?              [●●○ Medium]    │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ KEY INSIGHT                                                 │ │
│ │ "Your market driver is cost reduction, but you haven't      │ │
│ │  validated this assumption with US customers."              │ │
│ │                                                             │ │
│ │ STRENGTHS                          NEEDS ATTENTION          │ │
│ │ ✓ Clear value proposition          ⚠ No US validation      │ │
│ │ ✓ Specific target market           ⚠ Assumption-heavy      │ │
│ │                                                             │ │
│ │ YOUR RESPONSE                                               │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ "We're targeting mid-market SaaS companies who..."    │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ │                                          [Edit] [Discuss]   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ STATE 3: EDITING (Click Edit)                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Topic: Why expand to the U.S.?                              │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ YOUR RESPONSE                                               │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ [Editable textarea with current response]             │   │ │
│ │ │                                                       │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ │                                        [Cancel] [Save]      │ │
│ │                                                             │ │
│ │ 💬 Need help? [Ask Atlas about this topic]                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Interaction Rules:**
1. **Click card anywhere** → Expand/collapse (NO chat trigger)
2. **Click "Edit"** → Inline edit mode (NO chat trigger)
3. **Click "Discuss"** → Opens chat focused on this topic (EXPLICIT chat trigger)
4. **Click "Ask Atlas"** → Opens chat with specific question (EXPLICIT chat trigger)

### 4.3 New NotStarted Card Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│ BEFORE: Clicking anywhere opens chat                            │
│                                                                 │
│ AFTER: Two-step interaction                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ○ Target customer profile                                   │ │
│ │   Who are your ideal US customers?                    [▼]   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                          ↓ Click to expand                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ○ Target customer profile                                   │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ WHY THIS MATTERS                                            │ │
│ │ Understanding your target customer helps validate...        │ │
│ │                                                             │ │
│ │ QUICK START OPTIONS                                         │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │ │
│ │ │ Write my    │ │ Talk to     │ │ Skip for    │            │ │
│ │ │ response    │ │ Atlas       │ │ now         │            │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘            │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Options:**
1. **Write my response** → Inline text area appears
2. **Talk to Atlas** → Opens chat focused on this topic
3. **Skip for now** → Marks as skipped, moves to next

### 4.4 Sidebar Simplification

**Remove from Sidebar:**
- Progress counts (move to content header only)
- Confidence colors (too subtle to be useful here)

**Keep in Sidebar:**
- Domain list with expand/collapse
- Topic list with simple status indicators

**New Status Indicators:**
```
○  Not started
◐  In progress (started but incomplete)
●  Complete
⚠  Needs attention (low confidence)
```

### 4.5 Chat Panel Redesign

**Make Chat Optional, Not Forced**

```
┌─────────────────────────────────────────────────────────────────┐
│ CHAT PANEL STATES                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ STATE 1: MINIMIZED (Default after onboarding)                   │
│ ┌──────────────────────────┐                                    │
│ │ 💬 Chat with Atlas   [↑] │  ← Persistent footer bar           │
│ └──────────────────────────┘                                    │
│                                                                 │
│ STATE 2: OPEN (User clicks to expand)                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Atlas Assistant                                    [─] [×]  │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ Currently discussing: Market > Target Customer              │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │                                                             │ │
│ │ [Chat messages...]                                          │ │
│ │                                                             │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ [Type your message...]                            [Send]    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ STATE 3: FOCUSED (User selected specific topic to discuss)      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Atlas Assistant                                    [─] [×]  │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │ 📍 Focused on: Target customer profile                      │ │
│ │    [End focus] to return to general chat                    │ │
│ │─────────────────────────────────────────────────────────────│ │
│ │                                                             │ │
│ │ [Chat messages...]                                          │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.6 Onboarding Flow

**New First-Time User Experience:**

```
Step 1: Welcome Modal
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    Welcome to Atlas Readiness Guide                             │
│                                                                 │
│    We'll help you assess your US expansion readiness            │
│    across 5 key areas:                                          │
│                                                                 │
│    ○ Market          ○ Go-to-Market                             │
│    ○ Product         ○ Operations                               │
│    ○ Financials                                                 │
│                                                                 │
│    ⏱️ Most people complete this in 20-30 minutes                │
│    💾 Your progress is saved automatically                      │
│                                                                 │
│    How would you like to proceed?                               │
│                                                                 │
│    ┌────────────────────┐  ┌────────────────────┐              │
│    │ Guide me through   │  │ Let me explore     │              │
│    │ (Recommended)      │  │ on my own          │              │
│    └────────────────────┘  └────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

"Guide me through" → Opens chat, AI leads
"Let me explore" → Chat minimized, user browses content
```

### 4.7 Progress & Status Dashboard

**New Domain Header with Clear Status:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Market Readiness                                    3/5 topics  │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│ YOUR PROGRESS                                                   │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│ │         60% complete                                      │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ CONFIDENCE BREAKDOWN                                            │
│ ● Strong (2)  ◐ Developing (1)  ○ Not started (2)              │
│                                                                 │
│ NEXT RECOMMENDED                                                │
│ → Market size estimate - Understanding your addressable market  │
│                                                 [Start this]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.8 Return User Experience

**New "Welcome Back" Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    Welcome back!                                                │
│                                                                 │
│    LAST SESSION: 2 days ago                                     │
│                                                                 │
│    YOUR PROGRESS                                                │
│    ████████████████████████░░░░░░░░░░░░░░░░░  45%              │
│                                                                 │
│    COMPLETED                         TO DO                      │
│    ✓ Market (3/5)                   ○ Operations (0/5)         │
│    ✓ Product (2/5)                  ○ Financials (0/5)         │
│    ◐ Go-to-Market (1/5)                                        │
│                                                                 │
│    ┌────────────────────────────────────────────────────────┐   │
│    │ Continue where you left off: Go-to-Market Strategy     │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                 │
│    Or [View all topics] to explore freely                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Implementation Priority Matrix

| Change | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Decouple card expand from chat | High | Medium | P0 |
| Add inline edit mode | High | Medium | P0 |
| Add onboarding flow | High | Medium | P1 |
| Chat minimized by default | Medium | Low | P1 |
| Simplify status indicators | Medium | Low | P1 |
| Not-started card options | Medium | Medium | P2 |
| Welcome back flow | Medium | Medium | P2 |
| Skip topic option | Low | Low | P3 |
| Progress dashboard | Low | Medium | P3 |

---

## Part 6: Success Metrics

| Metric | Current (Est.) | Target |
|--------|----------------|--------|
| Task completion rate | 35% | >60% |
| Time to first input | 90+ seconds | <30 seconds |
| Cards expanded without chat | 0% | >50% |
| User-initiated chat opens | ~100% forced | >70% voluntary |
| "Where am I?" confusion (survey) | High | Low |
| Session return rate | Unknown | >40% |

---

## Part 7: Next Steps

1. **Design:** Create high-fidelity mockups of new card states
2. **Engineering:** Implement card expand/collapse without chat trigger
3. **Product:** Define onboarding copy and flow
4. **Research:** Validate with 3-5 user tests before full build

---

*Document prepared for cross-functional alignment. This represents a significant UX shift and should be reviewed by all stakeholders before implementation.*

# Readiness Report UX Overhaul

**Date:** 2026-02-19
**Status:** Implementation Plan
**Priority:** CRITICAL

---

## Problem Statement

Currently there are **4 different ways** to access/generate the readiness report:
1. "Readiness Report" link in sidebar (navigates to `/snapshot`)
2. Inline CTA in ContentPanel ("Generate Snapshot")
3. TopBar actions
4. Direct URL to `/snapshot`

This is confusing and inconsistent. The report is a separate page, requiring full navigation away from the workspace.

---

## Solution: Single Entry Point, Integrated View

### Core Principles

1. **One Entry Point:** Sidebar has a "Readiness Report" section (like "Assessment")
2. **Integrated View:** Report opens IN the workspace, not a separate page
3. **Sidebar Always Visible:** User can switch between Assessment and Report instantly
4. **Lazy Refresh:** Clicking "Readiness Report" shows current version; explicit "Refresh" button for updates
5. **Clear Status:** Before generation, show readiness status and what's needed

---

## Architecture Changes

### 1. Workspace State (workspace-context.tsx)

Add new state and actions:

```typescript
interface WorkspaceState {
  // ... existing fields

  // NEW: Active view mode
  activeView: 'assessment' | 'report';

  // NEW: Report state tracking
  reportState: {
    hasGenerated: boolean;
    lastGeneratedAt: string | null;
    needsRefresh: boolean;  // True if assessment changed since generation
  };
}

type WorkspaceAction =
  // ... existing actions
  | { type: 'SET_VIEW'; payload: 'assessment' | 'report' }
  | { type: 'SET_REPORT_GENERATED'; payload: string }  // timestamp
  | { type: 'MARK_REPORT_STALE' };
```

### 2. Sidebar Structure (Sidebar.tsx)

**Current:**
```
┌────────────────────────┐
│ [📄] Readiness Report  │  ← Link to /snapshot
├────────────────────────┤
│ ASSESSMENT             │  ← Section header
│   ▸ Market             │
│   ▸ Product            │
│   ...                  │
└────────────────────────┘
```

**New:**
```
┌────────────────────────┐
│ ASSESSMENT             │  ← Section header (clickable)
│   ▸ Market             │
│   ▸ Product            │
│   ...                  │
├────────────────────────┤
│ READINESS REPORT       │  ← Section header (clickable)
│   [Current report or   │
│    status indicator]   │
└────────────────────────┘
```

**Behavior:**
- Clicking "ASSESSMENT" header → `activeView: 'assessment'`, shows domain list
- Clicking "READINESS REPORT" header → `activeView: 'report'`, shows report in ContentPanel
- Active section is highlighted
- Report section shows subtle status indicator (e.g., "Ready" / "60% complete")

### 3. ContentPanel Routing (ContentPanel.tsx)

**Current:** Always shows domain content
**New:** Routes based on `activeView`

```tsx
export function ContentPanel() {
  const { activeView } = useWorkspace();

  if (activeView === 'report') {
    return <ReportPanel />;
  }

  // Existing domain content logic
  return <DomainContent />;
}
```

### 4. New ReportPanel Component

**Location:** `apps/web/src/components/workspace/report/ReportPanel.tsx`

**States:**

#### State A: Not Ready to Generate (< 60% or missing domain coverage)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 Readiness Report                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ○ Not Ready to Generate                               │ │
│  │                                                        │ │
│  │  Complete at least 60% of topics with coverage in all │ │
│  │  5 domains to generate your readiness report.         │ │
│  │                                                        │ │
│  │  Current Progress: 8/25 topics (32%)                  │ │
│  │                                                        │ │
│  │  Market       ●●●●●  5/5  ✓                           │ │
│  │  Product      ●●●○○  3/5  ✓                           │ │
│  │  GTM          ○○○○○  0/5  ← Need 2+                   │ │
│  │  Operations   ○○○○○  0/5  ← Need 2+                   │ │
│  │  Financials   ○○○○○  0/5  ← Need 2+                   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [← Continue Assessment]                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### State B: Ready to Generate (first time)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 Readiness Report                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ● Ready to Generate                                   │ │
│  │                                                        │ │
│  │  You've covered 18/25 topics (72%) with coverage      │ │
│  │  across all domains. Generate your report to see:     │ │
│  │                                                        │ │
│  │  • Your readiness verdict (Ready / Caveats / Not Yet) │ │
│  │  • Critical blockers to address                       │ │
│  │  • Assumptions to validate                            │ │
│  │  • 30-day action plan                                 │ │
│  │                                                        │ │
│  │              [Generate Report]                         │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### State C: Report Generated (viewing)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 Readiness Report                   [↻ Refresh Report]   │
│  Generated Feb 19, 2:30 PM                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ◐ Ready with Caveats                    18/25 (72%)  │ │
│  │  ...                                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ... rest of report content ...                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### State D: Report Needs Refresh (assessment changed)
Same as State C but with visible indicator:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  📊 Readiness Report                                        │
│  Generated Feb 19, 2:30 PM                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ⚠ Assessment updated since this report was generated │ │
│  │                                                        │ │
│  │  [↻ Refresh Report]                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ... current report content ...                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5. Remove Duplicate Entry Points

**Remove/Modify:**
- `InlineSnapshotCTA.tsx` → Delete or convert to "View Report" link
- TopBar report actions → Remove
- `/snapshot` page → Redirect to `/workspace` with report view

**Keep:**
- Sidebar "Readiness Report" section as ONLY entry point

---

## Implementation Steps

### Phase 1: Workspace Context Updates

1. Add `activeView` state to WorkspaceContext
2. Add `reportState` tracking (hasGenerated, lastGeneratedAt, needsRefresh)
3. Add actions: `SET_VIEW`, `SET_REPORT_GENERATED`, `MARK_REPORT_STALE`
4. Track when inputs change to mark report as stale

### Phase 2: Sidebar Restructure

1. Move "Readiness Report" below Assessment section
2. Style as section header (like "ASSESSMENT")
3. Add click handler to switch `activeView`
4. Add subtle status indicator (progress or "Ready")
5. Highlight active section

### Phase 3: ContentPanel Routing

1. Check `activeView` state
2. Render `ReportPanel` when `activeView === 'report'`
3. Render existing domain content when `activeView === 'assessment'`

### Phase 4: ReportPanel Component

1. Create `apps/web/src/components/workspace/report/ReportPanel.tsx`
2. Implement 4 states (not ready, ready, viewing, needs refresh)
3. Move report rendering logic from `/snapshot/page.tsx`
4. Add generate/refresh functionality
5. Integrate with assessment context for snapshot data

### Phase 5: Cleanup

1. Delete `InlineSnapshotCTA.tsx` or simplify to link
2. Remove TopBar report actions
3. Update `/snapshot` route to redirect to workspace
4. Update any other report entry points

---

## Files to Modify

| File | Change |
|------|--------|
| `lib/context/workspace-context.tsx` | Add `activeView`, `reportState`, new actions |
| `components/workspace/sidebar/Sidebar.tsx` | Restructure with two sections |
| `components/workspace/content/ContentPanel.tsx` | Route based on `activeView` |
| `components/workspace/content/InlineSnapshotCTA.tsx` | Delete or simplify |
| `app/snapshot/page.tsx` | Redirect to workspace |

## New Files to Create

| File | Purpose |
|------|---------|
| `components/workspace/report/ReportPanel.tsx` | Main report view container |
| `components/workspace/report/ReportNotReady.tsx` | "Not ready to generate" state |
| `components/workspace/report/ReportReadyToGenerate.tsx` | "Ready to generate" state |
| `components/workspace/report/ReportContent.tsx` | Actual report content |
| `components/workspace/report/ReportNeedsRefresh.tsx` | "Needs refresh" banner |

---

## Sidebar Visual Design

```
┌────────────────────────────────────────┐
│                                        │
│  ASSESSMENT                   ← Header │
│  ─────────────────────────────────     │
│  ▸ Market          ●●●●●  5/5          │
│  ▸ Product         ●●●○○  3/5          │
│  ▸ GTM             ●○○○○  1/5          │
│  ▸ Operations      ○○○○○  0/5          │
│  ▸ Financials      ●●○○○  2/5          │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  READINESS REPORT             ← Header │
│  ─────────────────────────────────     │
│  📊 11/25 topics (44%)                 │
│  ○ Not ready to generate               │
│                                        │
│  -- OR --                              │
│                                        │
│  📊 Ready to generate                  │
│  ● 18/25 topics covered                │
│                                        │
│  -- OR --                              │
│                                        │
│  📊 Generated Feb 19                   │
│  ◐ Ready with Caveats                  │
│                                        │
└────────────────────────────────────────┘
```

---

## Benefits

1. **Single Entry Point** - No confusion about where to find the report
2. **No Page Reload** - Instant switching between assessment and report
3. **Sidebar Always Visible** - Easy navigation context
4. **Clear Status** - User always knows if report is ready/current
5. **Explicit Refresh** - User controls when to regenerate

---

## Questions Resolved

1. **Can user see report while in progress?** Yes - switch anytime via sidebar
2. **When does report refresh?** Only when user clicks "Refresh"
3. **How does user know report is stale?** Banner appears when assessment changes
4. **Where is the generate button?** In ReportPanel, not scattered around UI


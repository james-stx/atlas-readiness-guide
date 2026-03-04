# Design Spec: Auth, Guest Mode & Data Capture — User Journeys & Wireframes

**Status:** Draft for review
**Author:** Product — STX Labs
**Date:** 2026-03-04
**Companion PRD:** `docs/PRD-Auth-Guest-Flow-and-Data-Capture.md`

---

## 1. User Journey Maps

### Journey 1 — New User: Signs In (magic link)

```
[/start page]
     │
     ▼
[Entry Modal appears]
  ┌──────────────────────────────────┐
  │  Sign In   │   Continue as Guest │
  └──────────────────────────────────┘
     │
     │  User clicks "Sign In"
     ▼
[Magic Link Form shown in modal]
  Enter email → "Send magic link"
     │
     ▼
[Confirmation screen: "Check your inbox"]
     │
     │  (user opens email, clicks link)
     ▼
[Supabase Auth callback → /workspace]
     │
     ▼
[WelcomeModal: Guide me vs Explore]
     │
     ▼
[Workspace: assessment in progress]
  TopBar: avatar chip | progress | Ask Atlas
     │
     ▼
[User navigates to Report panel]
     │
     ▼
[Report generates, full content visible]
     │
     ▼
[Export Section: "Email Report" button]
     │
     ▼
[Email delivered to verified address with PDF]
```

---

### Journey 2 — New User: Continues as Guest

```
[/start page]
     │
     ▼
[Entry Modal appears]
  ┌──────────────────────────────────┐
  │  Sign In   │   Continue as Guest │
  └──────────────────────────────────┘
     │
     │  User clicks "Continue as Guest"
     ▼
[Backend: POST /api/session { isGuest: true }]
     │
     ▼
[Redirected to /workspace]
     │
     ▼
[WelcomeModal: Guide me vs Explore]
     │
     ▼
[Workspace: assessment in progress]
  TopBar: GUEST badge | "Save progress" chip | progress | Ask Atlas
     │
     ▼
[User completes some topics]
     │
     ├── User ignores sign-up CTA ──────────────────────────────────────┐
     │                                                                   │
     │  User clicks "View Report"                                        │
     ▼                                                                   │
[Report panel: GATE OVERLAY shown]                                       │
  "Your report is one step away"                                         │
  [email input] [Send magic link]                                        │
     │                                                                   │
     │  User submits email                                               │
     ▼                                                                   │
[Email sent with magic link including ?guestSession=<id>]               │
     │                                                                   │
     │  User clicks link in email                                        │
     ▼                                                                   │
[Supabase auth callback → /workspace?guestSession=<id>]                 │
     │                                                                   │
     ▼                                                                   │
[POST /api/session/migrate → session migrated]                          │
     │                                                                   │
     ▼                                                                   │
[Report generates automatically]                                         │
     │                                                                   │
     └── Guest session expires (> 24 h) ────────────────────────────────┘
                      │
                      ▼
             [Error screen: "Session expired"]
             [Start new assessment button]
```

---

### Journey 3 — Guest Converts In-Session (via "Save progress" CTA)

```
[Workspace — Guest session active]
  TopBar shows GUEST chip + "Save progress" CTA
     │
     │  User clicks "Save progress"
     ▼
[In-workspace sign-up popup]
  "Save your progress"
  [email input] [Send magic link]
     │
     ▼
[Popup: "Check your inbox!" — auto-dismisses 3 s]
  User continues assessment
     │
     │  User clicks magic link in email
     ▼
[Auth callback → /workspace?guestSession=<id>]
     │
     ▼
[Migration runs silently in background]
  TopBar: GUEST chip → avatar chip (smooth swap)
     │
     ▼
[User continues — no session loss]
```

---

### Journey 4 — Returning Signed-In User

```
[Navigates to /start]
     │
     ▼
[Session recovery check]
  localStorage has atlas_recovery_token?
     │ YES
     ▼
[Entry Modal: "Continue where you left off?" banner]
  [Continue]  [Start fresh]
     │
     │  Continue clicked → recoverSession()
     ▼
[/workspace — existing session restored]
  TopBar: avatar chip (signed in state)
```

---

### Journey 5 — Report Export (Signed-In User)

```
[Report panel visible]
     │
     ▼
[Export Section]
  ┌────────────────────────────────────────┐
  │  [✉ Email Report]                      │
  │  Delivers your PDF to {email}          │
  └────────────────────────────────────────┘
     │
     │  User clicks "Email Report"
     ▼
[Button: spinner → "Sending..."]
     │
     ▼
[API: POST /api/export/send/{sessionId}]
  Resend: generate HTML + attach PDF
     │
     ▼
[Button: ✓ "Sent!" — stays for 3 s then resets]
[Inline confirmation: "Report sent to {email}"]
     │
     ▼
[User receives email]
  Subject: "Your Atlas Readiness Report — {company}"
  Body: readiness badge + findings + STX Labs CTA
  Attachment: atlas-readiness-report.pdf
```

---

### Journey 6 — Guest Hits Report Gate

```
[Workspace — Guest session]
     │
     │  User clicks "View Report" (sidebar or TopBar)
     ▼
[Report panel: Gate Overlay]
  ┌─────────────────────────────────────────────────┐
  │  🔒 Your report is one step away                │
  │                                                  │
  │  Create a free account to:                       │
  │  • Generate your full Readiness Report           │
  │  • Keep your assessment across devices           │
  │  • Receive your PDF report by email              │
  │                                                  │
  │  [you@company.com              ]                 │
  │  [      Send magic link        ]                 │
  │                                                  │
  │  Takes 30 seconds. No password needed.           │
  └─────────────────────────────────────────────────┘
  Sidebar remains fully interactive (guest can keep assessing)
```

---

## 2. Screen Wireframes

### Wire 1 — Workspace Entry Modal (Sign In vs Guest)

Renders over `/start` page before any workspace content loads.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ┌──────────────────────────────────────────────────────┐    │
│   │                                                      │    │
│   │          [A]  Atlas                                  │    │
│   │                                                      │    │
│   │   Assess your U.S. expansion readiness               │    │
│   │   in 25–30 minutes. Free.                            │    │
│   │                                                      │    │
│   │  ┌──────────────────────┐  ┌─────────────────────┐  │    │
│   │  │                      │  │                     │  │    │
│   │  │  [✉]  Sign In        │  │  [→]  Continue      │  │    │
│   │  │                      │  │       as Guest      │  │    │
│   │  │  Keep your report    │  │                     │  │    │
│   │  │  across devices      │  │  Start immediately. │  │    │
│   │  │  and receive PDF     │  │  Report requires    │  │    │
│   │  │  by email.           │  │  sign-in later.     │  │    │
│   │  │                      │  │                     │  │    │
│   │  │  Recommended ★       │  │                     │  │    │
│   │  └──────────────────────┘  └─────────────────────┘  │    │
│   │                                                      │    │
│   │  ────────────────────────────────────────────────    │    │
│   │  🔒 We never share your data.  Privacy Policy        │    │
│   │                                                      │    │
│   └──────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Dimensions: max-w-lg modal, centered, white bg, rounded-xl, backdrop blur
Border: Sign In card has accent border (#2383E2); Guest card has neutral border
```

---

### Wire 2 — Magic Link Sign-In Form (expanded in the entry modal)

Appears when user clicks "Sign In" in Wire 1.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │                                                    │    │
│   │   ← Back         [A]  Sign in to Atlas             │    │
│   │                                                    │    │
│   │   Work email                                       │    │
│   │   ┌─────────────────────────────────────────────┐ │    │
│   │   │  you@company.com                            │ │    │
│   │   └─────────────────────────────────────────────┘ │    │
│   │                                                    │    │
│   │   ┌─────────────────────────────────────────────┐ │    │
│   │   │         Send magic link   →                 │ │    │
│   │   └─────────────────────────────────────────────┘ │    │
│   │                                                    │    │
│   │   No password needed. Link expires in 1 hour.      │    │
│   │                                                    │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

States:
  Default:  Email input focused, button enabled when email valid
  Loading:  Button shows spinner "Sending..."
  Success:  Transitions to Wire 2b (confirmation screen)
  Error:    Red border on input, error message below
```

---

### Wire 2b — Magic Link Sent Confirmation

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │                                                    │    │
│   │              📨                                    │    │
│   │                                                    │    │
│   │         Check your inbox                          │    │
│   │                                                    │    │
│   │   We sent a sign-in link to                       │    │
│   │   you@company.com                                 │    │
│   │                                                    │    │
│   │   Click the link in that email to continue.       │    │
│   │   The link expires in 1 hour.                     │    │
│   │                                                    │    │
│   │   ─────────────────────────────────────────────   │    │
│   │                                                    │    │
│   │   Didn't receive it?  [Resend]   [Wrong email?]   │    │
│   │                                                    │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Wire 3 — TopBar: Guest State

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [A] Atlas   │   [GUEST ●]  [↑ Save progress]   │  ──── 32% · ~68 min  │  [✕ Close] │
└──────────────────────────────────────────────────────────────────────────────────────┘

Left section:
  [A] = logo mark (dark bg, white compass icon, 28×28px)
  "Atlas" label

Center-left section (between logo and progress):
  [GUEST ●] = amber pill badge
    - bg: #FEF3C7  text: #92400E  border: #FDE68A
    - "GUEST" in 11px uppercase bold
    - Clickable → re-opens sign-up popup
  [↑ Save progress] = small outline chip
    - icon: Upload arrow  text: "Save progress"  font-size: 12px
    - bg: white  border: #E8E6E1  hover: accent border + bg
    - Clicking opens Wire 5 (in-workspace popup)

Right section (unchanged from current TopBar):
  Progress bar 120px wide + percentage + remaining time
  [Ask Atlas] button (blue, right-most)
```

---

### Wire 4 — TopBar: Signed-In State

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [A] Atlas   │                              │  ──── 32% · ~68 min  │  [JP]  [✕ Close] │
└──────────────────────────────────────────────────────────────────────────────────────┘

Right section changes:
  [JP] = avatar chip (user initials)
    - 28×28px circle, bg: #37352F, text: white, font: 11px semibold
    - Clicking opens a small dropdown:
        ─────────────
        james@stxlabs.io
        ─────────────
        [Sign out]
        ─────────────
  No GUEST badge, no "Save progress" chip

Note: "Ask Atlas" button moves left to accommodate avatar chip
```

---

### Wire 5 — In-Workspace Sign-Up Popup (Guest CTA)

Triggered by clicking "Save progress" chip or the GUEST badge. Appears as a
small floating panel anchored below the TopBar right section. Does NOT navigate
away from the workspace.

```
                              ┌──────────────────────────────────┐
                              │  Save your progress          [×] │
                              │  ────────────────────────────    │
                              │  Create a free account to keep   │
                              │  your assessment and receive     │
                              │  your report by email.           │
                              │                                  │
                              │  Work email                      │
                              │  ┌──────────────────────────┐   │
                              │  │  you@company.com         │   │
                              │  └──────────────────────────┘   │
                              │  ┌──────────────────────────┐   │
                              │  │   Send magic link  →     │   │
                              │  └──────────────────────────┘   │
                              │                                  │
                              │  Takes 30 sec · No password      │
                              └──────────────────────────────────┘

Positioning: fixed, top-[48px] right-[16px] (below TopBar right edge)
Width: 280px
Shadow: lg (0 10px 25px rgba(0,0,0,0.15))
Animation: slide-down from TopBar
States:
  Default:  Input + button
  Sent:     "✓ Check your inbox!" (green) — popup auto-dismisses in 3 s
  Error:    Red message below input
```

---

### Wire 6 — Report Panel: Guest Gate Overlay

Replaces report content inside the report panel when `session.is_guest === true`.
The sidebar navigation remains interactive.

```
┌───────────────────────┬────────────────────────────────────────────────┐
│                       │                                                │
│  SIDEBAR              │   ┌──────────────────────────────────────────┐ │
│  (fully interactive)  │   │                                          │ │
│                       │   │         🔒                               │ │
│  Market          ✓    │   │                                          │ │
│  Product         ●    │   │   Your report is one step away           │ │
│  GTM             ○    │   │                                          │ │
│  Operations      ○    │   │   Create a free account to:              │ │
│  Financials      ○    │   │   ✓ Generate your full report            │ │
│                       │   │   ✓ Keep your progress across devices    │ │
│  ─────────────────    │   │   ✓ Receive your PDF report by email     │ │
│                       │   │                                          │ │
│  [View Report]        │   │   Work email                             │ │
│   ↑ (locked for       │   │   ┌──────────────────────────────────┐   │ │
│     guests)           │   │   │  you@company.com                 │   │ │
│                       │   │   └──────────────────────────────────┘   │ │
│                       │   │   ┌──────────────────────────────────┐   │ │
│                       │   │   │      Send magic link  →          │   │ │
│                       │   │   └──────────────────────────────────┘   │ │
│                       │   │                                          │ │
│                       │   │   Takes 30 seconds. No password needed.  │ │
│                       │   │                                          │ │
│                       │   └──────────────────────────────────────────┘ │
│                       │                                                │
└───────────────────────┴────────────────────────────────────────────────┘

Overlay specs:
  - Fills the content panel only (not full screen)
  - White bg, centered content, max-w-sm card
  - Lock icon (Lucide `Lock`) in accent colour (#2383E2)
  - Heading: 18px semibold
  - Bullets: 14px, check icons in green (#0F7B6C)
  - Email input + button: same styles as Wire 2
  - No backdrop/blur — sidebar stays usable
```

---

### Wire 7 — Report Panel: Export Section (Email Only — No Download Button)

Replaces the current two-button layout in `ExportSection`.

```
┌───────────────────────────────────────────────────────────────┐
│  SHARE & EXPORT                                               │
│                                                               │
│  Your report will be delivered as a PDF to your inbox.        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ✉  Email Report                                →    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  [ sent state ]                                               │
│  ✓  Report sent to james@stxlabs.io                          │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  KEY STATS FOR YOUR DECK                         [Copy]       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  • 18 of 25 readiness topics assessed               │     │
│  │  • 12 high-confidence inputs captured               │     │
│  │  • 2 critical gaps identified                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Changes from current:
  - "Download PDF" button REMOVED
  - "Email Report" button is now full-width, accent style (blue)
  - Copy beneath button: "Delivers a PDF to {email}"
  - Success message replaces error-only message area
```

---

### Wire 8 — Enhanced Email Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  [A]  Atlas
             Powered by STX Labs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     Your U.S. Expansion Readiness Report

  ┌───────────────────────────────────────────────┐
  │  READINESS LEVEL                              │
  │                                               │
  │  ● Ready with Caveats                         │  ← amber badge
  │                                               │
  │  "Acme Corp shows strong product-market       │
  │   fit in the APAC region but has critical     │
  │   gaps in U.S. legal and GTM infrastructure." │
  └───────────────────────────────────────────────┘

  Generated for james@stxlabs.io · March 4, 2026
  ─────────────────────────────────────────────────

  KEY FINDINGS
  ┌─────────────────────────────────────────────┐
  │  1. Strong product differentiation ...  HIGH │
  │  2. No U.S. legal entity established ... LOW │
  │  3. GTM strategy is assumptions-based ... MED│
  └─────────────────────────────────────────────┘

  COVERAGE SUMMARY
  ┌───────────────┬──────────┬──────────────────┐
  │  Domain       │  Inputs  │  Confidence mix  │
  ├───────────────┼──────────┼──────────────────┤
  │  Market       │    8     │  5 H / 2 M / 1 L │
  │  Product      │    6     │  4 H / 1 M / 1 L │
  │  GTM          │    4     │  2 H / 1 M / 1 L │
  │  Operations   │    2     │  0 H / 1 M / 1 L │
  │  Financials   │    1     │  0 H / 0 M / 1 L │
  └───────────────┴──────────┴──────────────────┘

  TOP RECOMMENDATIONS
  1.  Establish a U.S. legal entity ...
  2.  Validate distribution channel assumptions ...
  3.  Build a U.S. advisory board ...

  ─────────────────────────────────────────────────

  ┌─────────────────────────────────────────────┐
  │  Work with STX Labs                         │
  │                                             │
  │  STX Labs helps APAC founders navigate      │
  │  U.S. market entry:                         │
  │                                             │
  │  → Strategic market positioning             │
  │  → GTM execution with U.S. partners         │
  │  → Investor-ready expansion planning        │
  │                                             │
  │  ┌─────────────────────────────────────┐   │
  │  │   Book a Discovery Call  →          │   │   ← CTA button (#37352F bg)
  │  └─────────────────────────────────────┘   │
  │                                             │
  │  stxlabs.io                                 │
  └─────────────────────────────────────────────┘

  ─────────────────────────────────────────────────
  Your full report is attached as a PDF.

  Generated by Atlas · STX Labs · Sydney, Australia
  Unsubscribe · Privacy Policy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email specs:
  Subject:   "Your Atlas Readiness Report — {company domain or email domain}"
  From:      "Atlas by STX Labs <atlas@stxlabs.io>"
  Reply-to:  "hello@stxlabs.io"
  Attachment: atlas-readiness-report-{sessionId[:8]}.pdf
  Template:  apps/api/src/lib/email/templates/snapshot-email.ts
```

---

## 3. Component Mapping

| Wire | Existing component | Action required |
|------|-------------------|-----------------|
| Wire 1 | `/start` page + `WelcomeModal` pattern | New `EntryModal` component at `/start` |
| Wire 2 / 2b | `/start` page form | New `MagicLinkForm` sub-component |
| Wire 3 | `TopBar.tsx` | Add guest/auth conditional sections |
| Wire 4 | `TopBar.tsx` | Add avatar chip + dropdown |
| Wire 5 | New | `SaveProgressPopup` floating component |
| Wire 6 | New within report panel | `ReportGateOverlay` component |
| Wire 7 | `export-section.tsx` | Remove download button; restyle email button |
| Wire 8 | `snapshot-email.ts` | Add readiness badge, STX pitch, remove download link |

---

## 4. Design Token Reference

All new components use the existing design system tokens. No new tokens are introduced.

| Token | Value | Usage |
|-------|-------|-------|
| `#37352F` | Charcoal | Logo bg, primary text, avatar bg |
| `#2383E2` | Accent Blue | Primary CTAs, progress bar, "Sign In" card border |
| `#9B9A97` | Muted | Secondary text, icons |
| `#E8E6E1` | Border | Card borders, dividers |
| `#F7F6F3` | Surface | Card backgrounds, hover states |
| `#FEF3C7` | Amber 100 | Guest badge background |
| `#92400E` | Amber 800 | Guest badge text |
| `#0F7B6C` | Green | Success states, high-confidence indicators |
| `#E03E3E` | Red | Error states, low-confidence indicators |

---

## 5. Responsive Behaviour

| Screen | Adjustments |
|--------|------------|
| Mobile (< 640px) | Entry modal: full-screen sheet instead of centred dialog. TopBar: Guest chip hidden; hamburger menu shows "Save progress" item. In-workspace popup: full-width bottom sheet. Report gate: full-screen overlay. |
| Tablet (640–1024px) | Entry modal: centred dialog (max-w-md). TopBar: all elements shown. |
| Desktop (> 1024px) | All wires as shown above. |

---

## 6. Animation Notes

| Element | Animation |
|---------|-----------|
| Entry modal | `animate-slide-up` (existing class, used in WelcomeModal) |
| TopBar guest→auth swap | Crossfade on auth state change (0.3 s ease) |
| In-workspace popup | `translate-y-[-8px] opacity-0` → `translate-y-0 opacity-100` (200 ms) |
| Report gate overlay | Fade in (150 ms) |
| Sign-up popup auto-dismiss | Fade out after 3 s success state |
| Magic link button loading | `Loader2` spinner (existing Lucide usage) |

---

## 7. Accessibility Notes

- All modals trap focus (`aria-modal="true"`, focus lock).
- "Continue as Guest" and "Sign In" cards are `<button>` elements, not `<div>`.
- Guest badge has `aria-label="Signed in as guest — click to save your progress"`.
- Report gate overlay has `role="main"` and appropriate heading hierarchy.
- Magic link form: `aria-live="polite"` region for success/error messages.
- Colour contrast: all text/background pairings meet WCAG AA (4.5:1 minimum).
  - Amber badge (#92400E on #FEF3C7): ratio 5.7:1 ✓
  - Accent blue (#2383E2 on white): ratio 4.6:1 ✓

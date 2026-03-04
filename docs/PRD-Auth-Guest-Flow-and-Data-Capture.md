# PRD: Auth, Guest Mode, Data Capture & PDF Email

**Status:** Draft for review
**Author:** Product — STX Labs
**Date:** 2026-03-04
**Branch:** `feat/auth-guest-flow-spec`

---

## 1. Problem Statement

### 1.1 Immediate Fix Required — Broken PDF Export

The "Download PDF" button on the Readiness Report is broken in production. The API route
`/api/export/pdf/[sessionId]` uses `renderToBuffer` (Puppeteer/Chromium) inside a Vercel
serverless function. This fails for two compounding reasons:

1. **Timeout:** Vercel Hobby/Pro cold-start + PDF render routinely exceeds the 10 s (Hobby)
   or 60 s (Pro) function timeout.
2. **Bundle size / runtime:** Chromium cannot be bundled into a standard serverless function;
   the route only works locally where Chrome is installed.

The "Email Report" button (`/api/export/send/[sessionId]`) works correctly — it renders HTML
via `snapshot-email.ts` and sends it through Resend. The PDF is generated server-side and
attached via the Resend `attachments` API, which has the same cold-start problem. However,
the email path is significantly more reliable because Resend's infra handles the heavy lifting
asynchronously.

**Resolution in this sprint:** Remove the "Download PDF" button entirely. Promote "Email
Report" as the single export action. The email template is enhanced (see F4) to compensate.

### 1.2 Business Problem — Anonymous Sessions & No Data Capture

Every Atlas session is currently 100 % anonymous:

- A user enters an email on `/start`, which is stored only in `localStorage` and passed as a
  parameter to the API — it is never verified.
- The API stores it in the `sessions` table but there is no Supabase Auth record.
- Any person who obtains a `sessionId` UUID can access that session's data via the API.
- There is no way to contact a user after they leave, track conversion, or offer them
  continuity across devices.

### 1.3 Business Opportunity — Guest→Auth Funnel

The product owner wants to:

1. Let users start without friction (guest mode).
2. Gate the Readiness Report behind a verified account (email + magic link).
3. Convert guests to signed-in users in-session without navigation loss.
4. Capture email in Supabase Auth so the team can reach out and build a CRM pipeline.

---

## 2. Goals & Non-Goals

### Goals

| # | Goal |
|---|------|
| G1 | Fix the broken PDF export by removing the download button and making email the primary export path |
| G2 | Introduce Supabase Auth (magic link) so users can have persistent, cross-device accounts |
| G3 | Allow anonymous guest usage up to the Report gate |
| G4 | Gate report generation behind a verified account |
| G5 | Allow guests to convert to full accounts in-session with data migration |
| G6 | Enhance the email template with STX Labs marketing content |
| G7 | Surface a non-obtrusive sign-up CTA for guests while they are in the workspace |

### Non-Goals (this sprint)

- Password-based authentication
- OAuth / social sign-in (Google, LinkedIn)
- Role-based access control
- Team / organisation accounts
- In-app "delete account" flow (flagged for next sprint; required for GDPR compliance)
- Report sharing links
- Mobile app

---

## 3. User Personas

### 3.1 New Founder (primary)
Exploring expansion readiness for the first time. Wants to understand their gaps without
committing to an account. Low trust initially; high value once they see the report quality.

### 3.2 Returning Founder (secondary)
Has used Atlas before. Wants to pick up where they left off or re-export the report.

### 3.3 STX Labs Advisor (internal)
Reviews reports alongside founders. Needs reliable PDF delivery into inbox; does not use
the web app directly.

---

## 4. Feature Specifications

### F0 — Fix PDF Export (PDF → Email)

**Priority:** P0 — Fix immediately

#### 4.0.1 Description
Remove the non-functional "Download PDF" button. Promote "Email Report" as the sole export
action. Update button copy and position to reflect this.

#### 4.0.2 User Stories
- As a signed-in user, I can receive my full Readiness Report as a PDF email attachment so I
  can save and share it without relying on a browser download.

#### 4.0.3 Acceptance Criteria
- [ ] The "Download PDF" button is removed from `ExportSection`.
- [ ] The "Email Report" button is the primary CTA (full width, accent style).
- [ ] Clicking "Email Report" sends the report to the verified account email.
- [ ] A success state shows "Sent to {email}" with a check icon.
- [ ] The broken `/api/export/pdf/[sessionId]` route is either deleted or returns 410 Gone.
- [ ] The email includes the PDF as an attachment (pre-existing capability via Resend).

#### 4.0.4 Technical Notes
- The working email route is `apps/api/src/app/api/export/send/[sessionId]/route.ts`.
- The email template is `apps/api/src/lib/email/templates/snapshot-email.ts` — enhance per F4.
- The broken PDF route is `apps/api/src/app/api/export/pdf/[sessionId]/route.ts`.
- `apps/web/src/components/snapshot/export-section.tsx` handles the UI buttons.

---

### F1 — Workspace Entry: Sign In vs Guest Modal

**Priority:** P1

#### 4.1.1 Description
Replace the current `/start` page email-only form with a two-path entry modal:
1. **Sign In / Create Account** — triggers magic-link authentication via Supabase Auth.
2. **Continue as Guest** — creates an anonymous backend session flagged `is_guest: true`.

The modal appears before the workspace loads. It replaces the current WelcomeModal's
purpose for new users; WelcomeModal retains its role for workspace mode selection (guided
vs explore) but fires _after_ auth is resolved.

#### 4.1.2 User Stories
- As a new user, I want to quickly enter the workspace as a guest so I can evaluate Atlas
  before committing my email.
- As a returning user, I want to sign in with my email so my report and history are
  available.
- As a new user who chose Sign In, I want to receive a magic link so I do not need to create
  a password.

#### 4.1.3 Acceptance Criteria
- [ ] The `/start` page shows a modal with two clearly labelled options: "Sign In" and
  "Continue as Guest".
- [ ] Choosing "Sign In" reveals an email input and a "Send magic link" button.
- [ ] After submitting the magic link form, the user sees a confirmation screen: "Check your
  inbox — we sent a link to {email}".
- [ ] Choosing "Continue as Guest" immediately creates a guest session and redirects to
  `/workspace`.
- [ ] Guest sessions are flagged `is_guest: true` in the `sessions` table.
- [ ] The session recovery flow (existing `atlas_recovery_token`) continues to work for
  returning signed-in users who have not signed out.

#### 4.1.4 Edge Cases
- User submits magic link but closes tab → link still valid for 1 hour (Supabase default);
  returning to `/start` shows the sign-in form pre-filled if `pendingEmail` is in
  `sessionStorage`.
- User tries to sign in with an email already used for a guest session → system checks
  whether a guest session exists for that email and offers to migrate (see F5).
- User disables JavaScript → static fallback form at `/start?mode=email` (no modal).

#### 4.1.5 Technical Notes
- Supabase Auth `signInWithOtp({ email })` sends the magic link.
- `supabase.auth.onAuthStateChange` listener in the web app picks up the session token when
  the user clicks the link and returns to any tab.
- The `sessions` table requires a new nullable column: `supabase_user_id UUID REFERENCES
  auth.users(id)` and a boolean `is_guest DEFAULT false`.
- The API `POST /api/session` must accept an optional `supabaseUserId` and `isGuest` flag.
- Middleware (`apps/api/src/middleware.ts`) must be extended to validate Supabase JWT for
  protected routes (report generation, export).

---

### F2 — Guest Indicator & Non-Obtrusive Sign-Up CTA

**Priority:** P2

#### 4.2.1 Description
While a user is in the workspace as a guest, the TopBar shows a "Guest" chip and a
non-obtrusive "Save your progress" CTA. Clicking the CTA opens an in-workspace sign-up
popup (no navigation away from the workspace). The popup allows the user to enter their
email and receive a magic link without losing their current place.

#### 4.2.2 User Stories
- As a guest, I can see that I am not signed in and understand that my data will be lost
  after 24 hours.
- As a guest, I can sign up for an account from within the workspace without interrupting my
  assessment.

#### 4.2.3 Acceptance Criteria
- [ ] TopBar shows "Guest" badge (amber/warning colour) when `session.is_guest === true`.
- [ ] TopBar shows a "Save progress" CTA chip to the left of the "Ask Atlas" button.
- [ ] Clicking "Save progress" opens a small popup modal (not a page redirect).
- [ ] The popup shows: title "Save your progress", body "Create a free account to keep your
  assessment and receive your report by email.", email input, "Send magic link" button.
- [ ] On submit, popup shows "Check your inbox!" and auto-dismisses after 3 s.
- [ ] If user is signed in, the TopBar shows their avatar initials and email instead of the
  Guest chip.
- [ ] The CTA does not appear more than once per session (dismissed state saved in
  `sessionStorage`).

#### 4.2.4 Edge Cases
- Guest submits sign-up popup but does not click the magic link → guest session continues;
  popup can be re-opened by clicking the Guest chip again.
- Guest dismisses popup → chip remains; popup can still be reopened.
- Signed-in user visits workspace → guest chip never shown.

#### 4.2.5 Technical Notes
- `session.is_guest` flag drives the TopBar variant; passed through context.
- `AssessmentContext` needs to expose `isGuest: boolean`.
- The in-workspace popup reuses Supabase `signInWithOtp` with a redirect URL that carries
  the guest `sessionId` as a query parameter so the migration (F5) can be triggered
  automatically when the user returns.

---

### F3 — Report Gating: Signed-In Users Only

**Priority:** P1

#### 4.3.1 Description
Guests cannot generate or view the Readiness Report. When a guest navigates to the Report
panel (by clicking "View Report" or similar), they see a gate overlay that explains the
benefit of signing up and offers the sign-up flow inline.

#### 4.3.2 User Stories
- As a guest, I am clearly told that generating the report requires a free account, and I
  can sign up without losing my progress.
- As a signed-in user, I can generate and view the report as before.

#### 4.3.3 Acceptance Criteria
- [ ] The Report panel for a guest session shows an overlay instead of the report content.
- [ ] The overlay includes: a heading ("Your report is one step away"), a brief benefit list
  (3 bullets), an email input, and a "Send magic link" CTA.
- [ ] The overlay does not obscure the workspace sidebar (guest can continue assessment).
- [ ] After the user clicks their magic link and returns, the overlay disappears and the
  report generates automatically.
- [ ] The API `POST /api/snapshot/generate` rejects calls from guest sessions with HTTP 403.
- [ ] The API `GET /api/snapshot/[sessionId]` rejects calls from guest sessions with HTTP 403.

#### 4.3.4 Edge Cases
- Guest completes 100 % of the assessment → report gate still shown (no partial bypass).
- Guest signs up via the gate overlay, returns to the link, but their session has expired
  (> 24 h) → error screen: "Your guest session expired. Your responses have been removed.
  Please start a new assessment." with a "Start new" button.
- Signed-in user's Supabase JWT expires mid-session → automatic silent refresh via Supabase
  client; if refresh fails, redirect to sign-in.

#### 4.3.5 Technical Notes
- The API middleware must check `session.is_guest` before allowing snapshot routes.
- The web app `ReportPanel` component checks `isGuest` from context before rendering report
  content.
- The "return from magic link" flow: Supabase redirects to `/workspace?view=report&session=
  {guestSessionId}` — the app reads this param, triggers migration (F5), then shows the
  report.

---

### F4 — Enhanced Email Template with STX Labs Marketing

**Priority:** P2

#### 4.4.1 Description
The existing snapshot email template (`snapshot-email.ts`) is functional but has no brand
personality or commercial intent. This feature enhances it with:
- Atlas / STX Labs branding header
- Positioning summary (readiness level badge + 1-line summary)
- Existing content (key findings, coverage, recommendations) retained
- New STX Labs pitch section before the footer
- CTA to book a discovery call

The PDF attachment remains (generated server-side by the working Resend path).

#### 4.4.2 User Stories
- As a user, I receive a polished, branded email that summarises my readiness and clearly
  shows what to do next.
- As an STX Labs advisor, the email I forward to colleagues includes a professional
  introduction to STX Labs services.

#### 4.4.3 Acceptance Criteria
- [ ] Email subject line: "Your Atlas Readiness Report — [Company/Domain]".
- [ ] Header section: Atlas logo mark + "Powered by STX Labs" tagline.
- [ ] Readiness level shown as a coloured badge (green/amber/red) directly under the header.
- [ ] One-sentence readiness summary (generated from `snapshot.executive_summary`).
- [ ] Existing key findings, coverage summary, and recommendations sections retained.
- [ ] New "Work with STX Labs" section: 3-bullet description of STX advisory services + CTA
  button "Book a discovery call" linking to the STX Labs Calendly/booking URL.
- [ ] Footer: unsubscribe link placeholder, Atlas version, STX Labs address.
- [ ] The "Download Full PDF" link in the current template is removed (PDF is now the
  attachment; no separate download link needed).
- [ ] Plain-text version updated to match.

#### 4.4.4 Technical Notes
- File: `apps/api/src/lib/email/templates/snapshot-email.ts`.
- Resend `attachments` already works — no infrastructure change needed.
- The STX Labs booking URL will be provided by the product owner before implementation;
  use a placeholder `https://stxlabs.io/discovery` for now.
- `snapshot.executive_summary` is available in the V5 snapshot schema.

---

### F5 — Guest-to-Auth Session Migration

**Priority:** P1

#### 4.5.1 Description
When a guest user creates an account (via F2 or F3), their existing session data — messages,
inputs, and partial snapshots — is migrated to their new authenticated account. This happens
server-side when the user returns from clicking the magic link.

#### 4.5.2 User Stories
- As a user who started as a guest and then created an account, I do not lose any of my
  assessment progress.
- As a user, when I sign in for the first time and I had a previous guest session, I am
  automatically presented with my migrated workspace.

#### 4.5.3 Acceptance Criteria
- [ ] A new API endpoint `POST /api/session/migrate` accepts `{ guestSessionId, supabaseUserId }`.
- [ ] Migration updates `sessions.supabase_user_id = supabaseUserId` and sets
  `sessions.is_guest = false` for the guest session.
- [ ] Migration is idempotent — calling it twice does not duplicate data.
- [ ] If the guest session has expired, the endpoint returns HTTP 410 Gone with a clear error.
- [ ] After migration, the user is redirected to `/workspace` with the migrated session active.
- [ ] The existing `atlas_session_id` in `localStorage` is updated to the migrated session's ID.
- [ ] If the user already has a previous authenticated session (returning user who used a
  guest session on a new device), they are offered: "You have a previous session — would
  you like to continue that one or keep this new session?" (modal choice).

#### 4.5.4 Edge Cases
- Guest session data > 24 h old is purged by a scheduled job (Supabase Edge Function or
  pg_cron) before migration is attempted → 410 response as above.
- Guest creates an account but does not complete magic link within the session → session
  data persists for 24 h; migration is still possible within that window.
- User uses the same email for multiple guest sessions across different devices → only the
  session ID passed in the magic link redirect URL is migrated.

#### 4.5.5 Technical Notes
- The `sessions` table migration (required for F1) covers the DB schema changes.
- The magic link redirect URL must include `?guestSession={guestSessionId}` so the app
  knows which session to migrate after auth resolves.
- Supabase Auth `onAuthStateChange('SIGNED_IN', ...)` is the trigger point.
- The migration endpoint must validate that the authenticated user is the one who initiated
  the magic link request (i.e., the email matches `sessions.email` for the guest session).

---

## 5. Auth Method Decision Record

### Decision: Passwordless Magic Link via Supabase Auth

| Option | Pros | Cons |
|--------|------|------|
| **Magic link (chosen)** | Zero friction — no password to create/forget. Supabase supports natively (`signInWithOtp`). Extends the existing "enter your email" UX pattern. High deliverability via Resend. | User must have email access to click link. Cannot sign in offline. |
| Email + password | Familiar UX for some users | Password reset flow required. Higher abandonment at signup. More surface area for credential-stuffing attacks. |
| OAuth (Google/LinkedIn) | Frictionless for users with accounts | Significant implementation complexity. Privacy-conscious B2B founders may prefer not to link social accounts. |

**Recommendation:** Magic link in this sprint. OAuth can be added later as an additional
option without architecture changes (Supabase handles both).

---

## 6. Data Model Changes

### 6.1 `sessions` table additions

```sql
ALTER TABLE sessions
  ADD COLUMN supabase_user_id UUID REFERENCES auth.users(id),
  ADD COLUMN is_guest BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN guest_expires_at TIMESTAMPTZ;

-- Guest sessions expire 24 hours after creation
CREATE OR REPLACE FUNCTION set_guest_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_guest THEN
    NEW.guest_expires_at := NOW() + INTERVAL '24 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_guest_expiry
  BEFORE INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION set_guest_expiry();
```

### 6.2 Guest session purge job

```sql
-- pg_cron: runs daily at 02:00 UTC
SELECT cron.schedule(
  'purge-guest-sessions',
  '0 2 * * *',
  $$
    DELETE FROM sessions
    WHERE is_guest = true
      AND guest_expires_at < NOW();
  $$
);
```

### 6.3 Row-Level Security

```sql
-- Authenticated users can only see their own sessions
CREATE POLICY "Users see own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (supabase_user_id = auth.uid());

-- Guest sessions are accessible by anyone with the session ID (existing behaviour)
-- This is acceptable for the 24-hour lifetime; tighten in a future sprint
CREATE POLICY "Guest sessions accessible by ID"
  ON sessions FOR SELECT
  TO anon
  USING (is_guest = true AND guest_expires_at > NOW());
```

---

## 7. PII & Privacy

| Data | Retention | Notes |
|------|-----------|-------|
| Email address | Until account deletion (or 24 h for guests) | Stored in Supabase Auth for verified accounts; `sessions.email` for guests |
| Assessment responses | Until account deletion (or 24 h for guests) | May contain business-sensitive content; not personal data |
| IP address | Not stored | Vercel logs only; not persisted to DB |
| Magic link tokens | 1 hour (Supabase default) | Auto-expired |

**GDPR note:** The right to erasure requires a "Delete my account" feature that removes the
Supabase Auth user and all associated sessions/inputs/snapshots. This is out of scope for
this sprint but must be implemented before the product goes to a EU audience at scale.

---

## 8. API Changes Summary

| Route | Change |
|-------|--------|
| `POST /api/session` | Add optional `supabaseUserId` + `isGuest` fields |
| `POST /api/session/migrate` | **New** — guest→auth migration |
| `GET /api/snapshot/[sessionId]` | Reject if `session.is_guest === true` (403) |
| `POST /api/snapshot/generate` | Reject if `session.is_guest === true` (403) |
| `GET /api/export/pdf/[sessionId]` | Remove or return 410 Gone |
| `POST /api/export/send/[sessionId]` | Require authenticated session (no guests) |
| `apps/api/src/middleware.ts` | Add Supabase JWT validation for protected routes |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PDF export complaints | 0 post-launch | Sentry error rate on export route |
| Email report delivery rate | > 95 % | Resend delivery dashboard |
| Guest→auth conversion rate | > 30 % of guests who hit the report gate | Supabase Auth signups vs guest sessions |
| Auth signup completion rate | > 60 % of magic links clicked | Supabase Auth → sessions with `supabase_user_id` |
| Session data loss on migration | 0 % | Manual QA + automated migration test |

---

## 10. Out of Scope / Future Work

- OAuth / social sign-in
- Team accounts and session sharing
- In-app "delete account" (GDPR compliance — next sprint)
- Audit log of report views/exports
- Admin dashboard for STX Labs to view all sessions
- Push notifications or follow-up email sequences (separate CRM sprint)

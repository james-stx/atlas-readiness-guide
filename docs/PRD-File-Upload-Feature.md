# PRD: Document Upload & Auto-Analysis
**Status:** Draft
**Author:** Product
**Date:** March 2026
**Scope:** Atlas Web App + API

---

## 1. Problem Statement

Beta users are dropping off or reporting fatigue mid-assessment. The core complaint: they already have this information documented — pitch decks, business plans, financial models, GTM strategies — and being asked to recall and re-articulate it from memory in a chat interface is exhausting and time-consuming.

The current experience asks founders to do two things simultaneously that should be separate: (1) locate and retrieve information from their own knowledge, and (2) have that information evaluated. The cognitive overhead of step 1 is creating friction that prevents step 2 from ever happening.

This is a retention and completion rate problem with a clear, structural solution.

---

## 2. Opportunity

Founders preparing for U.S. expansion almost universally have existing documentation. Pitch decks. Market research. Financial models. Go-to-market strategies. Board decks. These documents contain the exact information Atlas needs to assess readiness — it's already structured, already committed to, and in many cases already stress-tested by investors or advisors.

If Atlas can read those documents and automatically map their contents to the relevant domains and topics, the assessment process transforms from a 45-minute knowledge retrieval exercise into a 10-minute validation and gap-identification conversation.

The opportunity is not just speed. It's a fundamentally better product: one where Atlas meets founders where they are rather than asking them to re-produce what they've already done. This is the difference between a tool that respects the user's time and one that wastes it.

**Projected impact:**
- Significant increase in assessment completion rate
- Reduction in time-to-first-insight
- Higher quality inputs (documents are more specific and detailed than recalled answers)
- Stronger value prop for founders who arrive with prior work already done

---

## 3. Goals

1. Allow users to upload one or more documents at any point during their assessment
2. Automatically analyse uploaded documents and map relevant content to the 5 domains and 25 topics
3. Users do not need to label or describe what they're uploading — Atlas identifies content type and relevance automatically
4. Provide clear, visible attribution: every topic addressed by a document shows which file it came from
5. The conversation becomes confirmatory, validating, and gap-filling rather than starting from a blank slate
6. Maintain assessment quality — document-derived inputs go through the same confidence classification as manually provided answers

---

## 4. User Stories

**Primary:**
> As a founder who has a pitch deck and GTM strategy document, I want to upload them at the start of my assessment so that Atlas can pre-fill what it already knows and only ask me about things I haven't covered.

**Secondary:**
> As a user mid-assessment, I want to upload a document when I realise I have relevant material, so I don't have to type out information that's already written down.

> As a user reviewing my workspace, I want to see clearly which of my topic responses came from an uploaded document and which I answered manually, so I can trust the source of each insight.

> As a user, I want Atlas to tell me what it found in my documents and what it couldn't find, so I know exactly where gaps remain.

---

## 5. Scope (v1)

**In scope:**
- Upload 1–5 documents per session
- Supported formats: PDF, DOCX, PPTX
- Auto-detection of document type (pitch deck, business plan, financial model, GTM strategy, market research, competitive analysis, other)
- AI mapping of document content to relevant question_ids across all 5 domains
- Confidence classification of document-derived inputs (same system as chat-derived)
- Document source attribution in workspace topic cards
- Upload available from: chat input area + sidebar panel + start-of-conversation prompt
- Session-scoped storage (files expire with session)
- Processing status feedback (uploading → analysing → done)
- Summary of what was found per document

**Out of scope (v1):**
- OCR for scanned/image-heavy PDFs
- Spreadsheet formats (CSV, XLSX) — deferred to v2
- Image uploads (PNG, JPG) — deferred to v2
- Document editing or annotation
- Persisting documents beyond session expiry
- Cross-session document reuse

---

## 6. User Experience Design

### 6.1 Entry Points

There are three natural entry points for upload. All three must exist in v1.

**A. Pre-assessment prompt (highest priority)**

Immediately after the user's session is created and the chat is initialised, before Atlas asks its first question, a persistent banner appears at the top of the chat panel:

```
┌──────────────────────────────────────────────────────────┐
│  📎  Have existing documents?                            │
│  Upload them and Atlas will automatically map what's     │
│  already covered — so we only ask about the gaps.        │
│                          [Upload documents]  [Skip →]    │
└──────────────────────────────────────────────────────────┘
```

This banner dismisses permanently once either action is taken. It does not reappear on session recovery.

**B. Chat input area (always available)**

A paperclip icon sits to the left of the chat textarea. Clicking it opens the upload modal. This is persistent throughout the entire assessment — users can upload at any point.

**C. Sidebar — Uploaded Documents panel**

A collapsible "Documents" section in the sidebar (below domain navigation) shows uploaded files and allows adding more. This gives users a persistent, visible record of what they've shared.

---

### 6.2 Upload Modal

Single modal, drag-and-drop primary, file picker secondary.

```
┌───────────────────────────────────────────────────────────────┐
│  Upload your documents                                   [×]  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │         Drag files here, or click to browse             │  │
│  │                                                         │  │
│  │    PDF · DOCX · PPTX · up to 20MB per file             │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  You don't need to tell us what it is. Atlas will            │
│  automatically identify what's relevant to your              │
│  readiness assessment.                                        │
│                                                               │
│  Great for: pitch decks · business plans · GTM strategies    │
│  financial models · market research · board presentations     │
│                                                               │
│  [Upload files]                         Up to 5 files / session│
└───────────────────────────────────────────────────────────────┘
```

The value prop copy here is deliberate: "You don't need to tell us what it is." This is the key differentiator from standard file upload UX and must be prominent.

---

### 6.3 Processing State

Once files are uploaded, the modal transitions to a processing view. This is not a background process — users should see it happening, as it sets expectations for what Atlas is doing.

```
┌───────────────────────────────────────────────────────────────┐
│  Analysing your documents...                             [×]  │
│                                                               │
│  ✓  pitch-deck-2026.pdf    uploaded                          │
│  ◌  GTM-strategy-Q1.docx   analysing...                      │
│                                                               │
│  Atlas is reading your documents and mapping                  │
│  relevant content to your readiness assessment.              │
│  This takes about 15–30 seconds per file.                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

When processing completes, the modal transitions to the Results Summary view (6.4) automatically.

---

### 6.4 Processing Results Summary

This is a critical moment. Users need to feel the value immediately — Atlas has done real work on their documents and they should see it.

```
┌───────────────────────────────────────────────────────────────┐
│  Here's what we found                                    [×]  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  📄 pitch-deck-2026.pdf           [Pitch Deck]          │  │
│  │  Covered 9 topics across 3 domains                      │  │
│  │                                                         │  │
│  │  ● Market        ████████░░  4 of 5 topics              │  │
│  │  ● Product       ██████░░░░  3 of 5 topics              │  │
│  │  ● Go-to-Market  ████░░░░░░  2 of 5 topics              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  📄 GTM-strategy-Q1.docx          [GTM Strategy]        │  │
│  │  Covered 4 topics in Go-to-Market                       │  │
│  │                                                         │  │
│  │  ● Go-to-Market  ████████░░  4 of 5 topics              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  13 topics addressed. 12 remaining.                          │
│  Atlas will now focus on the gaps.                           │
│                                                               │
│  [Continue to assessment →]                                  │
└───────────────────────────────────────────────────────────────┘
```

Key design decisions here:
- Show the auto-detected document type prominently ("Pitch Deck", "GTM Strategy") — demonstrates Atlas understood what was uploaded
- Progress bars per domain communicate coverage at a glance
- "Atlas will now focus on the gaps" sets the right expectation for what the conversation will be
- Topics remaining count makes the time-savings tangible

---

### 6.5 Document Attribution in Workspace

Every topic card in the content panel that contains document-derived content shows a source badge.

**On the collapsed topic row:**
```
  Target Customer Profile          [📄 pitch-deck-2026.pdf]  [High ✓]  ›
```

**In the expanded topic card (above the response text):**
```
  Source: pitch-deck-2026.pdf
  Atlas extracted this from your Pitch Deck. You can edit below or discuss further with Atlas.
```

This creates a clear audit trail. Users know exactly where each piece of information came from and can verify, correct, or expand on it.

---

### 6.6 Atlas Chat Behaviour After Upload

After processing, when Atlas begins the conversation, it:

1. Acknowledges what was found (warm, specific, not robotic)
2. Confirms key extracted information for high-confidence topics
3. Asks clarifying or deepening questions on medium-confidence extractions
4. Focuses new questions entirely on uncovered topics

**Example opening after upload:**

> "Thanks for sharing those. I've reviewed your pitch deck and GTM strategy — you've already covered quite a bit of ground.
>
> For your Market chapter, I have a clear picture of your target segment and market size estimate. I did notice your competitive landscape section is fairly high level — before we move on, can you tell me more about the two or three competitors you see as most directly threatening your U.S. position?
>
> Once we've covered that, we can move to Product — there are two topics there I couldn't find in either document."

This is dramatically better than starting from scratch. The conversation feels intelligent, informed, and respectful of what the user has already done.

---

### 6.7 Sidebar — Documents Panel

```
DOCUMENTS  [+ Add]
─────────────────────────────
📄  pitch-deck-2026.pdf
    9 topics across 3 domains

📄  GTM-strategy-Q1.docx
    4 topics · Go-to-Market

[+ Upload another document]
```

Clicking a file name expands a breakdown of exactly which topics it addressed, each as a clickable link that navigates to that topic in the content panel.

---

## 7. Technical Architecture

### 7.1 File Storage

Use **Supabase Storage** (already integrated). Create a private `session-documents` bucket. Files are stored at path `{session_id}/{file_id}/{original_filename}`.

Access is controlled by session ownership — files are never publicly accessible.

### 7.2 New Database Tables

```sql
-- Uploaded files metadata
CREATE TABLE session_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  detected_type TEXT,           -- 'pitch_deck' | 'business_plan' | 'gtm_strategy' |
                                -- 'financial_model' | 'market_research' | 'competitive_analysis' | 'other'
  status        TEXT NOT NULL DEFAULT 'processing',  -- 'processing' | 'complete' | 'failed'
  topics_found  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

-- Individual topic mappings extracted from files
CREATE TABLE file_topic_mappings (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id            UUID NOT NULL REFERENCES session_files(id) ON DELETE CASCADE,
  session_id         UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  domain             TEXT NOT NULL,
  question_id        TEXT NOT NULL,
  extracted_content  TEXT NOT NULL,         -- verbatim or paraphrased excerpt
  confidence_level   TEXT NOT NULL,         -- 'high' | 'medium' | 'low'
  confidence_rationale TEXT,
  page_reference     TEXT,                  -- e.g. "Slide 12" or "Page 4"
  created_at         TIMESTAMPTZ DEFAULT now()
);
```

The `file_topic_mappings` table maps directly to question_ids, meaning extracted content slots directly into the same system as manually entered inputs.

### 7.3 New API Endpoints

```
POST   /api/files/upload              — upload file(s), return file_id(s)
GET    /api/files/[sessionId]         — list all files + status for a session
GET    /api/files/[fileId]/mappings   — get topic mappings for a specific file
DELETE /api/files/[fileId]            — remove a file and its mappings
POST   /api/files/[fileId]/process    — trigger/retry processing (internal use)
```

### 7.4 Processing Pipeline

Each uploaded file goes through a 3-stage pipeline:

**Stage 1 — Text Extraction**
- PDF: use `pdf-parse` (Node.js library, no external service needed)
- DOCX: use `mammoth` (Node.js, extracts clean text + structure)
- PPTX: use `pptx-parser` or `officegen` to extract slide text
- Output: raw text string with page/slide markers preserved

**Stage 2 — Document Classification**
Single lightweight Claude Haiku call:
```
Given the following document text, identify:
1. Document type (pitch_deck | business_plan | financial_model | gtm_strategy | market_research | competitive_analysis | other)
2. Brief rationale (1 sentence)

Document text: [first 3000 characters]
```
Cost: ~$0.001 per file. Fast (<2 seconds).

**Stage 3 — Topic Extraction & Mapping**
Single Claude Sonnet call with the full topic list and document text:
```
You are analysing a document to identify which of the following readiness assessment topics are addressed.

TOPICS TO LOOK FOR:
[Full list of all 25 question_ids with their descriptions]

DOCUMENT TEXT:
[full extracted text, truncated to model context limit]

For each topic that is addressed in this document:
- Return the question_id
- Extract the most relevant verbatim excerpt or a faithful paraphrase
- Assign a confidence level (high/medium/low) based on how specifically the document addresses the topic
- Note the page/slide reference if identifiable

Return only topics that genuinely have relevant content. Do not fabricate or infer beyond what is written.
```

Output is parsed and stored as `file_topic_mappings` rows, then corresponding `inputs` rows are created (or updated if the topic was already manually answered — user is notified if a conflict exists).

**Processing time estimate:** 15–45 seconds per document depending on length.

### 7.5 Conflict Resolution

If a user has already manually answered a topic and then uploads a document that also covers that topic:
- The existing manual input is **not** overwritten automatically
- The file mapping is stored but marked `status = 'pending_review'`
- In the topic card, both sources are shown with a "Which do you want to use?" prompt
- This preserves user agency and prevents silent data replacement

### 7.6 Context Injection

When `streamConversation()` builds the system prompt, file mappings are injected alongside existing inputs:

```
TOPIC: target_segment
STATUS: COVERED (from pitch-deck-2026.pdf, High confidence)
EXTRACTED: "Primary target: Series A SaaS companies with >$1M ARR seeking enterprise contracts"
INSTRUCTION: Confirm this with the user, then probe for specifics around buying behaviour and decision-maker profile.
```

This gives the AI model the full context to have an intelligent, document-aware conversation.

### 7.7 Constraints & Limits

| Constraint | Limit | Rationale |
|------------|-------|-----------|
| Files per session | 5 | Prevents abuse, keeps processing tractable |
| File size | 20MB | Covers all realistic founder documents |
| File formats | PDF, DOCX, PPTX | Covers >95% of founder document types |
| Retention | Session lifetime | Privacy, storage cost |
| Processing timeout | 90 seconds | Fail gracefully rather than hang |

---

## 8. Confidence & Quality Standards

Document-derived inputs are held to the same confidence standard as manually entered answers. The AI extraction prompt explicitly instructs the model to classify low confidence for:
- Vague or aspirational statements ("we plan to target...")
- Numbers without sources
- Assertions without supporting evidence

This ensures the readiness report accurately reflects whether information is validated or assumed — regardless of whether it came from a chat response or a document. A polished pitch deck full of aspirational claims will still correctly generate Low confidence ratings, which is a feature not a bug.

---

## 9. Privacy & Security

- Files are stored in a private Supabase Storage bucket — no public URLs
- Files are scoped to session_id and only accessible to the session owner
- Virus/malware scanning: integrate ClamAV or Supabase's built-in file scanning before processing
- Files are automatically deleted when the session expires
- Guest sessions: files follow the same 24-hour expiry as the session itself
- No document content is stored in the AI model's context beyond the session lifecycle
- Do not log or persist extracted document text beyond the `file_topic_mappings` table

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Upload adoption rate | >40% of sessions in first 30 days | `session_files` count / total sessions |
| Assessment completion rate | +20% vs baseline | sessions reaching `completed` status |
| Time to complete assessment | -30% for uploaders vs non-uploaders | session duration comparison |
| Topics pre-filled per session | >6 average for uploading sessions | avg `file_topic_mappings` count |
| Extraction accuracy | >85% user acceptance rate | inputs not edited after document extraction |

---

## 11. Phased Rollout

**Phase 1 — Core Upload (v1)**
- Upload modal with drag-and-drop
- PDF + DOCX + PPTX support
- Auto-classification and topic mapping
- Source attribution in workspace
- Chat context injection
- Pre-assessment upload prompt

**Phase 2 — Enhanced Intelligence (v2)**
- Conflict resolution UI when document and manual answer both exist
- Image/screenshot support (OCR via Tesseract or Claude vision)
- Spreadsheet support (CSV, XLSX) for financial models
- "Re-analyse" if user uploads a newer version of a document
- Document summary view — show Atlas's full reading of each file

**Phase 3 — Report Integration**
- PDF report includes a "Sources" section listing uploaded documents
- Document-derived insights labelled in the readiness report
- Allow document re-upload post-completion for a revised assessment

---

## 12. Open Questions

1. **Conflict resolution default**: If a document contradicts a manual answer, should we surface this to the user immediately or defer to the next time they visit that topic card?

2. **Guest sessions**: Should we restrict upload to signed-in users only (to incentivise sign-in and ensure documents persist longer)? Or allow guests with a clear expiry warning?

3. **Atlas acknowledgement timing**: Should Atlas acknowledge uploaded documents immediately in the chat stream, or only reference them contextually when a covered topic comes up in conversation?

4. **Re-upload**: If a user uploads a revised pitch deck mid-session, should old mappings from the previous version be removed or retained with versioning?

5. **Processing failure UX**: If a document fails to process (corrupt file, unsupported structure), should we still allow the session to continue with a clear error, or block progress until resolved?

---

## 13. Dependencies

| Dependency | Owner | Notes |
|------------|-------|-------|
| Supabase Storage bucket setup | Engineering | Private bucket, CORS policy for web upload |
| `pdf-parse`, `mammoth` packages | Engineering | npm install, no external service |
| File upload API endpoints | Engineering | 3 new API routes |
| DB migrations | Engineering | 2 new tables |
| Chat context injection | Engineering | Modify `streamConversation()` to include file mappings |
| Frontend upload modal | Design/Engineering | New component |
| Sidebar documents panel | Design/Engineering | New sidebar section |
| Topic card source attribution | Design/Engineering | Modify `TopicCard` component |

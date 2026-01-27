# Atlas Readiness Guide - MVP Build Documentation

> This documentation covers everything built for the Atlas Readiness Guide MVP, from initial design through deployment. Written to be understood by both technical and non-technical readers.

---

## Table of Contents

1. [Overview & Executive Summary](#1-overview--executive-summary)
2. [Glossary](#2-glossary)
3. [User Flows](#3-user-flows)
4. [UX/UI Design](#4-uxui-design)
5. [Technical Architecture](#5-technical-architecture)
6. [Codebase Structure](#6-codebase-structure)
7. [Data Model & Storage](#7-data-model--storage)
8. [Integrations](#8-integrations)
9. [API Reference](#9-api-reference)
10. [Configuration & Secrets](#10-configuration--secrets)
11. [Local Development Setup](#11-local-development-setup)
12. [Deployment & Environments](#12-deployment--environments)
13. [Manual Testing & Troubleshooting](#13-manual-testing--troubleshooting)
14. [Decision Log](#14-decision-log)
15. [Known Limitations & Future Roadmap](#15-known-limitations--future-roadmap)
16. [Maintenance Guide](#16-maintenance-guide)

---

## 1. Overview & Executive Summary

### What is Atlas Readiness Guide?

Atlas Readiness Guide is a web application that helps Australian companies assess their readiness to expand into the United States market. It uses an AI-powered conversational interface to guide users through a structured assessment across five key business domains.

### What Problem Does It Solve?

Australian companies considering U.S. expansion often don't know what they don't know. They may have assumptions about their readiness that haven't been validated. This tool helps them:

- **Identify what they actually know** (validated information)
- **Surface their assumptions** (things they believe but haven't confirmed)
- **Reveal gaps** (things they haven't considered)

### Key Features

| Feature | Description |
|---------|-------------|
| **Conversational Assessment** | AI-guided chat that feels natural, not like a boring survey |
| **5-Domain Coverage** | Market, Product, Go-to-Market, Operations, Financials |
| **Confidence Classification** | Each input is rated as High/Medium/Low confidence |
| **Phase 1 Progress Visibility System** | Real-time progress tracking during assessment conversations with visual progress indicators, domain-specific progress tracking, confidence-based input classification, toast notifications for captured inputs, and a comprehensive readiness panel for detailed progress review |
| **Readiness Snapshot** | Summary document showing strengths, assumptions, and gaps |
| **PDF Export** | Download the snapshot as a professional PDF |
| **Email Delivery** | Send the snapshot directly to your inbox |
| **Session Recovery** | Return to your assessment if you leave and come back |

### Live URLs

- **Web App**: https://atlas-readiness-guide-web.vercel.app
- **API**: https://atlas-readiness-guide-api.vercel.app

### Technology Summary (Plain Language)

| Component | What It Does | Technology Used |
|-----------|--------------|-----------------|
| Frontend | What users see and interact with | Next.js (React) |
| Backend/API | Processes requests, talks to AI | Next.js API Routes |
| Database | Stores user sessions and responses | Supabase (PostgreSQL) |
| AI | Powers the conversational assessment | Anthropic Claude |
| Email | Sends snapshot to users | Resend |
| Hosting | Makes the app available on the internet | Vercel |

---

## 2. Glossary

A reference for technical terms used throughout this documentation.

### General Terms

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface - a way for different software to talk to each other. Like a waiter taking your order to the kitchen. |
| **Frontend** | The part of the app users see and interact with (buttons, text, forms). |
| **Backend** | The behind-the-scenes part that processes data, talks to databases, and runs business logic. |
| **Database** | Where information is stored permanently (like a digital filing cabinet). |
| **Environment Variable** | A secret or configuration value stored outside the code (like passwords or API keys). |
| **Deployment** | The process of putting code onto a server so people can use it. |
| **Repository (Repo)** | Where code is stored and tracked (like a folder with version history). |
| **Monorepo** | A single repository containing multiple related projects. |

### Project-Specific Terms

| Term | Definition |
|------|------------|
| **Session** | A user's assessment journey from start to finish. |
| **Domain** | One of five business areas assessed: Market, Product, GTM, Operations, Financials. |
| **Input** | A piece of information the user provides during the assessment. |
| **Confidence Level** | How validated the information is: High (verified), Medium (researched), Low (assumed). |
| **Snapshot** | The final summary document generated from all inputs. |
| **Recovery Token** | A secret code that lets users return to their session. |
| **Streaming** | Sending data piece by piece instead of all at once (makes AI responses appear word by word). |

### Technology Terms

| Term | Definition |
|------|------------|
| **Next.js** | A framework for building web applications with React. |
| **React** | A library for building user interfaces with reusable components. |
| **TypeScript** | JavaScript with added type checking (catches errors before running). |
| **Supabase** | A service that provides a database and authentication. |
| **Vercel** | A platform for deploying web applications. |
| **Claude** | Anthropic's AI assistant that powers the conversational assessment. |
| **CORS** | Cross-Origin Resource Sharing - security rules for web requests between different websites. |

---

## 3. User Flows

### Primary User Journey

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Start     │────▶│    Chat     │────▶│  Snapshot   │────▶│   Export    │
│   Page      │     │  Assessment │     │  Generated  │     │  PDF/Email  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Step-by-Step Flow

#### 1. Start Page (`/start`)
- User enters their email address
- Clicks "Start Assessment"
- System creates a new session and stores a recovery token locally

#### 2. Chat Assessment (`/chat`)
- AI greets the user and explains the process
- Conversation flows through 5 domains:
  1. **Market** - Target market, competitors, market size
  2. **Product** - Product-market fit, localization needs
  3. **GTM** - Go-to-market strategy, sales channels
  4. **Operations** - Legal, hiring, infrastructure
  5. **Financials** - Funding, runway, pricing
- Each response is analyzed and classified by confidence level
- Progress bar shows current domain
- Users can type freely or use quick-response buttons

#### 3. Snapshot Generation (`/snapshot`)
- When all domains are covered, user triggers snapshot generation
- AI synthesizes all inputs into:
  - Key findings
  - Coverage summary by domain
  - Strengths (high confidence items)
  - Assumptions (medium confidence items)
  - Gaps (low confidence items)
  - Recommended next steps

#### 4. Export Options
- **Download PDF** - Professional formatted document
- **Send Email** - Snapshot delivered to inbox with PDF link

### Session Recovery Flow

If a user leaves and returns:
1. App checks for stored recovery token
2. If found, prompts to continue or start fresh
3. If continuing, restores full session state (messages, inputs, current domain)

### Progress Tracking Flow

1. **Real-time Progress Updates**:
   - User sees progress ring showing overall completion percentage
   - Domain pills display status (not started, in progress, adequate) for each business area
   - Current active domain is visually highlighted
   - Toast notifications appear when new inputs are captured with confidence levels

2. **Progress Details Panel**:
   - User clicks "View Details" to open slide-out readiness panel
   - Panel shows detailed breakdown by domain with expandable accordions
   - Each domain shows covered topics, confidence levels, and gap analysis
   - Readiness assessment with suggestions for improvement
   - "Generate Snapshot" button when ready for comprehensive report

3. **Domain Navigation**:
   - Users can click domain pills to jump to specific domain details in the panel
   - Auto-scroll to selected domain within the readiness panel
   - Visual indicators show progress and confidence for each topic area

---

## 4. UX/UI Design

### Design Principles

1. **Conversational, Not Form-Like** - Feels like chatting with an advisor, not filling out a survey
2. **Progressive Disclosure** - Only show what's relevant at each step
3. **Clear Progress** - Always know where you are in the assessment
4. **Mobile-First** - Works well on phones (where many founders are)
5. **Minimal Friction** - Email-only signup, no passwords

### Visual Design

#### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Indigo) | `#5754FF` | Buttons, links, accents |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, chat bubbles |
| Text Primary | `#0F172A` | Main text |
| Text Secondary | `#64748B` | Supporting text |
| Success (Green) | `#16A34A` | High confidence |
| Warning (Amber) | `#D97706` | Medium confidence |
| Error (Red) | `#DC2626` | Low confidence |

#### Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, comfortable reading size

### Key Screens

#### Start Page
- Clean, centered layout
- Email input field
- Single call-to-action button
- Brief explanation of what to expect

#### Chat Interface
- Progress bar at top showing domain progress
- Message list with clear user/AI distinction
- Quick response chips when relevant
- Text input at bottom with send button
- Loading indicators during AI responses

#### Snapshot View
- Executive summary at top
- Tabbed or sectioned view of detailed findings
- Clear visual distinction between strengths/assumptions/gaps
- Export buttons prominently displayed

### Progress Visibility Components

#### Progress Header
- **Desktop**: Full header with progress ring, domain pills, and "View Details" button
- **Mobile**: Compact layout with percentage text and smaller domain pills
- Responsive design with different layouts for mobile vs desktop

#### Domain Pills
- Circular indicators showing first letter of each domain (M, P, G, O, F)
- Three states: not_started (gray), in_progress (blue), adequate (filled blue)
- Current domain highlighted with ring and scale animation
- Tooltips show full domain name and input count

#### Confidence System
- **High**: Filled circle icon, green color scheme
- **Medium**: Half-filled circle icon, yellow color scheme  
- **Low**: Empty circle icon, red color scheme
- Confidence badges with icons and text labels

#### Toast Notifications
- Slide-in animations from right side
- Auto-dismiss after 3 seconds (pausable on hover)
- Show captured input topic, confidence level, and domain
- Stack up to 3 notifications, newest on bottom

#### Readiness Panel
- Slide-out panel from right side (full-screen on mobile)
- Progress ring and readiness assessment at top
- Expandable domain accordions with mini progress bars
- Topic-by-topic breakdown with confidence indicators
- Gap analysis and improvement suggestions
- Generate Snapshot CTA button

---

## 5. Technical Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          VERCEL                                  │
│  ┌─────────────────────┐       ┌─────────────────────────────┐  │
│  │    Web App          │       │         API                  │  │
│  │    (Next.js)        │◄─────▶│       (Next.js)              │  │
│  │                     │       │                              │  │
│  │  - Start Page       │       │  - Session Management        │  │
│  │  - Chat Interface   │       │  - Chat Streaming            │  │
│  │  - Snapshot View    │       │  - Snapshot Generation       │  │
│  │                     │       │  - PDF Generation            │  │
│  │  Port: 3000         │       │  - Email Sending             │  │
│  │                     │       │  Port: 3001                  │  │
│  └─────────────────────┘       └──────────────┬───────────────┘  │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────┐
                    │                           │                   │
                    ▼                           ▼                   ▼
           ┌───────────────┐          ┌───────────────┐    ┌───────────────┐
           │   Supabase    │          │   Anthropic   │    │    Resend     │
           │  (Database)   │          │   (Claude AI) │    │   (Email)     │
           └───────────────┘          └───────────────┘    └───────────────┘
```

### Component Breakdown

#### Web App (Frontend)
- **Purpose**: User interface
- **Technology**: Next.js 14 with React
- **Key Features**:
  - Server and client components
  - Real-time streaming display
  - Local storage for session recovery
  - Responsive design

#### API (Backend)
- **Purpose**: Business logic and integrations
- **Technology**: Next.js API Routes
- **Key Features**:
  - RESTful endpoints
  - Server-Sent Events (SSE) for streaming
  - PDF generation with React-PDF
  - Email sending with React templates

#### Conversation Agent
The conversation agent uses Vercel AI SDK's `streamText()` with tool support:
- **Tool Context**: Uses closure pattern to capture `sessionId` and `currentDomain` since AI SDK doesn't pass custom context to tool execute functions
- **recordInput**: Captures user responses, classifies confidence, saves to database, emits `input` SSE event
- **transitionDomain**: Moves between assessment domains, emits `domain_change` SSE event
- **Tool Execution**: Configured with `maxSteps: 5` and `fullStream` consumption to ensure tools execute and events are emitted
- **Progress Sync**: Question IDs must match between `domains.ts` (API) and `progress.ts` (web) for accurate tracking

#### Database (Supabase)
- **Purpose**: Persistent data storage
- **Technology**: PostgreSQL via Supabase
- **Stores**: Sessions, messages, inputs, snapshots

#### AI (Anthropic Claude)
- **Purpose**: Conversational intelligence
- **Model**: Claude 3.5 Sonnet
- **Uses**: Conversation flow, input extraction, confidence classification, snapshot synthesis

#### Email (Resend)
- **Purpose**: Transactional email delivery
- **Features**: HTML emails with PDF download links

### Progress Context System

**ProgressProvider**: React context that manages:
- Real-time progress state calculation from assessment inputs
- Domain-specific progress tracking and status
- Readiness panel open/close state with domain scrolling
- Toast notification queue management
- Progress state derived from inputs with confidence scoring

**Progress State Management**:
- Calculates overall progress percentage across all domains
- Tracks covered topics per domain against predefined topic lists
- Determines domain status (not_started → in_progress → adequate)
- Generates readiness assessment (not_ready → approaching → ready)
- Provides gap analysis and improvement suggestions

### Documentation Automation

- **Auto-documentation workflow**: GitHub Action that automatically updates MVP-BUILD-DOCUMENTATION.md when changes are pushed to main branch
- **AI-powered analysis**: Uses Claude API to analyze code changes and generate appropriate documentation updates
- **Change detection**: Automatically detects relevant file changes and filters out non-essential updates

### Data Flow

1. **User sends message** → Web App → API
2. **API processes** → Sends to Claude AI
3. **AI responds** → Streamed back through API → Web App
4. **Inputs extracted** → Stored in Supabase
5. **Snapshot generated** → Claude synthesizes → Stored in Supabase
6. **Export** → PDF generated or Email sent

---

## 6. Codebase Structure

### Repository Organization

```
atlas-readiness-guide/
├── apps/
│   ├── api/                    # Backend API application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── api/        # API route handlers
│   │   │   │       ├── chat/   # Chat endpoints
│   │   │   │       ├── session/# Session management
│   │   │   │       ├── snapshot/# Snapshot generation
│   │   │   │       ├── export/ # PDF and email
│   │   │   │       └── health/ # Health check
│   │   │   └── lib/            # Shared utilities
│   │   │       ├── ai/         # AI/Claude integration
│   │   │       ├── db/         # Database functions
│   │   │       ├── email/      # Email templates
│   │   │       └── pdf/        # PDF generation
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── vercel.json
│   │
│   └── web/                    # Frontend web application
│       ├── src/
│       │   ├── app/            # Next.js pages
│       │   │   ├── start/      # Start page
│       │   │   ├── chat/       # Chat interface
│       │   │   └── snapshot/   # Snapshot view
│       │   ├── components/     # React components
│       │   │   ├── chat/       # Chat-specific
│       │   │   ├── ui/         # General UI
│       │   │   └── progress/   # Progress tracking components
│       │   │       ├── confidence-badge.tsx      # Confidence level indicators with icons
│       │   │       ├── domain-accordion.tsx      # Expandable domain progress details
│       │   │       ├── domain-pill.tsx          # Circular domain status indicators
│       │   │       ├── input-notification.tsx   # Toast notifications for captured inputs
│       │   │       ├── notification-stack.tsx   # Manager for multiple toast notifications
│       │   │       ├── progress-header.tsx      # Main progress bar with domain pills
│       │   │       ├── progress-ring.tsx        # Circular progress indicator
│       │   │       ├── readiness-panel.tsx      # Slide-out detailed progress panel
│       │   │       └── index.ts                 # Progress components exports
│       │   └── lib/            # Utilities
│       │       ├── api-client.ts  # API communication
│       │       ├── context/    # React context
│       │       │   └── progress-context.tsx  # Progress state management
│       │       ├── progress.ts     # Progress calculation utilities
│       │       └── storage.ts  # Local storage
│       ├── next.config.js
│       ├── package.json
│       └── vercel.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   └── src/index.ts
│   └── config/                 # Shared configuration
│       └── src/index.ts
│
├── scripts/update-docs.ts      # Auto-documentation update script
├── .github/workflows/update-docs.yml # GitHub Action workflow
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
├── turbo.json                  # Turborepo configuration
└── docs/                       # Documentation
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `apps/api/src/app/api/chat/route.ts` | Handles chat messages, streams AI responses |
| `apps/api/src/lib/ai/agents/conversation.ts` | Claude conversation logic |
| `apps/api/src/lib/db/session.ts` | Session CRUD operations |
| `apps/web/src/lib/context/assessment-context.tsx` | Global state management |
| `apps/web/src/app/chat/page.tsx` | Chat interface page |
| `packages/types/src/index.ts` | All TypeScript type definitions |
| `scripts/update-docs.ts` | Auto-documentation update script that analyzes git changes and generates documentation updates using Claude API |
| `.github/workflows/update-docs.yml` | GitHub Action workflow for automated documentation updates |

---

## 7. Data Model & Storage

### Database Tables

#### `sessions`
Stores user assessment sessions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique session identifier |
| `email` | VARCHAR | User's email address |
| `status` | ENUM | `active`, `synthesizing`, `completed` |
| `current_domain` | ENUM | Current domain being assessed |
| `recovery_token_hash` | VARCHAR | Hashed token for session recovery |
| `created_at` | TIMESTAMP | When session started |
| `updated_at` | TIMESTAMP | Last activity |
| `expires_at` | TIMESTAMP | When session expires |
| `metadata` | JSONB | Additional session data |

#### `messages`
Stores chat conversation history.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique message identifier |
| `session_id` | UUID | Links to session |
| `role` | ENUM | `user`, `assistant`, `system` |
| `content` | TEXT | Message text |
| `metadata` | JSONB | Quick responses, etc. |
| `created_at` | TIMESTAMP | When sent |

#### `inputs`
Stores extracted user inputs with confidence levels.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique input identifier |
| `session_id` | UUID | Links to session |
| `domain` | ENUM | Which domain this relates to |
| `question_id` | VARCHAR | Which question answered |
| `response` | TEXT | User's response |
| `confidence` | ENUM | `high`, `medium`, `low` |
| `evidence` | TEXT | Supporting evidence |
| `metadata` | JSONB | Additional data |
| `created_at` | TIMESTAMP | When captured |

#### `snapshots`
Stores generated readiness snapshots.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique snapshot identifier |
| `session_id` | UUID | Links to session |
| `key_findings` | JSONB | Array of findings |
| `coverage_summary` | JSONB | Coverage by domain |
| `strengths` | JSONB | High confidence items |
| `assumptions` | JSONB | Medium confidence items |
| `gaps` | JSONB | Low confidence items |
| `next_steps` | JSONB | Recommended actions |
| `created_at` | TIMESTAMP | When generated |

### Data Lifecycle

```
1. User starts → Session created
2. User chats → Messages stored
3. AI extracts → Inputs stored
4. Assessment complete → Snapshot generated
5. Session expires → Data retained for analysis
```

---

## 8. Integrations

### Supabase (Database)

**What it is**: A hosted PostgreSQL database with additional features.

**How we use it**:
- Store all application data
- Direct database queries via JavaScript client
- Row-level security (not yet implemented)

**Configuration**:
- URL: Provided in Supabase dashboard
- Keys: Anon key (public) and Service role key (private)

**Cost**: Free tier covers MVP usage

### Anthropic Claude (AI)

**What it is**: Large language model API for AI capabilities.

**How we use it**:
- Power conversational assessment
- Extract structured inputs from natural language
- Classify confidence levels
- Generate snapshot synthesis

**Model**: Claude 3.5 Sonnet
- Good balance of capability and speed
- Supports streaming responses

**Configuration**:
- API Key from Anthropic Console
- SDK: `@ai-sdk/anthropic`

**Cost**: Pay per token (usage-based)

### Resend (Email)

**What it is**: Modern email API for transactional emails.

**How we use it**:
- Send snapshot emails to users
- HTML-formatted emails with styling

**Configuration**:
- API Key from Resend dashboard
- Sender email must be from verified domain (or use their test domain)

**Cost**: Free tier includes 100 emails/day

### Vercel (Hosting)

**What it is**: Platform for deploying web applications.

**How we use it**:
- Host both web and API applications
- Automatic deployments from GitHub
- Environment variable management
- SSL/HTTPS included

**Configuration**:
- Connected to GitHub repository
- Separate projects for web and API
- Environment variables set in dashboard

**Cost**: Free tier covers MVP usage

---

## 9. API Reference

### Base URL
- **Production**: `https://atlas-readiness-guide-api.vercel.app`
- **Local**: `http://localhost:3001`

### Endpoints

#### Health Check
```
GET /api/health
```
Returns API status. Used to verify the API is running.

**Response**: `{ "status": "healthy", "timestamp": "..." }`

---

#### Create Session
```
POST /api/session
```
Creates a new assessment session.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "session": {
    "id": "uuid",
    "email": "user@example.com",
    "status": "active",
    "currentDomain": "market"
  },
  "recoveryToken": "secret-token"
}
```

---

#### Recover Session
```
POST /api/session/recover
```
Recovers an existing session using recovery token.

**Request Body**:
```json
{
  "recoveryToken": "secret-token"
}
```

**Response**: Session data with messages and inputs.

---

#### Get Session
```
GET /api/session/[id]
```
Gets session details by ID.

---

#### Initialize Chat
```
POST /api/chat/init
```
Initializes chat with welcome message.

**Request Body**:
```json
{
  "sessionId": "uuid"
}
```

**Response**: Initial assistant message.

---

#### Send Message (Streaming)
```
POST /api/chat
```
Sends a user message and streams AI response.

**Request Body**:
```json
{
  "sessionId": "uuid",
  "message": "User's message"
}
```

**Response**: Server-Sent Events stream with:
- `text` events (AI response chunks)
- `input` events (extracted inputs)
- `domain_change` events (domain transitions)
- `complete` event (final message)

---

#### Generate Snapshot
```
POST /api/snapshot/generate
```
Generates readiness snapshot from all inputs.

**Request Body**:
```json
{
  "sessionId": "uuid"
}
```

**Response**: Generated snapshot data.

---

#### Get Snapshot
```
GET /api/snapshot/[sessionId]
```
Retrieves existing snapshot for a session.

---

#### Download PDF
```
GET /api/export/pdf/[sessionId]
```
Downloads snapshot as PDF file.

---

#### Send Email
```
POST /api/export/send/[sessionId]
```
Sends snapshot email to user.

**Response**:
```json
{
  "success": true,
  "message": "Snapshot sent to user@example.com"
}
```

---

## 10. Configuration & Secrets

### Environment Variables

Both applications need environment variables to function. These are set differently for local development vs production.

#### API Environment Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Public Supabase key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Supabase key (keep secret!) | Supabase Dashboard → Settings → API |
| `ANTHROPIC_API_KEY` | Claude AI API key | console.anthropic.com → API Keys |
| `RESEND_API_KEY` | Email service key | resend.com → API Keys |

#### Web Environment Variables

| Variable | Description | Value |
|----------|-------------|-------|
| `NEXT_PUBLIC_API_URL` | URL of the API | `https://atlas-readiness-guide-api.vercel.app` (production) or `http://localhost:3001` (local) |

#### Documentation Update Workflow
- `ANTHROPIC_API_KEY`: Required for the auto-documentation update workflow. Must be set as a GitHub repository secret to enable automatic documentation updates via Claude API.

### Progress System Configuration

**Domain Topics** (`DOMAIN_TOPICS`): Predefined lists of topics for each business domain used to calculate coverage percentages.

**Readiness Thresholds**: Configuration for determining when domains and overall assessment reach "adequate" status based on input count and topic coverage.

**Animation Durations**: Configurable timing for UI animations including toast auto-dismiss (3s), slide transitions (150-200ms), and progress bar updates (300ms).

### Setting Variables Locally

Create `.env.local` files in each app directory:

**`apps/api/.env.local`**:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
```

**`apps/web/.env.local`**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Setting Variables on Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable with its value
4. Ensure variables are enabled for Production, Preview, and Development

### Security Notes

- **Never commit** `.env.local` files to git (they're in `.gitignore`)
- **Never share** service role keys or API keys publicly
- **Rotate keys** if accidentally exposed

---

## 11. Local Development Setup

### Prerequisites

Before starting, you need:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org
   - Verify: `node --version`

2. **pnpm** (package manager)
   - Install: `npm install -g pnpm`
   - Verify: `pnpm --version`

3. **Git** (version control)
   - Usually pre-installed on Mac
   - Verify: `git --version`

4. **Accounts** (for API keys)
   - Supabase account: https://supabase.com
   - Anthropic account: https://console.anthropic.com
   - Resend account: https://resend.com (optional for local)

### Step-by-Step Setup

#### 1. Clone the Repository

Open Terminal and run:
```bash
git clone https://github.com/james-stx/atlas-readiness-guide.git
cd atlas-readiness-guide
```

#### 2. Install Dependencies

```bash
pnpm install
```

This installs all packages for all apps in the monorepo.

#### 3. Set Up Supabase Database

1. Create a new project at supabase.com
2. Go to SQL Editor
3. Run this migration to create tables:

```sql
-- Create enum types
CREATE TYPE session_status AS ENUM ('active', 'synthesizing', 'completed');
CREATE TYPE domain_type AS ENUM ('market', 'product', 'gtm', 'operations', 'financials');
CREATE TYPE confidence_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  status session_status DEFAULT 'active',
  current_domain domain_type DEFAULT 'market',
  recovery_token_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  metadata JSONB DEFAULT '{}'
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inputs table
CREATE TABLE inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  domain domain_type NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  response TEXT NOT NULL,
  confidence confidence_level NOT NULL,
  evidence TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Snapshots table
CREATE TABLE snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  key_findings JSONB NOT NULL,
  coverage_summary JSONB NOT NULL,
  strengths JSONB NOT NULL,
  assumptions JSONB NOT NULL,
  gaps JSONB NOT NULL,
  next_steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_email ON sessions(email);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_inputs_session ON inputs(session_id);
CREATE INDEX idx_snapshots_session ON snapshots(session_id);
```

#### 4. Create Environment Files

Create `apps/api/.env.local`:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
RESEND_API_KEY=re_test_123
```

Create `apps/web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 5. Start Development Servers

```bash
pnpm dev
```

This starts both apps:
- Web: http://localhost:3000
- API: http://localhost:3001

#### 6. Test It Out

1. Open http://localhost:3000
2. Enter an email address
3. Start chatting!

---

## 12. Deployment & Environments

### Environments

| Environment | Purpose | URLs |
|-------------|---------|------|
| Local | Development and testing | localhost:3000, localhost:3001 |
| Production | Live user-facing | atlas-readiness-guide-web.vercel.app |

### How Deployment Works

1. **Code pushed to GitHub** → triggers Vercel
2. **Vercel detects changes** → starts build
3. **Build process**:
   - Installs dependencies
   - Compiles TypeScript
   - Builds Next.js application
4. **Deploy** → new version goes live
5. **Zero downtime** → old version serves traffic until new is ready

### Deploying Updates

Simply push to the main branch:
```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel automatically deploys within a few minutes.

### Automated Documentation Updates

The repository includes a GitHub Action that automatically updates documentation:

1. **Trigger**: Runs on every push to the main branch
2. **Process**: 
   - Detects changed files in the commit
   - Analyzes changes using Claude API
   - Generates appropriate documentation updates
   - Commits updated documentation back to the repository
3. **Requirements**: Requires `ANTHROPIC_API_KEY` secret to be configured in GitHub repository settings
4. **Manual execution**: Can also be run locally with `pnpm update-docs`

### Monitoring Deployments

1. Go to vercel.com
2. Select your project
3. Click **Deployments** tab
4. View build logs and status

### Rollback

If something breaks:
1. Go to Deployments in Vercel
2. Find the last working deployment
3. Click "..." → "Promote to Production"

---

## 13. Manual Testing & Troubleshooting

### Test Checklist

#### Start Page
- [ ] Email validation works (rejects invalid emails)
- [ ] Start button creates session
- [ ] Redirects to chat page

#### Chat
- [ ] Welcome message appears
- [ ] User can type and send messages
- [ ] AI responses stream in
- [ ] Progress bar updates with domains
- [ ] Quick response buttons work
- [ ] Can complete all 5 domains

#### Snapshot
- [ ] Snapshot generates successfully
- [ ] All sections populate correctly
- [ ] PDF downloads
- [ ] Email sends (if Resend configured)

#### Session Recovery
- [ ] Close browser, reopen → can continue
- [ ] Recovery works across devices (same browser)

### Progress Tracking Testing

**Progress Updates**:
1. Start new assessment conversation
2. Verify progress ring starts at 0%
3. Send messages that capture business inputs
4. Confirm toast notifications appear for each captured input
5. Check domain pills update status as topics are covered
6. Verify current domain highlighting follows conversation flow

**Readiness Panel**:
1. Click "View Details" to open progress panel
2. Test domain accordion expand/collapse functionality
3. Verify topic lists show correct coverage status
4. Check confidence indicators match captured inputs
5. Test "Generate Snapshot" button appears when ready
6. Verify panel closes with X button, Escape key, or back button

**Responsive Behavior**:
1. Test progress header layout on mobile vs desktop
2. Verify toast notifications position correctly on small screens
3. Check readiness panel becomes full-screen on mobile
4. Test touch interactions on domain pills and accordions

### Common Issues & Fixes

#### "Failed to fetch" error on start page
**Cause**: API not running or CORS issue
**Fix**:
1. Check API is running (`pnpm dev`)
2. Check NEXT_PUBLIC_API_URL is correct
3. Check API CORS allows web app origin

#### Chat not responding
**Cause**: Anthropic API issue
**Fix**:
1. Check ANTHROPIC_API_KEY is set
2. Check API key is valid and has credits
3. Check browser console for errors

#### "Invalid supabaseUrl" error
**Cause**: Environment variable not set
**Fix**: Ensure SUPABASE_URL is set in Vercel/env file

#### PDF won't download
**Cause**: React-PDF rendering issue
**Fix**: Check browser console, ensure snapshot data is valid

#### Email not received
**Cause**: Resend configuration
**Fix**:
1. Check RESEND_API_KEY is valid
2. Check sender domain is verified in Resend
3. Check spam folder

### Progress Tracking Issues

**Problem**: Progress not updating when user provides inputs
- Check browser network tab for `input` SSE events during conversation
- Verify tool execution is working by looking for `recordInput` calls in API logs
- Ensure question IDs in `apps/web/src/lib/progress.ts` match those in `apps/api/src/lib/ai/prompts/domains.ts`

**Problem**: Domain transition not working
- Look for `domain_change` SSE events in network tab
- Check that `transitionDomain` tool is being called when domain topics are covered
- Verify `maxSteps: 5` allows sufficient tool execution in conversation flow

### Viewing Logs

#### Local
Logs appear in the terminal running `pnpm dev`

#### Vercel
1. Go to project → Deployments
2. Click a deployment
3. Click **Functions** tab
4. Select a function to view logs

---

## 14. Decision Log

Key decisions made during development and why.

### Monorepo Structure
**Decision**: Use a monorepo with Turborepo
**Why**:
- Shared types between frontend and backend
- Single repository to manage
- Easier dependency management
- Coordinated deployments

### Next.js for Both Apps
**Decision**: Use Next.js for both web and API
**Why**:
- Consistent technology stack
- API routes are simple to create
- Both deploy well to Vercel
- TypeScript support built-in

### Supabase over Firebase
**Decision**: Use Supabase for database
**Why**:
- PostgreSQL is more familiar
- Better for relational data
- Good free tier
- Direct SQL access

### Claude over GPT-4
**Decision**: Use Anthropic Claude
**Why**:
- Better at following complex instructions
- More consistent structured output
- Good streaming support
- Competitive pricing

### Email-Only Auth
**Decision**: No passwords, just email
**Why**:
- Reduces friction
- MVP doesn't need accounts
- Recovery token provides continuity
- Can add auth later if needed

### Vercel for Hosting
**Decision**: Deploy to Vercel
**Why**:
- Native Next.js support
- Free tier sufficient for MVP
- Easy environment variables
- Automatic HTTPS

### Server-Sent Events (SSE) for Streaming
**Decision**: Use SSE instead of WebSockets
**Why**:
- Simpler to implement
- Works through Vercel
- One-directional is sufficient
- Better browser support

---

## 15. Known Limitations & Future Roadmap

### Current Limitations

| Limitation | Impact | Future Solution |
|------------|--------|-----------------|
| No user accounts | Can't access from new device | Add authentication |
| Single session per email | Can't have multiple assessments | Add session selection |
| No editing inputs | Can't correct mistakes | Add edit functionality |
| English only | Limited audience | Add i18n |
| No admin dashboard | Can't view analytics | Build admin panel |
| Basic error handling | Some errors unclear | Improve error messages |
| No offline support | Requires internet | Add PWA features |

### Potential Future Features

#### Short Term
- Input editing capability
- Better progress saving
- Improved error messages
- Loading state improvements

#### Medium Term
- User authentication
- Multiple assessments per user
- Admin dashboard with analytics
- Comparison between sessions

#### Long Term
- Team/organization features
- Integration with other tools
- AI-powered recommendations
- Benchmark comparisons

---

## 16. Maintenance Guide

### Regular Tasks

#### Weekly
- Check Vercel deployment status
- Review any error logs
- Monitor API usage/costs

#### Monthly
- Update dependencies (`pnpm update`)
- Review Supabase usage
- Check Anthropic API usage

#### As Needed
- Rotate API keys if exposed
- Scale resources if traffic grows
- Address user-reported issues

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update

# Test locally
pnpm dev

# If working, deploy
git add .
git commit -m "Update dependencies"
git push
```

### Documentation Maintenance

**Automated Updates**
- Documentation is automatically updated via GitHub Actions when code changes are pushed
- The workflow analyzes changes and updates relevant sections using AI
- Manual review of auto-generated updates is recommended

**Manual Updates**
- Run `pnpm update-docs` locally to generate documentation updates
- Ensure `ANTHROPIC_API_KEY` environment variable is set
- The script analyzes recent changes and suggests documentation updates

### Database Maintenance

Supabase handles most maintenance automatically. For manual tasks:

1. Go to Supabase Dashboard
2. SQL Editor for direct queries
3. Table Editor for data inspection

### Monitoring Costs

| Service | Free Tier Limit | How to Check |
|---------|-----------------|--------------|
| Vercel | 100GB bandwidth | Vercel Dashboard → Usage |
| Supabase | 500MB database | Supabase Dashboard → Usage |
| Anthropic | Pay-per-use | Anthropic Console → Usage |
| Resend | 100 emails/day | Resend Dashboard |

### Emergency Contacts

If something breaks:
1. Check Vercel status: status.vercel.com
2. Check Supabase status: status.supabase.com
3. Check Anthropic status: status.anthropic.com

---

## Appendix: File Reference

### Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and scripts |
| `turbo.json` | Turborepo build configuration |
| `pnpm-workspace.yaml` | Workspace packages definition |
| `apps/*/next.config.js` | Next.js configuration |
| `apps/*/tsconfig.json` | TypeScript configuration |
| `apps/*/vercel.json` | Vercel deployment settings |

### Important Source Files

| File | Purpose |
|------|---------|
| `apps/api/src/lib/ai/agents/conversation.ts` | AI conversation logic |
| `apps/api/src/lib/ai/prompts/system.ts` | AI system prompts |
| `apps/api/src/lib/db/session.ts` | Session management |
| `apps/web/src/lib/context/assessment-context.tsx` | Frontend state |
| `apps/web/src/lib/api-client.ts` | API communication |
| `packages/types/src/index.ts` | Shared type definitions |

---

## Changelog

### January 2026
- Added automated documentation update workflow
- Integrated Claude API for intelligent documentation analysis
- Added GitHub Actions workflow for continuous documentation maintenance
- Implemented Phase 1 Progress Visibility system with real-time progress tracking UI
- Added progress rings, domain pills, confidence badges, and toast notifications
- Built comprehensive readiness panel with expandable domain accordions
- Added slide-out progress panel with snapshot generation capabilities
- Fixed critical bugs: enabled tool execution in conversation agent and aligned question IDs between progress tracking and API domains

---

*Documentation generated January 2026*
*Atlas Readiness Guide MVP v1.0*
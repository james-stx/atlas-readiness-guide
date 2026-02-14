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

## V4 Philosophy: Synthesis-First Reporting

Atlas V4 introduces a fundamental shift in how readiness reports are generated:

- **Synthesis over Summarization**: Reports now identify cross-domain patterns and insights rather than simply summarizing individual topics
- **Incomplete Assessment Value**: Users receive actionable insights and personalized guidance even before reaching the 60% completion threshold
- **Progressive Disclosure**: The system provides different experiences for incomplete vs. complete assessments, maximizing value at each stage

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
| AI | Powers the conversational assessment | Anthropic Claude 4.5 |
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

**Navigation Between Pages:**
- Direct navigation via anchor tags (<a>) resets React context
- Both workspace and snapshot pages implement session recovery from localStorage
- If session recovery fails, users are automatically redirected to /start
- Session recovery prevents loss of assessment progress during navigation

**Chat Interaction Flow Updates:**

*Message Input:*
1. User types message with real-time character counting
2. Visual feedback when approaching character limit (80% threshold)
3. Send via Enter key or platform-specific shortcut (⌘+Enter/Ctrl+Enter)
4. Character limit prevents submission when exceeded

*Navigation:*
1. Exit chat via header button triggers confirmation modal
2. Logo click returns to home page
3. Current domain/progress visible in simplified header format

#### 3. Completion and Continued Interaction
After completing an assessment and viewing their report, users can continue chatting to refine or expand their assessment. The session remains active and accessible for further conversation. Only abandoned sessions prevent continued interaction.

### Readiness Report Review Flow

1. **Assessment Overview**: Users see overall readiness status with:
   - Executive readiness level (Ready/Ready with Caveats/Not Ready)
   - Coverage metrics (X/Y topics covered)
   - Domain-level confidence indicators
   - Executive summary bullets

2. **Domain Deep Dive**: For each domain, users can review:
   - Structured topic cards with key insights
   - Requirements display with visual status indicators
   - Confidence levels with dot visualization
   - Uncovered topics shown with dashed borders

3. **Action Planning**: Three-tier action system:
   - **Critical Actions**: Must address before investment
   - **Assumptions to Validate**: Research and validation tasks
   - **30-Day Plan**: Week-organized roadmap with unblock information

4. **Source Traceability**: All action items include domain → topic source attribution

### Incomplete Assessment Report Flow (V4)

1. User accesses snapshot page with <60% topic coverage
2. **Assessment Progress**: Visual progress bar showing path to 60% threshold with domain-by-domain coverage
3. **Early Signals**: Cross-domain patterns identified from existing inputs (strengths, risks, unknowns)
4. **Recommended Topics**: Personalized next-topic suggestions with impact reasoning and unlock previews
5. **Unlock Preview**: Preview of full report deliverables with call-to-action to continue
6. **Export Options**: Current insights available for export

### Complete Assessment Report Flow (Existing)

1. User reaches 60%+ coverage threshold
2. Full readiness verdict with confidence levels
3. Critical actions and assumptions with source traceability
4. Complete action plan and export options

### Auto-Navigation Behavior

**Auto-Navigation Behavior:**
- When AI captures new input, the content panel automatically navigates to the relevant topic
- When AI transitions to a new domain, the content panel navigates to that domain
- The sidebar automatically expands collapsed domains when navigation occurs
- This provides seamless context switching between AI interactions and content exploration

### Content Browsing Flow

**Content Browsing Flow:**
1. User selects domain from sidebar
2. User clicks on topic card to view details
3. Content panel updates to show selected topic (highlighted)
4. Chat does NOT auto-open or send messages
5. User can browse multiple topics without triggering AI discussions

### AI Discussion Flow

**AI Discussion Flow:**
1. User browses to desired topic (as above)
2. User explicitly clicks "Talk to Atlas" or "Discuss" button
3. Chat panel opens automatically
4. System auto-sends introductory message about the selected topic
5. AI responds and conversation begins

**Key Distinction:** Topic selection (navigation) is now separate from topic discussion (AI chat initiation)

### Session Recovery Flow

If a user leaves and returns:
1. App checks for stored recovery token
2. If found, prompts to continue or start fresh
3. If continuing, restores full session state (messages, inputs, current domain)

### Assessment Start Flow Updates

#### Enhanced Session Recovery
- **Detection**: Automatic detection of stored sessions on page load
- **Recovery UI**: Prominent teal recovery option displayed when previous session exists
- **User Choice**: Clear options to either continue previous session or start fresh
- **Loading States**: Dedicated loading indicators for recovery process

#### Improved Onboarding Experience
- **Visual Welcome**: Centered logo and welcoming copy ("Let's...")
- **Email Validation**: Real-time validation with clear error messaging
- **Expectations Setting**: Icon-enhanced expectations section on start page
- **Navigation**: Consistent back navigation to homepage

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

### Legal Pages Access

**Flow**: Accessing Privacy Policy and Terms of Service
- Privacy Policy accessible at `/privacy`
- Terms of Service accessible at `/terms`
- Both pages maintain consistent header/footer with Atlas branding
- Include navigation back to main application
- Content covers:
  - Data collection and processing practices
  - AI model usage disclosure
  - User rights under Australian Privacy Act
  - Service limitations and disclaimers
  - Liability limitations and jurisdiction (Victorian law)

---

## 4. UX/UI Design

### Design Principles

1. **Conversational, Not Form-Like** - Feels like chatting with an advisor, not filling out a survey
2. **Progressive Disclosure** - Only show what's relevant at each step
3. **Clear Progress** - Always know where you are in the assessment
4. **Mobile-First** - Works well on phones (where many founders are)
5. **Minimal Friction** - Email-only signup, no passwords

### Auto-Navigation Features

**Auto-Navigation Features:**
- Content panel automatically syncs with AI conversation context
- Domains auto-expand in sidebar when referenced by AI
- Smooth transitions between AI-driven topic changes
- Reduces manual navigation overhead for users

### Design System Updates

#### Color Palette
- **Primary Colors**: Transitioned to neutral-* color palette (neutral-50, neutral-100, neutral-200, neutral-400, neutral-500, neutral-900)
- **Accent Colors**: Teal accent color system (accent-500, accent-600) used for focus states and interactive elements
- **Background**: Clean white backgrounds with neutral-50 for section differentiation

**Color Palette Migration:**
- Migrated from slate-based color palette to neutral-based system
- Primary purple replaced with neutral-900 for main elements
- Accent colors updated to accent-600 for interactive elements

**Confidence Indicators:**
- High confidence: accent (teal) - `bg-accent-500`, `text-accent-700`
- Medium confidence: warm (amber) - `bg-warm-500`, `text-warm-700`  
- Low/missing confidence: neutral - `bg-neutral-300`, `text-neutral-600`

**Header Treatment:**
- Privacy and Terms pages now feature backdrop blur headers (`bg-white/80 backdrop-blur-sm`)
- Consistent sticky positioning with border separator
- Maintains visual hierarchy across all static pages
- **Header Branding**: Displays 'Atlas' as main brand name with 'by STX Labs' as gradient-styled tagline
- **Homepage Headline**: 'Your Readiness. Revealed.' with 'Revealed.' in gradient styling

#### Layout Standards
- **Container Widths**: 
  - `max-w-wide`: Used for header/navigation areas
  - `max-w-content`: Used for main content areas
  - `max-w-3xl`: Used for process/timeline sections
- **Header Design**: Unified sticky header with blur backdrop (`bg-white/80 backdrop-blur-sm`)
- **Footer**: Consistent footer layout across all pages

#### Component Design Patterns
- **Touch Targets**: Minimum 44px height for interactive elements (inputs, buttons)
- **Focus States**: Teal focus rings (`focus-visible:ring-accent-500`)
- **Hover States**: Subtle border color transitions on form elements
- **Icons**: Integrated Lucide React icons for consistent iconography

## V3 Readiness Report Design System

The readiness report implements a comprehensive visual design system:

### Color System
- **Semantic Colors**: Uses Notion-inspired color palette for confidence levels and status indicators
- **Theme Colors**: 
  - Critical Actions: Red theme (#E03E3E, #FBE4E4)
  - Assumptions: Amber theme (#D9730D, #FAEBDD) 
  - Action Plans: Blue theme
  - Success States: Green theme (#0F7B6C, #DDEDEA)

### Typography Scale
- Headers: 11px uppercase with tracking
- Body text: 13-14px
- Secondary text: 12px (#9B9A97)

### Visual Indicators
- **Confidence Dots**: Visual representation using filled/empty circles (●●●●○)
- **Status Icons**: ✓ addressed, △ partial, ○ not addressed
- **Progress Bars**: Coverage visualization with dual metrics
- **Card Styles**: Solid borders for covered topics, dashed borders for uncovered

## V4 Incomplete Assessment Components

### AssessmentProgress
- Progress bar toward 60% completion threshold
- Domain-by-domain coverage visualization
- Guidance on which domains need attention
- Visual indicators for domains meeting minimum coverage

### EarlySignals
- Cross-domain pattern display with type classification:
  - **Strength** (●): Positive indicators spanning domains
  - **Pattern** (◉): Consistent themes across inputs
  - **Risk** (◐): Potential issues identified
  - **Unknown** (○): Gaps that need investigation
- Source traceability showing which inputs contributed to each signal
- Implications and blocked insights

### RecommendedTopics
- Prioritized list of next topics to tackle
- Impact level indicators (High/Medium)
- Reasoning for why each topic is valuable
- Preview of what insights each topic will unlock
- Direct navigation to workspace

### UnlockPreview
- Preview of full report deliverables
- Visual representation of locked insights
- Clear call-to-action to continue assessment

### Page-Specific Design Updates

#### Start Page (`/start`)
- **Layout**: Centered single-column layout with welcoming journey-start feel
- **Recovery Flow**: Prominent teal-colored session recovery option for returning users
- **Form Design**: Email input with enhanced validation states and error handling
- **Expectations Section**: Clean layout with integrated icons for better visual hierarchy

#### How It Works Page (`/how-it-works`)
- **Timeline Design**: Connected step-by-step process visualization
- **FAQ Section**: Refined layout with improved readability
- **Process Steps**: Enhanced visual flow with connected timeline elements
- **Domain Cards**: Grid layout for the five assessment domains (Market, Product, Operations, Financial, Team)

#### Form Components
- **Input Component**: 
  - Height: 44px (`h-11`) for optimal touch interaction
  - Border: `border-neutral-200` default, `hover:border-neutral-300` on hover
  - Focus: Teal ring (`focus-visible:ring-accent-500`) with matching border
  - Padding: `px-4 py-2.5` for comfortable text entry

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

**Topic Card Interactions:**
- **Click on card**: Navigates to topic, highlights it in domain header, updates content view (does not open chat)
- **Click "Talk to Atlas" button**: Opens chat panel AND starts AI discussion about the topic
- **Click "Discuss" button**: Same as "Talk to Atlas" - explicit discussion trigger

This separation allows users to browse content freely without accidentally triggering AI conversations.

**Chat Interface Components:**

*Header Design:*
- Simplified header showing current domain only (e.g., "2 of 5 Market")
- Progress ring removed from header (consolidated in sidebar)
- Exit option with confirmation modal
- Logo link returns to home page

*Message Display:*
- Assistant messages: Compass icon in teal gradient circle avatar
- User messages: User icon in neutral circle avatar
- Fully rounded avatars (rounded-full)
- Message bubbles with rounded-2xl styling

*Input Controls:*
- Character count display with visual feedback approaching limit
- Platform-aware keyboard shortcuts (⌘ on Mac, Ctrl on Windows)
- Dual send options: Enter key or Cmd/Ctrl+Enter
- Auto-resizing textarea with 150px max height
- Character limit enforcement with visual warnings

#### Snapshot View
- Executive summary at top
- Tabbed or sectioned view of detailed findings
- Clear visual distinction between strengths/assumptions/gaps
- Export buttons prominently displayed

**Error Handling & Feedback**:
- Error messages display in a red-bordered container with AlertCircle icon
- Button provides immediate feedback with "Generating..." state
- Disabled state prevents multiple simultaneous generation attempts
- Local error state ensures immediate user feedback without waiting for global state updates

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
           │  (Database)   │          │ (Claude 4.5)  │    │   (Email)     │
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

**Session Management:**
- Assessment context can be lost during navigation via anchor tags
- Session recovery mechanism implemented in both workspace and snapshot pages
- Uses localStorage as fallback when React context is unavailable
- Automatic fallback to /start route when session cannot be recovered

**Chat Interface Technical Details:**

*Input Handling:*
- Platform detection for keyboard shortcut display (`navigator.userAgent` detection)
- Character counting with configurable limits (default: 2000 chars)
- Auto-resize textarea implementation with scroll height calculation
- Dual keyboard event handling for Enter and Cmd/Ctrl+Enter

*UI State Management:*
- Exit confirmation modal state
- Character count visual feedback states (normal/warning/error)
- Platform-aware shortcut key detection and display

*Icon Integration:*
- Lucide React icons: Compass (assistant), User (user), Send, X, Menu
- Gradient backgrounds for assistant avatar using Tailwind gradient utilities

**Request Timeout Management**
- Chat requests include a 90-second timeout to prevent hanging
- Uses AbortController for proper request cancellation
- Timeout errors are handled gracefully with user-friendly messaging
- Streaming message cleanup ensures UI state consistency

#### Real-time Communication
**Real-time Communication**: The SSE (Server-Sent Events) implementation includes robust error handling and buffering of incomplete chunks across TCP packet boundaries to ensure reliable streaming of AI responses and tool execution results.

**Error Handling & Resilience:**
- Automatic retry logic for API failures with exponential backoff
- Rate limit detection and graceful degradation
- User feedback during service interruptions
- Robust error recovery for both REST API and SSE streaming connections
- Maximum 3 retry attempts with 1.5 second base delay

#### AI/LLM Integration

The synthesis model configuration has been optimized with increased token limits (4096 tokens) to handle comprehensive snapshot generation. The snapshot generation includes a **fallback mechanism** for handling incomplete AI responses:

1. **Primary Path**: AI generates structured topic analysis with insights
2. **Fallback Path**: When AI returns empty topicResults:
   - System checks for actual user input on each topic
   - Uses input's confidence_level as topic confidence
   - Displays generic "User provided input on this topic" insight
   - Ensures all covered topics are shown regardless of AI response completeness

This dual-path approach ensures report reliability even when the AI model (Haiku) has processing issues.

**AI Model Configuration:**
- Conversation: Claude Sonnet 4.5 (high capability)
- Classification: Claude Haiku 4.5 (fast, deterministic)
- Synthesis: Claude Haiku 4.5 (optimized for speed, 10-20s generation time vs 40-60s with Sonnet)

**Performance Considerations:**
- Synthesis uses Haiku model to avoid 60-second timeouts
- Token limits optimized per use case (synthesis: 2048 tokens, classification: 256 tokens)
- V3 synthesis prompt simplified for faster processing

#### Conversation Agent
The conversation agent uses Vercel AI SDK's `streamText()` with tool support:
- **Tool Context**: Uses closure pattern to capture `sessionId` and `currentDomain` since AI SDK doesn't pass custom context to tool execute functions
- **recordInput**: Captures user responses, classifies confidence, saves to database, emits `input` SSE event
- **transitionDomain**: Moves between assessment domains, emits `domain_change` SSE event
- **Single-step Execution**: The AI conversation system uses a single-step interaction model where the AI generates text and calls tools in one pass, with tools executing as side effects (like database saves) without follow-up model calls. This ensures 1 API call per user message instead of multiple calls, significantly reducing token usage and staying within rate limits.
- **Progress Sync**: Question IDs must match between `domains.ts` (API) and `progress.ts` (web) for accurate tracking

**AI Conversation Flow**: The system uses the Vercel AI SDK with a maximum of 2 steps for tool execution (maxSteps:2). This allows proper tool round-trips where the AI can call tools and receive results while staying within rate limits. Without this setting, the model would call tools but never receive results, causing stream iteration failures.

**Tool Execution Performance**: Tool execution during conversations uses fast regex-based classification (`quickClassify()`) instead of LLM-based classification to prevent blocking the Server-Sent Events (SSE) stream. This ensures real-time text streaming continues uninterrupted during input recording and domain transitions. Full LLM classification is reserved for non-real-time operations to maintain optimal user experience.

**AI Response Flow Enhancement**: The conversation agent now includes a fallback mechanism to ensure users always receive text responses. When the AI only uses tools (like recordInput or transitionDomain) without generating conversational text, the system automatically makes a follow-up API call without tools to force a conversational response. This prevents silent tool-only interactions where users might not receive feedback.

**AI Agent Tool Validation**: The conversation agent now enforces strict validation of question IDs, requiring exact matches from predefined domain question lists rather than allowing AI-generated IDs. This ensures proper progress tracking and prevents data inconsistencies.

**Automatic Domain Transitions**: The system now includes explicit instructions for the AI to automatically transition between assessment domains after covering 3-4 key topics, improving conversation flow and completion rates.

The AI service layer utilizes Anthropic's Claude 4.5 models for different purposes:
- **Sonnet 4.5**: Primary model for conversations and content synthesis (higher capability)
- **Haiku 4.5**: Lightweight model for fast classification tasks (optimized for speed)

#### Database (Supabase)
- **Purpose**: Persistent data storage
- **Technology**: PostgreSQL via Supabase
- **Stores**: Sessions, messages, inputs, snapshots

#### AI (Anthropic Claude 4.5)
- **Purpose**: Conversational intelligence
- **Models**: Claude 4.5 Sonnet and Haiku
- **Uses**: Conversation flow, input extraction, confidence classification, snapshot synthesis

#### Email (Resend)
- **Purpose**: Transactional email delivery
- **Features**: HTML emails with PDF download links

### Workspace Context Auto-Navigation

**Workspace State Management:**

*Navigation State:*
- `selectedDomain`: Currently viewed domain
- `selectedCategory`: Currently highlighted topic (for browsing)

*Chat State:*
- `isChatOpen`: Whether chat panel is visible
- `topicToDiscuss`: Topic user explicitly wants to discuss (set only by "Talk to Atlas" button)

*State Flow:*
1. Topic card click → sets `selectedCategory` (navigation only)
2. "Talk to Atlas" click → sets `topicToDiscuss` + opens chat + auto-sends message
3. After auto-message sent → `topicToDiscuss` is cleared

This prevents accidental AI conversations when users are just browsing content.

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
│       │   │   ├── snapshot/   # Snapshot view
│       │   │   ├── privacy/page.tsx    # Privacy Policy page with data handling disclosure
│       │   │   └── terms/page.tsx      # Terms of Service page with legal disclaimers
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

### V4 New Components
```
apps/web/src/components/snapshot/
├── AssessmentProgress.tsx    # Progress toward 60% threshold
├── EarlySignals.tsx         # Cross-domain pattern display
├── RecommendedTopics.tsx    # Personalized next-topic guidance
├── UnlockPreview.tsx        # Preview of complete report
├── AssessmentOverview.tsx   # Existing: Complete assessment display
├── ActionPlanUnified.tsx    # Existing: Full action plan
└── export-section.tsx       # Existing: Export functionality
```

### Updated API Routes
- `apps/api/src/app/api/snapshot/generate/route.ts`: Enhanced with V4 synthesis logic
- `apps/api/src/lib/ai/prompts/synthesis-v3.ts`: Updated prompts for cross-domain synthesis

**ActionPlanUnified**: Implements three-section action plan:
- Critical Actions (red theme, numbered priority)
- Assumptions to Validate (amber theme, validation steps)
- 30-Day Plan (blue theme, week organization)

**AssessmentOverview**: Dual-metric display with coverage bars and confidence dots, executive summary generation

**DomainDetailSection**: Structured topic cards with requirement status indicators, confidence visualization, and uncovered topic handling

### UI Component Updates

#### Input Component (`/components/ui/input.tsx`)
- **Accessibility**: Enhanced touch target sizing (44px height)
- **Styling**: Integrated with new design system colors and focus states
- **Responsiveness**: Improved hover and focus state transitions

#### Page Components
- **Start Page**: Complete redesign with session recovery integration
- **How It Works**: Enhanced timeline and FAQ layouts
- **Header/Footer**: Unified design system implementation across pages

**Snapshot Components** (`apps/web/src/components/snapshot/`):
- All components updated to use new neutral-based color system
- Confidence indicators standardized across components:
  - `assumptions-section.tsx` - Uses warm colors for validation warnings
  - `coverage-overview.tsx` - Updated confidence dot colors (accent/warm/neutral)
  - `gaps-section.tsx` - Importance-based color coding with neutral base
  - `key-findings.tsx` - Domain-specific confidence styling
  - `strengths-section.tsx` - Accent colors for positive indicators
  - `next-steps-section.tsx` - Neutral styling for action items
  - `export-section.tsx` - Consistent button and status styling

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
| `status` | ENUM | `active`, `synthesizing`, `completed`, `abandoned` |
| `current_domain` | ENUM | Current domain being assessed |
| `recovery_token_hash` | VARCHAR | Hashed token for session recovery |
| `created_at` | TIMESTAMP | When session started |
| `updated_at` | TIMESTAMP | Last activity |
| `expires_at` | TIMESTAMP | When session expires |
| `metadata` | JSONB | Additional session data |

**Session Status Types:**
- **active**: Session in progress, user can chat
- **synthesizing**: Snapshot being generated
- **completed**: Assessment finished and report generated, but user can still continue chatting
- **abandoned**: Session terminated, no further interaction allowed

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

### V3 Readiness Report Data Structure

The V3 redesign introduces enhanced data structures:

```typescript
interface CriticalAction {
  title: string;
  description: string;
  source_domain: DomainType;
  source_topic: string;
  source_status: string;
  impact?: string;
}

interface AssumptionV3 {
  title: string;
  description: string;
  validation_steps: string[];
  source_domain: DomainType;
  source_topic: string;
}

interface ActionPlanItem {
  title: string;
  description: string;
  week: number;
  unblocks?: string;
  source_domain: DomainType;
  source_topic: string;
}
```

**Key Features**:
- Source traceability: All items track originating domain and topic
- Structured validation: Assumptions include specific validation steps
- Timeline organization: Action items organized by week with unblock information

## V4 New Types

### CrossDomainSignal
```typescript
interface CrossDomainSignal {
  type: 'strength' | 'pattern' | 'risk' | 'unknown';
  title: string;
  description: string;
  derived_from: string[]; // Source topics
  blocked_by?: DomainType[]; // Missing domain coverage
  implication: string;
}
```

### TopicRecommendation
```typescript
interface TopicRecommendation {
  domain: DomainType;
  topic_id: string;
  topic_label: string;
  impact: 'high' | 'medium';
  why: string; // Reasoning for recommendation
  unlocks: string[]; // What insights this will provide
}
```

### Updated Snapshot Schema
The V3 snapshot schema now includes:
- `early_signals`: Array of CrossDomainSignal for incomplete assessments
- `recommended_topics`: Array of TopicRecommendation for incomplete assessments
- Backward compatibility with existing complete assessment fields

### Data Lifecycle

```
1. User starts → Session created
2. User chats → Messages stored
3. AI extracts → Inputs stored
4. Assessment complete → Snapshot generated
5. Session expires → Data retained for analysis
```

### Legal and Compliance Considerations

**Privacy Policy Disclosures**:
- Email addresses collected for session recovery and result delivery
- Conversation responses stored for assessment processing
- Session metadata collected for technical operations
- Data processed using OpenAI GPT-4 (third-party AI service)
- User rights include access, correction, and deletion under Australian Privacy Act

**Data Retention**: As disclosed in Privacy Policy, user data retained for service provision with deletion rights available upon request.

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

**AI Models (Anthropic Claude)**
- **Conversation Model**: `claude-sonnet-4-5-20250929` - Used for natural language conversations with users
- **Classification Model**: `claude-haiku-4-5-20251001` - Used for fast content classification and routing
- **Synthesis Model**: `claude-sonnet-4-5-20250929` - Used for generating summaries and synthesized responses

All models use Claude 4.5 architecture, providing improved performance and capabilities over previous versions.

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

The `recordInput` tool now includes server-side validation:

- **questionId validation**: The tool validates that the provided `questionId` exists in the current domain's valid question IDs
- **Error handling**: If an invalid `questionId` is provided, the tool returns an error response containing the list of valid IDs for the current domain
- **Self-correction**: This enables the AI agent to automatically retry with a correct `questionId` when validation fails

**Session Status Validation**: The chat endpoint now allows messages for sessions with status 'active' or 'completed'. Only sessions with status 'abandoned' will return a validation error 'This session is no longer active'.

**Request Timeout Behavior**
- All chat requests automatically timeout after 90 seconds
- Timeout errors return user-friendly error messages
- AbortSignal is passed through the request chain for proper cancellation
- Failed/cancelled requests trigger cleanup of streaming UI state

---

#### Generate Snapshot
```
POST /api/snapshot/generate
```
Generates readiness snapshot from all inputs.

**Model Configuration Updates:**
- Synthesis operations now use 4096 max tokens (increased from 1024) for more comprehensive analysis
- Snapshot generation includes robust error handling for partial completions
- Optional response arrays (strengths, assumptions, gaps, nextSteps) default to empty arrays if not generated

**Request Body**:
```json
{
  "sessionId": "uuid"
}
```

**Response**: Generated snapshot data.

## AI Prompt Updates for V4

### Incomplete Assessment Prompts
When coverage is below 60%, the AI system now generates:

1. **Early Signals** (2-4 cross-domain patterns)
   - Synthesizes patterns across available inputs
   - Identifies strengths, risks, and unknowns
   - Provides implications for expansion readiness

2. **Recommended Topics** (3 highest-value topics)
   - Prioritizes topics based on current coverage gaps
   - Explains why each topic is valuable
   - Previews what insights each topic will unlock

### Synthesis Instructions
- Explicit instruction to synthesize patterns, not summarize topics
- Focus on cross-domain implications and insights
- Provide unique value beyond what the console interface shows
- Generate actionable guidance for next steps

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
| `ANTHROPIC_API_KEY` | Required API key for accessing Claude 4.5 models (Sonnet and Haiku variants) | console.anthropic.com → API Keys |
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

**Conversation History Limit**: Set to 10 messages to balance context retention with token usage

**AI Interaction Mode**: Single-step execution to minimize API calls

**AI Model Settings:**
```typescript
models: {
  conversation: 'claude-sonnet-4-5-20250929',
  classification: 'claude-haiku-4-5-20251001', 
  synthesis: 'claude-haiku-4-5-20251001' // Fast model for timeout avoidance
}

modelConfig: {
  synthesis: {
    maxTokens: 2048, // Reduced for performance
    temperature: 0.3
  }
}
```

### Email Configuration

**Build-time Environment Variables**: The Resend email client is now lazy-initialized to prevent build failures when RESEND_API_KEY is not available during the build process. The client is only instantiated when actually sending emails, not at module load time.

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

**Testing Topic Selection:**
1. Navigate to any domain with topic cards
2. Click 'Talk to Atlas' on a topic
3. Verify chat opens and automatically sends "Let's talk about: [Topic Name]"
4. Verify Atlas responds immediately with topic-relevant content
5. Test with different topics to ensure consistent behavior

**Testing AI Response Consistency**: When testing conversations, verify that users always receive text responses even when the AI primarily uses tools. If you notice silent responses where only tool execution occurs, this should trigger the automatic fallback mechanism to generate a follow-up conversational response.

### Progress Tracking Issues

**Problem**: Progress not updating when user provides inputs
- Check browser network tab for `input` SSE events during conversation
- Verify tool execution is working by looking for `recordInput` calls in API logs
- Ensure question IDs in `apps/web/src/lib/progress.ts` match those in `apps/api/src/lib/ai/prompts/domains.ts`

**Problem**: Domain transition not working
- Look for `domain_change` SSE events in network tab
- Check that `transitionDomain` tool is being called when domain topics are covered
- Verify single-step execution allows sufficient tool execution in conversation flow

**Progress Tracking Issues**:
- **Symptom**: Progress checklist not updating despite user providing answers
- **Cause**: AI using incorrect question IDs that don't match the predefined domain questions
- **Solution**: Check that the conversation agent is using exact question IDs from the system prompt
- **Verification**: Monitor the `recordInput` tool calls to ensure questionId parameters match the domain configuration

**Domain Transition Problems**:
- **Symptom**: Conversations getting stuck in one domain without progressing
- **Solution**: The AI now has explicit instructions to call `transitionDomain` after 3-4 topics are covered
- **Verification**: Check that domain transitions occur naturally in conversation flow

**Troubleshooting Topic Selection:**
- If auto-message doesn't send, check that `
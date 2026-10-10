# Architecture Overview: StudyOS Next

## 1. Technology Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & Backend:** Supabase (PostgreSQL, GoTrue for Auth, Storage)
- **Deployment:** Vercel (Frontend), Supabase (Backend/DB)

## 2. System Architecture
### Server/Client Boundaries
- **Server Components (RSC):** Used for fetching subjects, notes, assignments, and dashboard data directly from Supabase (bypassing client network waterfalls).
- **Client Components:** Used for interactive elements (flashcard flipping, rich text editing, modal dialogs, AI chat interfaces).
- **Server Actions:** Handle form submissions, data mutations (creating notes, updating tasks, AI requests).

### Authentication Strategy
- Supabase Auth (GoTrue) using email/password and OAuth (Google/GitHub).
- Middleware intercepts requests to protect routes (e.g., `/dashboard`, `/subjects`) and redirects unauthenticated users to `/login`.

### Private vs. Shared Data Architecture
- **Individual Accounts:** All standard tables (notes, subjects) feature a `user_id` linked to `auth.users`. Row Level Security (RLS) ensures users can only read/write their own data.
- **Shared Resources & Groups:** A `groups` table and `memberships` table dictate access. Shared resources will either be cloned or linked via a `shared_resources` pivot table, with RLS policies allowing group members `SELECT` access.

## 3. Data Flow & State Management
- **Local State:** React `useState`/`useReducer` for UI state.
- **Server State:** Next.js Cache & React Query (or Supabase direct fetch with Next.js revalidation) for synchronized data.
- **Offline / Sync Strategy:** We will utilize service workers and IndexedDB (via a library like Dexie or raw browser APIs) for *optional offline drafts* (e.g., writing a note offline). We do not promise full offline functionality. Synchronization will be optimistic, resolving conflicts by "last write wins" or warning the user if a server-side timestamp is newer.

## 4. AI Integration Strategy
- **Provider Abstraction:** Server-side utility class wrapping OpenAI/Anthropic APIs.
- **Endpoints:** Next.js Route Handlers (`/api/ai/...`) handle processing to keep API keys secure.
- **Quotas & Validation:** The `ai_requests` table logs token usage and request types. Zod schemas validate all user prompts and structured AI outputs before storing them in the DB.

## 5. Error Handling & Testing
- **Error Handling:** Global Next.js `error.tsx` boundaries. Server Actions return discriminated unions (e.g., `{ success: true, data: ... } | { success: false, error: ... }`).
- **Testing:** Jest + React Testing Library for unit testing UI components. Playwright for E2E testing critical journeys (auth, note creation).

## 6. Design System & Environments
- **Design Tokens:** Defined in `tailwind.config.ts` (colors, typography, spacing).
- **Accessibility:** Radix UI (via shadcn) provides foundational a11y (ARIA attributes, keyboard navigation).
- **Environments:** Local (Docker/Supabase CLI), Preview (Vercel Preview + Supabase Staging), Production.

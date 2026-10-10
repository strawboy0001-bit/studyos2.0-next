# Implementation Plan: StudyOS Next

## 1. Infrastructure & Seed Strategy
- **Migrations:** Managed via Supabase CLI (`supabase migration new ...`). The schema is strictly source-controlled in the repository; no manual production DB edits.
- **Seed Data:** A `seed.sql` file will populate local development environments with test users, subjects, topics, and sample flashcards to enable immediate local UI development.

## 2. Development Phases & Acceptance Checklist

### Phase 1: Project Setup & Authentication
- [ ] Initialize Next.js project with Tailwind CSS, TypeScript, and shadcn/ui.
- [ ] Initialize Supabase project locally (`supabase init`).
- [ ] Set up Supabase Auth (Email/Password).
- [ ] Implement global layouts, navigation shell, and protected route middleware.
- [ ] **Acceptance:** Developer can spin up the app locally, register a user, log in, and see a blank protected dashboard.

### Phase 2: Core Academic Hierarchy & Notes
- [ ] Create initial migrations for `profiles`, `subjects`, `units`, `topics`, and `notes`.
- [ ] Build Subject/Unit/Topic management UI.
- [ ] Integrate a rich text editor for Notes.
- [ ] Set up Supabase Storage for attachments and link to notes.
- [ ] **Acceptance:** User can create a subject, navigate to a topic, write a rich text note, and attach an image.

### Phase 3: Task & Assessment Management
- [ ] Create migrations for `assignments` and `exams`.
- [ ] Build Kanban/List views for upcoming tasks.
- [ ] Integrate a calendar or timeline component.
- [ ] **Acceptance:** User can add an assignment with a due date and mark it complete on the dashboard.

### Phase 4: Active Recall & Revision Engine
- [ ] Create migrations for `flashcards`, `quiz_questions`, and `quiz_attempts`.
- [ ] Implement spaced repetition algorithm (e.g., SuperMemo-2 variant) on the server.
- [ ] Build flashcard study interface (flip, rate ease).
- [ ] **Acceptance:** User can create flashcards, review them, and see their next review date push into the future based on performance.

### Phase 5: AI Integration
- [ ] Setup API routes for AI interactions (OpenAI/Anthropic).
- [ ] Implement `ai_requests` logging for quotas.
- [ ] Build "Generate Flashcards from Note" feature.
- [ ] **Acceptance:** User clicks a button on a note, AI generates 5 flashcards, which are validated via Zod and saved to the DB.

### Phase 6: Collaboration & Sharing (V2 Foundation)
- [ ] Create migrations for `groups`, `memberships`, and `shared_resources`.
- [ ] Implement group creation and invite system.
- [ ] Update RLS policies to allow group viewing.
- [ ] **Acceptance:** User can invite another test user to a group, share a topic's notes, and the second user can read them.

### Phase 7: Polish, Analytics, & Deployment
- [ ] Implement `study_sessions` tracking and analytics dashboard.
- [ ] Finalize design tokens, responsive breakpoints, and animations.
- [ ] Deploy to Vercel (Frontend) and Supabase (Production DB).
- [ ] **Acceptance:** Application passes Lighthouse accessibility scores, handles mobile views perfectly, and is accessible on the production domain.

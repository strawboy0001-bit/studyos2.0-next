# Product Requirements Document (PRD): StudyOS Next

## 1. Product Goal
Build an academic operating system for college students combining subjects, notes, assignments, revision, quizzes, AI study assistance, progress analytics, and collaboration into a unified production-grade platform.

## 2. Target Audience & User Roles
- **Student (Primary):** Individual users managing their personal academic life (subjects, notes, tasks, exams, flashcards).
- **Group Member/Collaborator (Secondary):** Students sharing resources, notes, or quiz sets within shared workspaces/groups.
- **Admin:** System administrators managing the platform, AI quotas, and global settings (Out of scope for initial V1 MVP, but designed for).

## 3. Core Features & Boundaries
1. **Academic Organization:** Subjects -> Units -> Topics.
2. **Notes & Attachments:** Rich text notes tied to topics, with file attachments (PDFs, images).
3. **Task & Assessment Management:** Assignments, exams, and study sessions scheduling.
4. **Active Recall & Revision:** Flashcards, quiz questions, and spaced repetition attempts.
5. **AI Study Assistance:** Automated flashcard generation, quiz generation, and AI tutoring requests.
6. **Collaboration:** Shared resources and basic group memberships for collaborative study.
7. **Analytics:** Progress tracking, study session insights, and completion metrics.

## 4. User Journeys
- **Onboarding:** User signs up, creates a profile, and sets up their first Subject and Unit.
- **Daily Capture:** User uploads a lecture PDF (Attachment), creates a Note, and logs an Assignment due next week.
- **Study Mode:** User triggers an AI Request to generate flashcards from a Note, reviews them in a Study Session, and tracks performance.
- **Collaboration:** User creates a Group, invites peers, and shares a Unit's notes and flashcards.

## 5. Navigation Structure
- `/dashboard`: High-level overview, upcoming assignments/exams, recent notes.
- `/subjects`: Hierarchical view of Subjects > Units > Topics.
- `/tasks`: Kanban or list view of assignments and exams.
- `/revision`: Flashcards, quizzes, and spaced repetition queue.
- `/analytics`: Progress charts and study time tracking.
- `/groups`: Shared workspaces and collaboration resources.
- `/settings`: Profile, AI quotas, preferences.

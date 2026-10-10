# Database Data Model: StudyOS Next

## 1. Core Entities
All tables will reside in a Supabase PostgreSQL database.

### Users & Profiles
- **profiles:** `id` (PK, matches auth.users), `name`, `avatar_url`, `created_at`, `updated_at`.

### Academic Hierarchy
- **subjects:** `id`, `user_id` (FK), `name`, `color_code`, `created_at`, `updated_at`.
- **units:** `id`, `subject_id` (FK), `title`, `order_index`, `created_at`.
- **topics:** `id`, `unit_id` (FK), `title`, `order_index`, `created_at`.

### Content & Resources
- **notes:** `id`, `topic_id` (FK), `user_id` (FK), `title`, `content_rich`, `created_at`, `updated_at`.
- **attachments:** `id`, `note_id` (FK, nullable), `topic_id` (FK, nullable), `user_id`, `file_path`, `file_type`, `size_bytes`, `created_at`.

### Tasks & Assessments
- **assignments:** `id`, `subject_id` (FK), `user_id`, `title`, `description`, `due_date`, `status` (enum: pending, completed), `created_at`.
- **exams:** `id`, `subject_id` (FK), `user_id`, `title`, `exam_date`, `weightage`, `created_at`.

### Revision & Testing
- **flashcards:** `id`, `topic_id` (FK), `user_id`, `front_content`, `back_content`, `next_review_date`, `ease_factor`, `interval`, `created_at`.
- **quiz_questions:** `id`, `topic_id` (FK), `user_id`, `question_text`, `options` (jsonb), `correct_option_index`, `created_at`.
- **quiz_attempts:** `id`, `user_id`, `topic_id` (FK), `score`, `total_questions`, `completed_at`.
- **study_sessions:** `id`, `user_id`, `start_time`, `end_time`, `focus_mode_enabled`.

### AI & Quotas
- **ai_requests:** `id`, `user_id`, `request_type` (e.g., generate_flashcards), `prompt_tokens`, `completion_tokens`, `status`, `created_at`.

### Collaboration
- **groups:** `id`, `owner_id` (FK), `name`, `description`, `created_at`.
- **memberships:** `id`, `group_id` (FK), `user_id` (FK), `role` (admin, member), `joined_at`.
- **shared_resources:** `id`, `group_id` (FK), `resource_type` (note, flashcard_set), `resource_id` (UUID), `shared_by` (FK), `shared_at`.

## 2. Security, Validation & Ownership
- **Ownership:** Every personal record has a `user_id` defaulting to `auth.uid()`.
- **Access Control (RLS):** Policies enforce that `user_id = auth.uid()` for all CRUD operations. For shared resources, `group_id IN (SELECT group_id FROM memberships WHERE user_id = auth.uid())`.
- **Deletion Behavior:** Use `ON DELETE CASCADE` from Subjects down to Topics and Notes to prevent orphan records.
- **Timestamps:** Handled via PostgreSQL triggers (`moddatetime` extension) for `updated_at`.
- **Validation:** Enforced at the DB level via `CHECK` constraints (e.g., `score >= 0`, text lengths) and at the application level via Zod.

## 3. Indexes & Retention
- **Indexes:** Created on `user_id`, `subject_id`, `due_date`, and `next_review_date` for performance optimization.
- **Retention:** AI requests logged for 30 days. Soft deletes for Groups, hard deletes for personal notes.

import { z } from "zod";

export const SubjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  semester: z.string().optional(),
  description: z.string().optional(),
  examDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subject = z.infer<typeof SubjectSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subjectId: z.string().uuid().optional(),
  goalId: z.string().uuid().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;

export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  subjectId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  isAiGenerated: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Note = z.infer<typeof NoteSchema>;

export const GoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(["active", "completed", "abandoned"]).default("active"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Goal = z.infer<typeof GoalSchema>;

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url().optional(),
  type: z.enum(["video", "article", "book", "documentation", "other"]),
  goalId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  createdAt: z.date(),
});

export type Resource = z.infer<typeof ResourceSchema>;

export const StudyMaterialSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  fileData: z.any().optional(), // ArrayBuffer
  subjectId: z.string().uuid().optional(),
  contentExtract: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StudyMaterial = z.infer<typeof StudyMaterialSchema>;

export const FlashcardSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid().optional(),
  front: z.string().min(1),
  back: z.string().min(1),
  nextReviewDate: z.date(),
  interval: z.number().default(0), // days
  easeFactor: z.number().default(2.5),
  repetitions: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

export const QuizSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  subjectId: z.string().uuid().optional(),
  questions: z.array(z.object({
    id: z.string().uuid(),
    question: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    type: z.enum(["mcq", "true-false", "short-answer"])
  })),
  createdAt: z.date(),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const QuizAttemptSchema = z.object({
  id: z.string().uuid(),
  quizId: z.string().uuid(),
  score: z.number(),
  totalQuestions: z.number(),
  completedAt: z.date(),
});

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;

export const UserProfileSchema = z.object({
  id: z.number().default(1), // Single record
  name: z.string().min(1),
  degree: z.string().min(1),
  createdAt: z.date(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

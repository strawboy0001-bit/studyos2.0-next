import Dexie, { type EntityTable } from 'dexie';
import { type Subject, type Task, type Note, type Goal, type Resource, type StudyMaterial, type Flashcard, type Quiz, type QuizAttempt, type UserProfile } from './schema';

const db = new Dexie('StudyOSDB') as Dexie & {
  subjects: EntityTable<Subject, 'id'>;
  tasks: EntityTable<Task, 'id'>;
  notes: EntityTable<Note, 'id'>;
  goals: EntityTable<Goal, 'id'>;
  resources: EntityTable<Resource, 'id'>;
  materials: EntityTable<StudyMaterial, 'id'>;
  flashcards: EntityTable<Flashcard, 'id'>;
  quizzes: EntityTable<Quiz, 'id'>;
  quizAttempts: EntityTable<QuizAttempt, 'id'>;
  profile: EntityTable<UserProfile, 'id'>;
};

// Schema declaration:
db.version(6).stores({
  subjects: 'id, name, code',
  tasks: 'id, subjectId, dueDate, status, goalId',
  notes: 'id, subjectId',
  goals: 'id, status',
  resources: 'id, goalId, subjectId',
  materials: 'id, subjectId, fileType',
  flashcards: 'id, subjectId, nextReviewDate',
  quizzes: 'id, subjectId',
  quizAttempts: 'id, quizId',
  profile: 'id',
});

export { db };

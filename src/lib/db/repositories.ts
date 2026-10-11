import { db } from './index';
import type { Subject, Task, Goal, Resource } from './schema';
import { v4 as uuidv4 } from 'uuid';

export const subjectRepo = {
  async getAll() {
    return await db.subjects.toArray();
  },
  async getById(id: string) {
    return await db.subjects.get(id);
  },
  async create(subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSubject: Subject = {
      ...subject,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.subjects.add(newSubject);
    return newSubject;
  },
  async update(id: string, updates: Partial<Subject>) {
    await db.subjects.update(id, { ...updates, updatedAt: new Date() });
    return await db.subjects.get(id);
  },
  async delete(id: string) {
    await db.subjects.delete(id);
  }
};

export const taskRepo = {
  async getAll() {
    return await db.tasks.toArray();
  },
  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.tasks.add(newTask);
    return newTask;
  },
  async updateStatus(id: string, status: Task['status']) {
    await db.tasks.update(id, { status, updatedAt: new Date() });
  }
};

export const goalRepo = {
  async getAll() {
    return await db.goals.toArray();
  },
  async getById(id: string) {
    return await db.goals.get(id);
  },
  async create(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.goals.add(newGoal);
    return newGoal;
  },
  async update(id: string, updates: Partial<Goal>) {
    await db.goals.update(id, { ...updates, updatedAt: new Date() });
  },
  async delete(id: string) {
    await db.goals.delete(id);
  }
};

export const resourceRepo = {
  async getByGoalId(goalId: string) {
    return await db.resources.where('goalId').equals(goalId).toArray();
  },
  async create(resource: Omit<Resource, 'id' | 'createdAt'>) {
    const newResource: Resource = {
      ...resource,
      id: uuidv4(),
      createdAt: new Date(),
    };
    await db.resources.add(newResource);
    return newResource;
  }
};

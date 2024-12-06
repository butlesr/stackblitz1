import { create } from 'zustand';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTasksByUser: (userId: string) => Task[];
  getTasksByGroup: (groupId: string) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  
  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

  getTasksByUser: (userId) => {
    return get().tasks.filter(
      (task) => task.assignedTo.includes(userId) || task.createdBy === userId
    );
  },

  getTasksByGroup: (groupId) => {
    return get().tasks.filter((task) => task.groupId === groupId);
  },
}));
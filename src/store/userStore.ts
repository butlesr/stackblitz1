import { create } from 'zustand';
import { User } from '../types';

interface UserStore {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: {
    id: 'default-user',
    name: 'Default User',
    email: 'user@example.com',
  },
  users: [],

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  addUser: (user) => {
    set((state) => ({
      users: [...state.users, user],
    }));
  },

  updateUser: (userId, updates) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
    }));
  },
}));
import { create } from 'zustand';
import { Group, GroupMember } from '../types';

interface GroupStore {
  groups: Group[];
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  addMember: (groupId: string, member: GroupMember) => void;
  removeMember: (groupId: string, userId: string) => void;
  updateMemberRole: (groupId: string, userId: string, role: GroupMember['role']) => void;
  getGroupById: (groupId: string) => Group | undefined;
  getUserGroups: (userId: string) => Group[];
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],

  addGroup: (group) => {
    set((state) => ({
      groups: [...state.groups, group],
    }));
  },

  updateGroup: (groupId, updates) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      ),
    }));
  },

  deleteGroup: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== groupId),
    }));
  },

  addMember: (groupId, member) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? { ...group, members: [...group.members, member] }
          : group
      ),
    }));
  },

  removeMember: (groupId, userId) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter((member) => member.userId !== userId),
            }
          : group
      ),
    }));
  },

  updateMemberRole: (groupId, userId, role) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) =>
                member.userId === userId ? { ...member, role } : member
              ),
            }
          : group
      ),
    }));
  },

  getGroupById: (groupId) => {
    return get().groups.find((group) => group.id === groupId);
  },

  getUserGroups: (userId) => {
    return get().groups.filter((group) =>
      group.members.some((member) => member.userId === userId)
    );
  },
}));
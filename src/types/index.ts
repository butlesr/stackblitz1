export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  createdBy: string;
  groupId?: string;
  steps: TaskStep[];
  reminders: Reminder[];
}

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  status: 'pending' | 'completed';
}

export interface Reminder {
  id: string;
  type: 'notification' | 'call' | 'message' | 'ringtone';
  time: Date;
  message: string;
  recipients: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}
import React from 'react';
import { Pencil, Trash2, MessageCircle } from 'lucide-react';
import { Task } from '../types';
import { useTaskStore } from '../store/taskStore';

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
  onOpenChat: () => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task, onEdit, onOpenChat }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        title="Edit task"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={onOpenChat}
        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
        title="Open chat"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
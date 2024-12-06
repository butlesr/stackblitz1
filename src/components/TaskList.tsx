import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types';
import { format } from 'date-fns';
import { Calendar, Clock, Flag } from 'lucide-react';
import { TaskActions } from './TaskActions';
import { ChatBox } from './ChatBox';
import { TaskForm } from './TaskForm';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [chatTask, setChatTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <TaskActions
              task={task}
              onEdit={() => setEditingTask(task)}
              onOpenChat={() => setChatTask(task)}
            />
          </div>
          
          <p className="text-gray-600 mt-2">{task.description}</p>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="mr-4">
              {format(new Date(task.deadline), 'MMM d, yyyy')}
            </span>
            
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {format(new Date(task.deadline), 'h:mm a')}
            </span>
            
            <span className={`flex items-center ml-4 ${getPriorityColor(task.priority)}`}>
              <Flag className="w-4 h-4 mr-1" />
              {task.priority}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex space-x-2">
              {task.steps.map((step) => (
                <div
                  key={step.id}
                  className={`h-2 flex-1 rounded-full ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Edit Task</h2>
            </div>
            <div className="p-4">
              <TaskForm
                initialData={editingTask}
                onSubmit={() => setEditingTask(null)}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}

      {chatTask && <ChatBox task={chatTask} onClose={() => setChatTask(null)} />}
    </div>
  );
};
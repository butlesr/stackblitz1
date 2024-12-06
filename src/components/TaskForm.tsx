import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '../store/taskStore';
import { useGroupStore } from '../store/groupStore';
import { useUserStore } from '../store/userStore';
import { Plus, Trash, X } from 'lucide-react';
import { Task } from '../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  groupId: z.string().optional(),
  steps: z.array(
    z.object({
      title: z.string().min(1, 'Step title is required'),
      deadline: z.string(),
    })
  ),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const currentUser = useUserStore((state) => state.currentUser);
  const userGroups = useGroupStore((state) => 
    currentUser ? state.getUserGroups(currentUser.id) : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          deadline: new Date(initialData.deadline).toISOString().slice(0, 16),
          priority: initialData.priority,
          groupId: initialData.groupId,
          steps: initialData.steps.map((step) => ({
            title: step.title,
            deadline: new Date(step.deadline).toISOString().slice(0, 16),
          })),
        }
      : {
          steps: [{ title: '', deadline: '' }],
        },
  });

  const onFormSubmit = (data: TaskFormData) => {
    if (!currentUser) return;

    if (initialData) {
      updateTask(initialData.id, {
        ...data,
        updatedAt: new Date(),
        deadline: new Date(data.deadline),
        steps: data.steps.map((step, index) => ({
          ...(initialData.steps[index] || {}),
          id: initialData.steps[index]?.id || crypto.randomUUID(),
          title: step.title,
          description: '',
          deadline: new Date(step.deadline),
          status: initialData.steps[index]?.status || 'pending',
        })),
      });
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: new Date(data.deadline),
        status: 'pending' as const,
        assignedTo: data.groupId 
          ? userGroups.find(g => g.id === data.groupId)?.members.map(m => m.userId) || []
          : [currentUser.id],
        createdBy: currentUser.id,
        steps: data.steps.map((step) => ({
          id: crypto.randomUUID(),
          ...step,
          description: '',
          deadline: new Date(step.deadline),
          status: 'pending' as const,
        })),
        reminders: [],
      };
      addTask(newTask);
    }
    onSubmit?.();
  };

  const steps = watch('steps');

  const addStep = () => {
    setValue('steps', [...steps, { title: '', deadline: '' }]);
  };

  const removeStep = (index: number) => {
    setValue(
      'steps',
      steps.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assign to Group</label>
        <select
          {...register('groupId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Personal Task</option>
          {userGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="datetime-local"
          {...register('deadline')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          {...register('priority')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Steps</h3>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </button>
        </div>

        {steps.map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                {...register(`steps.${index}.title`)}
                placeholder="Step title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="datetime-local"
                {...register(`steps.${index}.deadline`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update' : 'Create'} Task
        </button>
      </div>
    </form>
  );
};
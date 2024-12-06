import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGroupStore } from '../store/groupStore';
import { useUserStore } from '../store/userStore';
import { Plus, X } from 'lucide-react';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().min(1, 'Description is required'),
  members: z.array(
    z.object({
      userId: z.string().min(1, 'User ID is required'),
      phoneNumber: z.string().min(1, 'Phone number is required'),
      role: z.enum(['admin', 'member']),
    })
  ),
});

type GroupFormData = z.infer<typeof groupSchema>;

export const GroupForm: React.FC = () => {
  const addGroup = useGroupStore((state) => state.addGroup);
  const currentUser = useUserStore((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      members: [{ userId: '', phoneNumber: '', role: 'member' }],
    },
  });

  const onSubmit = (data: GroupFormData) => {
    if (!currentUser) return;

    const newGroup = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          userId: currentUser.id,
          role: 'admin' as const,
          joinedAt: new Date(),
        },
        ...data.members.map((member) => ({
          userId: member.userId,
          role: member.role,
          joinedAt: new Date(),
        })),
      ],
    };

    addGroup(newGroup);
    // Reset form or show success message
  };

  const members = watch('members');

  const addMember = () => {
    setValue('members', [
      ...members,
      { userId: '', phoneNumber: '', role: 'member' },
    ]);
  };

  const removeMember = (index: number) => {
    setValue(
      'members',
      members.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Group Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Members</h3>
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>

        {members.map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                {...register(`members.${index}.userId`)}
                placeholder="User ID"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="tel"
                {...register(`members.${index}.phoneNumber`)}
                placeholder="Phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <select
                {...register(`members.${index}.role`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeMember(index)}
              className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Group
        </button>
      </div>
    </form>
  );
};
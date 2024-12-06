import React, { useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import { Users, Settings, List } from 'lucide-react';
import { TaskList } from './TaskList';

export const GroupList: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const groups = useGroupStore((state) => 
    currentUser ? state.getUserGroups(currentUser.id) : []
  );
  const getTasksByGroup = useTaskStore((state) => state.getTasksByGroup);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-indigo-500" />
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedGroupId(
                  selectedGroupId === group.id ? null : group.id
                )}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                title="View group tasks"
              >
                <List className="w-4 h-4" />
              </button>
              {group.members.some(
                (member) =>
                  member.userId === currentUser.id && member.role === 'admin'
              ) && (
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                  title="Group settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Members</h4>
            <div className="flex flex-wrap gap-2">
              {group.members.map((member) => (
                <span
                  key={member.userId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {member.role === 'admin' ? '👑 ' : ''}
                  {member.userId}
                </span>
              ))}
            </div>
          </div>

          {selectedGroupId === group.id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-lg font-medium mb-4">Group Tasks</h4>
              <TaskList tasks={getTasksByGroup(group.id)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
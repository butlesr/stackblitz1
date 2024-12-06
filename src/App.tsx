import React from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { GroupForm } from './components/GroupForm';
import { GroupList } from './components/GroupList';
import { useTaskStore } from './store/taskStore';

function App() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                <div className="bg-white shadow rounded-lg p-6">
                  <TaskForm />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
                <div className="bg-white shadow rounded-lg p-6">
                  <GroupForm />
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <TaskList tasks={tasks} />
              </div>
              
              <div>
                <GroupList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
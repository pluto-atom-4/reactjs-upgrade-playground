import { useState, useCallback } from 'react';
import type { JSX } from 'react';

interface Activity {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const ActivityComponent = ({ activities }: { activities: Activity[] }): JSX.Element => (
  <div className="space-y-2">
    {activities.map((activity) => (
      <div
        key={activity.id}
        className={`p-3 rounded-md text-sm font-medium ${
          activity.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : activity.type === 'error'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-blue-100 text-blue-700 border border-blue-300'
        }`}
      >
        {activity.message}
      </div>
    ))}
  </div>
);

export const ActivityComponentDemo = (): JSX.Element => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = useCallback((type: Activity['type'], message: string) => {
    const id = Date.now().toString();
    setActivities((prev) => [{ id, type, message }, ...prev]);

    setTimeout(() => {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  }, []);

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-green-900">Activity Component Pattern</h3>
      <p className="text-sm text-green-700">Toast-like notifications with automatic dismissal</p>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => addActivity('success', '✓ Action completed successfully!')} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">
          Success
        </button>
        <button onClick={() => addActivity('error', '✗ Something went wrong!')} className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700">
          Error
        </button>
        <button onClick={() => addActivity('info', 'ℹ Here is some information')} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
          Info
        </button>
      </div>

      {activities.length > 0 && <ActivityComponent activities={activities} />}
    </div>
  );
};


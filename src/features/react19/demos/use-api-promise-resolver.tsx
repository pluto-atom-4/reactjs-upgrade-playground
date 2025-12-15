import { use, Suspense, useState } from 'react';
import type { JSX } from 'react';

// Simulate an API call that returns data
function fetchUserData(userId: string): Promise<{ id: string; name: string; email: string; joinedDate: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      });
    }, 1500);
  });
}

/**
 * UserDataDisplay Component - Demonstrates React 19 use() API
 *
 * Key use() API Specific Behaviors:
 *
 * 1. Promise Unwrapping:
 *    - The use() hook unwraps a promise and returns its resolved value
 *    - This allows reading async data synchronously within the component
 *    - Unlike .then() or async/await, use() integrates with React's rendering lifecycle
 *
 * 2. Suspense Integration:
 *    - When a pending promise is passed to use(), it throws the promise
 *    - React's Suspense boundary catches this thrown promise and displays the fallback UI
 *    - Once resolved, React automatically re-renders the component with the resolved value
 *    - This eliminates the need for manual loading state management
 *
 * 3. Re-rendering on Promise Change:
 *    - If a different promise is passed as a prop, use() will suspend again
 *    - The component cleanly transitions from old data -> loading state -> new data
 *    - Prevents race conditions and stale data issues
 *
 * 4. Error Handling:
 *    - If the promise is rejected, use() throws the error
 *    - The nearest Error Boundary will catch and handle the error
 *    - Normal error handling patterns apply (not covered in this demo)
 *
 * 5. Context & Dependency Handling:
 *    - use() can only be called in render or after render (async server components)
 *    - Unlike hooks that require conditional logic, use() handles conditional rendering naturally
 *    - The passed promise should be stable or properly memoized to avoid unnecessary suspensions
 *
 * 6. Advantages over Traditional Patterns:
 *    - Cleaner code without useEffect/useState for async operations
 *    - No waterfall loading problems with multiple data dependencies
 *    - Better composability with Suspense boundaries
 *    - Automatic state management - no forgotten cleanup
 */
function UserDataDisplay({ userPromise }: { userPromise: Promise<{ id: string; name: string; email: string; joinedDate: string }> }): JSX.Element {
  const user = use(userPromise);

  return (
    <div className="bg-white border border-teal-200 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">ID:</span>
        <span className="text-sm text-gray-900 font-mono">{user.id}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Name:</span>
        <span className="text-sm text-gray-900">{user.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Email:</span>
        <span className="text-sm text-gray-900 font-mono">{user.email}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Joined:</span>
        <span className="text-sm text-gray-900">{user.joinedDate}</span>
      </div>
    </div>
  );
}

// Loading fallback component
function UserDataFallback(): JSX.Element {
  return (
    <div className="bg-white border border-teal-200 rounded-lg p-4 space-y-3">
      <div className="h-4 bg-linear-to-r from-teal-200 to-transparent rounded animate-pulse"></div>
      <div className="h-4 bg-linear-to-r from-teal-200 to-transparent rounded animate-pulse w-5/6"></div>
      <div className="h-4 bg-linear-to-r from-teal-200 to-transparent rounded animate-pulse w-4/6"></div>
      <div className="h-4 bg-linear-to-r from-teal-200 to-transparent rounded animate-pulse w-3/4"></div>
    </div>
  );
}

export const UseApiPromiseResolverDemo = (): JSX.Element => {
  const [activeUserId, setActiveUserId] = useState('1');
  const [userPromise, setUserPromise] = useState<Promise<{ id: string; name: string; email: string; joinedDate: string }> | null>(
    fetchUserData('1'),
  );

  const handleSelectUser = (userId: string) => {
    setActiveUserId(userId);
    setUserPromise(fetchUserData(userId));
  };

  return (
    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-teal-900">use() API - Promise Resolver</h3>
        <p className="text-sm text-teal-700 mt-1">Unwrap promises within components using the use() hook with Suspense</p>
      </div>

      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {['1', '2', '3', '4', '5'].map((id) => (
            <button
              key={id}
              onClick={() => handleSelectUser(id)}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                activeUserId === id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }`}
            >
              User {id}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500">
          Select a user to fetch their data. The <code className="bg-gray-100 px-1 rounded">use()</code> hook will unwrap the promise.
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">User Data (Using use() with Suspense):</h4>
        {userPromise ? (
          <Suspense fallback={<UserDataFallback />}>
            <UserDataDisplay userPromise={userPromise} />
          </Suspense>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">Select a user to load data</div>
        )}
      </div>

      <div className="bg-teal-100 border border-teal-300 rounded-lg p-3 text-xs text-teal-800 space-y-1">
        <p className="font-semibold">How it works:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>
            The <code className="bg-white px-1 rounded">use()</code> hook allows reading promise values directly in components
          </li>
          <li>
            When a new promise is passed, the Suspense boundary catches it and shows the fallback UI
          </li>
          <li>
            Once the promise resolves, React re-renders the component with the data
          </li>
          <li>No manual .then() or async/await needed in the component body</li>
        </ul>
      </div>
    </div>
  );
};


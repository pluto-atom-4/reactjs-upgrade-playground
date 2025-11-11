import type { ReactElement } from 'react';
import { Fragment, useState, useEffect, useRef, useCallback, useActionState, useOptimistic } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { NextPageWithLayout } from './_app';

/**
 * React 19.2 Features Playground
 *
 * This page showcases key features introduced in React 19.2:
 * - useActionState (formerly useFormState)
 * - useFormStatus
 * - useOptimistic
 * - Partial Pre-rendering (PPR) concepts
 * - Activity Component pattern
 * - useEffectEvent pattern
 */

// ============================================================================
// 1. useActionState Hook Demo
// ============================================================================

type FormState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  message?: string;
  data?: Record<string, unknown>;
};

async function submitForm(prevState: FormState, formData: FormData): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    return {
      status: 'error',
      message: 'Name and email are required',
    };
  }

  return {
    status: 'success',
    message: `Successfully submitted! Hello ${name}`,
    data: { name, email },
  };
}

const UseActionStateDemo = () => {
  const [state, formAction, isPending] = useActionState(submitForm, { status: 'idle' } as FormState);

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-900">useActionState Hook</h3>
      <p className="text-sm text-blue-700">
        Handles form submission with optimistic UI updates
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {state.status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✓ {state.message}
        </div>
      )}

      {state.status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ✗ {state.message}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. useOptimistic Hook Demo
// ============================================================================

interface OptimisticItem {
  id: string;
  text: string;
  completed: boolean;
  pending?: boolean;
}

async function addTodoAction(item: OptimisticItem): Promise<OptimisticItem> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return item;
}

const UseOptimisticDemo = () => {
  const [todos, setTodos] = useState<OptimisticItem[]>([
    { id: '1', text: 'Learn React 19.2', completed: false },
    { id: '2', text: 'Build playground', completed: true },
  ]);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic<OptimisticItem[], OptimisticItem>(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }],
  );

  const handleAddTodo = async (text: string) => {
    const newTodo: OptimisticItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    try {
      await addOptimisticTodo(newTodo);
      const result = await addTodoAction(newTodo);
      setTodos((prev) => [...prev, result]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-purple-900">useOptimistic Hook</h3>
      <p className="text-sm text-purple-700">
        Optimistically update UI before server response
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          id="todo-input"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Add a new todo..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = e.currentTarget;
              if (input.value.trim()) {
                handleAddTodo(input.value);
                input.value = '';
              }
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.getElementById('todo-input') as HTMLInputElement;
            if (input.value.trim()) {
              handleAddTodo(input.value);
              input.value = '';
            }
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {optimisticTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-3 p-3 rounded-md ${
              todo.pending
                ? 'bg-yellow-50 border border-yellow-300'
                : 'bg-white border border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className="w-5 h-5 accent-purple-600"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
            {todo.pending && <span className="text-xs text-yellow-700 ml-auto">pending...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// 3. Activity Component Pattern Demo
// ============================================================================

interface Activity {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const ActivityComponent = ({ activities }: { activities: Activity[] }) => {
  return (
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
};

const ActivityComponentDemo = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = useCallback(
    (type: Activity['type'], message: string) => {
      const id = Date.now().toString();
      setActivities((prev) => [{ id, type, message }, ...prev]);

      setTimeout(() => {
        setActivities((prev) => prev.filter((a) => a.id !== id));
      }, 4000);
    },
    [],
  );

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-green-900">Activity Component Pattern</h3>
      <p className="text-sm text-green-700">
        Toast-like notifications with automatic dismissal
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addActivity('success', '✓ Action completed successfully!')}
          className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Success
        </button>
        <button
          onClick={() => addActivity('error', '✗ Something went wrong!')}
          className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
        >
          Error
        </button>
        <button
          onClick={() => addActivity('info', 'ℹ Here is some information')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          Info
        </button>
      </div>

      {activities.length > 0 && <ActivityComponent activities={activities} />}
    </div>
  );
};

// ============================================================================
// 4. useEffectEvent Pattern Demo (Simulated)
// ============================================================================

const UseEffectEventDemo = () => {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<string[]>([]);

  // Simulating useEffectEvent pattern - defining a callback that won't change
  const handleCountChange = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString();
    logRef.current = [...logRef.current, `Count changed to ${count} at ${timestamp}`];
    setLog([...logRef.current]);
  }, [count]);

  // This effect depends on handleCountChange but won't recreate on dependency changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCountChange();
    }, 1000);

    return () => clearTimeout(timer);
  }, [handleCountChange]);

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-indigo-900">useEffectEvent Pattern</h3>
      <p className="text-sm text-indigo-700">
        Separate event handling logic from effects
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
          >
            Increment: {count}
          </button>
          <span className="text-sm text-indigo-700">
            (Changes auto-logged after 1s)
          </span>
        </div>

        <div className="bg-white border border-indigo-300 rounded-md p-3 h-40 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-gray-500 text-sm">Click the button to see logs...</p>
          ) : (
            <ul className="text-sm font-mono space-y-1">
              {log.map((entry, idx) => (
                <li key={idx} className="text-indigo-700">
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. Partial Pre-rendering (PPR) Concept Demo
// ============================================================================

const StaticContent = () => (
  <div className="bg-white border border-gray-300 rounded-md p-4">
    <h4 className="font-bold text-gray-900">Static Content</h4>
    <p className="text-sm text-gray-600">
      This content is pre-rendered at build time and cached.
    </p>
  </div>
);

const DynamicContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white border ${isLoading ? 'border-yellow-300' : 'border-green-300'} rounded-md p-4`}>
      <h4 className="font-bold text-gray-900">Dynamic Content</h4>
      {isLoading ? (
        <p className="text-sm text-yellow-700">Loading from server...</p>
      ) : (
        <p className="text-sm text-green-700">
          ✓ Loaded! Current time: {new Date().toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

const PartialPreRenderingDemo = () => {
  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-orange-900">
        Partial Pre-rendering (PPR) Concept
      </h3>
      <p className="text-sm text-orange-700">
        Combine static and dynamic content in a single page
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StaticContent />
        <DynamicContent />
      </div>

      <div className="bg-orange-100 border border-orange-300 rounded-md p-3 text-sm text-orange-700">
        <strong>PPR Benefits:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Faster initial page load (static parts cached)</li>
          <li>Dynamic parts stream in after initial render</li>
          <li>Better Core Web Vitals scores</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// 6. React Server Components Awareness Demo
// ============================================================================

const ServerComponentsAwarenessDemo = () => {
  const [clientSideData, setClientSideData] = useState('Not loaded yet');

  useEffect(() => {
    // Simulating client-side data fetching
    setTimeout(() => {
      setClientSideData('Fetched from API at ' + new Date().toLocaleTimeString());
    }, 800);
  }, []);

  return (
    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-pink-900">
        React Server Components Awareness
      </h3>
      <p className="text-sm text-pink-700">
        Understand when code runs on server vs client
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-100 border border-purple-300 rounded-md p-4">
          <h4 className="font-bold text-purple-900 mb-2">Server-side</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>✓ Database queries</li>
            <li>✓ API calls (direct)</li>
            <li>✓ Secrets/env variables</li>
            <li>✓ Heavy computations</li>
          </ul>
        </div>

        <div className="bg-cyan-100 border border-cyan-300 rounded-md p-4">
          <h4 className="font-bold text-cyan-900 mb-2">Client-side</h4>
          <p className="text-sm text-cyan-700 mb-2">Data: {clientSideData}</p>
          <ul className="text-sm text-cyan-700 space-y-1">
            <li>✓ Event handlers</li>
            <li>✓ Hooks (useState, useEffect)</li>
            <li>✓ Browser APIs</li>
            <li>✓ Interactivity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Playground Page
// ============================================================================

const React19PlaygroundPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>React 19.2 Features Playground</title>
        <meta
          name="description"
          content="Interactive playground for React 19.2 features"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              React 19.2 Features Playground
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Explore key features introduced in React 19.2
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                ← Back to Home
              </Link>
              <a
                href="https://react.dev/blog/2024/12/19/react-19-2-is-now-available"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Official Blog →
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Feature 1 */}
            <section>
              <UseActionStateDemo />
            </section>

            {/* Feature 2 */}
            <section>
              <UseOptimisticDemo />
            </section>

            {/* Feature 3 */}
            <section>
              <ActivityComponentDemo />
            </section>

            {/* Feature 4 */}
            <section>
              <UseEffectEventDemo />
            </section>

            {/* Feature 5 */}
            <section>
              <PartialPreRenderingDemo />
            </section>

            {/* Feature 6 */}
            <section>
              <ServerComponentsAwarenessDemo />
            </section>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Learn More</h2>
            <p className="text-gray-300 mb-6">
              This playground demonstrates some of the key improvements in React 19.2.
              Try interacting with each section to see the features in action.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full">
                useActionState
              </span>
              <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full">
                useOptimistic
              </span>
              <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full">
                Activity Component
              </span>
              <span className="px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full">
                useEffectEvent
              </span>
              <span className="px-3 py-1 bg-orange-900 text-orange-200 rounded-full">
                PPR Concepts
              </span>
              <span className="px-3 py-1 bg-pink-900 text-pink-200 rounded-full">
                RSC Awareness
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

React19PlaygroundPage.getLayout = (page: ReactElement) => page;

export default React19PlaygroundPage;


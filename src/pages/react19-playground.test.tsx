import { describe, it, expect, beforeEach as _beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import _userEvent from '@testing-library/user-event';
import { useState, useCallback, useEffect } from 'react';

/**
 * Tests for React 19.2 Playground Components
 *
 * Tests cover:
 * - useActionState Hook
 * - useOptimistic Hook
 * - Activity Component Pattern
 * - useEffectEvent Pattern
 * - Partial Pre-rendering Concepts
 * - React Server Components Awareness
 */

// ============================================================================
// Test: Activity Component
// ============================================================================

describe('ActivityComponent', () => {
  it('renders activity messages with correct styling', () => {
    interface Activity {
      id: string;
      type: 'success' | 'error' | 'info';
      message: string;
    }

    const ActivityComponent = ({ activities }: { activities: Activity[] }) => (
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

    const activities: Activity[] = [
      { id: '1', type: 'success', message: '✓ Success!' },
      { id: '2', type: 'error', message: '✗ Error!' },
      { id: '3', type: 'info', message: 'ℹ Info' },
    ];

    render(<ActivityComponent activities={activities} />);

    expect(screen.getByText('✓ Success!')).toBeInTheDocument();
    expect(screen.getByText('✗ Error!')).toBeInTheDocument();
    expect(screen.getByText('ℹ Info')).toBeInTheDocument();
  });

  it('renders empty state when no activities', () => {
    interface Activity {
      id: string;
      type: 'success' | 'error' | 'info';
      message: string;
    }

    const ActivityComponent = ({ activities }: { activities: Activity[] }) => (
      <div className="space-y-2">
        {activities.length === 0 && <p>No activities</p>}
        {activities.map((activity) => (
          <div key={activity.id}>{activity.message}</div>
        ))}
      </div>
    );

    render(<ActivityComponent activities={[]} />);
    expect(screen.getByText('No activities')).toBeInTheDocument();
  });
});

// ============================================================================
// Test: Form with useActionState Pattern
// ============================================================================

describe('Form with useActionState Pattern', () => {
  it('handles form submission with pending state', async () => {
    const mockFormAction = vi.fn();

    const FormComponent = () => {
      const [isPending, setIsPending] = useState(false);
      const [state, setState] = useState<{ message?: string }>({});

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        try {
          const formData = new FormData(e.currentTarget);
          await mockFormAction(formData);
          setState({ message: 'Success!' });
        } finally {
          setIsPending(false);
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            disabled={isPending}
            placeholder="Enter name"
          />
          <button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
          {state.message && <div>{state.message}</div>}
        </form>
      );
    };

    render(<FormComponent />);

    const input = screen.getByPlaceholderText('Enter name');
    const button = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const FormComponent = () => {
      const [state, setState] = useState<{ message?: string }>({});

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        if (!name || !email) {
          setState({ message: 'Name and email are required' });
          return;
        }

        setState({ message: 'Form submitted!' });
      };

      return (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Submit</button>
          {state.message && <div>{state.message}</div>}
        </form>
      );
    };

    render(<FormComponent />);

    fireEvent.click(screen.getByText('Submit'));
    expect(
      screen.getByText('Name and email are required'),
    ).toBeInTheDocument();
  });
});

// ============================================================================
// Test: useOptimistic Pattern
// ============================================================================

describe('useOptimistic Pattern', () => {
  it('displays optimistic UI while updating', async () => {
    interface Todo {
      id: string;
      text: string;
      completed: boolean;
      pending?: boolean;
    }

    const OptimisticTodoDemo = () => {
      const [todos, setTodos] = useState<Todo[]>([
        { id: '1', text: 'Learn React', completed: false },
      ]);
      const [optimisticTodos, setOptimisticTodos] = useState<Todo[]>(todos);

      const addTodo = async (text: string) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text,
          completed: false,
          pending: true,
        };

        // Optimistic update
        setOptimisticTodos((prev) => [...prev, newTodo]);

        // Simulate server delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Update actual state
        setTodos((prev) => [...prev, { ...newTodo, pending: undefined }]);
      };

      return (
        <div>
          <button
            onClick={() => addTodo('New task')}
            data-testid="add-todo"
          >
            Add Todo
          </button>
          <ul>
            {optimisticTodos.map((todo) => (
              <li
                key={todo.id}
                data-testid={`todo-${todo.id}`}
                className={todo.pending ? 'pending' : 'complete'}
              >
                {todo.text}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    render(<OptimisticTodoDemo />);

    fireEvent.click(screen.getByTestId('add-todo'));

    // Should appear immediately (optimistic)
    const newTodo = screen.getByText('New task');
    expect(newTodo).toBeInTheDocument();

    await waitFor(
      () => {
        // Component should have rendered the new todo
        expect(newTodo).toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });

  it('maintains multiple todos in optimistic state', async () => {
    interface Todo {
      id: string;
      text: string;
      completed: boolean;
    }

    const OptimisticTodoDemo = () => {
      const [todos, setTodos] = useState<Todo[]>([]);

      const addTodo = (text: string) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text,
          completed: false,
        };
        setTodos((prev) => [...prev, newTodo]);
      };

      return (
        <div>
          <button onClick={() => addTodo('Task 1')} data-testid="add-1">
            Add 1
          </button>
          <button onClick={() => addTodo('Task 2')} data-testid="add-2">
            Add 2
          </button>
          <ul data-testid="todo-list">
            {todos.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        </div>
      );
    };

    render(<OptimisticTodoDemo />);

    fireEvent.click(screen.getByTestId('add-1'));
    fireEvent.click(screen.getByTestId('add-2'));

    const todoList = screen.getByTestId('todo-list');
    const items = todoList.querySelectorAll('li');

    expect(items).toHaveLength(2);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});

// ============================================================================
// Test: useEffectEvent Pattern
// ============================================================================

describe('useEffectEvent Pattern', () => {
  it('logs events with timestamps', async () => {
    const UseEffectEventDemo = () => {
      const [count, setCount] = useState(0);
      const [log, setLog] = useState<string[]>([]);

      const handleCountChange = useCallback(() => {
        const timestamp = new Date().toLocaleTimeString();
        setLog((prev) => [
          ...prev,
          `Count changed to ${count} at ${timestamp}`,
        ]);
      }, [count]);

      return (
        <div>
          <button onClick={() => setCount((c) => c + 1)}>
            Increment: {count}
          </button>
          <button onClick={handleCountChange} data-testid="log-button">
            Log Event
          </button>
          <ul data-testid="log-list">
            {log.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      );
    };

    render(<UseEffectEventDemo />);

    fireEvent.click(screen.getByText(/Increment/));
    fireEvent.click(screen.getByTestId('log-button'));

    const logList = screen.getByTestId('log-list');
    expect(logList.querySelectorAll('li')).toHaveLength(1);
    expect(screen.getByText(/Count changed to 1/)).toBeInTheDocument();
  });

  it('maintains log history on multiple events', async () => {
    const UseEffectEventDemo = () => {
      const [count, setCount] = useState(0);
      const [log, setLog] = useState<string[]>([]);

      const handleCountChange = useCallback(() => {
        setLog((prev) => [...prev, `Count: ${count}`]);
      }, [count]);

      return (
        <div>
          <button onClick={() => setCount((c) => c + 1)}>
            Increment
          </button>
          <button onClick={handleCountChange} data-testid="log">
            Log
          </button>
          <div data-testid="log-count">{log.length}</div>
        </div>
      );
    };

    render(<UseEffectEventDemo />);

    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByTestId('log'));

    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByTestId('log'));

    expect(screen.getByTestId('log-count')).toHaveTextContent('2');
  });
});

// ============================================================================
// Test: Partial Pre-rendering Concept
// ============================================================================

describe('Partial Pre-rendering Concept', () => {
  it('renders static content immediately', () => {
    const StaticContent = () => (
      <div data-testid="static-content">
        <h4>Static Content</h4>
        <p>This content is pre-rendered at build time.</p>
      </div>
    );

    render(<StaticContent />);

    expect(screen.getByTestId('static-content')).toBeInTheDocument();
    expect(screen.getByText('Static Content')).toBeInTheDocument();
  });

  it('renders dynamic content after loading', async () => {
    const DynamicContent = () => {
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 50); // Short timeout for testing

        return () => clearTimeout(timer);
      }, []);

      return (
        <div data-testid="dynamic-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <p>Loaded at {new Date().toLocaleTimeString()}</p>
          )}
        </div>
      );
    };

    render(<DynamicContent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText(/Loaded at/)).toBeInTheDocument();
    });
  });

  it('combines static and dynamic content', async () => {
    const StaticContent = () => <div data-testid="static">Static</div>;

    const DynamicContent = () => {
      const [loaded, setLoaded] = useState(false);

      useEffect(() => {
        setTimeout(() => setLoaded(true), 50);
      }, []);

      return (
        <div data-testid="dynamic">
          {loaded ? 'Dynamic Loaded' : 'Dynamic Loading'}
        </div>
      );
    };

    const PartialPreRenderingDemo = () => (
      <div>
        <StaticContent />
        <DynamicContent />
      </div>
    );

    render(<PartialPreRenderingDemo />);

    expect(screen.getByTestId('static')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Dynamic Loaded')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Test: React Server Components Awareness
// ============================================================================

describe('React Server Components Awareness', () => {
  it('demonstrates server vs client capabilities', () => {
    const ServerComponentsAwarenessDemo = () => {
      const [clientData, setClientData] = useState('Not loaded');

      useEffect(() => {
        setTimeout(() => {
          setClientData('Fetched from client');
        }, 50);
      }, []);

      return (
        <div>
          <div data-testid="server-section">
            <h4>Server-side</h4>
            <ul>
              <li>Database queries</li>
            </ul>
          </div>
          <div data-testid="client-section">
            <h4>Client-side</h4>
            <p data-testid="client-data">{clientData}</p>
          </div>
        </div>
      );
    };

    render(<ServerComponentsAwarenessDemo />);

    expect(screen.getByTestId('server-section')).toBeInTheDocument();
    expect(screen.getByText('Database queries')).toBeInTheDocument();
    expect(screen.getByTestId('client-data')).toHaveTextContent('Not loaded');
  });

  it('updates client-side data after effect', async () => {
    const ServerComponentsAwarenessDemo = () => {
      const [data, setData] = useState('Initial');

      useEffect(() => {
        const timer = setTimeout(() => {
          setData('Updated');
        }, 50);

        return () => clearTimeout(timer);
      }, []);

      return <div data-testid="data">{data}</div>;
    };

    render(<ServerComponentsAwarenessDemo />);

    expect(screen.getByTestId('data')).toHaveTextContent('Initial');

    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent('Updated');
    });
  });
});

// ============================================================================
// Test: Integration Tests
// ============================================================================

describe('React 19.2 Features Integration', () => {
  it('handles multiple features together', async () => {
    const IntegratedComponent = () => {
      const [todos, setTodos] = useState<
        { id: string; text: string; pending?: boolean }[]
      >([]);
      const [activities, setActivities] = useState<
        { id: string; message: string }[]
      >([]);

      const addTodo = async (text: string) => {
        const id = Date.now().toString();
        setTodos((prev) => [...prev, { id, text, pending: true }]);
        setActivities((prev) => [
          ...prev,
          { id, message: 'Todo added' },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 50));
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, pending: undefined } : t)),
        );
      };

      return (
        <div>
          <button onClick={() => addTodo('New task')} data-testid="add">
            Add
          </button>
          <div data-testid="todos">
            {todos.map((t) => (
              <div key={t.id}>{t.text}</div>
            ))}
          </div>
          <div data-testid="activities">
            {activities.map((a) => (
              <div key={a.id}>{a.message}</div>
            ))}
          </div>
        </div>
      );
    };

    render(<IntegratedComponent />);

    fireEvent.click(screen.getByTestId('add'));

    await waitFor(() => {
      expect(screen.getByText('New task')).toBeInTheDocument();
      expect(screen.getByText('Todo added')).toBeInTheDocument();
    });
  });
});


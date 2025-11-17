import { useOptimistic, useState, useCallback } from 'react';
import type { JSX } from 'react';

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

export const UseOptimisticDemo = (): JSX.Element => {
  const [todos, setTodos] = useState<OptimisticItem[]>([
    { id: '1', text: 'Learn React 19.2', completed: false },
    { id: '2', text: 'Build playground', completed: true },
  ]);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic<OptimisticItem[], OptimisticItem>(todos, (state, newTodo) => [
    ...state,
    { ...newTodo, pending: true },
  ]);

  const handleAddTodo = useCallback(
    async (text: string) => {
      const newTodo: OptimisticItem = { id: Date.now().toString(), text, completed: false };

      try {
        await addOptimisticTodo(newTodo);
        const result = await addTodoAction(newTodo);
        setTodos((prev) => [...prev, result]);
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    },
    [addOptimisticTodo],
  );

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-purple-900">useOptimistic Hook</h3>
      <p className="text-sm text-purple-700">Optimistically update UI before server response</p>

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
                void handleAddTodo(input.value);
                input.value = '';
              }
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.getElementById('todo-input') as HTMLInputElement | null;
            if (input?.value.trim()) {
              void handleAddTodo(input.value);
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
            className={`flex items-center gap-3 p-3 rounded-md ${todo.pending ? 'bg-yellow-50 border border-yellow-300' : 'bg-white border border-gray-200'}`}
          >
            <input type="checkbox" checked={todo.completed} readOnly className="w-5 h-5 accent-purple-600" />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.text}</span>
            {todo.pending && <span className="text-xs text-yellow-700 ml-auto">pending...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};


import { trpc } from '@web/utils/trpc';

export function TodoItem({
                           id,
                           text,
                           done,
                           onChange,
                         }: {
  id: string;
  text: string;
  done: boolean;
  onChange: () => void;
}) {
  const toggleTodo = trpc.todos.toggle.useMutation({ onSuccess: onChange });
  const deleteTodo = trpc.todos.delete.useMutation({ onSuccess: onChange });

  return (
    <li className="flex justify-between items-center border p-2 rounded">
      <span
        className={`cursor-pointer ${done ? 'line-through text-gray-500' : ''}`}
        onClick={() => toggleTodo.mutate({ id })}
      >
        {text}
      </span>
      <button
        onClick={() => deleteTodo.mutate({ id })}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </li>
  );
}

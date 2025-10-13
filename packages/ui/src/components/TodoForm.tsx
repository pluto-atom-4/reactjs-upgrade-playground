import { useState } from 'react';
import { trpc } from '@web/utils/trpc';

export function TodoForm({ onAdd }: { onAdd: () => void }) {
  const [text, setText] = useState('');
  const addTodo = trpc.todos.add.useMutation({ onSuccess: onAdd });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo.mutate({ text });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 flex-grow"
        placeholder="Add a new todo"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}

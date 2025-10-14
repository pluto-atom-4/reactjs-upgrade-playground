import { TodoItem } from './TodoItem';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export function TodoList({
  todos,
  isLoading,
  onToggle,
  onDelete
}: {
  todos?: Todo[];
  isLoading?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {todos?.map((todo) => (
        <TodoItem key={todo.id} {...todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

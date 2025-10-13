import { trpc } from '@web/utils/trpc';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { data: todos, isLoading, refetch } = trpc.todos.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {todos?.map((todo) => (
        <TodoItem key={todo.id} {...todo} onChange={refetch} />
      ))}
    </ul>
  );
}

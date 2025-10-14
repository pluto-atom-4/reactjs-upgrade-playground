import { TodoForm, TodoList } from '@ui';
import { trpc } from './utils/trpc';

function App() {
  const { data: todos, isLoading, refetch } = trpc.todos.getAll.useQuery();
  const addTodo = trpc.todos.add.useMutation({ onSuccess: () => refetch() });
  const toggleTodo = trpc.todos.toggle.useMutation({ onSuccess: () => refetch() });
  const deleteTodo = trpc.todos.delete.useMutation({ onSuccess: () => refetch() });

  const handleAdd = (text: string) => {
    addTodo.mutate({ text });
  };

  const handleToggle = (id: string) => {
    toggleTodo.mutate({ id });
  };

  const handleDelete = (id: string) => {
    deleteTodo.mutate({ id });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 TODOs</h1>
      <TodoForm onAdd={handleAdd} />
      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;

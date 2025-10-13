import { TodoForm, TodoList } from '@ui';

function App() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 TODOs</h1>
      <TodoForm onAdd={() => {}} />
      <TodoList />
    </div>
  );
}


export default App;

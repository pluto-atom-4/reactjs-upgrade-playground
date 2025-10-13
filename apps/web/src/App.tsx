import { trpc } from './utils/trpc';

function App() {
  const health = trpc.health.status.useQuery();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">tRPC Health Check</h1>
      <p>Status: {health.data?.status ?? 'Loading...'}</p>
    </div>
  );
}

export default App;

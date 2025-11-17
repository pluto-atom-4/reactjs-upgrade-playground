import { useState, useEffect } from 'react';
import type { JSX } from 'react';

export const ServerComponentsAwarenessDemo = (): JSX.Element => {
  const [clientSideData, setClientSideData] = useState('Not loaded yet');

  useEffect(() => {
    const timer = setTimeout(() => {
      setClientSideData('Fetched from API at ' + new Date().toLocaleTimeString());
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-pink-900">React Server Components Awareness</h3>
      <p className="text-sm text-pink-700">Understand when code runs on server vs client</p>

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


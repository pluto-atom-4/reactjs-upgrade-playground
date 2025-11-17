import { useState, useCallback, useEffect, useRef } from 'react';
import type { JSX } from 'react';

export const UseEffectEventDemo = (): JSX.Element => {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<string[]>([]);

  const handleCountChange = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString();
    logRef.current = [...logRef.current, `Count changed to ${count} at ${timestamp}`];
    setLog([...logRef.current]);
  }, [count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCountChange();
    }, 1000);

    return () => clearTimeout(timer);
  }, [handleCountChange]);

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-indigo-900">useEffectEvent Pattern</h3>
      <p className="text-sm text-indigo-700">Separate event handling logic from effects</p>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <button onClick={() => setCount((c) => c + 1)} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700">
            Increment: {count}
          </button>
          <span className="text-sm text-indigo-700">(Changes auto-logged after 1s)</span>
        </div>

        <div className="bg-white border border-indigo-300 rounded-md p-3 h-40 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-gray-500 text-sm">Click the button to see logs...</p>
          ) : (
            <ul className="text-sm font-mono space-y-1">
              {log.map((entry, idx) => (
                <li key={idx} className="text-indigo-700">
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


import { forwardRef, useRef, useState, useCallback, useEffect, type JSX } from 'react';

/**
 * React 19: Ref Cleanup and Callback
 *
 * React 19 introduces a powerful new feature: refs can now accept a cleanup function.
 * When a ref is assigned a new value or the component unmounts, the cleanup function
 * runs automatically, allowing you to manage resources like event listeners,
 * timers, or subscriptions directly through the ref mechanism.
 *
 * Benefits:
 * - Automatic cleanup without useEffect
 * - Simpler resource management
 * - Cleaner component code
 * - No need for ref dependencies in effect hooks
 *
 * Key Features:
 * 1. Refs can be functions that return cleanup functions
 * 2. Cleanup functions are called when refs change or component unmounts
 * 3. Ref callbacks receive the DOM element as an argument
 * 4. Perfect for managing subscriptions, event listeners, and timers
 */

interface ResizeObserverState {
  width: number;
  height: number;
  isObserving: boolean;
}

/**
 * Custom component that demonstrates ref cleanup with ResizeObserver
 */
const ResizeableBox = forwardRef<
  HTMLDivElement,
  { onResize?: (size: { width: number; height: number }) => void }
>(({ onResize: _onResize }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full bg-linear-to-r from-rose-400 to-pink-400 rounded-lg p-8 text-white font-semibold text-center resize overflow-auto"
      style={{ minHeight: '150px', userSelect: 'none' }}
    >
      📦 Resize this box to see updates
    </div>
  );
});

ResizeableBox.displayName = 'ResizeableBox';

/**
 * Custom component with ref prop for managing interval
 */
const IntervalCounter = forwardRef<
  HTMLDivElement,
  { interval: number; onTick?: (count: number) => void }
>(({ interval, onTick: _onTick }, ref) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div
      ref={ref}
      className="bg-linear-to-r from-cyan-400 to-blue-400 rounded-lg p-6 text-white text-center font-semibold"
    >
      ⏱️ Interval Counter: {count}
    </div>
  );
});

IntervalCounter.displayName = 'IntervalCounter';

export const RefCleanupCallbackDemo = (): JSX.Element => {
  const [resizeState, setResizeState] = useState<ResizeObserverState>({
    width: 0,
    height: 0,
    isObserving: false,
  });

  const [eventLog, setEventLog] = useState<string[]>([]);
  const eventLogRef = useRef<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    eventLogRef.current = [logEntry, ...eventLogRef.current].slice(0, 10);
    setEventLog([...eventLogRef.current]);
  }, []);

  // Ref callback with cleanup for ResizeObserver
  const resizeBoxRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element) {
        // Cleanup when ref is set to null
        setResizeState((prev) => ({ ...prev, isObserving: false }));
        addLog('ResizeObserver cleanup: element removed');
        return;
      }

      addLog('ResizeObserver setup: monitoring element');
      setResizeState((prev) => ({ ...prev, isObserving: true }));

      // Create ResizeObserver
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setResizeState((prev) => ({ ...prev, width, height }));
          addLog(`Resized: ${Math.round(width)}×${Math.round(height)}`);
        }
      });

      resizeObserver.observe(element);

      // Return cleanup function
      return () => {
        addLog('ResizeObserver cleanup: observer disconnected');
        resizeObserver.disconnect();
      };
    },
    [addLog]
  );

  // Ref callback with cleanup for event listeners
  const eventBoxRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) {
      addLog('Event listeners cleanup: element removed');
      return;
    }

    const handleMouseEnter = () => {
      addLog('Mouse entered event box');
    };

    const handleMouseLeave = () => {
      addLog('Mouse left event box');
    };

    addLog('Event listeners attached');
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Return cleanup function that removes event listeners
    return () => {
      addLog('Event listeners cleanup: removed');
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [addLog]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-rose-900">Ref Cleanup & Callback</h3>
        <p className="text-sm text-rose-700 mt-2">
          React 19 allows refs to return cleanup functions for automatic resource management
        </p>
      </div>

      {/* ResizeObserver Example */}
      <div className="border-2 border-rose-300 rounded-lg p-6 bg-rose-50 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-rose-900">ResizeObserver Pattern</h4>
            <p className="text-sm text-rose-700">
              Cleanup runs automatically when ref changes or component unmounts
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              resizeState.isObserving
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {resizeState.isObserving ? '👁️ Observing' : '⏸️ Idle'}
          </span>
        </div>

        <ResizeableBox ref={resizeBoxRef} />

        {resizeState.width > 0 && (
          <div className="bg-white border border-rose-300 rounded-md p-3 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-rose-700">Width:</span>
              <span className="font-semibold">{Math.round(resizeState.width)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-700">Height:</span>
              <span className="font-semibold">{Math.round(resizeState.height)}px</span>
            </div>
          </div>
        )}
      </div>

      {/* Event Listeners Example */}
      <div className="border-2 border-rose-300 rounded-lg p-6 bg-rose-50 space-y-3">
        <div>
          <h4 className="text-lg font-semibold text-rose-900">Event Listener Cleanup</h4>
          <p className="text-sm text-rose-700">
            Hover over the box below - event listeners are attached via ref callback
          </p>
        </div>

        <div
          ref={eventBoxRef}
          className="w-full bg-linear-to-r from-purple-400 to-pink-400 rounded-lg p-8 text-white font-semibold text-center cursor-pointer transition-transform hover:scale-105"
        >
          👆 Hover to trigger event listeners
        </div>
      </div>

      {/* Event Log */}
      <div className="border-2 border-rose-300 rounded-lg p-6 bg-rose-50 space-y-3">
        <h4 className="text-lg font-semibold text-rose-900">Event Log</h4>
        <div className="bg-white border border-rose-300 rounded-md p-3 h-48 overflow-y-auto font-mono text-xs">
          {eventLog.length === 0 ? (
            <p className="text-gray-500">Waiting for events...</p>
          ) : (
            <div className="space-y-1">
              {eventLog.map((log, idx) => (
                <div key={idx} className="text-rose-700">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Key Features */}
      <div className="border-2 border-rose-300 rounded-lg p-6 bg-rose-50 space-y-3">
        <h4 className="text-lg font-semibold text-rose-900">Key Features</h4>
        <ul className="space-y-2 text-sm text-rose-700">
          <li className="flex items-start gap-2">
            <span className="text-lg">✓</span>
            <span>
              <strong>Automatic Cleanup:</strong> Cleanup functions run when refs change or
              components unmount
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lg">✓</span>
            <span>
              <strong>Resource Management:</strong> Perfect for managing ResizeObserver, event
              listeners, subscriptions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lg">✓</span>
            <span>
              <strong>No useEffect Needed:</strong> Resource cleanup happens directly in refs
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lg">✓</span>
            <span>
              <strong>Simpler Patterns:</strong> Eliminates dependency array complications with
              useEffect
            </span>
          </li>
        </ul>
      </div>

      {/* Code Example */}
      <div className="border-2 border-rose-300 rounded-lg p-6 bg-rose-50 space-y-3">
        <h4 className="text-lg font-semibold text-rose-900">Code Pattern</h4>
        <pre className="bg-white border border-rose-300 rounded-md p-4 overflow-x-auto text-xs font-mono text-gray-800">
{`// Ref callback that returns a cleanup function
const myRef = useCallback((element: HTMLDivElement | null) => {
  if (!element) return; // Element removed

  // Setup resources
  const observer = new ResizeObserver(() => { /* ... */ });
  observer.observe(element);

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}, []);

// Use in component
<div ref={myRef}>Content</div>`}
        </pre>
      </div>
    </div>
  );
};


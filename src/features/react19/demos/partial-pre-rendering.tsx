import { useState, useEffect } from 'react';
import type { JSX } from 'react';

const StaticContent = (): JSX.Element => (
  <div className="bg-white border border-gray-300 rounded-md p-4">
    <h4 className="font-bold text-gray-900">Static Content</h4>
    <p className="text-sm text-gray-600">This content is pre-rendered at build time and cached.</p>
  </div>
);

const DynamicContent = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white border ${isLoading ? 'border-yellow-300' : 'border-green-300'} rounded-md p-4`}>
      <h4 className="font-bold text-gray-900">Dynamic Content</h4>
      {isLoading ? (
        <p className="text-sm text-yellow-700">Loading from server...</p>
      ) : (
        <p className="text-sm text-green-700">✓ Loaded! Current time: {new Date().toLocaleTimeString()}</p>
      )}
    </div>
  );
};

export const PartialPreRenderingDemo = (): JSX.Element => (
  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-4">
    <h3 className="text-xl font-bold text-orange-900">Partial Pre-rendering (PPR) Concept</h3>
    <p className="text-sm text-orange-700">Combine static and dynamic content in a single page</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StaticContent />
      <DynamicContent />
    </div>

    <div className="bg-orange-100 border border-orange-300 rounded-md p-3 text-sm text-orange-700">
      <strong>PPR Benefits:</strong>
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Faster initial page load (static parts cached)</li>
        <li>Dynamic parts stream in after initial render</li>
        <li>Better Core Web Vitals scores</li>
      </ul>
    </div>
  </div>
);


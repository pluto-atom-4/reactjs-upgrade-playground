'use client';

import { useDeferredValue, useState } from 'react';
import type { JSX } from 'react';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

export const UseDeferredValueDemo = (): JSX.Element => {
  const [searchInput, setSearchInput] = useState('');

  // useDeferredValue with initial value - defers updates to the search input
  const deferredSearchInput = useDeferredValue(searchInput, 'React');

  const allResults: SearchResult[] = [
    { id: 1, title: 'React Basics', description: 'Learn the fundamentals of React' },
    { id: 2, title: 'React Hooks', description: 'Master React hooks and state management' },
    { id: 3, title: 'React Performance', description: 'Optimize your React applications' },
    { id: 4, title: 'React 19 Features', description: 'Explore new React 19 capabilities' },
    { id: 5, title: 'Server Components', description: 'Build with React Server Components' },
    { id: 6, title: 'Next.js Framework', description: 'Full-stack React framework' },
    { id: 7, title: 'TypeScript with React', description: 'Type-safe React development' },
    { id: 8, title: 'State Management', description: 'Redux, Zustand, and more' },
    { id: 9, title: 'React Testing', description: 'Unit and integration testing' },
    { id: 10, title: 'React Native', description: 'Build mobile apps with React' },
    { id: 11, title: 'CSS-in-JS Solutions', description: 'Styled Components and Tailwind' },
    { id: 12, title: 'GraphQL with React', description: 'Apollo Client and React integration' },
  ];

  const filteredResults = allResults.filter(
    (result) =>
      result.title.toLowerCase().includes(deferredSearchInput.toLowerCase()) ||
      result.description.toLowerCase().includes(deferredSearchInput.toLowerCase()),
  );

  const isSearching = searchInput !== deferredSearchInput;

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-purple-900">useDeferredValue with Initial Value</h3>
      <p className="text-sm text-purple-700">
        Defers search input updates for smooth filtering - initial value is "React"
      </p>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search documentation..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-purple-700">
          <span>
            Search term: <strong>"{deferredSearchInput}"</strong>
          </span>
          {isSearching && (
            <span className="text-yellow-600 font-semibold animate-pulse">Searching...</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500 text-sm">No results found for "{deferredSearchInput}"</p>
              <p className="text-gray-400 text-xs mt-2">Try searching for "React", "Hooks", or "Performance"</p>
            </div>
          ) : (
            filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white border border-purple-200 rounded-md p-3 hover:shadow-md hover:border-purple-400 transition-all cursor-pointer"
              >
                <h4 className="font-semibold text-purple-900 text-sm">{result.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{result.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-purple-100 border border-purple-300 rounded-md p-3 text-sm text-purple-700 space-y-2">
          <strong>How it works:</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Input updates immediately (urgent) - you see your typing instantly
            </li>
            <li>
              Search filtering defers (non-urgent) - renders behind the scenes without blocking input
            </li>
            <li>
              Initial value "React" is used until you start typing
            </li>
            <li>
              Smooth UX: no janky input lag during heavy filtering
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-300 rounded-md p-3 text-sm text-blue-700">
          <strong>Current state:</strong>
          <div className="mt-2 font-mono text-xs space-y-1">
            <div>Input value: <span className="text-blue-900">"{searchInput}"</span></div>
            <div>Deferred value: <span className="text-blue-900">"{deferredSearchInput}"</span></div>
            <div>Results: <span className="text-blue-900">{filteredResults.length}</span></div>
            <div>Is searching: <span className="text-blue-900">{isSearching ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};


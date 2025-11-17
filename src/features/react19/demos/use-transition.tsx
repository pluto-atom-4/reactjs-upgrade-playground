import { useTransition, useState, useCallback } from 'react';
import type { JSX } from 'react';

interface ListItem {
  id: number;
  name: string;
  category: string;
}

export const UseStartTransitionDemo = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [isPending, startTransitionAction] = useTransition();

  const allItems: ListItem[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i} - ${['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'][i % 5]}`,
    category: ['Fruits', 'Vegetables', 'Grains'][i % 3],
  }));

  const [filteredItems, setFilteredItems] = useState<ListItem[]>(allItems);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      startTransitionAction(() => {
        const filtered = allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredItems(filtered);
      });
    },
    [allItems, startTransitionAction],
  );

  return (
    <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-cyan-900">useTransition + startTransition</h3>
      <p className="text-sm text-cyan-700">Separate urgent updates (input) from non-urgent updates (filtering)</p>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search items (type to filter 10,000 items)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {isPending && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-cyan-600 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-cyan-700">
          <span>
            Results: <strong>{filteredItems.length}</strong> of <strong>{allItems.length}</strong>
          </span>
          {isPending && <span className="text-yellow-600 font-semibold">Updating...</span>}
        </div>

        <div className="bg-white border border-cyan-300 rounded-md p-3 h-64 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No items found matching "{query}"</p>
          ) : (
            <ul className="text-sm space-y-1">
              {filteredItems.slice(0, 50).map((item) => (
                <li key={item.id} className="p-2 hover:bg-cyan-100 rounded flex justify-between">
                  <span className="text-gray-800">{item.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{item.category}</span>
                </li>
              ))}
              {filteredItems.length > 50 && (
                <li className="p-2 text-gray-500 text-xs italic text-center">... and {filteredItems.length - 50} more results</li>
              )}
            </ul>
          )}
        </div>

        <div className="bg-cyan-100 border border-cyan-300 rounded-md p-3 text-sm text-cyan-700">
          <strong>How it works:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Typing input is urgent (updates immediately)</li>
            <li>Filtering large list is non-urgent (can be interrupted)</li>
            <li>UI stays responsive even during heavy filtering</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


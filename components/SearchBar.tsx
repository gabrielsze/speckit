'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce: wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search events by title or description..."
          className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

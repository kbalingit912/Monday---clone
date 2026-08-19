import { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => onSearch(value), 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="flex gap-2 items-center flex-1 max-w-sm">
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={handleChange}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && (
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}

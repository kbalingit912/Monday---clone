export function FilterBar({ filters, onFilterChange }) {
  const handlePriorityChange = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    onFilterChange({ ...filters, priority: newPriorities });
  };

  const handleAssigneeChange = (e) => {
    onFilterChange({ ...filters, assignee: e.target.value });
  };

  const handleDueDateChange = (e) => {
    onFilterChange({ ...filters, dueDate: e.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({ priority: [], assignee: '', dueDate: '' });
  };

  const activeFilterCount = filters.priority.length + (filters.assignee ? 1 : 0) + (filters.dueDate ? 1 : 0);

  return (
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex gap-2 items-center flex-wrap md:gap-4 overflow-x-auto">
      <div className="flex gap-2">
        {['low', 'medium', 'high', 'urgent'].map(priority => (
          <button
            key={priority}
            onClick={() => handlePriorityChange(priority)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filters.priority.includes(priority)
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Filter by assignee..."
        value={filters.assignee}
        onChange={handleAssigneeChange}
        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={filters.dueDate}
        onChange={handleDueDateChange}
        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Dates</option>
        <option value="overdue">Overdue</option>
        <option value="today">Today</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
      </select>

      {activeFilterCount > 0 && (
        <button
          onClick={handleClearFilters}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Clear ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

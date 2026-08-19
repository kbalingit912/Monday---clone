export function ViewSwitcher({ currentView, onViewChange }) {
  const views = ['Kanban', 'Gantt', 'Calendar'];

  return (
    <div className="flex gap-1 md:gap-2 mb-4 border-b border-gray-200 overflow-x-auto">
      {views.map(view => (
        <button
          key={view}
          onClick={() => onViewChange(view.toLowerCase())}
          className={`px-3 md:px-4 py-2 font-medium transition-colors text-sm md:text-base whitespace-nowrap ${
            currentView === view.toLowerCase()
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {view}
        </button>
      ))}
    </div>
  );
}

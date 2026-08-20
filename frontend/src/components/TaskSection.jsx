import { useState } from 'react';
import { TaskCardNew } from './TaskCardNew';

export function TaskSection({ title, tasks, column, count, onUpdate, onDelete, onAddTask }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const completed = tasks.filter((t) => t.status === 'done' || column?.name === 'Done').length;

  return (
    <div className="mb-6">
      {/* Section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-3 w-full text-gray-900 hover:text-gray-600"
      >
        <span className={`transform transition ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>▼</span>
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-gray-600 ml-auto">
          {completed} / {count || tasks.length}
        </span>
      </button>

      {/* Task list */}
      {isExpanded && (
        <div>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCardNew
                key={task.id}
                task={task}
                column={column}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm italic py-4">No tasks yet</p>
          )}

          {/* Add task button */}
          <button
            onClick={() => {
              console.log('Add task clicked, onAddTask:', typeof onAddTask);
              if (typeof onAddTask === 'function') {
                onAddTask();
              } else {
                console.error('onAddTask is not a function:', onAddTask);
              }
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2"
          >
            + Add task
          </button>
        </div>
      )}
    </div>
  );
}

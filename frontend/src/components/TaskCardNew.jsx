import { useState } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';

const STATUS_COLORS = {
  done: 'bg-green-100 text-green-800',
  'not-started': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-800',
};

const PRIORITY_COLORS = {
  low: 'text-blue-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

export function TaskCardNew({ task, column, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTaskStatus = () => {
    if (column?.name === 'Done') return 'done';
    if (column?.name === 'In Progress') return 'in-progress';
    return 'not-started';
  };

  const getStatusLabel = () => {
    const status = getTaskStatus();
    return status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isOverdue = date < today;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return { text: `${day}/${month}/${year}`, isOverdue, isToday };
  };

  const dueDate = formatDate(task.due_date);
  const status = getTaskStatus();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition text-left mb-3"
      >
        {/* Title */}
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h4>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{task.description}</p>
        )}

        {/* Metadata row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[status]}`}>
              {getStatusLabel()}
            </span>

            {/* Priority indicator */}
            {task.priority && (
              <span className={`text-lg ${PRIORITY_COLORS[task.priority]}`}>●</span>
            )}
          </div>

          {/* Due date */}
          {dueDate && (
            <div className={`text-xs font-medium ${dueDate.isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              {dueDate.text}
            </div>
          )}
        </div>

        {/* Labels */}
        {task.labels && Array.isArray(task.labels) && task.labels.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-3">
            {task.labels.slice(0, 3).map((label, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: label.color || '#3b82f6' }}
              >
                {label.name || label}
              </span>
            ))}
          </div>
        )}
      </button>

      {isModalOpen && (
        <TaskDetailsModal
          task={task}
          columnId={column?.id}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

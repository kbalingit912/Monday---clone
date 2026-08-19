import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

function getDueDateStatus(dueDate) {
  if (!dueDate) return null;
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  const in3Days = new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0];

  if (dueDate < today) return { text: 'Overdue', color: 'bg-red-100 text-red-800' };
  if (dueDate === today) return { text: 'Today', color: 'bg-orange-100 text-orange-800' };
  if (dueDate <= in3Days) return { text: dueDate, color: 'bg-gray-100 text-gray-800' };
  return null;
}

export function TaskCard({ task, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dueDateStatus = getDueDateStatus(task.due_date);

  const handleClick = (e) => {
    if (e.detail === 2) {  // Double click
      e.stopPropagation();
      onEdit?.(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow hover:border-blue-300"
    >
      <p className="text-sm text-gray-800 font-medium mb-2">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
      )}

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {/* Priority badge */}
        {task.priority && (
          <span className={`text-xs px-2 py-1 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}

        {/* Due date */}
        {dueDateStatus && (
          <span className={`text-xs px-2 py-1 rounded font-medium ${dueDateStatus.color}`}>
            {dueDateStatus.text}
          </span>
        )}

        {/* Assignee */}
        {task.assignee && (
          <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 font-medium">
            {task.assignee}
          </span>
        )}
      </div>

      {/* Tags */}
      {(() => {
        const labels = Array.isArray(task.labels) ? task.labels : (typeof task.labels === 'string' ? JSON.parse(task.labels) : []);
        return labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {labels.map((label, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        );
      })()}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-xs text-red-500 hover:text-red-700 mt-2"
        >
          Delete
        </button>
      )}
    </div>
  );
}

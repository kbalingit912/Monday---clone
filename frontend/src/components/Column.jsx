import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

export function Column({ column, onAddTask, onDeleteTask, onEditTask }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await onAddTask(column.id, newTaskTitle, '');
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4">{column.name}</h3>

      <div
        ref={setNodeRef}
        className="space-y-2 min-h-[400px] bg-white rounded p-2 border-2 border-dashed border-gray-200"
      >
        <SortableContext
          items={column.tasks?.map(t => t.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task.id)}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
      </div>

      <div className="mt-3">
        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setNewTaskTitle('');
                  setIsAdding(false);
                }
              }}
              autoFocus
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleAddTask}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewTaskTitle('');
                setIsAdding(false);
              }}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors text-sm"
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}

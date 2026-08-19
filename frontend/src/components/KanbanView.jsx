import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { tasksAPI } from '../api';

export function KanbanView({ board, onEditTask, onDeleteTask, onRefresh }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTask = async (columnId, title, description) => {
    try {
      const taskCount = board.columns
        .find(c => c.id === columnId)
        ?.tasks?.length || 0;
      await tasksAPI.create(columnId, title, description, taskCount);
      onRefresh();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask?.(taskId);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    try {
      const task = findTask(active.id);
      if (task) {
        const newColumnId = over.id;
        await tasksAPI.update(
          task.id,
          task.title,
          task.description || '',
          newColumnId,
          0
        );
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  const findTask = (taskId) => {
    for (const column of board.columns) {
      const task = column.tasks?.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-6 space-x-4">
        <div className="inline-flex gap-4">
          {board.columns?.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={onEditTask}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

import { useState, useEffect } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { TaskSection } from './TaskSection';
import { TaskDetailsModal } from './TaskDetailsModal';
import { Toast } from './Toast';
import { boardsAPI, tasksAPI } from '../api';
import { SearchBar } from './SearchBar';
import { ViewSwitcher } from './ViewSwitcher';
import { KanbanView } from './KanbanView';
import { GanttView } from './GanttView';
import { CalendarView } from './CalendarView';

export function BoardContent({ board, project, onBack, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState(board);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentView, setCurrentView] = useState('sections');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBoard();
  }, [board.id]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      const response = await boardsAPI.getById(board.id);
      setBoardData(response.data);
    } catch (err) {
      console.error('Failed to load board:', err);
      showToast('Failed to load board', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.delete(taskId);
      showToast('Task deleted successfully', 'success');
      await loadBoard();
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast('Failed to delete task', 'error');
    }
  };

  // Get tasks by column
  const getTasksByColumn = (columnName) => {
    const column = boardData?.columns?.find((c) => c.name === columnName);
    if (!column) return [];
    return boardData?.tasks?.filter((t) => t.column_id === column.id) || [];
  };

  // Count done tasks
  const allTasks = boardData?.tasks || [];
  const doneTasks = getTasksByColumn('Done');
  const todoTasks = getTasksByColumn('To Do');
  const inProgressTasks = getTasksByColumn('In Progress');

  // Calculate overdue count
  const overdueCount = allTasks.filter((t) => {
    const due = new Date(t.due_date);
    return t.due_date && due < new Date() && !doneTasks.find((d) => d.id === t.id);
  }).length;

  const renderView = () => {
    switch (currentView) {
      case 'gantt':
        return <GanttView board={boardData} onEditTask={setSelectedTask} onRefresh={loadBoard} />;
      case 'calendar':
        return <CalendarView board={boardData} onEditTask={setSelectedTask} onRefresh={loadBoard} />;
      case 'kanban':
        return (
          <KanbanView
            board={boardData}
            onEditTask={setSelectedTask}
            onDeleteTask={handleDeleteTask}
            onRefresh={loadBoard}
          />
        );
      case 'sections':
      default:
        return (
          <div className="flex-1 overflow-y-auto p-6">
            <ProgressIndicator
              completed={doneTasks.length}
              total={allTasks.length}
              overdue={overdueCount}
            />

            <TaskSection
              title="To do"
              tasks={todoTasks}
              column={boardData?.columns?.find((c) => c.name === 'To Do')}
              count={todoTasks.length}
              onUpdate={(task) => {
                setSelectedTask(task);
              }}
              onDelete={handleDeleteTask}
              onAddTask={() => {
                // Create new task in To Do column
                const column = boardData?.columns?.find((c) => c.name === 'To Do');
                if (column) {
                  setSelectedTask({
                    id: 'new',
                    title: '',
                    description: '',
                    column_id: column.id,
                    priority: 'medium',
                  });
                }
              }}
            />

            <TaskSection
              title="In Progress"
              tasks={inProgressTasks}
              column={boardData?.columns?.find((c) => c.name === 'In Progress')}
              count={inProgressTasks.length}
              onUpdate={setSelectedTask}
              onDelete={handleDeleteTask}
            />

            <TaskSection
              title="Done"
              tasks={doneTasks}
              column={boardData?.columns?.find((c) => c.name === 'Done')}
              count={doneTasks.length}
              onUpdate={setSelectedTask}
              onDelete={handleDeleteTask}
            />
          </div>
        );
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading board...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium mb-2"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-bold text-gray-900">{boardData?.name}</h2>
          </div>
          <SearchBar onSearch={() => {}} />
        </div>
      </div>

      {/* View Switcher */}
      <div className="border-b border-gray-200 px-6 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('sections')}
            className={`px-3 py-2 rounded-lg transition ${
              currentView === 'sections'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setCurrentView('kanban')}
            className={`px-3 py-2 rounded-lg transition ${
              currentView === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setCurrentView('gantt')}
            className={`px-3 py-2 rounded-lg transition ${
              currentView === 'gantt'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Gantt
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`px-3 py-2 rounded-lg transition ${
              currentView === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Content */}
      {renderView()}

      {/* Modals */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          projectId={project?.id}
          onClose={() => setSelectedTask(null)}
          onSave={async () => {
            await loadBoard();
            setSelectedTask(null);
            showToast('Task saved successfully', 'success');
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';
import { ViewSwitcher } from './ViewSwitcher';
import { FilterBar } from './FilterBar';
import { SearchBar } from './SearchBar';
import { Toast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import { KanbanView } from './KanbanView';
import { GanttView } from './GanttView';
import { CalendarView } from './CalendarView';
import { boardsAPI, tasksAPI } from '../api';
import { applyFilters } from '../utils/filterUtils';

export function Board({ boardId, onBack, projectId }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tags, setTags] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [currentView, setCurrentView] = useState('kanban');
  const [filters, setFilters] = useState({
    priority: [],
    assignee: '',
    dueDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const filteredBoard = useMemo(() => applyFilters(board, filters, searchQuery), [board, filters, searchQuery]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleDeleteTask = async (taskId) => {
    setConfirmDialog({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await tasksAPI.delete(taskId);
          setConfirmDialog(null);
          showToast('Task deleted successfully', 'success');
          await loadBoard();
        } catch (err) {
          showToast('Failed to delete task', 'error');
          console.error('Failed to delete task:', err);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  useEffect(() => {
    loadBoard();
    loadMetadata();
  }, [boardId, projectId]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      const response = await boardsAPI.getById(boardId);
      setBoard(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load board');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    if (!projectId) return;
    try {
      const [tagsRes, assigneesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${projectId}/tags`).then(r => r.json()),
        fetch(`http://localhost:5000/api/projects/${projectId}/assignees`).then(r => r.json())
      ]);
      setTags(tagsRes);
      setAssignees(assigneesRes);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = async () => {
    await loadBoard();
    setSelectedTask(null);
    showToast('Task saved successfully', 'success');
  };

  if (loading) return <div className="p-8">Loading board...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!board) return <div className="p-8">Board not found</div>;

  const renderView = () => {
    switch (currentView) {
      case 'gantt':
        return <GanttView board={filteredBoard} onEditTask={handleEditTask} onRefresh={loadBoard} />;
      case 'calendar':
        return <CalendarView board={filteredBoard} onEditTask={handleEditTask} onRefresh={loadBoard} />;
      case 'kanban':
      default:
        return <KanbanView board={filteredBoard} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} onRefresh={loadBoard} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center md:justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
        >
          ← Back
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{board.name}</h1>
        <div className="flex-1 md:flex-initial">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      <div className="bg-white px-6 py-2 border-b border-gray-200">
        <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {renderView()}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          projectId={projectId}
          tags={tags}
          assignees={assignees}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel={confirmDialog.cancelLabel}
          isDangerous={confirmDialog.isDangerous}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}

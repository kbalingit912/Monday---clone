import { useState, useEffect } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';
import { Toast } from './Toast';
import { boardsAPI, tasksAPI } from '../api';
import { SearchBar } from './SearchBar';
import { TasksListView } from './TasksListView';
import { CalendarView } from './CalendarView';

export function BoardContent({ board, project, onBack, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState(board);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentView, setCurrentView] = useState('sections');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(boardData?.name || '');

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

  const handleSaveBoardName = async () => {
    if (!editedName.trim()) {
      showToast('Board name cannot be empty', 'error');
      return;
    }

    try {
      await boardsAPI.update(boardData.id, editedName);
      const updatedBoardData = { ...boardData, name: editedName };
      setBoardData(updatedBoardData);
      setIsEditingName(false);
      showToast('Board renamed successfully', 'success');
      // Refresh parent to update sidebar
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to rename board:', err);
      showToast('Failed to rename board', 'error');
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
      case 'calendar':
        return <CalendarView board={boardData} onEditTask={setSelectedTask} onRefresh={loadBoard} />;
      case 'sections':
      default:
        return (
          <TasksListView
            board={boardData}
            onEditTask={setSelectedTask}
            onDeleteTask={handleDeleteTask}
            onRefresh={loadBoard}
          />
        );
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading board...</div>;
  }

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ borderBottomColor: '#e5e7eb', borderBottomWidth: '1px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <button
              onClick={onBack}
              style={{ color: '#4b5563', fontWeight: '500', marginBottom: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              onMouseEnter={(e) => (e.target.style.color = '#111827')}
              onMouseLeave={(e) => (e.target.style.color = '#4b5563')}
            >
              ← Back
            </button>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#111827',
                    border: '2px solid #2563eb',
                    borderRadius: '6px',
                    padding: '8px',
                    maxWidth: '400px',
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveBoardName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                />
                <button
                  onClick={handleSaveBoardName}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setEditedName(boardData?.name);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{boardData?.name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#2563eb',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#dbeafe')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  title="Edit board name"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <SearchBar onSearch={() => {}} />
        </div>
      </div>

      {/* View Switcher */}
      <div style={{ borderBottomColor: '#e5e7eb', borderBottomWidth: '1px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['sections', 'calendar'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                background: currentView === view ? '#2563eb' : 'transparent',
                color: currentView === view ? '#ffffff' : '#4b5563',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                if (currentView !== view) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== view) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
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

import { useState } from 'react';
import { tasksAPI } from '../api';

const STATUS_COLORS = {
  'To Do': '#9ca3af',
  'In Progress': '#f59e0b',
  'Done': '#10b981'
};

const PRIORITY_COLORS = {
  'low': '#3b82f6',
  'medium': '#f59e0b',
  'high': '#f97316',
  'urgent': '#ef4444'
};

export function TasksListView({ board, onEditTask, onDeleteTask, onRefresh }) {
  const [expandedNotes, setExpandedNotes] = useState({});

  const allTasks = board?.columns?.flatMap(col =>
    (col.tasks || []).map(task => ({ ...task, column_name: col.name }))
  ) || [];

  const getColumnColor = (columnName) => STATUS_COLORS[columnName] || '#6b7280';
  const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || '#6b7280';

  const getNextDueDate = (currentDate, pattern) => {
    const date = new Date(currentDate);
    switch (pattern) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'fortnight':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const handleComplete = async (task) => {
    const doneColumn = board.columns.find(c => c.name === 'Done');
    const todoColumn = board.columns.find(c => c.name === 'To Do');

    if (doneColumn && task.column_name !== 'Done') {
      try {
        // Move current task to Done
        await tasksAPI.update(task.id, task.title, task.description, doneColumn.id, 0, {
          priority: task.priority,
          assignee: task.assignee,
          due_date: task.due_date,
          labels: task.labels,
          is_recurring: task.is_recurring,
          recurrence_pattern: task.recurrence_pattern,
          recurrence_end_date: task.recurrence_end_date
        });

        // If task is recurring, create next instance
        if (task.is_recurring && task.recurrence_pattern && todoColumn) {
          const nextDate = getNextDueDate(task.due_date, task.recurrence_pattern);

          // Check if recurrence should end
          if (!task.recurrence_end_date || new Date(nextDate) <= new Date(task.recurrence_end_date)) {
            await tasksAPI.create(
              todoColumn.id,
              task.title,
              task.description,
              0,
              {
                priority: task.priority,
                assignee: task.assignee,
                due_date: nextDate,
                labels: task.labels,
                is_recurring: 1,
                recurrence_pattern: task.recurrence_pattern,
                recurrence_end_date: task.recurrence_end_date
              }
            );
          }
        }

        await onRefresh?.();
      } catch (err) {
        console.error('Failed to mark task complete:', err);
      }
    }
  };

  const toggleNote = (taskId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await tasksAPI.update(task.id, task.title, task.description, task.column_id, task.position, {
        priority: task.priority,
        status: newStatus,
        assignee: task.assignee,
        due_date: task.due_date,
        labels: task.labels,
        is_recurring: task.is_recurring,
        recurrence_pattern: task.recurrence_pattern,
        recurrence_end_date: task.recurrence_end_date
      });
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'not started':
        return '#f3f4f6';
      case 'in progress':
        return '#fef3c7';
      case 'stuck':
        return '#fee2e2';
      case 'done':
        return '#d1fae5';
      default:
        return '#f3f4f6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'not started':
        return '#4b5563';
      case 'in progress':
        return '#92400e';
      case 'stuck':
        return '#991b1b';
      case 'done':
        return '#065f46';
      default:
        return '#4b5563';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  const getDaysUntilDue = (dateStr) => {
    if (!dateStr) return null;
    const dueDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Group tasks by column
  const tasksByColumn = {};
  board?.columns?.forEach(col => {
    tasksByColumn[col.name] = col.tasks || [];
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* To Do Column */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>v</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>To do</span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>{tasksByColumn['To Do']?.length || 0} / {tasksByColumn['To Do']?.length || 0}</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <tbody>
            {(tasksByColumn['To Do'] || []).map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #e5e7eb', hover: { backgroundColor: '#f3f4f6' } }}>
                {/* Checkbox */}
                <td style={{ padding: '12px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={() => handleComplete(task)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>

                {/* Task Title */}
                <td style={{ padding: '12px 16px', flex: 1 }}>
                  <div>
                    <button
                      onClick={() => onEditTask(task)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textDecoration: 'underline' }}
                    >
                      {task.title}
                    </button>
                  </div>
                  {task.description && (
                    <button
                      onClick={() => toggleNote(task.id)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', marginTop: '4px', textDecoration: 'underline' }}
                    >
                      {expandedNotes[task.id] ? '- Hide note' : '+ View note'}
                    </button>
                  )}
                  {expandedNotes[task.id] && (
                    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '13px', color: '#4b5563' }}>
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td style={{ padding: '12px 16px', width: '140px', textAlign: 'center' }}>
                  <select
                    value={task.status || 'not started'}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getStatusBgColor(task.status || 'not started'),
                      color: getStatusTextColor(task.status || 'not started'),
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    <option value="not started">Not started</option>
                    <option value="in progress">In progress</option>
                    <option value="stuck">Stuck</option>
                    <option value="done">Done</option>
                  </select>
                </td>

                {/* Due Date */}
                <td style={{ padding: '12px 16px', width: '100px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(task.due_date)}
                </td>

                {/* Days/Priority */}
                <td style={{ padding: '12px 16px', width: '80px', textAlign: 'center' }}>
                  {getDaysUntilDue(task.due_date) !== null && (
                    <span style={{ fontSize: '12px', fontWeight: '500', color: getDaysUntilDue(task.due_date) < 0 ? '#ef4444' : '#6b7280' }}>
                      {getDaysUntilDue(task.due_date) > 0 ? '📅 ' : '🔴 '}{Math.abs(getDaysUntilDue(task.due_date))}d
                    </span>
                  )}
                </td>

                {/* Priority */}
                <td style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: getPriorityColor(task.priority), textTransform: 'capitalize' }}>
                    {task.priority}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!tasksByColumn['To Do'] || tasksByColumn['To Do'].length === 0) && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No tasks in To Do
          </div>
        )}

        <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
          <button
            onClick={() => {
              const column = board.columns.find(c => c.name === 'To Do');
              if (column) {
                onEditTask({
                  id: 'new',
                  title: '',
                  description: '',
                  column_id: column.id,
                  priority: 'medium',
                });
              }
            }}
            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0' }}
          >
            + Add task
          </button>
        </div>
      </div>

      {/* In Progress Column */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>v</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>In Progress</span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>{tasksByColumn['In Progress']?.length || 0} / {tasksByColumn['In Progress']?.length || 0}</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <tbody>
            {(tasksByColumn['In Progress'] || []).map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={() => handleComplete(task)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '12px 16px', flex: 1 }}>
                  <button
                    onClick={() => onEditTask(task)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textDecoration: 'underline' }}
                  >
                    {task.title}
                  </button>
                  {task.description && (
                    <button
                      onClick={() => toggleNote(task.id)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', marginTop: '4px', marginLeft: '0px', textDecoration: 'underline', display: 'block' }}
                    >
                      {expandedNotes[task.id] ? '- Hide note' : '+ View note'}
                    </button>
                  )}
                  {expandedNotes[task.id] && (
                    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '13px', color: '#4b5563' }}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px', width: '140px', textAlign: 'center' }}>
                  <select
                    value={task.status || 'in progress'}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getStatusBgColor(task.status || 'in progress'),
                      color: getStatusTextColor(task.status || 'in progress'),
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    <option value="not started">Not started</option>
                    <option value="in progress">In progress</option>
                    <option value="stuck">Stuck</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', width: '100px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(task.due_date)}
                </td>
                <td style={{ padding: '12px 16px', width: '80px', textAlign: 'center' }}>
                  {getDaysUntilDue(task.due_date) !== null && (
                    <span style={{ fontSize: '12px', fontWeight: '500', color: getDaysUntilDue(task.due_date) < 0 ? '#ef4444' : '#6b7280' }}>
                      {getDaysUntilDue(task.due_date) > 0 ? '📅 ' : '🔴 '}{Math.abs(getDaysUntilDue(task.due_date))}d
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: getPriorityColor(task.priority), textTransform: 'capitalize' }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!tasksByColumn['In Progress'] || tasksByColumn['In Progress'].length === 0) && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No tasks in progress
          </div>
        )}

        <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
          <button
            onClick={() => {
              const column = board.columns.find(c => c.name === 'In Progress');
              if (column) {
                onEditTask({
                  id: 'new',
                  title: '',
                  description: '',
                  column_id: column.id,
                  priority: 'medium',
                });
              }
            }}
            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0' }}
          >
            + Add task
          </button>
        </div>
      </div>

      {/* Done Column */}
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>v</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Done</span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>{tasksByColumn['Done']?.length || 0} / {tasksByColumn['Done']?.length || 0}</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <tbody>
            {(tasksByColumn['Done'] || []).map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #e5e7eb', opacity: '0.7' }}>
                <td style={{ padding: '12px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '12px 16px', flex: 1 }}>
                  <button
                    onClick={() => onEditTask(task)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textDecoration: 'line-through' }}
                  >
                    {task.title}
                  </button>
                </td>
                <td style={{ padding: '12px 16px', width: '140px', textAlign: 'center' }}>
                  <select
                    value={task.status || 'done'}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getStatusBgColor(task.status || 'done'),
                      color: getStatusTextColor(task.status || 'done'),
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    <option value="not started">Not started</option>
                    <option value="in progress">In progress</option>
                    <option value="stuck">Stuck</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', width: '100px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(task.due_date)}
                </td>
                <td style={{ padding: '12px 16px', width: '80px', textAlign: 'center' }}></td>
                <td style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: getPriorityColor(task.priority), textTransform: 'capitalize' }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!tasksByColumn['Done'] || tasksByColumn['Done'].length === 0) && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No completed tasks
          </div>
        )}

        <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
          <button
            onClick={() => {
              const column = board.columns.find(c => c.name === 'Done');
              if (column) {
                onEditTask({
                  id: 'new',
                  title: '',
                  description: '',
                  column_id: column.id,
                  priority: 'medium',
                });
              }
            }}
            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0' }}
          >
            + Add task
          </button>
        </div>
      </div>
    </div>
  );
}

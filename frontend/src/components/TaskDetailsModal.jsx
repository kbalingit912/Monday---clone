import { useState, useEffect } from 'react';
import { tasksAPI } from '../api';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export function TaskDetailsModal({ task, projectId, onClose, onSave, tags = [], assignees = [] }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const labels = task?.labels;
  const parsedLabels = Array.isArray(labels) ? labels : (typeof labels === 'string' ? JSON.parse(labels) : []);
  const [selectedTags, setSelectedTags] = useState(parsedLabels);
  const [newTagName, setNewTagName] = useState('');
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false);
  const [recurrencePattern, setRecurrencePattern] = useState(task?.recurrence_pattern || 'weekly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(task?.recurrence_end_date || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const isNewTask = task.id === 'new';
      const metadata = {
        priority,
        assignee: assignee || null,
        due_date: dueDate || null,
        labels: selectedTags,
        is_recurring: isRecurring ? 1 : 0,
        recurrence_pattern: isRecurring ? recurrencePattern : null,
        recurrence_end_date: isRecurring && recurrenceEndDate ? recurrenceEndDate : null
      };
      console.log('Saving task with metadata:', metadata);

      if (isNewTask) {
        await tasksAPI.create(task.column_id, title, description, 0, metadata);
      } else {
        await tasksAPI.update(task.id, title, description, task.column_id, task.position, metadata);
      }
      onSave?.();
    } catch (err) {
      console.error('Failed to save task:', err);
      setErrors({ save: 'Failed to save task. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '99999', padding: '20px' }}>
      <div style={{ backgroundColor: '#f5f3f0', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottomWidth: '1px', borderBottomColor: '#e8e3dd', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#2d2d2d' }}>{task.id === 'new' ? 'Create Task' : 'Edit Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {errors.save && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#fde8e8', borderRadius: '6px', color: '#c0392b', fontSize: '14px' }}>
            {errors.save}
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d2d2d', marginBottom: '8px' }}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          {errors.title && <p style={{ marginTop: '4px', fontSize: '12px', color: '#c0392b' }}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d2d2d', marginBottom: '8px' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d2d2d', marginBottom: '8px' }}>Priority</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['low', 'medium', 'high', 'urgent'].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{ padding: '6px 12px', borderRadius: '4px', border: priority === p ? '2px solid #9b8673' : '1px solid #ddd', backgroundColor: priority === p ? '#e8d7c3' : 'white', color: '#2d2d2d', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d2d2d', marginBottom: '8px' }}>Assignee</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Type name..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d2d2d', marginBottom: '8px' }}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        {/* Recurring Task */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="recurring" style={{ fontSize: '14px', fontWeight: '600', color: '#2d2d2d', cursor: 'pointer' }}>Make this task recurring</label>
          </div>

          {isRecurring && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px', backgroundColor: '#faf8f7', borderRadius: '6px', borderLeftWidth: '4px', borderLeftColor: '#9b8673' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d2d2d', marginBottom: '6px' }}>Repeat Pattern</label>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit' }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnight">Every 2 weeks (Fortnight)</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d2d2d', marginBottom: '6px' }}>End Recurrence (Optional)</label>
                <input
                  type="date"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white', color: '#2d2d2d', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', borderTopWidth: '1px', borderTopColor: '#e8e3dd', paddingTop: '24px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white', color: '#2d2d2d', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#9b8673', color: 'white', cursor: isSaving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500', opacity: isSaving ? '0.7' : '1' }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

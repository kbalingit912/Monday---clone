import { useState, useEffect } from 'react';
import { tasksAPI } from '../api';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

const DEFAULT_TAG_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

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
  const [tagColorIndex, setTagColorIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [assigneeSuggestions, setAssigneeSuggestions] = useState([]);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      newErrors.dueDate = 'Invalid date format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAssigneeChange = (value) => {
    setAssignee(value);
    if (value.length > 0) {
      const filtered = assignees.filter(a =>
        a.name.toLowerCase().includes(value.toLowerCase()) &&
        a.name !== value
      );
      setAssigneeSuggestions(filtered);
      setShowAssigneeDropdown(true);
    } else {
      setAssigneeSuggestions([]);
      setShowAssigneeDropdown(false);
    }
  };

  const handleSelectAssignee = (name) => {
    setAssignee(name);
    setShowAssigneeDropdown(false);
    setAssigneeSuggestions([]);
  };

  const handleAddTag = () => {
    if (newTagName.trim() && !selectedTags.find(t => t.name === newTagName)) {
      const newTag = {
        name: newTagName,
        color: DEFAULT_TAG_COLORS[tagColorIndex % DEFAULT_TAG_COLORS.length]
      };
      setSelectedTags([...selectedTags, newTag]);
      setNewTagName('');
      setTagColorIndex((tagColorIndex + 1) % DEFAULT_TAG_COLORS.length);
    }
  };

  const handleRemoveTag = (index) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const isNewTask = task.id === 'new';

      if (isNewTask) {
        // Create new task
        await tasksAPI.create(
          task.column_id,
          title,
          description,
          0,
          { priority, assignee: assignee || null, due_date: dueDate || null, labels: selectedTags }
        );
      } else {
        // Update existing task
        await tasksAPI.update(
          task.id,
          title,
          description,
          task.column_id,
          task.position,
          { priority, assignee: assignee || null, due_date: dueDate || null, labels: selectedTags }
        );
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
    <div style={{ position: 'fixed', inset: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '9999' }}>
      <div style={{ backgroundColor: '#f5f3f0', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#3d3d3d' }}>{task.id === 'new' ? 'Create Task' : 'Edit Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        {errors.save && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {errors.save}
          </div>
        )}

        {/* Title & Description */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  priority === opt.value ? opt.color + ' ring-2 ring-offset-1' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            onFocus={() => assignee && setShowAssigneeDropdown(true)}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showAssigneeDropdown && assigneeSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
              {assigneeSuggestions.map((sugg, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAssignee(sugg.name)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  {sugg.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {selectedTags.map((tag, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-1"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button onClick={() => handleRemoveTag(i)} className="font-bold">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag..."
              className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300"
            >
              Add
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

const express = require('express');
const router = express.Router();
const Tasks = require('../models/tasks');

// Get tasks by column
router.get('/column/:columnId', (req, res) => {
  Tasks.getByColumn(req.params.columnId, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tasks || []);
  });
});

// Get single task
router.get('/:id', (req, res) => {
  Tasks.getById(req.params.id, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });
});

// Create task
router.post('/', (req, res) => {
  const { columnId, title, description, position, priority, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date } = req.body;
  if (!columnId || !title) return res.status(400).json({ error: 'Column ID and title are required' });

  const metadata = { priority, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date };
  Tasks.create(columnId, title, description || '', position || 0, metadata, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(task);
  });
});

// Update task (including moving between columns and metadata)
router.put('/:id', (req, res) => {
  const { title, description, columnId, position, priority, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date } = req.body;
  const metadata = { priority, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date };
  Tasks.update(req.params.id, title, description, columnId, position, metadata, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, title, description, columnId, position, priority, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date });
  });
});

// Delete task
router.delete('/:id', (req, res) => {
  Tasks.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;

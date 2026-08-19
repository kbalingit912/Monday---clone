const express = require('express');
const router = express.Router();
const Boards = require('../models/boards');
const Columns = require('../models/columns');

// Get boards by project
router.get('/project/:projectId', (req, res) => {
  Boards.getByProject(req.params.projectId, (err, boards) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(boards || []);
  });
});

// Get board with columns and tasks
router.get('/:id', (req, res) => {
  Boards.getWithColumns(req.params.id, (err, board) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  });
});

// Create board
router.post('/', (req, res) => {
  const { projectId, name } = req.body;
  if (!projectId || !name) return res.status(400).json({ error: 'Project ID and name are required' });

  Boards.create(projectId, name, (err, board) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(board);
  });
});

// Create default columns for board
router.post('/:id/init-columns', (req, res) => {
  const boardId = req.params.id;
  const columns = ['To Do', 'In Progress', 'Done'];
  let created = 0;

  columns.forEach((name, index) => {
    Columns.create(boardId, name, index, (err, column) => {
      created++;
      if (created === columns.length) {
        res.status(201).json({ success: true, message: 'Columns created' });
      }
    });
  });
});

// Update board
router.put('/:id', (req, res) => {
  const { name } = req.body;
  Boards.update(req.params.id, name, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, name });
  });
});

// Delete board
router.delete('/:id', (req, res) => {
  Boards.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;

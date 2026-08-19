const express = require('express');
const router = express.Router();
const Projects = require('../models/projects');
const Tags = require('../models/tags');

// Mock user ID for MVP (no auth yet)
const DEMO_USER_ID = 'demo-user';

// Get all projects
router.get('/', (req, res) => {
  Projects.getAll(DEMO_USER_ID, (err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(projects || []);
  });
});

// Get single project
router.get('/:id', (req, res) => {
  Projects.getById(req.params.id, (err, project) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });
});

// Create project
router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  Projects.create(DEMO_USER_ID, name, description || '', (err, project) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(project);
  });
});

// Update project
router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  Projects.update(req.params.id, name, description, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, name, description });
  });
});

// Delete project
router.delete('/:id', (req, res) => {
  Projects.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get tags for autocomplete
router.get('/:id/tags', (req, res) => {
  Tags.getByProject(req.params.id, (err, tags) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tags || []);
  });
});

// Get unique assignees for autocomplete (from tasks in this project)
router.get('/:id/assignees', (req, res) => {
  // For MVP, return empty array. Can implement with direct query later if needed.
  res.json([]);
});

module.exports = router;

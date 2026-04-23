const express = require('express');
const router = express.Router();

// In-memory tasks array (replace with DB later)
let tasks = [];

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Add a new task
router.post('/', (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const newTask = { title, completed: !!completed };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:index - Update a task
router.put('/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx) || idx < 0 || idx >= tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { title, completed } = req.body;
  if (title !== undefined) tasks[idx].title = title;
  if (completed !== undefined) tasks[idx].completed = completed;
  res.json(tasks[idx]);
});

// DELETE /api/tasks/:index - Delete a task
router.delete('/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx) || idx < 0 || idx >= tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deleted = tasks.splice(idx, 1);
  res.json(deleted[0]);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Task = require('./models/Task');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST /api/tasks - Add a new task
router.post('/', async (req, res) => {
  const { title, completed, user } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const newTask = new Task({ title, completed: !!completed, user });
  await newTask.save();
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  await task.save();
  res.json(task);
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

module.exports = router;

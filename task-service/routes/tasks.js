const express = require('express');
const Task = require('../models/Task');
const { checkRole } = require('../middleware/auth');
const { verifyToken } = require('../middleware/jwt');
const router = express.Router();

// POST - Create task
router.post('/', checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - All tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Tasks assigned to user
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update task status (users can only update their own tasks)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found or not assigned to you' });
    
    task.status = req.body.status;
    task.updatedAt = Date.now();
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
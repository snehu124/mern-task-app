const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Get all tasks with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tasks = await Task.find({ assignedUser: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Task.countDocuments({ assignedUser: req.user.id });
    res.json({
      message: 'Tasks fetched successfully',
      result: {
        tasks,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', result: null });
  }
});

// Create a task
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedUser: req.user.id,
  });
  try {
    const newTask = await task.save();
    res.status(201).json({
      message: 'Task created successfully',
      result: newTask,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, result: null });
  }
});

// Get task details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found', result: null });
    }
    res.json({
      message: 'Task fetched successfully',
      result: task,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', result: null });
  }
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found', result: null });
    }
    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json({
      message: 'Task updated successfully',
      result: updatedTask,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, result: null });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format (MongoDB ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: 'Invalid task ID format',
        result: null,
      });
    }

    // Attempt to delete task
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found',
        result: null,
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
      result: deletedTask,
    });
  } catch (err) {
    console.error('Error deleting task:', err); // <-- Important for debugging
    return res.status(500).json({
      message: 'Server error',
      result: null,
    });
  }
});

// Update task status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found', result: null });
    }
    task.status = req.body.status;
    const updatedTask = await task.save();
    res.json({
      message: 'Task status updated successfully',
      result: updatedTask,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, result: null });
  }
});

// Update task priority
router.put('/:id/priority', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found', result: null });
    }
    task.priority = req.body.priority;
    const updatedTask = await task.save();
    res.json({
      message: 'Task priority updated successfully',
      result: updatedTask,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, result: null });
  }
});

module.exports = router;
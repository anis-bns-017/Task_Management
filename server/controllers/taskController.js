import Task from "../models/Task.js";
import dayjs from "dayjs"; // install this if not already

export const getReminders = async (req, res) => {
  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").endOf("day");

  const reminders = await Task.find({
    user: req.user._id,
    dueDate: {
      $gte: today.toDate(),
      $lte: tomorrow.toDate(),
    },
  });

  res.json(reminders);
};

// Create a task with optional dueDate
export const createTask = async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  const userId = req.user._id;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      category,
      user: userId,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Task.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

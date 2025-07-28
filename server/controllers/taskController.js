import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  const task = await Task.create({ title, description, user: userId });
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updated = await Task.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

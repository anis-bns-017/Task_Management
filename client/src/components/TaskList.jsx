import { useEffect, useState } from "react";
import axios from "../api/axios";
import React from "react";

export default function TaskList({ refreshKey }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [editTags, setEditTags] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`/tasks?search=${searchTerm}`);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
    setEditTags((task.tags || []).join(", "));
    setEditCategory(task.category || "");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const saveEdit = async (id) => {
    const tagArray = editTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      await axios.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        category: editCategory,
        tags: tagArray,
      });
      setEditTitle("");
      setEditDescription("");
      setEditStatus("pending");
      setEditTags("");
      setEditCategory("");
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase();
    const inTitle = task.title?.toLowerCase().includes(term);
    const inCategory = task.category?.toLowerCase().includes(term);
    const inTags = (task.tags || []).some((tag) =>
      tag.toLowerCase().includes(term)
    );
    return inTitle || inCategory || inTags;
  });

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (filteredTasks.length === 0)
    return <p>No tasks yet. Add your first task!</p>;

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, category, or tag..."
        className="border p-2 rounded w-full mb-4"
      />

      {filteredTasks.map((task) =>
        editingTaskId === task._id ? (
          <div
            key={task._id}
            className="p-4 border rounded-md shadow-sm flex flex-col space-y-2"
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border p-2 rounded"
              placeholder="Task Title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border p-2 rounded"
              placeholder="Description"
            />
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Edit category"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="border p-2 rounded"
              placeholder="Tags (comma-separated)"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => saveEdit(task._id)}
                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="bg-gray-400 text-black py-1 px-3 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            key={task._id}
            className="p-4 border rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-600">Category: {task.category}</p>
              <p className="text-xs mt-1">
                Status: <span className="font-medium">{task.status}</span>
              </p>
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(task)}
                className="bg-yellow-400 text-black py-1 px-3 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

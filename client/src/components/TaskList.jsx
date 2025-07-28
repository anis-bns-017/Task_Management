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

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
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
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (tasks.length === 0) return <p>No tasks yet. Add your first task!</p>;

  return (
    <div className="space-y-4">
      {tasks.map((task) =>
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
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border p-2 rounded"
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
              <p className="text-xs mt-1">
                Status: <span className="font-medium">{task.status}</span>
              </p>
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

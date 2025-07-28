import { useState } from "react";
import axios from "../api/axios";
import React from "react";

export default function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await axios.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Task Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Task Description (optional)"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
}

import { useState } from "react";
import axios from "../api/axios";
import React from "react";

export default function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await axios.post("/tasks", {
        title,
        description,
        dueDate,
        category,
        tags: tags.split(",").map((tag) => tag.trim()),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setCategory("");
      setTags("");
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
      <input
        type="date"
        className="border p-2 rounded w-full mt-2"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Study">Study</option>
        <option value="Shopping">Shopping</option>
        <option value="Others">Others</option>
      </select>

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border p-2 m-2 rounded"
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

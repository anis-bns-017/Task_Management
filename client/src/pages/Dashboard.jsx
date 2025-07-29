import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data } = await axios.get("/tasks/reminders");
        if (!data || data.length === 0) return;
         
      } catch (error) {
        console.error("Error fetching reminders", error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      <AddTask onTaskAdded={() => setRefresh((prev) => !prev)} />

      <div className="mt-8">
        <TaskList refreshKey={refresh} />
      </div>
    </div>
  );
}

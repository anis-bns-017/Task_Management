import { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import React from "react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");

    try {
      const res = await axios.post("/auth/login", formData, {
        withCredentials: true,
      });

      setUser(res.data.user);
      toast.success("Logged in successfully!", { id: toastId });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed", { id: toastId });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

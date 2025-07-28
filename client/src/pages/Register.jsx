import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-hot-toast"; // ✅ Import toast
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Register() {
  const { setUser } = useContext(AuthContext); // ✅ get setUser from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Registering...");

    try {
      const res = await axios.post("/auth/register", formData);
      setUser(res.data.user); // ✅ update user context
      toast.dismiss(toastId); // Dismiss the loading toast

      toast.success("Registered successfully!", { id: toastId });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
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
          Register
        </button>
      </form>
    </div>
  );
}

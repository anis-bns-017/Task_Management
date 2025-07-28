import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast"; // ✅ import toast

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out..."); // ✅ show loading toast
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully", { id: toastId }); // ✅ success
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed", { id: toastId }); // ✅ error
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="font-bold">Task Manager</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {user ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

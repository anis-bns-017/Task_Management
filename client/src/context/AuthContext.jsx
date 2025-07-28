import { createContext, useEffect, useState } from "react";
import axios from "../api/axios.js";
import React from "react";
 
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Check login status by calling backend (which checks cookie)
  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me"); // We will create this route next
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

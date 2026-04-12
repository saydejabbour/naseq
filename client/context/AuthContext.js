"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  // 🔹 LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      const userData = data.data;

      // ✅ SAVE USER
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔥 IMPORTANT: RETURN SAME STRUCTURE
      return {
        success: true,
        data: userData,
      };

    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 CUSTOM HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
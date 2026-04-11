"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 LOAD USER ON PAGE REFRESH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ SAVE
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ REMOVE
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Custom hook
export function useAuth() {
  return useContext(AuthContext);
}
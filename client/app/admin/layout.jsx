"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 🔥 PROTECTION LOGIC
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login"); // ❌ not logged in
      } else if (user.role !== "admin") {
        router.push("/"); // ❌ wrong role
      }
    }
  }, [user, isLoading]);

  // 🔥 LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔥 BLOCK ACCESS
  if (!user || user.role !== "admin") return null;

  // ✅ YOUR ORIGINAL UI
  return (
    <div className="flex min-h-screen bg-[#FDF8F3]">

      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}
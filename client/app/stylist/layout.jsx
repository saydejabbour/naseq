"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ✅ ADD THIS
import { ToastProvider } from "@/context/ToastContext";

export default function StylistLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 🔥 PROTECTION LOGIC
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "stylist") {
        router.push("/");
      }
    }
  }, [user, isLoading]);

  // 🔥 WAIT FOR AUTH CHECK
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔥 BLOCK RENDER
  if (!user || user.role !== "stylist") return null;

  // ✅ WRAP WITH TOAST PROVIDER
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#FDF8F3]">

        {/* Sidebar */}
        <Sidebar role="stylist" />

        {/* Content */}
        <main className="flex-1 p-10">
          {children}
        </main>

      </div>
    </ToastProvider>
  );
}
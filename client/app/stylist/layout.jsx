"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ToastProvider } from "@/context/ToastContext";

export default function StylistLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isStatusPage =
    pathname === "/stylist/pending" || pathname === "/stylist/rejected";

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isStatusPage) {
        router.push("/login");
      } else if (user && user.role !== "stylist") {
        router.push("/");
      } else if (user && !isStatusPage && user.stylist_status === "pending") {
        router.push("/stylist/pending");
      } else if (user && !isStatusPage && user.stylist_status === "rejected") {
        router.push("/stylist/rejected");
      } else if (user && !isStatusPage && user.stylist_status !== "approved") {
        router.push("/login");
      }
    }
  }, [user, isLoading, isStatusPage, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isStatusPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (!user || user.role !== "stylist") return null;

  if (user.stylist_status !== "approved") return null;

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#FDF8F3]">
        <Sidebar role="stylist" />

        <main className="flex-1 p-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
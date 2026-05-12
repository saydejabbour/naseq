"use client";

import { ToastProvider } from "@/context/ToastContext";

export default function AuthLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
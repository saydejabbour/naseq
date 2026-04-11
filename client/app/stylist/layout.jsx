"use client";

import Sidebar from "@/components/sidebar/Sidebar";

export default function StylistLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FDF8F3]">

      {/* Sidebar */}
      <Sidebar role="stylist" />

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}
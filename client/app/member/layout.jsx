"use client";

import Sidebar from "@/components/sidebar/Sidebar";

export default function MemberLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* 🧭 Sidebar */}
      <Sidebar role="member" />

      {/* 📄 Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}
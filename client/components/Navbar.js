"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleDashboard = () => {
    if (!user) return;

    if (user.role === "member") {
      console.log("Go to member dashboard");
    } else if (user.role === "stylist") {
      console.log("Go to stylist dashboard");
    } else if (user.role === "admin") {
      console.log("Go to admin dashboard");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 bg-[#F9F0F0] relative">
      
      {/* 🔹 Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={80}
          height={40}
          className="object-contain"
        />
      </div>

      {/* 🔹 Center Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-10 text-[#5E5A5A] font-medium">
        <Link href="/">Explore</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* 🔹 Right Side */}
      <div className="flex items-center gap-4">

        {!user ? (
          <>
            <Link href="/login" className="text-[#5E5A5A] font-medium">
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-[#7CB98B] text-white px-5 py-2 rounded-md hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* 🔹 Profile */}
            <button
              onClick={handleDashboard}
              className="bg-gray-200 px-3 py-2 rounded-full"
            >
              👤
            </button>

            {/* 🔹 Logout */}
            <button
              onClick={handleLogout}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
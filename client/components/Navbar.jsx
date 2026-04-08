"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-10 py-3 bg-[#F9F0F0]/90 backdrop-blur-md border-b border-[#E8E0E0]">

      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={80}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Center Links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-10 text-sm font-medium text-[#5E5A5A]">
        {[
          { label: "Explore", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7CB98B] after:transition-all after:duration-300 hover:after:w-full hover:text-[#2F3E34] transition-colors duration-200"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-sm text-[#5E5A5A] font-medium hover:text-[#2F3E34] transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#2F3E34] text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-[#7CB98B] transition-colors duration-300"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                if (!user) return;
                if (user.role === "member") console.log("Go to member dashboard");
                else if (user.role === "stylist") console.log("Go to stylist dashboard");
                else if (user.role === "admin") console.log("Go to admin dashboard");
              }}
              className="w-9 h-9 rounded-full bg-[#DDE8E1] text-[#2F3E34] flex items-center justify-center text-base hover:bg-[#7CB98B] hover:text-white transition-colors duration-200"
            >
              👤
            </button>
            <button
              onClick={logout}
              className="text-sm text-[#C0392B] font-medium hover:text-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
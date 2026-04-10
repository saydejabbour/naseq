"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // 🔥 GET CURRENT PAGE

  const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-10 py-3 bg-[#F9F0F0]/90 backdrop-blur-md border-b border-[#E8E0E0]">

      {/* LOGO */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={80}
          height={40}
          className="object-contain cursor-pointer"
        />
      </Link>

      {/* CENTER LINKS */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-10 text-sm font-medium">

        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`
                relative transition-colors duration-200

                ${isActive 
                  ? "text-[#2F3E34] font-semibold" 
                  : "text-[#5E5A5A] hover:text-[#2F3E34]"
                }

                after:absolute after:bottom-[-3px] after:left-0 
                after:h-[2px] after:bg-[#7CB98B] 
                after:transition-all after:duration-300

                ${isActive 
                  ? "after:w-full" 
                  : "after:w-0 hover:after:w-full"
                }
              `}
            >
              {label}
            </Link>
          );
        })}

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-sm text-[#5E5A5A] font-medium hover:text-[#2F3E34]"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-[#2F3E34] text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-[#7CB98B]"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                if (!user) return;

                if (user.role === "member") window.location.href = "/dashboard";
                else if (user.role === "stylist") window.location.href = "/stylist";
                else if (user.role === "admin") window.location.href = "/admin";
              }}
              className="w-9 h-9 rounded-full bg-[#DDE8E1] text-[#2F3E34] flex items-center justify-center hover:bg-[#7CB98B] hover:text-white"
            >
              👤
            </button>

            <button
              onClick={logout}
              className="text-sm text-[#C0392B] font-medium hover:text-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
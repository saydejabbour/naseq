"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function StylistRejectedPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <Image
          src="/logo.png"
          alt="Naseq"
          width={80}
          height={60}
          className="mx-auto mb-4"
        />

        <h1 className="text-2xl font-serif text-[#2F3E34] mb-3">
          Application Rejected
        </h1>

        <p className="text-gray-500 text-sm leading-6 mb-6">
          Your stylist application was not approved by the admin.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-[#7CB98B] text-white py-3 rounded-xl text-sm hover:bg-[#6aa879] transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
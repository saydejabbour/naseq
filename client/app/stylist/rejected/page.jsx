"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StylistRejectedPage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContinueAsMember = async () => {
    if (!user?.user_id || loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/stylist/continue-as-member/${user.user_id}`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to continue as member");
        return;
      }

      const updatedUser = {
        ...user,
        role: "member",
        stylist_status: null,
      };

      updateUser(updatedUser);

      router.push("/member");
    } catch (err) {
      console.error("CONTINUE AS MEMBER ERROR:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
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
          Your stylist application was not approved at this time. You can still
          continue using Naseq as a member.
        </p>

        <button
          onClick={handleContinueAsMember}
          disabled={loading}
          className={`w-full text-white py-3 rounded-xl text-sm transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#7CB98B] hover:bg-[#6aa879]"
          }`}
        >
          {loading ? "Updating Account..." : "Continue as Member"}
        </button>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full mt-3 border border-[#7CB98B] text-[#7CB98B] py-3 rounded-xl text-sm hover:bg-[#F3FBF5] transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
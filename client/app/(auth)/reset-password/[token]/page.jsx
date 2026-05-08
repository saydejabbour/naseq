"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordTokenPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        alert(data.message || "Failed to reset password");
        return;
      }

      alert(data.message || "Password reset successfully");
      router.push("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-10 text-center">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Naseq" className="w-28 object-contain" />
        </div>

        <h1 className="text-xl font-semibold text-[#2D3A3A] mb-2">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          <div className="text-left">
            <label className="text-sm text-gray-700 mb-1 block">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F7F3F3] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7CB98B]"
            />
          </div>

          <div className="text-left">
            <label className="text-sm text-gray-700 mb-1 block">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F7F3F3] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7CB98B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-sm font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#7CB98B] hover:bg-[#6aa87a] text-white"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-[#7CB98B] hover:underline"
          >
            ← Back To Login
          </button>
        </div>
      </div>
    </main>
  );
}
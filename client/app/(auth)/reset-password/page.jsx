"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("✅ Reset link sent to your email");
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-10 text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Naseq" className="w-28 object-contain" />
        </div>

        <h2 className="text-xl font-semibold text-[#2D3A3A] mb-2">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mb-8">
          Enter your email and we'll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-left">
            <label className="text-sm text-gray-700 mb-1 block">
              Email
            </label>

            <input
              type="email"
              placeholder="You@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F7F3F3] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7CB98B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-sm font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-[#7CB98B] hover:bg-[#6aa87a] text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Password"}
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
    </div>
  );
}
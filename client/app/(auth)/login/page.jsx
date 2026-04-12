"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ LOGIN HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    const res = await login(form.email, form.password);

    setLoading(false);

    if (res.success) {
      router.push("/");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
      <div className="w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-10">

          {/* LOGO */}
          <div className="flex justify-center mb-5">
            <img
              src="/logo.png"
              alt="Naseq"
              className="w-28 object-contain"
            />
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-semibold text-center text-[#2D3A3A] mb-1">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 text-sm mb-8">
            Sign in to your account
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-[#F7F3F3] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7CB98B]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-gray-700">
                  Password
                </label>

                {/* ✅ FIXED RESET LINK */}
                <Link
                  href="/reset-password"
                  className="text-xs text-[#7CB98B] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-[#F7F3F3] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7CB98B]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl mt-2 text-sm font-medium transition 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7CB98B] hover:bg-[#6aa87a] text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* BOTTOM TEXT */}
          <div className="text-center mt-8 text-sm">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-[#7CB98B] hover:underline">
                Sign Up
              </Link>
            </p>

            <p className="mt-2 text-gray-700">
              Are you a stylist?{" "}
              <span className="text-[#F5A962] cursor-pointer hover:underline">
                Apply here
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
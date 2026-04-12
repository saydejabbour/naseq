"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/services/api";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 HANDLE ROLE CHANGE
  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

  // 🔥 HANDLE SUBMIT (UPDATED WITH REDIRECT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await apiRequest("/auth/register", "POST", {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    setLoading(false);

    if (res.success) {
      alert("Account created successfully!");

      // 🔥 SMART REDIRECT BASED ON ROLE
      if (form.role === "member") {
        router.push("/member");
      } else if (form.role === "stylist") {
        router.push("/stylistapp");
      }

    } else {
      alert(res.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FDF8F3] overflow-hidden">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* LOGO */}
        <div className="flex justify-center mb-3">
          <Image
            src="/logo.png"
            alt="Naseq Logo"
            width={70}
            height={50}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center text-[#2F3E34]">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Sign up to your account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* FULL NAME */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Role</label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={form.role === "member"}
                  onChange={() => handleRoleChange("member")}
                />
                Participant
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={form.role === "stylist"}
                  onChange={() => handleRoleChange("stylist")}
                />
                Stylist
              </label>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7CB98B] text-white py-2.5 rounded-lg hover:opacity-90 transition mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
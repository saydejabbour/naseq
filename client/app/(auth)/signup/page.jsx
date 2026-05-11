"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/services/api";
import { useToast } from "@/context/ToastContext";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

const handleSubmit = async () => {
  if (loading) return;

  if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
    alert("Please fill all fields");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await apiRequest("/auth/register", "POST", {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });

    if (!res?.success) {
      alert(res?.message || "Signup failed");
      return;
    }

    alert(res?.message || "Account created. Please verify your email.");

    if (form.role === "member") {
      router.push("/member");
    } else {
      router.push("/stylistapp");
    }
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="h-screen flex items-center justify-center bg-[#FDF8F3] overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="Naseq Logo" width={70} height={50} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#2F3E34]">
          Welcome Back
        </h2>

        <p className="text-center text-sm text-gray-500 mb-4">
          Sign up to your account
        </p>

        <form className="space-y-3">
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

       <button
  type="button"
  onClick={handleSubmit}
  className="w-full bg-[#7CB98B] text-white py-2.5 rounded-lg hover:opacity-90 transition mt-2"
>
  Create Account
</button>
        </form>

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
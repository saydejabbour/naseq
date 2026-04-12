"use client";

import Image from "next/image";
import { useState } from "react";

export default function StylistApplication() {

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 GET LOGGED USER
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.bio) {
      alert("Please fill all fields");
      return;
    }

    if (!profileImage) {
      alert("Please upload a profile image");
      return;
    }

    if (!user) {
      alert("You must be logged in");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("bio", form.bio);

    // 🔥 IMPORTANT
    formData.append("user_id", user.user_id);

    formData.append("profileImage", profileImage);

    portfolioFiles.forEach((file) => {
      formData.append("portfolio", file);
    });

    try {
      const res = await fetch("http://localhost:5000/api/stylist/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Application submitted successfully!");

        setForm({
          full_name: "",
          email: "",
          bio: "",
        });
        setProfileImage(null);
        setPortfolioFiles([]);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EDE7] px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">

        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={70}
          height={70}
          className="mb-2 object-contain"
        />

        <h2 className="text-lg font-semibold text-gray-800">
          Apply as a Stylist
        </h2>

        <p className="text-xs text-gray-500 mb-4 text-center">
          Submit your application to join our stylist community
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">

          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="bg-gray-100 p-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-gray-100 p-2 rounded"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            className="bg-gray-100 p-2 rounded"
          />

          {/* PROFILE */}
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />

          {/* PORTFOLIO */}
          <input
            type="file"
            multiple
            onChange={(e) =>
              setPortfolioFiles(Array.from(e.target.files))
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}
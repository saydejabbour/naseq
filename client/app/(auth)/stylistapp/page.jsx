"use client";

import Image from "next/image";
import { useState } from "react";

export default function StylistApplication() {

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SUBMIT HANDLER (CONNECTED TO BACKEND)
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

    setLoading(true);

    const formData = new FormData();

    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("bio", form.bio);
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
        
        // 🔥 RESET FORM
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

        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={70}
          height={70}
          className="mb-2 object-contain"
        />

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800">
          Apply as a Stylist
        </h2>

        <p className="text-xs text-gray-500 mb-4 text-center">
          Submit your application to join our stylist community
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-xs text-gray-700">Short Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about your styling experience..."
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none h-16 resize-none"
            />
          </div>

          {/* PROFILE PHOTO */}
          <div>
            <label className="text-xs text-gray-700">Profile Photo</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400 cursor-pointer block hover:bg-gray-50">

              {profileImage
                ? profileImage.name
                : "Click to upload JPG, PNG up to 5MB"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* PORTFOLIO */}
          <div>
            <label className="text-xs text-gray-700">Portfolio</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400 cursor-pointer block hover:bg-gray-50">

              {portfolioFiles.length > 0
                ? `${portfolioFiles.length} file(s) selected`
                : "Upload images or PDF"}

              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) =>
                  setPortfolioFiles(Array.from(e.target.files))
                }
              />
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-2 rounded-lg text-sm transition ${
              loading
                ? "bg-gray-400"
                : "bg-[#7CB98B] hover:bg-[#6aa879] text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>
      </div>
    </div>
  );
}
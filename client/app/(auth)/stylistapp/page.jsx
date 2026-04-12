"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function StylistApplication() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [profileImage, setProfileImage] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  // ✅ ONLY LOGIC ADDED HERE
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must be logged in");
      return;
    }

    const updatedUser = {
      ...user,
      stylistApplication: {
        status: "pending",
      },
    };

    updateUser(updatedUser);

    router.push("/member");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EDE7] px-4">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-6 py-5 flex flex-col items-center">

        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="Naseq Logo"
          width={60}
          height={60}
          className="mb-2"
        />

        {/* TITLE */}
        <h2 className="text-base font-semibold text-gray-800">
          Apply as a Stylist
        </h2>

        <p className="text-[11px] text-gray-500 mb-3 text-center">
          Submit your application to join our stylist community
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">

          {/* NAME */}
          <div>
            <label className="text-[11px] text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full mt-1 px-3 py-2 text-xs rounded-md bg-gray-100 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-[11px] text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 text-xs rounded-md bg-gray-100 outline-none"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-[11px] text-gray-700">Short Bio</label>
            <textarea
              placeholder="Tell us about your styling experience..."
              className="w-full mt-1 px-3 py-2 text-xs rounded-md bg-gray-100 outline-none h-14 resize-none"
            />
          </div>

          {/* PROFILE PHOTO */}
          <div>
            <label className="text-[11px] text-gray-700">Profile Photo</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-md p-3 text-center text-[11px] text-gray-400 cursor-pointer block hover:bg-gray-50">

              <div className="flex flex-col items-center gap-1">
                {/* CAMERA ICON (UNCHANGED) */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                >
                  <path d="M4 7h4l2-2h4l2 2h4v12H4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>

                <span>
                  {profileImage
                    ? profileImage.name
                    : "Click to upload profile photo JPG, PNG up to 5MB"}
                </span>
              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* PORTFOLIO */}
          <div>
            <label className="text-[11px] text-gray-700">Portfolio Images</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-md p-3 text-center text-[11px] text-gray-400 cursor-pointer block hover:bg-gray-50">

              <div className="flex flex-col items-center gap-1">
                {/* UPLOAD ICON (UNCHANGED) */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                >
                  <path d="M12 16V4" />
                  <path d="M8 8l4-4 4 4" />
                  <rect x="4" y="16" width="16" height="4" />
                </svg>

                <span>
                  {portfolioFiles.length > 0
                    ? `${portfolioFiles.length} file(s)`
                    : "Upload portfolio images or PDF (max 10 files)"}
                </span>
              </div>

              <input
                type="file"
                multiple
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
            className="mt-2 bg-[#7CB98B] hover:bg-[#6aa879] text-white py-2 rounded-md text-xs transition"
          >
            Submit Application
          </button>

        </form>
      </div>
    </div>
  );
}
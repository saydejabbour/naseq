"use client";

import Image from "next/image";
import { useState } from "react";

export default function StylistApplication() {
  const [profileImage, setProfileImage] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EDE7] px-4">

      {/* CARD */}
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
        <form className="w-full flex flex-col gap-3">

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-xs text-gray-700">Short Bio</label>
            <textarea
              placeholder="Tell us about your styling experience..."
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 outline-none h-16 resize-none"
            />
          </div>

          {/* 🔥 PROFILE PHOTO (FIGMA STYLE + REAL) */}
          <div>
            <label className="text-xs text-gray-700">Profile Photo</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400 cursor-pointer block hover:bg-gray-50">

              {/* ICON */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">📷</span>

                <span>
                  {profileImage
                    ? profileImage.name
                    : "Click to upload profile photo JPG, PNG up to 5MB"}
                </span>
              </div>

              {/* HIDDEN INPUT */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* 🔥 PORTFOLIO (FIGMA STYLE + REAL) */}
          <div>
            <label className="text-xs text-gray-700">Portfolio Images</label>

            <label className="mt-1 border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-400 cursor-pointer block hover:bg-gray-50">

              {/* ICON */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">⬆️</span>

                <span>
                  {portfolioFiles.length > 0
                    ? `${portfolioFiles.length} file(s) selected`
                    : "Upload portfolio images or PDF (max 10 files)"}
                </span>
              </div>

              {/* HIDDEN INPUT */}
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
            className="mt-2 bg-[#7CB98B] hover:bg-[#6aa879] text-white py-2 rounded-lg text-sm transition"
          >
            Submit Application
          </button>

        </form>
      </div>
    </div>
  );
}
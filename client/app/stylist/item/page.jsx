"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ IMPORTANT

const CATEGORIES = [
  { id: 1, name: "Tops" },
  { id: 2, name: "Bottoms" },
  { id: 3, name: "Shoes" },
  { id: 4, name: "Accessories" },
  { id: 5, name: "Dresses & Jumpsuits" },
  { id: 6, name: "Outerwear" },
  { id: 7, name: "Bags" },
  { id: 8, name: "Activewear" },
];

export default function StylistAddItem() {
  const { user } = useAuth(); // ✅ GET USER

  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ================= SAVE ITEM ================= */
  const handleSubmit = async () => {
    try {
      if (!file) {
        alert("Please upload an image");
        return;
      }

      if (!category) {
        alert("Please select a category");
        return;
      }

      const formData = new FormData();

      formData.append("image", file);
      formData.append("category_id", category);
      formData.append("user_id", user.user_id); // ✅ VERY IMPORTANT

      const res = await fetch("http://127.0.0.1:5000/api/clothing/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (data.success) {
        alert("Item saved successfully!");

        // reset
        setPreview(null);
        setFile(null);
        setCategory("");
      } else {
        alert(data.message || "Upload failed");
      }

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-10 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-serif text-[#1a2e1a] mb-2">
        Add Clothing Item
      </h1>

      <p className="text-sm text-[#7A7A7A] mb-8">
        Upload a photo and choose a category.
      </p>

      <div className="bg-white rounded-2xl p-8 max-w-2xl border border-[#E8E2D9]">

        {/* IMAGE */}
        <p className="text-sm font-medium mb-3 text-[#1a2e1a]">
          Upload Image
        </p>

        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`
            w-full h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition
            ${
              dragOver
                ? "border-[#F5A962] bg-[#fff8f4]"
                : "border-[#E5DCD3] bg-[#faf8f5] hover:border-[#F5A962]"
            }
          `}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full object-contain p-2"
            />
          ) : (
            <p className="text-sm text-[#A0A0A0]">
              click or drag to upload an image
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* REMOVE IMAGE */}
        {preview && (
          <button
            onClick={() => {
              setPreview(null);
              setFile(null);
            }}
            className="mt-2 text-xs text-red-500 hover:underline"
          >
            Remove image
          </button>
        )}

        {/* CATEGORY */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-[#1a2e1a]">
            Category
          </p>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#fdf6ee] border border-[#E5DCD3] rounded-xl px-4 py-3 text-sm"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit} // ✅ THIS WAS MISSING
          className="mt-8 w-full bg-[#7CB98B] hover:bg-[#6aa879] text-white py-3 rounded-xl font-medium transition"
        >
          Save Item
        </button>

      </div>
    </div>
  );
}
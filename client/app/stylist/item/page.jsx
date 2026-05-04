"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
    setSuccess(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!file) return setError("Please upload an image.");
    if (!category) return setError("Please select a category.");
    if (!user?.user_id && !user?.id) return setError("User not found. Please login again.");

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);
      formData.append("category_id", category);
      formData.append("user_id", user?.user_id || user?.id);

      const res = await fetch("http://127.0.0.1:5000/api/clothing/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setSuccess(true);

      setPreview(null);
      setFile(null);
      setCategory("");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-10 py-10">
      <h1 className="text-3xl font-serif text-[#1a2e1a] mb-2">
        Add Clothing Item
      </h1>

      <p className="text-sm text-[#7A7A7A] mb-8">
        Upload a photo and choose a category.
      </p>

      <div className="bg-white rounded-2xl p-8 max-w-2xl border border-[#E8E2D9]">
        <p className="text-sm font-medium mb-3 text-[#1a2e1a]">
          Upload Image
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
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
              className="h-full w-full object-contain rounded-xl p-2"
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

        {preview && (
          <button
            onClick={() => {
              setPreview(null);
              setFile(null);
              setSuccess(false);
            }}
            className="mt-2 text-xs text-red-500 hover:underline"
          >
            Remove image
          </button>
        )}

        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-[#1a2e1a]">
            Category
          </p>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setError("");
              setSuccess(false);
            }}
            className="w-full bg-[#fdf6ee] border border-[#E5DCD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A962]"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            ✓ Item added successfully!
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full bg-[#7CB98B] hover:bg-[#6aa879] text-white py-3 rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Save Item"}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CLOTHING_API = "http://localhost:5000/api/clothing";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${CLOTHING_API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to add category");
        return;
      }
      alert("Category added successfully");
      router.push("/admin/categories");
    } catch (err) {
      console.error("ADD CATEGORY ERROR:", err);
      alert("Server error while adding category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-10 py-10">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push("/admin/categories")}
        className="mb-6 text-[13px] text-[#999] hover:text-black transition-colors"
      >
        ← Back to Categories
      </button>

      {/* Title */}
      <h1 className="mb-8 font-serif text-[26px] font-semibold text-black">
        Add New Category
      </h1>

      {/* Form Card */}
      <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-[0_4px_18px_rgba(0,0,0,0.12)]">
        {/* Category Name */}
        <label className="mb-2 block font-serif text-[14px] text-black">
          Category Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Accessories"
          className="mb-6 w-full rounded-xl bg-[#f8eee5] px-4 py-3.5 text-[14px] text-black placeholder-[#c9b8ab] shadow-sm outline-none focus:ring-2 focus:ring-[#a8d98d]/40 transition"
        />

        {/* Description */}
        <label className="mb-2 block font-serif text-[14px] text-black">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this category....."
          className="mb-6 h-28 w-full resize-none rounded-xl bg-[#f8eee5] px-4 py-3.5 text-[14px] text-black placeholder-[#c9b8ab] shadow-sm outline-none focus:ring-2 focus:ring-[#a8d98d]/40 transition"
        />

        {/* Active checkbox — centered like Figma */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded accent-[#e05c5c]"
          />
          <label htmlFor="isActive" className="font-serif text-[14px] text-black cursor-pointer">
            Active
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#a8d98d] px-7 py-2 text-[14px] font-medium text-white shadow-md hover:bg-[#96cc7a] disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving..." : "Save Category"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg bg-[#f2e6da] px-7 py-2 text-[14px] font-medium text-black shadow-sm hover:bg-[#e9d9cb] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
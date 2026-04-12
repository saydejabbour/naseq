"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { id: 1, name: "Tops" },
  { id: 2, name: "Bottoms" },
  { id: 3, name: "Shoes" },
  { id: 4, name: "Accessories" },
  { id: 5, name: "Dress" },
];

const COLORS = [
  "Black", "White", "Beige", "Brown", "Gray",
  "Navy", "Blue", "Green", "Red", "Pink",
  "Yellow", "Orange", "Purple", "Multicolor",
];

const STYLES = ["Casual", "Formal", "Sporty", "Elegant", "Streetwear", "Bohemian"];
const SEASONS = ["Summer", "Winter", "Spring", "Fall", "All Season"];
const OCCASIONS = ["Daily", "Work", "Event", "Sport", "Travel", "Evening"];

export default function AddItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    category_id: "",
    color: "",
    style: "",
    season: "",
    occasion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── image handling ──────────────────────────────────────
  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── form handling ───────────────────────────────────────
  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError("");
    if (!file) return setError("Please upload an image.");
    if (!form.category_id) return setError("Please select a category.");
    if (!form.color) return setError("Please select a color.");
    if (!form.style) return setError("Please select a style.");
    if (!form.season) return setError("Please select a season.");
    if (!form.occasion) return setError("Please select an occasion.");

    setLoading(true);

    const data = new FormData();
    data.append("image", file);
    data.append("category_id", form.category_id);
    data.append("color", form.color);
    data.append("style", form.style);
    data.append("season", form.season);
    data.append("occasion", form.occasion);
    data.append("user_id", user?.user_id || user?.id);

    try {
      const res = await fetch("http://localhost:5000/api/clothing/add", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Something went wrong");

      setSuccess(true);
      setTimeout(() => router.push("/member/wardrobe"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f5] px-6 py-10 md:px-12">
      <h1 className="text-3xl font-semibold text-[#2d2d2d] mb-1">Add Clothing Item</h1>
      <p className="text-sm text-[#999] mb-8">
        Upload a photo and fill in the details to add it to your wardrobe.
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8 max-w-2xl">

        {/* ── Image Upload ── */}
        <p className="text-sm font-semibold text-[#2d2d2d] mb-3">Upload Image</p>
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`
            relative w-full h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragOver
              ? "border-[#e8a87c] bg-[#fff8f4]"
              : "border-[#ddd5c8] bg-[#faf8f5] hover:border-[#c9a882] hover:bg-[#fff8f4]"}
          `}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-contain rounded-xl p-2"
            />
          ) : (
            <>
              <div className="w-10 h-10 mb-3 text-[#b5a090]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0L8 10m4-4v12" />
                </svg>
              </div>
              <p className="text-sm text-[#b5a090]">click or drag to upload an image</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {preview && (
          <button
            onClick={() => { setPreview(null); setFile(null); }}
            className="mt-2 text-xs text-[#c0392b] hover:underline"
          >
            Remove image
          </button>
        )}

        {/* ── Fields Grid ── */}
        <div className="grid grid-cols-2 gap-5 mt-7">
          <SelectField
            label="Category"
            value={form.category_id}
            onChange={(v) => handleChange("category_id", v)}
            options={CATEGORIES.map((c) => ({ label: c.name, value: c.id }))}
            placeholder="Select Category"
          />
          <SelectField
            label="Color"
            value={form.color}
            onChange={(v) => handleChange("color", v)}
            options={COLORS.map((c) => ({ label: c, value: c }))}
            placeholder="e.g. Blue, Red"
          />
          <SelectField
            label="Style"
            value={form.style}
            onChange={(v) => handleChange("style", v)}
            options={STYLES.map((s) => ({ label: s, value: s }))}
            placeholder="Select Style"
          />
          <SelectField
            label="Season"
            value={form.season}
            onChange={(v) => handleChange("season", v)}
            options={SEASONS.map((s) => ({ label: s, value: s }))}
            placeholder="Select Season"
          />
        </div>

        <div className="mt-5">
          <SelectField
            label="Occasion"
            value={form.occasion}
            onChange={(v) => handleChange("occasion", v)}
            options={OCCASIONS.map((o) => ({ label: o, value: o }))}
            placeholder="Select occasion"
          />
        </div>

        {/* ── Error / Success ── */}
        {error && (
          <p className="mt-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            ✓ Item added! Redirecting to wardrobe…
          </p>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={loading || success}
          className="mt-7 w-full py-3.5 rounded-xl bg-[#6a9e76] hover:bg-[#5a8e66] active:bg-[#4e7d5a] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Save Item"}
        </button>
      </div>
    </div>
  );
}

// ── Reusable Select ──────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2d2d2d] mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#fdf6ee] border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#e8a87c] focus:border-transparent cursor-pointer"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b5a090]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
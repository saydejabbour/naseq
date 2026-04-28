"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* ✅ CATEGORY ONLY */
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

export default function WardrobePage() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);

  /* ✅ ONLY CATEGORY */
  const [filters, setFilters] = useState({
    category: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/clothing/user/${user.user_id}`
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (data.success) {
          setItems(data.data || []);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    if (user?.user_id) fetchItems();
  }, [user]);

  /* ================= FILTER ================= */
  const filtered = items.filter((item) => {
    return (
      !filters.category ||
      item.category_name?.toLowerCase() === filters.category.toLowerCase()
    );
  });

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-10 bg-[#FDF8F3] min-h-screen">

      {/* TITLE */}
      <h1 className="text-4xl font-serif text-[#1a2e1a] mb-6">
        My Wardrobe
      </h1>

      {/* ✅ ONLY CATEGORY FILTER */}
      <div className="flex flex-wrap gap-5 mb-8">

        <SelectField
          label="Category"
          value={filters.category}
          onChange={(v) => handleFilter("category", v)}
          options={CATEGORIES.map((c) => ({
            label: c.name,
            value: c.name,
          }))}
          placeholder="Select Category"
        />

      </div>

      {/* ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filtered.map((item) => (
          <div
            key={item.item_id}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
          >
            {/* IMAGE */}
            <div className="h-[260px] flex items-center justify-center">
              <img
                src={`http://127.0.0.1:5000${item.image_url}`}
                alt=""
                className="h-full object-contain"
              />
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                {item.category_name}
              </span>
            </div>

            
          </div>
        ))}

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No items found.
        </p>
      )}
    </div>
  );
}

/* ================= SELECT COMPONENT ================= */
function SelectField({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-[180px] relative">
      <label className="block text-sm font-medium text-[#2d2d2d] mb-1.5">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-[#f7efe6] border border-[#e3d6c7] 
        rounded-2xl px-5 py-3 text-sm flex justify-between items-center 
        cursor-pointer shadow-sm"
      >
        <span className={value ? "text-[#2d2d2d]" : "text-[#bfae9b]"}>
          {value || placeholder}
        </span>

        <svg width="16" height="16" viewBox="0 0 24 24" className="text-[#bfae9b]">
          <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-[#f7efe6] border border-[#e3d6c7] rounded-2xl shadow-md overflow-hidden">

          <div
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="px-4 py-2 text-[#bfae9b] hover:bg-[#efe4d6] cursor-pointer"
          >
            {placeholder}
          </div>

          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-[#efe4d6] cursor-pointer text-[#2d2d2d]"
            >
              {o.label}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
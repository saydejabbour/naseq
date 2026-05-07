"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const CLOTHING_API = "http://localhost:5000/api/clothing";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${CLOTHING_API}/categories`);
      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5ede3] px-10 py-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-serif text-[28px] font-semibold text-black">
          Manager Categories
        </h1>

        <button className="inline-flex items-center gap-2 rounded-lg bg-[#7ac653] px-6 py-3 text-[15px] font-medium text-white shadow-lg shadow-black/20 hover:bg-[#6ab746]">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-[0_4px_18px_rgba(0,0,0,0.18)]">
        <div className="grid grid-cols-[1.2fr_0.8fr_1fr] border-b border-[#ddd] bg-white px-7 py-4">
          <span className="font-serif text-[16px] font-semibold text-[#666]">
            category
          </span>
          <span className="font-serif text-[16px] font-semibold text-[#666]">
            item
          </span>
          <span className="font-serif text-[16px] font-semibold text-[#666]">
            Actions
          </span>
        </div>

        {loading ? (
          <div className="px-7 py-6 text-center text-[#888]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-7 py-6 text-center text-[#888]">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.category_id}
              className="grid grid-cols-[1.2fr_0.8fr_1fr] items-center border-b border-[#e5e5e5] bg-white px-7 py-4 shadow-[0_3px_10px_rgba(0,0,0,0.12)] last:border-b-0"
            >
              <span className="text-[15px] text-black">
                {category.name}
              </span>

              <span className="text-[15px] text-[#888]">
                {category.item_count || category.count || 0}
              </span>

              <div className="flex items-center gap-6">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#fdeeee] px-4 py-1.5 text-[15px] text-black hover:bg-[#f9dddd]">
                  <Pencil size={18} className="text-[#888]" />
                  Edit
                </button>

                <button className="inline-flex items-center gap-2 rounded-lg bg-[#fdeeee] px-4 py-1.5 text-[15px] text-red-500 hover:bg-[#f9dddd]">
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
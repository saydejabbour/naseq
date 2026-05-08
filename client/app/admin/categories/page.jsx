"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLOTHING_API = "http://localhost:5000/api/clothing";

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(category.category_id);
      const res = await fetch(
        `${CLOTHING_API}/categories/${category.category_id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to delete category");
        return;
      }
      setCategories((prev) =>
        prev.filter((item) => item.category_id !== category.category_id)
      );
      alert("Category deleted successfully");
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);
      alert("Server error while deleting category");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-[28px] font-semibold text-black">
          Manager Categories
        </h1>
        <button
          onClick={() => router.push("/admin/categories/add")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#7ac653] px-5 py-2.5 text-[14px] font-medium text-white shadow-md hover:bg-[#6ab746] transition-colors"
        >
          + Add Category
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white shadow-[0_4px_18px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_0.7fr_1fr] px-8 py-4 border-b border-[#ececec]">
          <span className="font-serif text-[14px] text-[#888]">category</span>
          <span className="font-serif text-[14px] text-[#888]">item</span>
          <span className="font-serif text-[14px] text-[#888]">Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="px-8 py-10 text-center text-[#aaa] text-[14px]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-8 py-10 text-center text-[#aaa] text-[14px]">
            No categories found.
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.category_id}
              className={`grid grid-cols-[1.5fr_0.7fr_1fr] items-center px-8 py-4 ${
                index !== categories.length - 1 ? "border-b border-[#f0f0f0]" : ""
              } hover:bg-[#fdf9f6] transition-colors`}
            >
              <span className="text-[15px] font-medium text-black">
                {category.name}
              </span>

              <span className="text-[14px] text-[#aaa]">
                {category.item_count ?? category.count ?? 0}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    router.push(`/admin/categories/${category.category_id}`)
                  }
                  className="rounded-lg bg-[#fde8e8] px-5 py-1.5 text-[13px] font-medium text-black hover:bg-[#f9d6d6] transition-colors"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.category_id}
                  className="rounded-lg bg-[#fde8e8] px-5 py-1.5 text-[13px] font-medium text-red-500 hover:bg-[#f9d6d6] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === category.category_id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
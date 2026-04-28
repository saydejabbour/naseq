"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MyTemplatesPage() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchTemplates = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/stylist/templates/user/${user.user_id}`
        );

        const data = await res.json();

        console.log("MY TEMPLATES RESPONSE:", data);

        if (data.success) {
          setTemplates(data.data || []);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error("Fetch templates error:", err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/stylist/templates/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Delete failed");
        return;
      }

      setTemplates((prev) => prev.filter((t) => t.template_id !== id));
    } catch (err) {
      console.error("Delete template error:", err);
      alert("Server error while deleting template");
    }
  };

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      {/* TITLE */}
      <h1 className="text-4xl font-serif text-[#2F3E34] mb-10">
        My Templates
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-[#6b6b6b] text-sm">
          Loading templates...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && templates.length === 0 && (
        <div className="bg-white border border-[#EADFD4] rounded-2xl p-8 text-center shadow-sm">
          <p className="text-[#2F3E34] font-medium">
            No templates yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Publish a template first, then it will appear here.
          </p>
        </div>
      )}

      {/* GRID */}
      {!loading && templates.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {templates.map((t) => {
            const imageSrc = t.image_url
              ? t.image_url.startsWith("http") ||
                t.image_url.startsWith("data:image")
                ? t.image_url
                : `http://localhost:5000${t.image_url}`
              : "/placeholder.png";

            return (
              <div
                key={t.template_id}
                className="
                  bg-white rounded-2xl p-4
                  shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                  transition
                "
              >
                {/* IMAGE */}
                <div className="w-full h-[220px] flex items-center justify-center bg-[#f6f6f6] rounded-xl overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={t.title || "Template image"}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* TITLE */}
                <h3 className="mt-4 text-[#2F3E34] font-medium text-sm">
                  {t.title}
                </h3>

                {/* DESCRIPTION */}
                {t.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {t.description}
                  </p>
                )}

                {/* OCCASION */}
                {t.occasion && (
                  <p className="mt-2 text-xs text-[#7CB98B] font-medium">
                    {t.occasion}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3 mt-3">
                  <button
                    className="
                      flex-1 text-xs px-3 py-1 rounded-full
                      bg-gray-100 text-gray-600
                    "
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.template_id)}
                    className="
                      flex-1 text-xs px-3 py-1 rounded-full
                      bg-red-50 text-red-500
                    "
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
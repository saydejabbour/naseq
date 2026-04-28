"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MyTemplatesPage() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/templates/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTemplates(data.data);
        }
      });
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;

    await fetch(`http://localhost:5000/api/templates/${id}`, {
      method: "DELETE",
    });

    setTemplates((prev) =>
      prev.filter((t) => t.template_id !== id)
    );
  };

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">

      {/* TITLE */}
      <h1 className="text-4xl font-serif text-[#2F3E34] mb-10">
        My Template
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-8">

        {templates.map((t) => {
          const imageSrc = t.image_url
            ? t.image_url.startsWith("http")
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
                  className="max-h-full object-contain"
                />
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-[#2F3E34] font-medium text-sm">
                {t.title}
              </h3>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-3">

                {/* EDIT */}
                <button
                  className="
                    flex-1 text-xs px-3 py-1 rounded-full
                    bg-gray-100 text-gray-600
                  "
                >
                  ✏️ Edit
                </button>

                {/* DELETE */}
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
    </div>
  );
}
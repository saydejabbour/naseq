"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// ✅ LUCIDE ICONS
import { Pencil, Trash2, Check } from "lucide-react";

export default function MyTemplatesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchTemplates = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/stylist/templates/user/${user.user_id}`
        );

        const data = await res.json();

        if (data.success) {
          setTemplates(data.data || []);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error(err);
        setTemplates([]);
        showToast("Failed to load templates", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Delete this template?");
      if (!confirmed) return;

      const res = await fetch(
        `http://localhost:5000/api/stylist/templates/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Delete failed", "error");
        return;
      }

      setTemplates((prev) =>
        prev.filter((t) => t.template_id !== id)
      );

      showToast("Template deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Server error while deleting template", "error");
    }
  };

  /* ================= RENAME ================= */
  const handleRename = async (id) => {
    if (!editTitle.trim()) {
      showToast("Template name cannot be empty", "error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/stylist/templates/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle.trim() }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Rename failed", "error");
        return;
      }

      setTemplates((prev) =>
        prev.map((t) =>
          t.template_id === id
            ? { ...t, title: editTitle.trim() }
            : t
        )
      );

      setEditingId(null);
      setEditTitle("");

      showToast("Template renamed successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Server error while renaming template", "error");
    }
  };

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      <h1 className="text-4xl font-serif text-[#2F3E34] mb-10">
        My Templates
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-[#6b6b6b] text-sm">Loading templates...</p>
      )}

      {/* EMPTY */}
      {!loading && templates.length === 0 && (
        <div className="bg-white border border-[#EADFD4] rounded-2xl p-8 text-center shadow-sm">
          <p className="text-[#2F3E34] font-medium">No templates yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Publish a template first.
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
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="w-full h-[220px] flex items-center justify-center bg-[#f6f6f6] rounded-xl overflow-hidden">
                  <img
                    src={imageSrc}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* TITLE / EDIT */}
                {editingId === t.template_id ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 border border-[#EADFD4] rounded-lg px-2 py-1 text-sm"
                    />

                    <button
                      onClick={() => handleRename(t.template_id)}
                      className="bg-[#7CB98B] text-white px-3 rounded-lg flex items-center justify-center"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <h3 className="mt-4 text-[#2F3E34] font-medium text-sm">
                    {t.title}
                  </h3>
                )}

                {/* DESCRIPTION */}
                {t.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {t.description}
                  </p>
                )}

                
                {/* STYLE + SEASON TAGS */}
 <div className="flex gap-2 flex-wrap mt-auto">
            {t.style && (
              <span className="text-xs bg-green-50 border px-2 py-1 rounded-full">
                {t.style}
              </span>
            )}
            {t.season && (
              <span className="text-xs bg-green-50 border px-2 py-1 rounded-full">
                {t.season}
              </span>
            )}
          </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditingId(t.template_id);
                      setEditTitle(t.title || "");
                    }}
                    className="flex-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center gap-1"
                  >
                    <Pencil size={12} />
                    Rename
                  </button>

                  <button
                    onClick={() => handleDelete(t.template_id)}
                    className="flex-1 text-xs px-3 py-1 rounded-full bg-red-50 text-red-500 flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} />
                    Delete
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
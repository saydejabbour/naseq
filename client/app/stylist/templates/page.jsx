"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Pencil, Trash2, Check } from "lucide-react";

export default function MyTemplatesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    templateId: null,
  });

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

  const handleDelete = async () => {
    if (!deleteModal.templateId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/stylist/templates/${deleteModal.templateId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Delete failed", "error");
        return;
      }

      setTemplates((prev) =>
        prev.filter((t) => t.template_id !== deleteModal.templateId)
      );

      setDeleteModal({ open: false, templateId: null });
      showToast("Template deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Server error while deleting template", "error");
    }
  };

  const handleRename = async (id) => {
    if (!editTitle.trim()) {
      showToast("Template name cannot be empty", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/stylist/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Rename failed", "error");
        return;
      }

      setTemplates((prev) =>
        prev.map((t) =>
          t.template_id === id ? { ...t, title: editTitle.trim() } : t
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

      {loading && (
        <p className="text-[#6b6b6b] text-sm">Loading templates...</p>
      )}

      {!loading && templates.length === 0 && (
        <div className="bg-white border border-[#EADFD4] rounded-2xl p-8 text-center shadow-sm">
          <p className="text-[#2F3E34] font-medium">No templates yet.</p>
          <p className="text-sm text-gray-500 mt-2">Publish a template first.</p>
        </div>
      )}

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
                <div className="w-full h-[220px] flex items-center justify-center bg-[#f6f6f6] rounded-xl overflow-hidden">
                  <img
                    src={imageSrc}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

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

                {t.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {t.description}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap mt-3">
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
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        templateId: t.template_id,
                      })
                    }
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

      {deleteModal.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{
            background: "rgba(20, 14, 10, 0.62)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            className="w-full max-w-sm p-7"
            style={{
              background:
                "linear-gradient(160deg, #FFFDF9 0%, #FFF5E9 100%)",
              borderRadius: "28px",
              border: "1px solid rgba(245, 185, 120, 0.35)",
              boxShadow:
                "0 2px 0 rgba(255,255,255,0.9) inset, 0 24px 60px rgba(47,62,52,0.18)",
            }}
          >
            <div
              className="mx-auto mb-4 flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(145deg, #FFE8CE, #FFD4A8)",
                border: "1.5px solid rgba(245, 160, 80, 0.3)",
                boxShadow: "0 2px 8px rgba(245,160,80,0.18)",
                color: "#D4782A",
              }}
            >
              <Trash2 size={22} strokeWidth={1.8} />
            </div>

            <h2
              className="text-center mb-1.5"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                color: "#2A3328",
                letterSpacing: "-0.01em",
              }}
            >
              Delete this template?
            </h2>

            <p
              className="text-center mb-6"
              style={{
                fontSize: 13.5,
                color: "#7C6E63",
                lineHeight: 1.6,
              }}
            >
              This template will be removed
              <br />
              from your templates.
            </p>

            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(210,170,120,0.35), transparent)",
                marginBottom: 20,
              }}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, templateId: null })
                }
                className="flex-1 py-2.5 text-sm font-medium transition-all"
                style={{
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(210,175,130,0.4)",
                  color: "#6B5B4F",
                  backdropFilter: "blur(4px)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-semibold transition-all"
                style={{
                  borderRadius: 14,
                  background:
                    "linear-gradient(160deg, #F5A040 0%, #E8843A 100%)",
                  border: "1px solid rgba(200,110,40,0.25)",
                  color: "#fff",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.25) inset, 0 4px 14px rgba(220,120,40,0.28)",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
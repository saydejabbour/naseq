"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MessageBox from "../../../components/ui/MessageBox";
import { useToast } from "@/context/ToastContext";
import { Pencil, Trash2, Check } from "lucide-react";

const CANVAS_W = 800;
const CANVAS_H = 550;

export default function SavedOutfitsPage() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  // ✅ NEW STATES
 
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState("");

  const { showToast } = useToast();
  
  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/outfits/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOutfits(data.data);
      });
  }, [user]);

  // ✅ DELETE LOGIC (no confirm)
  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/outfits/${selectedId}`, {
      method: "DELETE",
    });

    setOutfits((prev) => prev.filter((o) => o.outfit_id !== selectedId));
    setShowDelete(false);
    showToast("Outfit deleted successfully ");
  };

  // ✅ EDIT LOGIC (no prompt)
  const handleEditSave = async () => {
    await fetch(`http://localhost:5000/api/outfits/edit/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    setOutfits((prev) =>
      prev.map((o) =>
        o.outfit_id === selectedId ? { ...o, name: newName } : o
      )
    );

    setShowEdit(false);
    showToast("Outfit updated successfully");
  };

  const aspectRatio = `800 / 700`;

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      <h1 className="text-3xl font-serif text-[#2F3E34] mb-8">
        Saved Outfits
      </h1>

      {/* ✅ GLOBAL MESSAGE */}
      

      <div className="grid grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <div
            key={outfit.outfit_id}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition relative"
          >
            <div
              style={{ aspectRatio }}
              className="w-full overflow-hidden rounded-xl"
              onClick={() => setSelectedOutfit(outfit)}
            >
              <img
                src={`http://localhost:5000${outfit.image_url}`}
                alt={outfit.name}
                className="w-full h-full object-fill"
              />
            </div>

            {/* ✅ RENAME INPUT */}
{showEdit && selectedId === outfit.outfit_id ? (
  <div className="mt-3 flex items-center gap-2">
    <input
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      className="flex-1 border border-[#E5D5C7] rounded-xl px-3 py-2 text-sm outline-none"
    />

    <button
      onClick={handleEditSave}
      className="w-10 h-10 rounded-xl bg-[#8DB596] text-white flex items-center justify-center"
    >
      ✓
    </button>
  </div>
) : (
  <h3 className="mt-3 font-serif text-lg text-[#2F3E34]">
    {outfit.name}
  </h3>
)}

<div className="flex gap-2 mt-3">
  <button
    onClick={() => {
      setSelectedId(outfit.outfit_id);
      setNewName(outfit.name);
      setShowEdit(true);
    }}
    className="flex-1 px-3 py-2 text-sm bg-[#F4F1EC] rounded-xl text-[#2F3E34]"
  >
    <div className="flex items-center justify-center gap-2">
  <Pencil size={16} />
  <span>Rename</span>
</div>
  </button>

  <button
    onClick={() => {
      setSelectedId(outfit.outfit_id);
      setShowDelete(true);
    }}
    className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-600 rounded-xl"
  >
    <div className="flex items-center justify-center gap-2">
  <Trash2 size={16} />
  <span>Delete</span>
</div>
  </button>
</div>
          </div>
        ))}
      </div>

      {/* ✅ DELETE MODAL */}
      {showDelete && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    style={{
      background: "rgba(30, 22, 15, 0.45)",
      backdropFilter: "blur(2px)",
    }}
  >
    <div
      className="w-full max-w-sm p-7"
      style={{
        background: "linear-gradient(160deg, #FFFDF9 0%, #FFF5E9 100%)",
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
        }}
      >
        Delete this outfit?
      </h2>

      <p
        className="text-center mb-6"
        style={{ fontSize: 13.5, color: "#7C6E63", lineHeight: 1.6 }}
      >
        This outfit will be removed<br />from your saved outfits.
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
          onClick={() => setShowDelete(false)}
          className="flex-1 py-2.5 text-sm font-medium"
          style={{
            borderRadius: 14,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(210,175,130,0.4)",
            color: "#6B5B4F",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 py-2.5 text-sm font-semibold"
          style={{
            borderRadius: 14,
            background: "linear-gradient(160deg, #F5A040 0%, #E8843A 100%)",
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

      

      {/* VIEW MODAL */}
      {selectedOutfit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-6 relative"
            style={{ width: CANVAS_W / 1.4, height: "auto" }}
          >
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <div
              style={{ aspectRatio }}
              className="w-full overflow-hidden rounded-xl"
            >
              <img
                src={
                  selectedOutfit?.image_url
                    ? `http://localhost:5000${selectedOutfit.image_url}`
                    : "/placeholder.png"
                }
                alt={selectedOutfit?.name || "Outfit"}
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="mt-4 text-xl font-serif text-[#2F3E34]">
              {selectedOutfit.name}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// ✅ Must match the constant in OutfitBuilderPage
const CANVAS_W = 800;
const CANVAS_H = 550;

export default function SavedOutfitsPage() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/outfits/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOutfits(data.data);
      });
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this outfit?")) return;

    await fetch(`http://localhost:5000/api/outfits/${id}`, { method: "DELETE" });
    setOutfits((prev) => prev.filter((o) => o.outfit_id !== id));
  };

  const handleEdit = async (outfit) => {
    const newName = prompt("Enter new name", outfit.name);
    if (!newName) return;

    await fetch(`http://localhost:5000/api/outfits/edit/${outfit.outfit_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    setOutfits((prev) =>
      prev.map((o) =>
        o.outfit_id === outfit.outfit_id ? { ...o, name: newName } : o
      )
    );
  };

  // ✅ FIX 8: Render saved images inside a container that matches the original
  //    canvas aspect ratio (800×550 = ~1.454). Using a ratio-locked wrapper +
  //    object-fill (not object-contain) means the image fills exactly without
  //    letter-boxing that can make items look mis-positioned.
  const aspectRatio = `${CANVAS_W} / ${CANVAS_H}`;

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      <h1 className="text-3xl font-serif text-[#2F3E34] mb-8">Saved Outfits</h1>

      <div className="grid grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <div
            key={outfit.outfit_id}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition relative"
          >
            {/* ✅ FIX 8: ratio-locked wrapper */}
            <div
              style={{ aspectRatio }}
              className="w-full overflow-hidden rounded-xl"
              onClick={() => setSelectedOutfit(outfit)}
            >
              <img
                src={`http://localhost:5000${outfit.image_url}`}
                alt={outfit.name}
                // ✅ object-fill because the image IS 800×550 — no letter-boxing needed
                className="w-full h-full object-fill"
              />
            </div>

            <h3 className="mt-3 font-serif text-lg text-[#2F3E34]">
              {outfit.name}
            </h3>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(outfit)}
                className="px-3 py-1 text-sm bg-[#FFF3E0] rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(outfit.outfit_id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOutfit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 relative"
               style={{ width: CANVAS_W / 1.4, height: "auto" }}>
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            {/* ✅ FIX 8 in modal too */}
            <div style={{ aspectRatio }} className="w-full overflow-hidden rounded-xl">
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
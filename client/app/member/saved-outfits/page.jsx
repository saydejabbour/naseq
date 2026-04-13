"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SavedOutfitsPage() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/outfits/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOutfits(data.data);
        }
      });
  }, [user]);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this outfit?")) return;

    await fetch(`http://localhost:5000/api/outfits/${id}`, {
      method: "DELETE",
    });

    setOutfits((prev) => prev.filter((o) => o.outfit_id !== id));
  };

  // ✅ EDIT (rename)
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

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      <h1 className="text-3xl font-serif text-[#2F3E34] mb-8">
        Saved Outfits
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <div
            key={outfit.outfit_id}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition relative"
          >
            {/* IMAGE */}
            <img
              src={`http://localhost:5000${outfit.image_url}`}
              onClick={() => setSelectedOutfit(outfit)}
              className="w-full h-64 object-contain rounded-xl"
            />

            {/* NAME */}
            <h3 className="mt-3 font-serif text-lg text-[#2F3E34]">
              {outfit.name}
            </h3>

            {/* ACTIONS */}
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

      {/* 🔥 MODAL (BIG VIEW) */}
      {selectedOutfit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] relative">
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <img
              src={`http://localhost:5000${selectedOutfit.image_url}`}
              className="w-full h-[400px] object-contain"
            />

            <h2 className="mt-4 text-xl font-serif text-[#2F3E34]">
              {selectedOutfit.name}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
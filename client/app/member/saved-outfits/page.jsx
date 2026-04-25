"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MessageBox from "../../../components/ui/MessageBox";
import { useToast } from "@/context/ToastContext";

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

            <h3 className="mt-3 font-serif text-lg text-[#2F3E34]">
              {outfit.name}
            </h3>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setSelectedId(outfit.outfit_id);
                  setNewName(outfit.name);
                  setShowEdit(true);
                }}
                className="px-3 py-1 text-sm bg-[#FFF3E0] rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setSelectedId(outfit.outfit_id);
                  setShowDelete(true);
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="mb-4 text-sm">Delete this outfit?</p>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDelete(false)}>Cancel</button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[300px]">
            <p className="mb-2 text-sm">Enter new name</p>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)}>Cancel</button>

              <button
                onClick={handleEditSave}
                className="bg-[#2d4a2d] text-white px-4 py-2 rounded"
              >
                Save
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
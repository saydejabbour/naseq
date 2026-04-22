"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// 🔥 IMPORT YOUR EXISTING CARD (VERY IMPORTANT)
import OutfitCard from "../../../components/ui/OutfitCard";

export default function SavedTemplatesPage() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SAVED TEMPLATES
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchSaved = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/saved-templates/${user.user_id}`
        );

        const data = await res.json();

        if (data.success) {
          setTemplates(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user]);

  // ❤️ REMOVE TEMPLATE
  const handleRemove = async (template_id) => {
    try {
      await fetch(
        `http://localhost:5000/api/saved-templates/${user.user_id}/${template_id}`,
        { method: "DELETE" }
      );

      // 🔥 UPDATE UI INSTANTLY
      setTemplates((prev) =>
        prev.filter((item) => item.template_id !== template_id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <p className="text-[#2F3E34] text-lg">Loading saved looks...</p>
      </div>
    );
  }

  // ❌ EMPTY STATE
  if (templates.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F3] gap-4">
        <h2 className="text-2xl font-serif text-[#2F3E34]">
          No saved looks yet
        </h2>
        <p className="text-gray-500 text-sm">
          Start exploring and save your favorite outfits 💚
        </p>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 bg-[#FDF8F3] min-h-screen">
      <h1 className="text-3xl font-serif text-[#2F3E34] mb-8">
        Saved Looks
      </h1>

      {/* 🔥 SAME GRID AS EXPLORE */}
      <div className="grid grid-cols-4 gap-6">
        {templates.map((item) => (
          <OutfitCard
            key={item.template_id}
            outfit={{
              ...item,
              id: item.template_id, // ✅ VERY IMPORTANT
            }}
            isSaved={true} // 👈 tells card to show heart
            onRemove={() => handleRemove(item.template_id)}
          />
        ))}
      </div>
    </div>
  );
}
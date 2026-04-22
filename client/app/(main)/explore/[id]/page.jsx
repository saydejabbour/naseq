"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest, saveTemplate } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import OutfitDetailsUI from "./_components/OutfitDetailsUI";

export default function OutfitDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔥 FETCH OUTFIT
  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const res = await apiRequest(`/outfits/template/${id}`);

        if (res.success) {
          setOutfit(res.data);
        } else {
          setOutfit(null);
        }

      } catch (err) {
        console.error(err);
        setOutfit(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOutfit();
  }, [id]);

  // 🔥 SAVE FUNCTION
 const handleSave = async () => {
  if (!user) {
    router.push("/signup");
    return;
  }

  if (!outfit) return;

  setSaving(true);

  try {
    if (saved) {
      // 🔴 REMOVE
      await fetch(
        `http://localhost:5000/api/saved-templates/${user.user_id}/${outfit.id}`,
        { method: "DELETE" }
      );

      setSaved(false);

    } else {
      // 🟢 SAVE
      const res = await saveTemplate(user.user_id, outfit.id);

      if (res.success || res.message === "Already saved") {
        setSaved(true);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
};

useEffect(() => {
  const checkIfSaved = async () => {
    if (!user || !outfit) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/saved-templates/${user.user_id}`
      );

      const data = await res.json();

      if (data.success) {
        const exists = data.data.some(
          (item) => item.template_id === outfit.id
        );

        if (exists) setSaved(true);
      }

    } catch (err) {
      console.error(err);
    }
  };

  checkIfSaved();
}, [user, outfit]);

  return (
    <OutfitDetailsUI
      outfit={outfit}
      loading={loading}
      user={user}
      saved={saved}
      saving={saving}
      onSave={handleSave}
      onBack={() => router.back()}
      onSignup={() => router.push("/signup")}
    />
  );
}
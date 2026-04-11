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

  useEffect(() => {
    const fetchOutfit = async () => {
      const res = await apiRequest(`/outfits/${id}`);
      setOutfit(res.success ? res.data : null);
      setLoading(false);
    };

    if (id) fetchOutfit();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      router.push("/signup");
      return;
    }

    setSaving(true);
    const res = await saveTemplate(user.user_id, outfit.id);
    setSaving(false);

    if (res.success) setSaved(true);
  };

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
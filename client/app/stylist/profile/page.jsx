"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, Save, X, Camera, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = "http://localhost:5000";

export default function StylistProfilePage() {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    profile_photo: "",
  });

  const [portfolio, setPortfolio] = useState([]);
  const [postedOutfits, setPostedOutfits] = useState([]);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [portfolioUploading, setPortfolioUploading] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      fetchProfile();
      fetchPostedOutfits();
    }
  }, [user]);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http") || path.startsWith("data:image")) return path;
    return `${API}${path.startsWith("/") ? path : `/uploads/${path}`}`;
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/stylist/profile/${user.user_id}`);
      const data = await res.json();

      if (data.success) {
        setProfile({
          name: data.data?.name || user?.full_name || "Stylist Name",
          bio:
            data.data?.bio ||
            "Fashion stylist specializing in everyday chic looks.",
          profile_photo: data.data?.profile_photo || "",
        });

        setProfilePreview(data.data?.profile_photo || "");
        setPortfolio(data.data?.portfolio || []);
      }
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
    }
  };

  const addPortfolioImage = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setPortfolioUploading(true);

    const formData = new FormData();
    formData.append("user_id", user.user_id);
    formData.append("portfolioImage", file);

    const res = await fetch(`${API}/api/stylist/profile/portfolio`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      e.target.value = "";
      fetchProfile();
    }
  } catch (err) {
    console.error("PORTFOLIO UPLOAD ERROR:", err);
  } finally {
    setPortfolioUploading(false);
  }
};

const deletePortfolioImage = async (portfolioId) => {
  try {
    const res = await fetch(
      `${API}/api/stylist/profile/portfolio/${portfolioId}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (data.success) {
      setPortfolio((prev) =>
        prev.filter((item) => item.portfolio_id !== portfolioId)
      );
    }
  } catch (err) {
    console.error("DELETE PORTFOLIO ERROR:", err);
  }
};

  const fetchPostedOutfits = async () => {
    try {
      const res = await fetch(`${API}/api/stylist/templates/user/${user.user_id}`);
      const data = await res.json();

      if (data.success) {
        setPostedOutfits(data.data || []);
      }
    } catch (err) {
      console.error("FETCH POSTED OUTFITS ERROR:", err);
    }
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      const res = await fetch(`${API}/api/stylist/profile/save`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setEditing(false);
        setProfileFile(null);
        fetchProfile();
      }
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-16 py-14">
      {/* PROFILE CARD */}
      <div className="max-w-6xl rounded-3xl bg-white p-10 shadow-sm">
        <div className="flex items-center gap-10">
          <div className="relative shrink-0">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#DDF2DF] text-5xl font-semibold text-[#7CB98B]">
              {profilePreview ? (
                <img
                  src={getImageUrl(profilePreview)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0) || "S"
              )}
            </div>

            {editing && (
              <>
                <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#7CB98B] text-white shadow">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex-1">
            {!editing ? (
              <>
                <div className="mb-3 flex items-center gap-4">
                  <h1 className="font-serif text-4xl text-[#1f3b25]">
                    {profile.name}
                  </h1>

                  <button
                    onClick={() => setEditing(true)}
                    className="text-[#1f3b25] hover:text-[#7CB98B]"
                  >
                    <Edit2 size={24} />
                  </button>
                </div>

                <p className="text-lg text-gray-500">{profile.bio}</p>
              </>
            ) : (
              <div className="space-y-4">
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#FBF2EF] px-4 py-3 text-[#1f3b25] outline-none"
                />

                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl bg-[#FBF2EF] px-4 py-3 text-[#1f3b25] outline-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-[#7CB98B] px-5 py-2 text-white"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 rounded-lg bg-[#F3EDEA] px-5 py-2 text-[#1f3b25]"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <section className="mt-16 max-w-6xl">
       <div className="mb-8 flex items-center justify-between">
  <h2 className="font-serif text-4xl text-[#1f3b25]">
    Portfolio
  </h2>

  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#1f3b25] px-4 py-2 text-sm text-[#1f3b25] transition-colors hover:bg-[#1f3b25] hover:text-white">
    <Plus size={16} />
    {portfolioUploading ? "Uploading..." : "Add Portfolio Item"}

    <input
      type="file"
      accept="image/*"
      onChange={addPortfolioImage}
      className="hidden"
    />
  </label>
</div>

        {portfolio.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C8BB] bg-white p-10 text-center text-gray-400">
            No portfolio images yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6">
            {portfolio.map((item) => (
              <div
  key={item.portfolio_id}
  className="group relative h-[210px] overflow-hidden rounded-xl bg-white shadow-sm"
>
                <img
                  src={getImageUrl(item.image_url)}
                  alt="Portfolio"
                  className="h-full w-full object-contain p-2"
                />

                 <button
    onClick={() => deletePortfolioImage(item.portfolio_id)}
    className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-sm transition group-hover:flex hover:bg-red-200"
  >
    <Trash2 size={14} />
  </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MY POSTED OUTFITS */}
      <section className="mt-20 max-w-6xl">
        <h2 className="mb-8 font-serif text-4xl text-[#1f3b25]">
          My Posted Outfits
        </h2>

        {postedOutfits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C8BB] bg-white p-10 text-center text-gray-400">
            No posted outfits yet. Create a template to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {postedOutfits.map((outfit) => {
              const cardData = {
                id: outfit.template_id,
                title: outfit.title,
                image_url: outfit.image_url,
                stylist: profile.name,
                style: outfit.style,
                season: outfit.season,
              };

              return <ExploreStyleCard key={outfit.template_id} outfit={cardData} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ExploreStyleCard({ outfit }) {
  return (
    <Link href={`/explore/${outfit.id}`} className="w-full">
      <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-green-100 bg-white transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-[420px] bg-white">
          <img
            src={
              outfit.image_url
                ? outfit.image_url.startsWith("http") ||
                  outfit.image_url.startsWith("data:image")
                  ? outfit.image_url
                  : `${API}${outfit.image_url}`
                : "/placeholder.png"
            }
            alt={outfit.title}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-serif text-lg text-[#1a2e1a]">
            {outfit.title}
          </h3>

          <p className="text-sm font-medium text-green-600">
            {outfit.stylist}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {outfit.style && (
              <span className="rounded-full border bg-green-50 px-2 py-1 text-xs">
                {outfit.style}
              </span>
            )}

            {outfit.season && (
              <span className="rounded-full border bg-green-50 px-2 py-1 text-xs">
                {outfit.season}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
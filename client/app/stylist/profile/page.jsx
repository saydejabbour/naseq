"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Edit2, Plus, Save, X, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = "http://localhost:5000";

export default function StylistProfilePage() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

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

  useEffect(() => {
    if (user?.user_id) {
      fetchProfile();
      fetchPostedOutfits();
    }
  }, [user]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
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

  const fetchPostedOutfits = async () => {
    try {
      const res = await fetch(
        `${API}/api/stylist/templates/user/${user.user_id}`
      );
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
      } else {
        alert(data.message || "Profile save failed");
      }
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      alert("Profile save failed");
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
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
      } else {
        alert(data.message || "Portfolio upload failed");
      }
    } catch (err) {
      console.error("PORTFOLIO UPLOAD ERROR:", err);
      alert("Portfolio upload failed");
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

  const handleDeleteOutfit = async (templateId) => {
    if (!confirm("Delete this outfit?")) return;
    try {
      const res = await fetch(`${API}/api/stylist/templates/${templateId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPostedOutfits((prev) =>
          prev.filter((t) => t.template_id !== templateId)
        );
      }
    } catch (err) {
      console.error("DELETE OUTFIT ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-16 py-14">
      {/* Header */}
      <p className="mb-6 text-sm uppercase tracking-[0.18em] text-[#7CB98B]">
        Stylist Panel
      </p>
      <h1 className="mb-10 font-serif text-5xl text-[#1f3b25]">My Profile</h1>

      {/* Profile Card */}
      <div className="max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#DDF2DF] text-5xl font-semibold text-[#7CB98B]">
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
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#7CB98B] text-white shadow"
                >
                  <Camera size={17} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImage}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            {!editing ? (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="font-serif text-3xl text-[#1f3b25]">
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[#1f3b25] hover:text-[#7CB98B] transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
                <p className="max-w-2xl text-gray-500 leading-relaxed">
                  {profile.bio}
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f3b25]">
                    Name
                  </label>
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#FBF2EF] px-4 py-3 outline-none text-[#1f3b25]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1f3b25]">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows="3"
                    className="w-full rounded-xl bg-[#FBF2EF] px-4 py-3 outline-none text-[#1f3b25]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-[#7CB98B] px-5 py-2 text-white font-medium"
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

      {/* Portfolio Section */}
      <section className="mt-12 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#1f3b25]">Portfolio</h2>
          <button
            onClick={() => portfolioInputRef.current.click()}
            className="flex items-center gap-2 rounded-lg border border-[#1f3b25] px-4 py-2 text-sm hover:bg-[#1f3b25] hover:text-white transition-colors"
          >
            <Plus size={16} />
            Add Portfolio Item
          </button>
          <input
            ref={portfolioInputRef}
            type="file"
            accept="image/*"
            onChange={addPortfolioImage}
            className="hidden"
          />
        </div>

        {portfolio.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C8BB] bg-white p-10 text-center text-gray-400">
            No portfolio images yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {portfolio.map((item) => (
              <div
                key={item.portfolio_id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-white shadow"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt="Portfolio"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => deletePortfolioImage(item.portfolio_id)}
                  className="absolute right-2 top-2 hidden rounded-full bg-red-100 p-1.5 text-red-500 group-hover:flex items-center justify-center"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Posted Outfits Section */}
      <section className="mt-14 max-w-6xl">
        <h2 className="mb-6 font-serif text-3xl text-[#1f3b25]">
          My Posted Outfits
        </h2>

        {postedOutfits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C8BB] bg-white p-10 text-center text-gray-400">
            No posted outfits yet. Create a template to get started.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {postedOutfits.map((t) => {
              const imageSrc = t.image_url
                ? t.image_url.startsWith("http") ||
                  t.image_url.startsWith("data:image")
                  ? t.image_url
                  : `${API}${t.image_url}`
                : "/placeholder.png";

              return (
                <div
                  key={t.template_id}
                  className="group relative rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Image */}
                  <div className="h-56 w-full bg-[#f6f6f6] flex items-center justify-center overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={t.title || "Outfit"}
                      className="max-h-full max-w-full object-contain p-3"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-sm text-[#1f3b25] truncate">
                      {t.title}
                    </h3>

                    {t.description && (
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.occasion && (
                        <span className="rounded-full bg-[#EAF5EC] px-2.5 py-0.5 text-[10px] font-medium text-[#7CB98B]">
                          {t.occasion}
                        </span>
                      )}
                      {t.season && (
                        <span className="rounded-full bg-[#F0EBE8] px-2.5 py-0.5 text-[10px] font-medium text-[#a07c6a]">
                          {t.season}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-full bg-gray-100 py-1.5 text-xs text-gray-600 hover:bg-gray-200 transition-colors">
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOutfit(t.template_id)}
                        className="flex-1 rounded-full bg-red-50 py-1.5 text-xs text-red-500 hover:bg-red-100 transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
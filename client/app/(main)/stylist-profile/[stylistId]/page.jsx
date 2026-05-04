"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:5000";

export default function PublicStylistProfilePage({ params }) {
  const { stylistId } = use(params);

  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [postedOutfits, setPostedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http") || path.startsWith("data:image")) return path;
    return `${API}${path.startsWith("/") ? path : `/uploads/${path}`}`;
  };

  useEffect(() => {
    if (!stylistId || stylistId === "undefined") return;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(
  `http://localhost:5000/api/stylist/public/${stylistId}`
);

const data = await res.json();

if (data.success) {
  console.log("PUBLIC PROFILE DATA:", data.data);

  setProfile(data.data.profile);
  setPortfolio(data.data.portfolio || []);
  setPostedOutfits(data.data.templates || []);
}
      } catch (err) {
        console.error("PUBLIC PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [stylistId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        Loading stylist profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        Stylist not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-[#FDF8F3] px-16 py-14">
        <div className="max-w-[1100px] mx-auto px-6 py-10">

      {/* PROFILE CARD */}
      <div className="max-w-6xl rounded-3xl bg-white p-10 shadow-sm">
        <div className="flex items-center gap-10">
          <div className="relative shrink-0">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#DDF2DF] text-5xl font-semibold text-[#7CB98B]">
              {profile.profile_photo ? (
                <img
                  src={getImageUrl(profile.profile_photo)}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0) || "S"
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="mb-3 font-serif text-4xl text-[#1f3b25]">
              {profile.name}
            </h1>

            <p className="text-lg text-gray-500">
              {profile.bio}
            </p>
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
     <div className="mt-10">
  <h2 className="text-2xl font-serif text-[#2F3E34] mb-6">
    Portfolio
  </h2>

  {portfolio.length === 0 ? (
    <div className="border border-dashed rounded-2xl p-10 text-center text-gray-400">
      No portfolio images yet.
    </div>
  ) : (
    <div className="grid grid-cols-4 gap-4">
      {portfolio.map((item, i) => (
        <img
          key={i}
          src={`http://localhost:5000${item.image_url}`}
          className="w-full h-[260px] object-contain rounded-xl bg-white"
        />
      ))}
    </div>
  )}
</div>

      {/* POSTED OUTFITS */}
      <section className="mt-20 max-w-6xl">
        <h2 className="mb-8 font-serif text-4xl text-[#1f3b25]">
          Posted Outfits
        </h2>

        {postedOutfits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C8BB] bg-white p-10 text-center text-gray-400">
            No posted outfits yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {postedOutfits.map((outfit) => (
              <ExploreStyleCard
                key={outfit.template_id}
                outfit={{
                  id: outfit.template_id,
                  title: outfit.title,
                  image_url: outfit.image_url,
                  stylist: profile.name,
                  style: outfit.style,
                  season: outfit.season,
                }}
              />
            ))}
          </div>
        )}
      </section>
</div>
    </div>
  );
}

function ExploreStyleCard({ outfit }) {
  return (
    <Link href={`/explore/${outfit.id}`} className="w-full">
      <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white bg-white transition hover:-translate-y-1 hover:shadow-xl">
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
"use client";

import SaveButton from "./SaveButton";

export default function OutfitDetailsUI({
  outfit,
  loading,
  user,
  saved,
  saving,
  onSave,
  onBack,
  onSignup,
}) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] flex flex-col items-center justify-center gap-4">
        <div className="w-[10px] h-[10px] rounded-full bg-[#4a7c59] animate-pulse"></div>
        <span className="text-[20px] text-[#5a7a5a] italic">
          Curating your look…
        </span>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] flex items-center justify-center">
        <span className="text-[#5a7a5a] text-[20px] italic">
          This outfit could not be found.
        </span>
      </div>
    );
  }

  const tags = [outfit.style, outfit.season, outfit.occasion].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F7F2EC] pb-20 relative overflow-hidden font-sans">

      {/* BACK */}
      <button
        onClick={onBack}
        className="relative z-10 flex items-center gap-2 mt-8 ml-10 text-[#5a7a5a] text-[13px] uppercase tracking-[0.04em] opacity-70 hover:opacity-100"
      >
        ← Back
      </button>

      {/* MAIN */}
      <div className="relative z-10 max-w-[1100px] mx-auto mt-12 px-10 flex gap-[72px]">

        {/* IMAGE */}
        <div className="relative basis-[440px] shrink-0">
          <div className="rounded-[4px_24px_4px_24px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(40,60,40,0.14)]">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${outfit.image_url}`}
              alt={outfit.title}
              className="w-full h-[560px] object-contain bg-white"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 pt-3 flex flex-col">

          {/* TITLE */}
          <h1 className="text-[52px] font-light text-[#1a2e1a] mb-6 font-serif">
            {outfit.title}
          </h1>

          {/* DESC */}
          <p className="text-[15px] text-[#5a5a4a] mb-6">
            {outfit.description || "No description available"}
          </p>

          {/* TAGS */}
          <div className="flex gap-2 mb-8">
            {tags.map((tag) => (
              <span key={tag} className="text-xs border px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* SAVE BUTTON */}
          <SaveButton
            user={user}
            saved={saved}
            saving={saving}
            onSave={onSave}
            onSignup={onSignup}
          />

          <p className="text-xs text-gray-400 mt-3">
            Saved looks appear in your personal wardrobe archive.
          </p>

        </div>
      </div>
    </div>
  );
}
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

      {/* BLOBS */}
      <div className="fixed top-[-160px] right-[-160px] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(141,179,141,0.18)_0%,transparent_70%)]"></div>

      <div className="fixed bottom-[-200px] left-[-100px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(180,155,120,0.15)_0%,transparent_70%)]"></div>

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="relative z-10 flex items-center gap-2 mt-8 ml-10 text-[#5a7a5a] text-[13px] uppercase tracking-[0.04em] opacity-70 hover:opacity-100"
      >
        ← Back
      </button>

      {/* CONTAINER */}
      <div className="relative z-10 max-w-[1100px] mx-auto mt-12 px-10 flex gap-[72px]">

        {/* IMAGE */}
        <div className="relative basis-[440px] shrink-0">

          <div className="relative rounded-[4px_24px_4px_24px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(40,60,40,0.14)]">

           <img
  src={`${process.env.NEXT_PUBLIC_API_URL}${outfit.image_url}`}
  alt={outfit.title}
  className="w-full h-[560px] object-contain bg-white"
/>

            {/* corners */}
            <div className="absolute top-[14px] left-[14px] w-[32px] h-[32px] border-t-2 border-l-2 border-white/70"></div>
            <div className="absolute bottom-[14px] right-[14px] w-[32px] h-[32px] border-b-2 border-r-2 border-white/70"></div>
          </div>

          {/* stylist badge */}
          <div className="absolute bottom-[-22px] right-[24px] bg-white rounded-full px-5 py-2 flex items-center gap-3 shadow-[0_8px_28px_rgba(40,60,40,0.13)]">

            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#4a7c59] to-[#2d4a2d] text-white flex items-center justify-center">
              {outfit.stylist?.[0]?.toUpperCase() ?? "S"}
            </div>

            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.06em]">
                Curated by
              </div>
              <div className="text-[13px] text-[#2d4a2d] font-medium">
                {outfit.stylist}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 pt-3 flex flex-col">

          {/* CATEGORY */}
          {outfit.occasion && (
            <div className="bg-[rgba(74,124,89,0.1)] text-[#4a7c59] text-[10px] uppercase tracking-[0.12em] px-4 py-1 rounded-full border border-[#4a7c59]/20 mb-5 w-fit">
              {outfit.occasion}
            </div>
          )}

          {/* TITLE */}
          <h1 className="text-[52px] font-light text-[#1a2e1a] leading-tight mb-7 font-serif">
            {outfit.title}
          </h1>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#4a7c59]/30 to-transparent"></div>
            <div className="w-[5px] h-[5px] rounded-full bg-[#4a7c59]"></div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#4a7c59]/30 to-transparent"></div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-[15px] text-[#5a5a4a] leading-[1.8] mb-7">
            {outfit.description || "No description available"}
          </p>

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-9">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] border border-[#6b8f6b]/40 px-3 py-1 uppercase tracking-[0.08em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* BUTTON */}
          <SaveButton
            user={user}
            saved={saved}
            saving={saving}
            onSave={onSave}
            onSignup={onSignup}
          />

          {/* FOOT NOTE */}
          <p className="text-[11px] text-gray-400 mt-3">
            Saved looks appear in your personal wardrobe archive.
          </p>
        </div>
      </div>
    </div>
  );
}
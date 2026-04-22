"use client";
import { useRouter } from "next/navigation";


export default function OutfitCard({
  
  outfit,
  isSaved = false,
  onRemove = null,
}) {
  // 🔥 SUPPORT BOTH TYPES OF DATA
  const images =
    outfit.images
      ? outfit.images.split(",") // builder outfits
      : outfit.image_url
      ? [outfit.image_url] // stylist templates
      : [];

      const router = useRouter();
  return (
    <div
  onClick={() => {
    if (!outfit?.id && !outfit?.template_id) return;

    const id = outfit.id || outfit.template_id;

    router.push(`/explore/${id}`);
  }}
  className="bg-white rounded-2xl border border-[#e5e5e5] p-4 hover:shadow-lg transition relative cursor-pointer"
>

      {/* ❤️ REMOVE BUTTON (ONLY IN SAVED PAGE) */}
      {isSaved && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#7CB98B]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
            2 6 4 4 6.5 4c1.74 0 3.41 1.01 
            4.22 2.44h1.56C13.09 5.01 14.76 
            4 16.5 4 19 4 21 6 21 8.5c0 
            3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      )}

      {/* IMAGE */}
      <div className="w-full h-[260px] flex items-center justify-center overflow-hidden rounded-xl bg-[#f9f9f9]">
        <img
          src={`http://localhost:5000${images[0]}`}
          alt={outfit.title || outfit.name}
          className="h-full object-contain"
        />
      </div>

      {/* TITLE */}
      <h3 className="mt-3 font-serif text-lg text-[#2F3E34]">
        {outfit.title || outfit.name}
      </h3>

      {/* STYLIST / USER */}
      <p className="text-sm text-green-700">
        {outfit.stylist_name || "You"}
      </p>

      {/* TAGS */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {outfit.style && (
          <span className="text-xs border px-2 py-1 rounded">
            {outfit.style}
          </span>
        )}
        {outfit.season && (
          <span className="text-xs border px-2 py-1 rounded">
            {outfit.season}
          </span>
        )}
      </div>
    </div>
  );
}
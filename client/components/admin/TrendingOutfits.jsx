import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:5000";


export default function TrendingOutfits({ data = [], onAnnounce }) {
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-7 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#B0A99F] mb-1">
        Trending
      </p>
      <h2 className="text-[30px] font-bold text-[#2F3E34] leading-tight mb-0.5">
        Trending Outfits
      </h2>
      <p className="text-[#9B948B] text-sm mb-7">Most saved outfit templates</p>

      {data.length === 0 ? (
        <p className="text-[#9B948B]">No trending outfits yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((outfit, index) => (
            <div
  key={outfit.template_id}
  onClick={() => router.push(`/explore/${outfit.template_id}`)}
  className="flex items-center gap-5 rounded-2xl hover:bg-[#FDF8F3] transition p-2 cursor-pointer"
>
              <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#F8F1EA] border border-[#EDE5DC] flex-shrink-0">
                <img
                  src={getImageUrl(outfit.image_url)}
                  alt={outfit.title}
                  className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#2F3E34] text-base leading-tight truncate">
                  {outfit.title}
                </h3>
                <p className="text-xs text-[#B0A99F] mt-0.5">
                  by{" "}
                  <span className="text-[#9B948B] font-medium">
                    {outfit.stylist_name || outfit.stylist || outfit.full_name || "Unknown Stylist"}
                  </span>
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A962]" />
                  <p className="text-xs text-[#F5A962] font-bold">
                    {outfit.saves} save{outfit.saves > 1 ? "s" : ""}
                  </p>

                  {onAnnounce && (
  <button
    onClick={() => onAnnounce(outfit)}
    className="mt-2 px-3 py-1.5 rounded-xl bg-[#FFF1E3] text-[#F5A962] text-xs font-semibold hover:bg-[#F5A962] hover:text-white transition"
  >
    Announce
  </button>
)}
                </div>
              </div>

              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF1E3] flex items-center justify-center">
                <span className="text-[#F5A962] font-bold text-sm leading-none">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
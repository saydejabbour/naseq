const BASE_URL = "http://localhost:5000";

export default function TrendingOutfits({ data = [] }) {
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm">
      <h2 className="text-[30px] font-bold text-[#2F3E34] mb-1">
        Trending Outfits
      </h2>

      <p className="text-[#9B948B] mb-6">Most saved outfit templates</p>

      {data.length === 0 ? (
        <p className="text-[#9B948B]">No trending outfits yet.</p>
      ) : (
        <div className="space-y-5">
          {data.map((outfit, index) => (
            <div
              key={outfit.template_id}
              className="flex items-center gap-5 rounded-2xl hover:bg-[#FDF8F3] transition p-2"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F8F1EA] border border-[#E8DED2] flex-shrink-0">
                <img
                  src={getImageUrl(outfit.image_url)}
                  alt={outfit.title}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#2F3E34] text-lg truncate">
                  {outfit.title}
                </h3>

                <p className="text-sm text-[#9B948B]">
                  by {outfit.stylist_name || outfit.stylist || outfit.full_name || "Unknown Stylist"}
                </p>

                <p className="text-sm text-[#F5A962] font-semibold mt-1">
                  {outfit.saves} save{outfit.saves > 1 ? "s" : ""}
                </p>
              </div>

              <span className="text-[#F5A962] font-bold text-lg">
                #{index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
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

      <p className="text-[#9B948B] mb-6">Most saved outfit styles</p>

      {data.length === 0 ? (
        <p className="text-[#9B948B]">No trending outfits yet.</p>
      ) : (
        <div className="space-y-5">
          {data.map((outfit, index) => (
            <div key={outfit.template_id} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F3EEE8]">
                <img
                  src={getImageUrl(outfit.image_url)}
                  alt={outfit.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-[#2F3E34]">
                  {outfit.title}
                </h3>
                <p className="text-sm text-[#9B948B]">
                  {outfit.saves} saves
                </p>
              </div>

              <span className="text-[#F5A962] font-bold">#{index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
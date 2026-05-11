const outfits = [
  {
    title: "Evening Elegance",
    saves: "2.3k saves",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
  },
  {
    title: "Casual Chic",
    saves: "1.8k saves",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
  },
  {
    title: "Summer Vibes",
    saves: "1.5k saves",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
  },
];

export default function TrendingOutfits() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm">
      <h2 className="text-[30px] font-bold text-[#2F3E34] mb-1">
        Trending Outfits
      </h2>

      <p className="text-[#9B948B] mb-6">Most saved outfit styles</p>

      <div className="space-y-5">
        {outfits.map((outfit, index) => (
          <div key={outfit.title} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F3EEE8]">
              <img
                src={outfit.image}
                alt={outfit.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-[#2F3E34]">{outfit.title}</h3>
              <p className="text-sm text-[#9B948B]">{outfit.saves}</p>
            </div>

            <span className="text-[#F5A962] font-bold">#{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
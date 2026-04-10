export default function Card({ outfit }) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition flex flex-col cursor-pointer">

      <div className="relative h-[420px] bg-green-50">
        <img
          src={outfit.image_url}
          alt={outfit.title}
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        {outfit.occasion && (
          <span className="absolute top-3 right-3 bg-white/90 border border-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
            {outfit.occasion}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-serif text-[#1a2e1a]">
          {outfit.title}
        </h3>
        <p className="text-sm text-green-600 font-medium">
          {outfit.stylist}
        </p>

        <div className="flex gap-2 flex-wrap mt-auto">
          {outfit.style && <span className="text-xs bg-green-50 border px-2 py-1 rounded-full">{outfit.style}</span>}
          {outfit.season && <span className="text-xs bg-green-50 border px-2 py-1 rounded-full">{outfit.season}</span>}
        </div>
      </div>

    </div>
  );
}
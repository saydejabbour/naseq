export default function OutfitCard({ outfit }) {
  const images = outfit.images ? outfit.images.split(",") : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4">

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {images.slice(0, 4).map((img, index) => (
          <img
            key={index}
            src={`http://localhost:5000${img}`}
            className="w-full h-28 object-contain bg-[#f9f9f9] rounded-lg"
          />
        ))}
      </div>

      {/* TITLE */}
      <h3 className="text-md font-serif text-[#2F3E34]">
        {outfit.name}
      </h3>

      {/* FAKE STYLIST (optional for now) */}
      <p className="text-xs text-gray-500 mb-2">
        You
      </p>

      {/* TAGS */}
      <div className="flex gap-2">
        <span className="bg-[#E8F5E9] text-[#2F3E34] text-xs px-3 py-1 rounded-full">
          Casual
        </span>
        <span className="bg-[#E8F5E9] text-[#2F3E34] text-xs px-3 py-1 rounded-full">
          All Season
        </span>
      </div>
    </div>
  );
}
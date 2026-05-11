export default function TopCategories({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm">
      <h2 className="text-[30px] font-bold text-[#2F3E34] mb-1">
        Top Categories
      </h2>

      <p className="text-[#9B948B] mb-8">
        Most used wardrobe categories
      </p>

      {data.length === 0 ? (
        <p className="text-[#9B948B]">No category data yet.</p>
      ) : (
        <div className="space-y-6">
          {data.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-[#2F3E34]">
                  {category.name}
                </span>

                <span className="text-[#9B948B]">
                  {category.percent}%
                </span>
              </div>

              <div className="h-3 bg-[#F3EEE8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7CB98B] rounded-full"
                  style={{ width: `${category.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default function ExploreHeader({ count }) {
  return (
    <div className="flex justify-between items-end px-10 py-10 border-b">
      <h1 className="text-4xl font-serif">Explore Outfits</h1>
      <p className="text-gray-500">{count} looks</p>
    </div>
  );
}
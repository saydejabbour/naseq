export default function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by stylist..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        px-3 py-2 
        border border-[#F5A962] 
        rounded-lg 
        w-full max-w-xs 
        outline-none 
        focus:ring-2 focus:ring-[#F5A962] 
        focus:border-[#F5A962]
      "
    />
  );
}
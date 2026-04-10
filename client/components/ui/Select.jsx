export default function Select({ value, onChange, label, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        px-5 py-2.5
        border border-[#F5A962]
        rounded-full
        bg-[#FFF3E0]
        text-[#7A4B1F]
        font-medium
        outline-none
        focus:ring-2 focus:ring-[#F5A962]
        focus:bg-[#FFE8CC]
        transition
        cursor-pointer
      "
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
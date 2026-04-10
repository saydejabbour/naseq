export default function FilterPill({ label, onClear }) {
  return (
    <span
      className="
        flex items-center gap-2 
        bg-[#FFF3E0] 
        border border-[#C9855E]
        text-[#C46A1E] 
        px-3 py-1 
        rounded-full 
        text-sm
      "
    >
      {label}

      <button
        onClick={onClear}
        className="
          flex items-center justify-center
          w-4 h-4 
          rounded-full 
          bg-[#F5A962] 
          text-white 
          text-xs 
          hover:opacity-80 
          transition
        "
      >
        ×
      </button>
    </span>
  );
}
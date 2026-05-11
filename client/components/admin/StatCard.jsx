import { ArrowUp } from "lucide-react";

export default function StatCard({
  icon,
  title,
  value,
  badge,
  accent = "green",
}) {
  const iconStyles =
    accent === "orange"
      ? "bg-[#FFF1E3] text-[#F5A962]"
      : "bg-[#EAF6EE] text-[#7CB98B]";

  return (
    <div className="group bg-white rounded-2xl border border-[#E8DED2] shadow-sm p-6 min-h-[145px] flex flex-col justify-between hover:shadow-md hover:border-[#D4C9BC] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconStyles} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

        {badge && (
          <div className="px-3 py-1 rounded-full bg-[#EAF6EE] text-[#7CB98B] text-xs font-bold flex items-center gap-1 tracking-wide">
            <ArrowUp size={11} strokeWidth={2.5} />
            {badge}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B0A99F] mb-1">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-[#2F3E34] leading-none">
          {value}
        </h2>
      </div>
    </div>
  );
}
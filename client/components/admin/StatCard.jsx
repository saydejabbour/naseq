import { ArrowUp } from "lucide-react";

export default function StatCard({
  icon,
  title,
  value,
  badge,
  accent = "green",
  action,
}) {
  const accentStyles =
    accent === "orange"
      ? "bg-[#FFF1E3] text-[#F5A962]"
      : "bg-[#EAF6EE] text-[#7CB98B]";

  return (
    <div className="bg-white rounded-2xl border border-[#E8DED2] shadow-sm p-6 min-h-[170px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${accentStyles}`}
        >
          {icon}
        </div>

        {badge && (
          <div className="px-3 py-1 rounded-full bg-[#EAF6EE] text-[#7CB98B] text-sm font-semibold flex items-center gap-1">
            <ArrowUp size={13} />
            {badge}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm text-[#9B948B] uppercase tracking-[0.12em] font-semibold mb-2">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-[#2F3E34] leading-tight">
          {value}
        </h2>

        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
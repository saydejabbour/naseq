"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OutfitsBarChart({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-7 shadow-sm h-[400px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B0A99F] mb-1">
            Activity
          </p>
          <h2 className="text-[32px] font-bold text-[#2F3E34] leading-tight">
            Outfits Created
          </h2>
          <p className="text-[#9B948B] text-sm mt-0.5">
            Monthly outfit activity
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF1E3] rounded-xl px-3 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5A962]" />
          <span className="text-xs font-semibold text-[#F5A962]">Outfits</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: -10, right: 10 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5A962" stopOpacity={1} />
              <stop offset="100%" stopColor="#F8CFA3" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#F0EBE4"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#B0A99F", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#B0A99F", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #E8DED2",
              background: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
              fontSize: "13px",
            }}
            cursor={{ fill: "#FDF8F3" }}
          />
          <Bar
            dataKey="outfits"
            fill="url(#barGradient)"
            radius={[12, 12, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
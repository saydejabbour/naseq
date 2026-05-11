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
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm h-[400px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[34px] font-bold text-[#2F3E34]">
            Outfits Created
          </h2>

          <p className="text-[#9B948B] text-lg">
            Monthly outfit generation
          </p>
        </div>

        <div className="bg-[#FFF1E3] text-[#F5A962] px-4 py-2 rounded-full text-sm font-semibold">
          Real Data
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ECE7E1" />

          <XAxis
            dataKey="month"
            tick={{ fill: "#9B948B", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#9B948B", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid #ECE7E1",
              background: "#fff",
            }}
          />

          <Bar dataKey="outfits" fill="#F5A962" radius={[14, 14, 0, 0]} barSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function UserGrowthChart({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-7 shadow-sm h-[400px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B0A99F] mb-1">
            Overview
          </p>
          <h2 className="text-[32px] font-bold text-[#2F3E34] leading-tight">
            User Growth
          </h2>
          <p className="text-[#9B948B] text-sm mt-0.5">
            Monthly registered users
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#EAF6EE] rounded-xl px-3 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7CB98B]" />
          <span className="text-xs font-semibold text-[#7CB98B]">Users</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ left: -10, right: 10 }}>
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A8D5B2" />
              <stop offset="100%" stopColor="#7CB98B" />
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
            cursor={{ stroke: "#E8DED2", strokeWidth: 2, strokeDasharray: "4 4" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="url(#lineGlow)"
            strokeWidth={3.5}
            dot={{ r: 4, fill: "#fff", stroke: "#7CB98B", strokeWidth: 2.5 }}
            activeDot={{ r: 7, fill: "#7CB98B", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
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
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm h-[400px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[34px] font-bold text-[#2F3E34]">
            User Growth
          </h2>

          <p className="text-[#9B948B] text-lg">
           Monthly registered users
          </p>
        </div>

       
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#ECE7E1"
          />

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

          <Line
            type="monotone"
            dataKey="users"
            stroke="#7CB98B"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#7CB98B",
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = ["#7CB98B", "#F5A962", "#A8D5B2", "#F8CFA3", "#D9C7B8"];

export default function TopCategories({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.percent,
  }));

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-7 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#B0A99F] mb-1">
        Breakdown
      </p>
      <h2 className="text-[30px] font-bold text-[#2F3E34] leading-tight mb-0.5">
        Top Categories
      </h2>
      <p className="text-[#9B948B] text-sm mb-7">
        Most used wardrobe categories
      </p>

      {chartData.length === 0 ? (
        <p className="text-[#9B948B]">No category data yet.</p>
      ) : (
        <div className="flex items-center gap-8">
          <div className="w-[240px] h-[240px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E8DED2",
                    background: "#fff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3">
            {chartData.map((category, index) => (
              <div key={category.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-semibold text-[#2F3E34]">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#9B948B]">
                    {category.value}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F3EDE7] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.value}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
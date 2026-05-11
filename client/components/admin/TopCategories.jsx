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
    <div className="bg-white rounded-3xl border border-[#E8DED2] p-6 shadow-sm">
      <h2 className="text-[30px] font-bold text-[#2F3E34] mb-1">
        Top Categories
      </h2>

      <p className="text-[#9B948B] mb-6">
        Most used wardrobe categories
      </p>

      {chartData.length === 0 ? (
        <p className="text-[#9B948B]">No category data yet.</p>
      ) : (
        <div className="flex items-center gap-8">
          <div className="w-[260px] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
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
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-4">
            {chartData.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-semibold text-[#2F3E34]">
                    {category.name}
                  </span>
                </div>

                <span className="text-[#9B948B] font-medium">
                  {category.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
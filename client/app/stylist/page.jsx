"use client";

import Link from "next/link";
import { PlusCircle, LayoutGrid, ArrowRight } from "lucide-react";

const cards = [
  {
    label: "Create Template",
    description: "Design and publish outfit templates",
    href: "/stylist/createtemplate",
    Icon: PlusCircle,
    bg: "bg-[#E8F5E9]",
    border: "border-[#CDE5D5]",
    iconBg: "bg-[#7CB98B]",
    arrowColor: "text-[#1a2e1a]",
    tag: "Create",
  },
  {
    label: "My Templates",
    description: "View and manage your templates",
    href: "/stylist/template",
    Icon: LayoutGrid,
    bg: "bg-[#FDF1E3]",
    border: "border-[#F5D6A5]",
    iconBg: "bg-[#F5A962]",
    arrowColor: "text-[#1a2e1a]",
    tag: "Manage",
  },
];

export default function StylistDashboard() {
  return (
    <div className="bg-[#FDF8F3] min-h-screen">

      {/* HEADER */}
      <div className="px-10 pt-14 pb-24">
        <p className="text-xs uppercase tracking-widest text-[#7CB98B] mb-3">
          Stylist Panel
        </p>

        <h1 className="text-6xl font-serif text-[#1a2e1a] leading-tight">
          Create your style,<br />
          <span className="italic text-[#F5A962]">
            inspire every look
          </span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          Design outfit templates and share your fashion creativity.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-10 -mt-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs uppercase text-gray-400">
            Quick Actions
          </span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
          {cards.map((card) => {
            const Icon = card.Icon;

            return (
              <Link
                key={card.label}
                href={card.href}
                className={`${card.bg} ${card.border}
                  border rounded-2xl p-6 cursor-pointer
                  flex flex-col gap-6 min-h-[180px]
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <div className={`${card.iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-white`}>
                    <Icon size={20} />
                  </div>

                  <span className={`${card.arrowColor} text-xs uppercase tracking-wide`}>
                    {card.tag}
                  </span>
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-xl font-serif text-[#1a2e1a]">
                    {card.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                </div>

                {/* ACTION */}
                <div className={`${card.arrowColor} flex items-center gap-1 text-sm mt-auto`}>
                  Open <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
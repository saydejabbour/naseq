"use client";

import { useRouter } from "next/navigation";
import { Users, List, ArrowRight } from "lucide-react";

const cards = [
  {
    label: "Stylist Accounts",
    description: "Manage and approve stylists",
    href: "/admin/stylists",
    Icon: Users,
    bg: "bg-[#EDF7EF]",
    border: "border-[#D9EEDC]",
    iconBg: "bg-[#2D3A3A]",
    arrowColor: "text-[#1a2e1a]",
    tag: "Users",
  },
  {
    label: "Categories",
    description: "Manage clothing categories",
    href: "/admin/categories",
    Icon: List,
    bg: "bg-[#FFF3E0]",
    border: "border-[#F5D6A5]",
    iconBg: "bg-[#F5A962]",
    arrowColor: "text-[#A05A1C]",
    tag: "Manage",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="bg-[#FDF8F3] min-h-screen">

      {/* 🔥 HERO HEADER */}
      <div className="px-10 pt-14 pb-24">
        <p className="text-xs uppercase tracking-widest text-[#7CB98B] mb-3">
          Admin Panel
        </p>

        <h1 className="text-6xl font-serif text-[#1a2e1a] leading-tight">
          Control the system,<br />
          <span className="italic text-[#7CB98B]">
            shape the experience
          </span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          Oversee users, manage categories, and maintain platform quality.
        </p>
      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="px-10 -mt-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs uppercase text-gray-400">
            Management
          </span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {cards.map((card) => {
            const Icon = card.Icon;

            return (
              <div
                key={card.label}
                onClick={() => router.push(card.href)}
                className={`${card.bg} ${card.border}
                  border rounded-2xl p-6 cursor-pointer
                  flex flex-col gap-6 min-h-[180px]
                  hover:shadow-xl hover:-translate-y-1 transition`}
              >
                <div className="flex justify-between">
                  <div className={`${card.iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-white`}>
                    <Icon size={20} />
                  </div>
                  <span className={`${card.arrowColor} text-xs uppercase`}>
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif text-[#1a2e1a]">
                    {card.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>

                <div className={`${card.arrowColor} flex items-center gap-1 text-sm`}>
                  Open <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
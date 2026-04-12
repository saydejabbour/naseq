"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ✅ LUCIDE ICONS */
import {
  PlusCircle,
  Sparkles,
  LayoutGrid,
  ArrowRight
} from "lucide-react";

const cards = [
  {
    label: "Add Item",
    description: "Add a new clothing item to your wardrobe",
    href: "/member/item",
    Icon: PlusCircle,
    bg: "bg-[#E8F5E9]",
    border: "border-[#CDE5D5]",
    iconBg: "bg-[#7CB98B]",
    iconColor: "text-white",
    arrowColor: "text-[#1a2e1a]",
    tag: "Wardrobe",
  },
  {
    label: "Generate Outfit",
    description: "Create outfit combinations from your wardrobe",
    href: "/member/generate",
    Icon: Sparkles,
    bg: "bg-[#FFF3E0]",
    border: "border-[#F5D6A5]",
    iconBg: "bg-[#F5A962]",
    iconColor: "text-white",
    arrowColor: "text-[#A05A1C]",
    tag: "Mix & Match",
  },
  {
    label: "Build Outfit",
    description: "Build your own outfit on a canvas",
    href: "/member/builder",
    Icon: LayoutGrid,
    bg: "bg-[#F7F3EE]",
    border: "border-[#E5DCD3]",
    iconBg: "bg-[#D6C2A6]",
    iconColor: "text-white",
    arrowColor: "text-[#7A5C3A]",
    tag: "Create",
  },
];

export default function MemberDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="p-10 bg-[#FDF8F3] min-h-screen">

      {/* HEADER */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7CB98B] mb-3">
          Member Portal
        </p>

        <h1 className="text-5xl font-serif text-[#1a2e1a] leading-tight mb-3">
          Welcome back,<br />
          <span className="italic text-[#F5A962]">
            what’s today’s look?
          </span>
        </h1>

        <p className="text-[#7A7A7A] text-base">
          Your style companion is ready — here's what you can do.
        </p>
      </div>

      {/* 🔥 APPLICATION STATUS */}
      {user?.stylistApplication && (
        <div className="mb-8">

          {/* PENDING */}
          {user.stylistApplication.status === "pending" && (
            <div className="bg-[#FFF3E0] border border-orange-200 text-orange-700 px-5 py-3 rounded-xl text-sm">
              Your stylist application is under review
            </div>
          )}

          {/* APPROVED */}
          {user.stylistApplication.status === "approved" && (
            <div className="bg-[#E8F5E9] border border-green-200 px-5 py-4 rounded-xl flex items-center justify-between">
              
              <span className="text-green-700 text-sm font-medium">
                You are approved as a stylist!
              </span>

              <button
                onClick={() => router.push("/stylist")}
                className="bg-[#7CB98B] hover:bg-[#6aa879] text-white px-4 py-2 rounded-md text-xs"
              >
                Go to Dashboard
              </button>

            </div>
          )}

        </div>
      )}

      {/* SECTION */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#ABABAB]">
          Quick Actions
        </span>
        <div className="flex-1 h-px bg-[#E8E2D9]" />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.Icon;

          return (
            <div
              key={card.label}
              onClick={() => router.push(card.href)}
              className={`${card.bg} ${card.border}
                border rounded-2xl p-6 cursor-pointer
                flex flex-col justify-between gap-6
                min-h-[200px]
                hover:shadow-lg hover:-translate-y-1 transition`}
            >
              <div className="flex items-start justify-between">
                <div className={`${card.iconBg} ${card.iconColor} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  <Icon size={20} />
                </div>

                <span className={`text-xs font-semibold uppercase ${card.arrowColor} opacity-70`}>
                  {card.tag}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif text-[#1a2e1a] mb-1">
                  {card.label}
                </h3>
                <p className="text-sm text-[#777]">
                  {card.description}
                </p>
              </div>

              <div className={`flex items-center gap-1 text-sm font-medium ${card.arrowColor}`}>
                <span>Get started</span>
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
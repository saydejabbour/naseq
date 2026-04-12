"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ✅ LUCIDE ICONS */
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  LayoutGrid,
  Heart,
  Bookmark,
  Sparkles,
  Users,
  List,
  LogOut,
} from "lucide-react";

export default function Sidebar({ role }) {
  const pathname = usePathname();

  /* 🎯 MENUS PER ROLE */
  const menus = {
    member: [
      { label: "Dashboard", href: "/member", icon: LayoutDashboard },
      { label: "My Wardrobe", href: "/member/wardrobe", icon: Shirt },
      { label: "Add Item", href: "/member/item", icon: PlusCircle },
      { label: "Outfit Builder", href: "/member/builder", icon: LayoutGrid },
      { label: "Saved Outfits", href: "/member/outfits", icon: Heart },
      { label: "Saved Templates", href: "/member/templates", icon: Bookmark },
      { label: "Generate Outfit", href: "/member/generate", icon: Sparkles },
    ],

    stylist: [
      { label: "Dashboard", href: "/stylist", icon: LayoutDashboard },
      { label: "My Profile", href: "/stylist/profile", icon: Shirt },
      { label: "My Wardrobe", href: "/stylist/wardrobe", icon: UserCircle },
      { label: "Add Item", href: "/stylist/item", icon: PlusCircle },
      { label: "Create Template", href: "/stylist/create", icon: PlusCircle },
      { label: "My Templates", href: "/stylist/templates", icon: LayoutGrid },
    ],

    admin: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Stylist Accounts", href: "/admin/stylists", icon: Users },
      { label: "Categories", href: "/admin/categories", icon: List },
    ],
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E8E2D9] p-6 flex flex-col justify-between">

      {/* 🔝 TOP */}
      <div>
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
          <span className="font-serif text-lg text-[#1a2e1a]">Naseq</span>
        </Link>

        {/* MENU */}
        <nav className="flex flex-col gap-2 text-sm">
          {menus[role]?.map((item, i) => {
            const isActive = pathname === item.href;

            const Icon = item.icon;

            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-[#E8F5E9] text-[#1a2e1a] font-medium"
                      : "text-gray-600 hover:bg-[#F5F5F5]"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🔻 LOGOUT */}
      <button className="flex items-center gap-3 text-gray-500 hover:text-[#1a2e1a] transition">
        <LogOut size={18} />
        Logout
      </button>

    </aside>
  );
}
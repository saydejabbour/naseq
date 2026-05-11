"use client";

import { useEffect, useState } from "react";
import { Users, Shirt, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import StatCard from "@/components/admin/StatCard";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import OutfitsBarChart from "@/components/admin/OutfitsBarChart";
import TopCategories from "@/components/admin/TopCategories";
import TrendingOutfits from "@/components/admin/TrendingOutfits";

const API_URL = "http://localhost:5000/api/admin-dashboard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <p className="text-[#2F3E34] text-lg font-semibold">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const announcePopularStyle = () => {
  const title = "Popular Style of the Month";
  const message = `${stats?.mostPopularStyle} is currently the most popular style on Naseq.`;

  router.push(
    `/admin/announcements?title=${encodeURIComponent(
      title
    )}&message=${encodeURIComponent(message)}&target_role=all&type=highlight`
  );
};

const announceTrendingOutfit = (outfit) => {
  const title = "Trending Outfit of the Month";
  const message = `${outfit.title} by ${
    outfit.stylist_name || "a Naseq stylist"
  } is one of the most saved outfits on Naseq.`;

  router.push(
    `/admin/announcements?title=${encodeURIComponent(
      title
    )}&message=${encodeURIComponent(message)}&target_role=all&type=highlight`
  );
};

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[42px] font-bold text-[#2F3E34]">
          Admin Dashboard
        </h1>
        <p className="text-[#9B948B] text-lg">
          Monitor users, outfits, saves, and platform activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users size={24} />}
          title="Total Users"
          value={stats?.totalUsers || 0}
          badge="+12%"
        />

        <StatCard
          icon={<Shirt size={24} />}
          title="Outfits Created"
          value={stats?.outfitsCreated || 0}
          badge="+8%"
          accent="orange"
        />

       <StatCard
  icon={<Sparkles size={24} />}
  title="Popular Style"
  value={stats?.mostPopularStyle || "No Data"}
  action={
    <button
    onClick={announcePopularStyle}
    className="px-4 py-2 rounded-full bg-[#FFF1E3] text-[#F5A962] font-semibold text-sm hover:bg-[#F5A962] hover:text-white transition"
  >
      Announce This Style
    </button>
  }
/>

        <StatCard
          icon={<Heart size={24} />}
          title="Total Saves"
          value={stats?.totalSaves || 0}
          badge="+15%"
          accent="orange"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
       <UserGrowthChart data={stats?.userGrowth || []} />
       <OutfitsBarChart data={stats?.outfitsPerMonth || []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TopCategories data={stats?.topCategories || []} />
        <TrendingOutfits
  data={stats?.trendingOutfits || []}
  onAnnounce={announceTrendingOutfit}
/>
      </div>
    </div>
  );
}
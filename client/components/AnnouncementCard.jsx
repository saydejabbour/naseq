"use client";

import { useEffect, useState } from "react";

import { Megaphone, X } from "lucide-react";

const API_URL = "http://localhost:5000/api/announcements";

export default function AnnouncementCard({ role = "member" }) {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

const res = await fetch(
  `${API_URL}?user_id=${storedUser?.user_id || ""}`
);
      const data = await res.json();

      if (data.success) {
        const filtered = data.data.filter(
          (item) =>
            item.is_active === 1 &&
            (item.target_role === role || item.target_role === "all")
        );

        setAnnouncements(filtered);
      }
    } catch (error) {
      console.log("Announcements fetch error:", error);
    }
  };

  const handleDismiss = async (announcementId) => {
  try {
   const storedUser = JSON.parse(localStorage.getItem("user"));

const res = await fetch(
  `${API_URL}?user_id=${storedUser?.user_id || ""}`
);

    if (!storedUser?.user_id) return;

    await fetch(`${API_URL}/dismiss`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        announcement_id: announcementId,
        user_id: storedUser.user_id,
      }),
    });

    setAnnouncements((prev) =>
      prev.filter(
        (item) => item.announcement_id !== announcementId
      )
    );
  } catch (error) {
    console.log("Dismiss error:", error);
  }
};

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-[#FFF1E3] text-[#F5A962] flex items-center justify-center">
          <Megaphone size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#2F3E34]">
            Announcements
          </h2>
          <p className="text-[#9B948B] text-sm">
            Latest updates from Naseq
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
  key={item.announcement_id}
  className="rounded-2xl bg-[#FDF8F3] border border-[#E8DED2] p-4 relative"
>
<button
  onClick={() => handleDismiss(item.announcement_id)}
  className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-[#EFE7DD] flex items-center justify-center transition"
>
  <X size={16} className="text-[#9B948B]" />
</button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#EAF6EE] text-[#7CB98B] font-semibold capitalize">
                {item.type}
              </span>
            </div>

            <h3 className="font-bold text-[#2F3E34] mb-1">
              {item.title}
            </h3>

            <p className="text-[#6F6F6F] text-sm leading-relaxed">
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const API_URL = "http://localhost:5000/api/announcements";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    target_role: "all",
    type: "info",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
  const title = searchParams.get("title");
  const message = searchParams.get("message");
  const target_role = searchParams.get("target_role");
  const type = searchParams.get("type");

  if (title || message) {
    setForm({
      title: title || "",
      message: message || "",
      target_role: target_role || "all",
      type: type || "info",
    });
  }
}, [searchParams]);

  const fetchAnnouncements = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (data.success) {
      setAnnouncements(data.data || []);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      message: "",
      target_role: "all",
      type: "info",
    });

    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[42px] font-bold text-[#2F3E34]">
          Manage Announcements
        </h1>
        <p className="text-[#9B948B] text-lg">
          Create messages that appear inside member and stylist dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm p-6 h-fit"
        >
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-6">
            Add Announcement
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-[#2F3E34]">
              Title
            </span>
            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
              className="mt-2 w-full rounded-2xl border border-[#E8DED2] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7CB98B]"
              placeholder="Top Outfit of the Month"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-[#2F3E34]">
              Message
            </span>
            <textarea
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
              rows={5}
              className="mt-2 w-full rounded-2xl border border-[#E8DED2] px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#7CB98B]"
              placeholder="Write your announcement here..."
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-[#2F3E34]">
              Target Audience
            </span>
            <select
              value={form.target_role}
              onChange={(e) =>
                setForm({ ...form, target_role: e.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-[#E8DED2] px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-[#7CB98B]"
            >
              <option value="all">Everyone</option>
              <option value="member">Members</option>
              <option value="stylist">Stylists</option>
            </select>
          </label>

          <label className="block mb-6">
            <span className="text-sm font-semibold text-[#2F3E34]">
              Type
            </span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-[#E8DED2] px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-[#7CB98B]"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="highlight">Highlight</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#7CB98B] text-white py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Plus size={18} />
            Add Announcement
          </button>
        </form>

        <div className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-6">
            Current Announcements
          </h2>

          {announcements.length === 0 ? (
            <p className="text-[#9B948B]">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.announcement_id}
                  className="rounded-2xl border border-[#E8DED2] p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-[#2F3E34] text-lg">
                        {item.title}
                      </h3>

                      <span className="text-xs px-3 py-1 rounded-full bg-[#EAF6EE] text-[#7CB98B] font-semibold">
                        {item.target_role}
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-[#FFF1E3] text-[#F5A962] font-semibold">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-[#6F6F6F]">{item.message}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(item.announcement_id)}
                    className="w-10 h-10 rounded-full bg-[#FFF1E3] text-[#F5A962] flex items-center justify-center hover:bg-[#F5A962] hover:text-white transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
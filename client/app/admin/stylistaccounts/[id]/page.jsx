"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Mail, User, FileText, ImageIcon } from "lucide-react";

const STYLIST_API = "http://localhost:5000/api/stylist";
const SERVER_URL = "http://localhost:5000";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SERVER_URL}${path}`;
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-[#f0ece7] text-[#8c6a4e]",
    Approved: "bg-[#ddf0e4] text-[#2a7a4b]",
    Rejected: "bg-[#fde8e8] text-[#b83232]",
  };

  return (
    <span className={`inline-flex items-center justify-center h-7 px-4 rounded-full text-[12px] font-semibold ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

export default function StylistApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStylist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${STYLIST_API}/admin/stylist-accounts/${id}`);
      const data = await res.json();

      if (data.success) {
        setStylist(data.data);
      } else {
        alert(data.message || "Failed to load stylist details");
      }
    } catch (err) {
      console.error("FETCH STYLIST DETAILS ERROR:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${STYLIST_API}/admin/stylist-accounts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        fetchStylist();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchStylist();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5ede3] px-8 py-8 text-[#888]">
        Loading stylist application...
      </div>
    );
  }

  if (!stylist) {
    return (
      <div className="min-h-screen bg-[#f5ede3] px-8 py-8 text-[#888]">
        Stylist not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ede3] px-8 py-8">
      <button
        onClick={() => router.push("/admin/stylistaccounts")}
        className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#8c6a4e] hover:text-[#2f3e34]"
      >
        <ArrowLeft size={16} />
        Back to Stylist Accounts
      </button>

      <div className="mb-7 flex items-start justify-between gap-5">
        <div>
          <h1 className="font-serif text-[30px] font-normal text-black">
            Stylist Application
          </h1>
          <p className="mt-1 text-[13px] text-[#aaa]">
            Review stylist profile, bio, and portfolio.
          </p>
        </div>

        <StatusBadge status={stylist.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
          <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f0ece7]">
            {stylist.profile_photo ? (
              <img
                src={getImageUrl(stylist.profile_photo)}
                alt={stylist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={54} className="text-[#c9b8a6]" />
            )}
          </div>

          <h2 className="text-center font-serif text-[24px] text-black">
            {stylist.name || "Unnamed Stylist"}
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
              <Mail size={16} className="text-[#8c6a4e]" />
              <span className="text-[13px] text-[#666]">{stylist.email}</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#faf7f4] px-4 py-3">
              <FileText size={16} className="text-[#8c6a4e]" />
              <span className="text-[13px] text-[#666]">
                Application ID: {stylist.application_id}
              </span>
            </div>
          </div>

          {stylist.status === "Pending" && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => updateStatus("Approved")}
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#ddf0e4] text-[13px] font-semibold text-[#2a7a4b]"
              >
                <Check size={15} />
                Approve
              </button>

              <button
                onClick={() => updateStatus("Rejected")}
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#fde8e8] text-[13px] font-semibold text-[#b83232]"
              >
                <X size={15} />
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
            <h3 className="mb-3 font-serif text-[22px] text-black">Bio</h3>
            <p className="min-h-[110px] rounded-xl bg-[#faf7f4] p-4 text-[14px] leading-7 text-[#666]">
              {stylist.bio || "No bio provided."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
            <h3 className="mb-4 font-serif text-[22px] text-black">
              Portfolio
            </h3>

            {stylist.portfolio && stylist.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {stylist.portfolio.map((item) => (
                  <div
                    key={item.portfolio_id}
                    className="overflow-hidden rounded-xl bg-[#faf7f4] shadow-sm"
                  >
                    <img
                      src={getImageUrl(item.image_url)}
                      alt="Portfolio"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl bg-[#faf7f4] text-[#bbb]">
                <ImageIcon size={34} />
                <p className="mt-2 text-[13px]">No portfolio images found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
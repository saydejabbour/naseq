"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const API = "http://localhost:5000/api/stylist";

export default function StylistAccountsPage() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStylists = async () => {
    try {
      const res = await fetch(`${API}/admin/stylist-accounts`);
      const data = await res.json();

      console.log("REAL STYLIST DATA:", data);

      if (data.success) {
        setStylists(data.data);
      } else {
        setStylists([]);
      }
    } catch (err) {
      console.error("FETCH STYLISTS ERROR:", err);
      setStylists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  const updateStatus = async (application_id, status) => {
    try {
      const res = await fetch(
        `${API}/admin/stylist-accounts/${application_id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchStylists();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf1e8] px-11 py-6">
      <h1 className="mb-2 font-serif text-[26px] font-bold text-black">
        Stylist Accounts
      </h1>

      <p className="mb-8 font-serif text-[14px] text-[#999]">
        {stylists.length} accounts registered
      </p>

      <div className="w-full max-w-[735px] overflow-hidden rounded-[8px] bg-white shadow-[0_3px_14px_rgba(0,0,0,0.22)]">
        <div className="grid grid-cols-[1.1fr_1.4fr_1fr_1.3fr] items-center rounded-[8px] bg-white px-5 py-5 shadow-[0_4px_12px_rgba(0,0,0,0.22)]">
          <p className="font-serif text-[13px] font-bold text-[#777]">Name</p>
          <p className="font-serif text-[13px] font-bold text-[#777]">Email</p>
          <p className="font-serif text-[13px] font-bold text-[#777]">
            Status
          </p>
          <p className="font-serif text-[13px] font-bold text-[#777]">
            Actions
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-6 font-serif text-[13px] text-[#777]">
            Loading...
          </div>
        ) : stylists.length === 0 ? (
          <div className="px-5 py-6 font-serif text-[13px] text-[#777]">
            No stylist applications found.
          </div>
        ) : (
          stylists.map((stylist, index) => (
            <div
              key={stylist.application_id}
              className={`grid grid-cols-[1.1fr_1.4fr_1fr_1.3fr] items-center px-5 py-4 ${
                index !== stylists.length - 1
                  ? "shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                  : ""
              }`}
            >
              <p className="font-serif text-[12px] font-bold text-black">
                {stylist.name}
              </p>

              <p className="font-serif text-[12px] font-bold text-[#777]">
                {stylist.email}
              </p>

              <StatusBadge status={stylist.status} />

              <div className="flex items-center gap-3">
                {stylist.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(stylist.application_id, "Approved")
                      }
                      className="flex h-[27px] items-center gap-2 rounded-[8px] bg-[#eadfdd] px-3 font-serif text-[13px] font-bold text-black"
                    >
                      <Check size={16} className="text-[#9b9290]" />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(stylist.application_id, "Rejected")
                      }
                      className="flex h-[27px] items-center gap-2 rounded-[8px] bg-[#eadfdd] px-4 font-serif text-[13px] font-bold text-red-500"
                    >
                      <X
                        size={16}
                        strokeWidth={3}
                        className="text-red-300"
                      />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-[#dbe4d4] text-black",
    Approved: "bg-[#85c45f] text-black",
    Rejected: "bg-[#ef3838] text-black",
  };

  return (
    <span
      className={`flex h-[26px] w-[89px] items-center justify-center rounded-[8px] font-serif text-[13px] font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}
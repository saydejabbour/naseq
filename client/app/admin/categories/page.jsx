"use client";

import { useEffect, useState } from "react";
import { Check, X, List, Plus } from "lucide-react";

const STYLIST_API = "http://localhost:5000/api/stylist";
const CLOTHING_API = "http://localhost:5000/api/clothing";

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-[#f0ece7] text-[#8c6a4e]",
    Approved: "bg-[#ddf0e4] text-[#2a7a4b]",
    Rejected: "bg-[#fde8e8] text-[#b83232]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center h-6 px-3 rounded-full text-[11.5px] font-semibold tracking-wide ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

function StylistAccountsPage({ stylists, loading, onUpdateStatus }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[26px] text-black font-normal tracking-tight">
          Stylist Accounts
        </h1>
        <p className="text-[13px] text-[#aaa] mt-1">
          {stylists.length} accounts registered
        </p>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
        <div className="grid grid-cols-[1.4fr_1.8fr_1fr_1.4fr] px-5 py-3.5 bg-[#faf7f4] border-b border-black/[0.06]">
          {["Name", "Email", "Status", "Actions"].map((h) => (
            <span
              key={h}
              className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[#aaa]"
            >
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-5 text-[13px] text-[#888]">Loading...</div>
        ) : stylists.length === 0 ? (
          <div className="px-5 py-5 text-[13px] text-[#888]">
            No stylist applications found.
          </div>
        ) : (
          stylists.map((stylist) => (
            <div
              key={stylist.application_id}
              className="grid grid-cols-[1.4fr_1.8fr_1fr_1.4fr] items-center px-5 py-4 border-b border-black/[0.05] last:border-0 hover:bg-[#fdfaf7] transition-colors"
            >
              <span className="text-[13.5px] font-semibold text-black">
                {stylist.name}
              </span>

              <span className="text-[13px] text-[#888]">
                {stylist.email}
              </span>

              <StatusBadge status={stylist.status} />

              <div className="flex items-center gap-2">
                {stylist.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        onUpdateStatus(stylist.application_id, "Approved")
                      }
                      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-semibold bg-[#e6f4ed] text-[#2a7a4b] hover:bg-[#d0ecd9] transition-colors"
                    >
                      <Check size={11} strokeWidth={2.5} />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(stylist.application_id, "Rejected")
                      }
                      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-semibold bg-[#fde8e8] text-[#b83232] hover:bg-[#fad4d4] transition-colors"
                    >
                      <X size={11} strokeWidth={2.5} />
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

function CategoriesPage({ categories, loading }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-[26px] text-black font-normal tracking-tight">
            Categories
          </h1>
          <p className="text-[13px] text-[#aaa] mt-1">
            Manage service categories
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3d1e0e] text-white rounded-lg text-[13px] font-semibold hover:bg-[#5a2e18] transition-colors">
          <Plus size={13} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <List size={36} className="text-[#ddd]" />
            <p className="text-[14px] text-[#ccc]">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <List size={36} className="text-[#ddd]" />
            <p className="text-[14px] text-[#ccc]">No categories yet</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center justify-between px-5 py-4 border-b border-black/[0.05] last:border-0 hover:bg-[#fdfaf7] transition-colors"
            >
              <span className="text-[13.5px] font-semibold text-black">
                {category.name}
              </span>

              <span className="text-[12px] text-[#aaa]">
                ID: {category.category_id}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DashboardPage({ stylists }) {
  const pending = stylists.filter((s) => s.status === "Pending").length;
  const approved = stylists.filter((s) => s.status === "Approved").length;

  const stats = [
    { label: "Total Stylists", value: stylists.length },
    { label: "Pending Reviews", value: pending },
    { label: "Approved", value: approved },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[26px] text-black font-normal tracking-tight">
          Dashboard
        </h1>
        <p className="text-[13px] text-[#aaa] mt-1">Overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[#bbb] mb-2">
              {label}
            </p>
            <p className="font-serif text-[32px] text-black font-normal">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NaseqAdmin() {
  const [page] = useState("stylists");

  const [stylists, setStylists] = useState([]);
  const [categories, setCategories] = useState([]);

  const [stylistsLoading, setStylistsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchStylists = async () => {
    try {
      const res = await fetch(`${STYLIST_API}/admin/stylist-accounts`);
      const data = await res.json();

      console.log("REAL STYLISTS:", data);

      if (data.success) {
        setStylists(data.data);
      } else {
        setStylists([]);
      }
    } catch (err) {
      console.error("FETCH STYLISTS ERROR:", err);
      setStylists([]);
    } finally {
      setStylistsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${CLOTHING_API}/categories`);
      const data = await res.json();

      console.log("REAL CATEGORIES:", data);

      if (data.success) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchStylists();
    fetchCategories();
  }, []);

  const updateStatus = async (application_id, status) => {
    try {
      const res = await fetch(
        `${STYLIST_API}/admin/stylist-accounts/${application_id}/status`,
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
    <div className="flex h-screen bg-[#f5ede3] font-sans">
      <main className="flex-1 overflow-y-auto px-8 py-7">
        {page === "dashboard" && <DashboardPage stylists={stylists} />}

        {page === "stylists" && (
          <StylistAccountsPage
            stylists={stylists}
            loading={stylistsLoading}
            onUpdateStatus={updateStatus}
          />
        )}

        {page === "categories" && (
          <CategoriesPage
            categories={categories}
            loading={categoriesLoading}
          />
        )}
      </main>
    </div>
  );
}
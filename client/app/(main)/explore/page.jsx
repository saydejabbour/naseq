"use client";

import { useEffect, useState, useMemo } from "react";
import { getOutfits } from "@/services/api";

export default function ExplorePage() {
  const [outfits, setOutfits] = useState([]);
  const [filters, setFilters] = useState({ style: "", season: "", occasion: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOutfits();
        setOutfits(data || []);
      } catch (error) {
        console.error("Error fetching outfits:", error);
      }
    };
    fetchData();
  }, []);

  const filteredOutfits = useMemo(() => {
    return outfits.filter((o) => {
      const styleMatch = !filters.style || o.style?.toLowerCase() === filters.style.toLowerCase();
      const seasonMatch = !filters.season || o.season?.toLowerCase() === filters.season.toLowerCase();
      const occasionMatch = !filters.occasion || o.occasion?.toLowerCase() === filters.occasion.toLowerCase();
      const searchMatch = !search || o.stylist?.toLowerCase().includes(search.toLowerCase());
      return styleMatch && seasonMatch && occasionMatch && searchMatch;
    });
  }, [outfits, filters, search]);

  const clearFilter = (key) => setFilters((f) => ({ ...f, [key]: "" }));

  const activeFilters = [
    ...(search ? [{ label: search, clear: () => setSearch("") }] : []),
    ...(filters.style ? [{ label: filters.style, clear: () => clearFilter("style") }] : []),
    ...(filters.season ? [{ label: filters.season, clear: () => clearFilter("season") }] : []),
    ...(filters.occasion ? [{ label: filters.occasion, clear: () => clearFilter("occasion") }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .ep-root {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
        }

        /* HEADER */
        .ep-header {
          padding: 56px 56px 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1.5px solid #dcfce7;
        }

        .ep-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 400;
          color: #1a2e1a;
          line-height: 1;
          margin: 0;
        }

        .ep-title span {
          color: #16a34a;
          font-style: italic;
        }

        .ep-count {
          font-size: 13px;
          color: #6b7280;
          padding-bottom: 6px;
          margin: 0;
        }

        /* CONTROLS */
        .ep-controls {
          padding: 20px 56px;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          background: #f9fafb;
          border-bottom: 1px solid #f0fdf4;
        }

        .ep-search-wrap {
          position: relative;
          flex: 1;
          min-width: 180px;
          max-width: 280px;
        }

        .ep-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          width: 14px;
          height: 14px;
        }

        .ep-search {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 14px 9px 36px;
          border: 1.5px solid #d1fae5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #1a2e1a;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ep-search::placeholder { color: #9ca3af; }
        .ep-search:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }

        .ep-sep {
          width: 1px;
          height: 20px;
          background: #d1fae5;
          flex-shrink: 0;
        }

        .ep-select-wrap { position: relative; }
        .ep-select-wrap::after {
          content: '';
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #16a34a;
          pointer-events: none;
        }

        .ep-select {
          appearance: none;
          padding: 9px 30px 9px 13px;
          border: 1.5px solid #d1fae5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          background: #fff;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ep-select:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .ep-select[data-active="true"] {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #15803d;
        }

        /* ACTIVE PILLS */
        .ep-pills {
          display: flex;
          gap: 8px;
          padding: 12px 56px;
          flex-wrap: wrap;
          background: #fff;
          border-bottom: 1px solid #f0fdf4;
        }

        .ep-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px 4px 12px;
          border-radius: 999px;
        }

        .ep-pill-x {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #bbf7d0;
          color: #15803d;
          font-size: 12px;
          border: none;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: background 0.15s;
        }
        .ep-pill-x:hover { background: #86efac; }

        /* GRID */
        .ep-grid {
          padding: 36px 56px 72px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        /* CARD */
        .ep-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid #e8f5e9;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.2s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .ep-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px -8px rgba(22,163,74,0.12), 0 4px 16px -4px rgba(0,0,0,0.06);
          border-color: #86efac;
        }

        .ep-card-img {
          position: relative;
          height: 380px;
          background: #f0fdf4;
          overflow: hidden;
        }
        .ep-card-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .ep-card:hover .ep-card-img img { transform: scale(1.05); }

        .ep-card-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(255,255,255,0.92);
          border: 1px solid #d1fae5;
          color: #15803d;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .ep-card-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ep-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 19px;
          font-weight: 400;
          color: #1a2e1a;
          margin: 0;
          line-height: 1.25;
        }

        .ep-card-stylist {
          font-size: 12.5px;
          color: #16a34a;
          font-weight: 500;
          margin: 0;
        }

        .ep-card-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 4px;
        }

        .ep-tag {
          font-size: 11px;
          font-weight: 500;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          padding: 3px 10px;
          border-radius: 999px;
        }

        /* EMPTY */
        .ep-empty {
          padding: 100px 56px;
          text-align: center;
        }
        .ep-empty-icon {
          width: 56px; height: 56px;
          background: #f0fdf4;
          border: 1.5px solid #d1fae5;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #16a34a;
        }
        .ep-empty-msg {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: #1a2e1a;
          margin: 0;
        }

        @media (max-width: 768px) {
          .ep-header, .ep-controls, .ep-grid, .ep-pills { padding-left: 20px; padding-right: 20px; }
          .ep-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 480px) {
          .ep-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ep-root">

        {/* HEADER */}
        <header className="ep-header">
          <h1 className="ep-title">Explore Outfits</h1>
          <p className="ep-count">{filteredOutfits.length} looks</p>
        </header>

        {/* CONTROLS */}
        <div className="ep-controls">
          <div className="ep-search-wrap">
            <svg className="ep-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="ep-search"
              type="text"
              placeholder="Search by stylist name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ep-sep" />

          {[
            { key: "style",    label: "Style",    options: ["Casual", "Formal", "Sporty"] },
            { key: "season",   label: "Season",   options: ["Summer", "Winter", "Spring"] },
            { key: "occasion", label: "Occasion", options: ["Everyday", "Work", "Evening"] },
          ].map(({ key, label, options }) => (
            <div className="ep-select-wrap" key={key}>
              <select
                className="ep-select"
                data-active={String(!!filters[key])}
                value={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              >
                <option value="">{label}</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* ACTIVE FILTER PILLS */}
        {activeFilters.length > 0 && (
          <div className="ep-pills">
            {activeFilters.map((f, i) => (
              <span key={i} className="ep-pill">
                {f.label}
                <button className="ep-pill-x" onClick={f.clear}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* GRID */}
        {filteredOutfits.length > 0 ? (
          <div className="ep-grid">
            {filteredOutfits.map((outfit) => (
              <div key={outfit.template_id} className="ep-card">
                <div className="ep-card-img">
                  <img src={outfit.image_url} alt={outfit.title} />
                  {outfit.occasion && (
                    <span className="ep-card-badge">{outfit.occasion}</span>
                  )}
                </div>
                <div className="ep-card-body">
                  <h3 className="ep-card-title">{outfit.title}</h3>
                  <p className="ep-card-stylist">{outfit.stylist}</p>
                  <div className="ep-card-tags">
                    {outfit.style && <span className="ep-tag">{outfit.style}</span>}
                    {outfit.season && <span className="ep-tag">{outfit.season}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ep-empty">
            <div className="ep-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p className="ep-empty-msg">No outfits match your filters</p>
          </div>
        )}

      </div>
    </>
  );
}
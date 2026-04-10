"use client";

import { useEffect, useState, useMemo } from "react";
import { getOutfits } from "@/services/api";

import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreFilters from "@/components/explore/ExploreFilters";
import OutfitGrid from "@/components/explore/OutfitGrid";
import EmptyState from "@/components/explore/EmptyState";
import FilterPill from "@/components/ui/FilterPill";

export default function ExplorePage() {
  const [outfits, setOutfits] = useState([]);
  const [filters, setFilters] = useState({ style: "", season: "", occasion: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOutfits();
      setOutfits(data || []);
    };
    fetchData();
  }, []);

  const filteredOutfits = useMemo(() => {
    return outfits.filter((o) => {
      return (
        (!filters.style || o.style === filters.style) &&
        (!filters.season || o.season === filters.season) &&
        (!filters.occasion || o.occasion === filters.occasion) &&
        (!search || o.stylist?.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [outfits, filters, search]);

  const activeFilters = [
    ...(search ? [{ label: search, clear: () => setSearch("") }] : []),
    ...(filters.style ? [{ label: filters.style, clear: () => setFilters(f => ({ ...f, style: "" })) }] : []),
    ...(filters.season ? [{ label: filters.season, clear: () => setFilters(f => ({ ...f, season: "" })) }] : []),
    ...(filters.occasion ? [{ label: filters.occasion, clear: () => setFilters(f => ({ ...f, occasion: "" })) }] : []),
  ];

  return (
    <div className="min-h-screen bg-white">

      <ExploreHeader count={filteredOutfits.length} />

      <ExploreFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 px-10 py-3 flex-wrap">
          {activeFilters.map((f, i) => (
            <FilterPill key={i} label={f.label} onClear={f.clear} />
          ))}
        </div>
      )}

      {filteredOutfits.length > 0 ? (
        <OutfitGrid outfits={filteredOutfits} />
      ) : (
        <EmptyState />
      )}

    </div>
  );
}
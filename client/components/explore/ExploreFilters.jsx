import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";

export default function ExploreFilters({ search, setSearch, filters, setFilters }) {
  return (
    <div className="flex gap-3 px-10 py-5 flex-wrap bg-gray-50 border-b">

      <SearchInput value={search} onChange={setSearch} />

      <Select
        label="Style"
        value={filters.style}
        onChange={(v) => setFilters((f) => ({ ...f, style: v }))}
        options={["Casual", "Formal", "Sporty"]}
      />

      <Select
        label="Season"
        value={filters.season}
        onChange={(v) => setFilters((f) => ({ ...f, season: v }))}
        options={["Summer", "Winter", "Spring"]}
      />

      <Select
        label="Occasion"
        value={filters.occasion}
        onChange={(v) => setFilters((f) => ({ ...f, occasion: v }))}
        options={["Everyday", "Work", "Evening"]}
      />

    </div>
  );
}
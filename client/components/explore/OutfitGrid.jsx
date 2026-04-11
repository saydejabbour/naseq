import Card from "@/components/ui/Card";

export default function OutfitGrid({ outfits }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {outfits.map((o) => (
        <Card key={o.id} outfit={o} />
      ))}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────
// 🎨 OUTFIT PANEL — Pinterest two-column style
// ─────────────────────────────────────────────
function OutfitPanel({ outfit, getImage }) {
  const isDress = !!outfit.items.dress;
  const { top, bottom, dress, shoes, bag, outerwear, accessories = [] } = outfit.items;

  const rightItems = [
    shoes ? { src: getImage(shoes.image_url), key: "shoes", h: 90 } : null,
    bag   ? { src: getImage(bag.image_url),   key: "bag",   h: 100 } : null,
    ...accessories.map((a, i) => ({ src: getImage(a.image_url), key: `acc-${i}`, h: 56 })),
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>

      {/* Style label */}
      <span style={{
        fontSize: "11px",
        letterSpacing: "3.5px",
        textTransform: "uppercase",
        color: "#888078",
        fontFamily: "Georgia, serif",
        paddingBottom: "10px",
        borderBottom: "1px solid #DDD9D2",
        width: "100%",
        textAlign: "center",
        display: "block",
      }}>
        {outfit.style}
      </span>

      {/* Two-column composition */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "320px",
      }}>

        {/* LEFT: Main clothing */}
        <div style={{
          flex: "0 0 58%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          paddingRight: "8px",
        }}>
          {outerwear && (
            <img src={getImage(outerwear.image_url)} alt="" style={{ height: "110px", objectFit: "contain", marginBottom: "4px", opacity: 0.9 }} />
          )}
          {isDress ? (
            <img src={getImage(dress.image_url)} alt="" style={{ height: "200px", objectFit: "contain" }} />
          ) : (
            <>
              {top && (
                <img src={getImage(top.image_url)} alt="" style={{ height: "130px", objectFit: "contain" }} />
              )}
              {bottom && (
                <img src={getImage(bottom.image_url)} alt="" style={{ height: "160px", objectFit: "contain", marginTop: "-12px" }} />
              )}
            </>
          )}
        </div>

        {/* RIGHT: Shoes, bag, accessories */}
        <div style={{
          flex: "0 0 42%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: "8px",
          paddingTop: "24px",
          gap: "18px",
        }}>
          {rightItems.map((item) => (
            <img key={item.key} src={item.src} alt="" style={{ height: `${item.h}px`, objectFit: "contain", maxWidth: "100%" }} />
          ))}
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🏠 MAIN PAGE — logic untouched
// ─────────────────────────────────────────────
export default function GeneratePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item_id");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const getImage = (url) =>
    url?.startsWith("http") ? url : `http://localhost:5000${url}`;

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      if (selectedStyles.length === 3) return;
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedItem || selectedStyles.length === 0) {
      alert("Please select item and styles");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/outfits/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          base_item_id: selectedItem.item_id,
          styles: selectedStyles,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setOutfits(data.data);
    } catch (err) {
      console.error(err);
      alert("Error generating outfits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSelectedItem = async () => {
      if (!itemId || !user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/clothing/user/${user.user_id}`);
        const data = await res.json();
        if (data.success) {
          const found = data.items.find((item) => String(item.item_id) === String(itemId));
          if (found) setSelectedItem(found);
        }
      } catch (err) {
        console.error("Failed to load selected item", err);
      }
    };
    fetchSelectedItem();
  }, [itemId, user]);

  const styleOptions = ["Casual", "Formal", "Sporty", "Elegant", "Streetwear", "Chic"];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-4">Generate Outfit</h1>

      {selectedItem && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="font-semibold mb-2">Selected Item</p>
          <img src={getImage(selectedItem.image_url)} className="w-32 h-32 object-contain" />
          <p className="text-sm mt-2">{selectedItem.subcategory}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="font-semibold mb-2">Select 3 styles</p>
        <div className="flex gap-2 flex-wrap">
          {styleOptions.map((style) => (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`px-3 py-1 rounded border ${selectedStyles.includes(style) ? "bg-green-500 text-white" : "bg-white"}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} className="bg-green-600 text-white px-4 py-2 rounded mb-6">
        Generate Outfits
      </button>

      {loading && <p>Generating outfits...</p>}

      {outfits.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "48px 32px",
          paddingTop: "8px",
        }}>
          {outfits.map((outfit, index) => (
            <OutfitPanel key={index} outfit={outfit} getImage={getImage} />
          ))}
        </div>
      )}

    </div>
  );
}
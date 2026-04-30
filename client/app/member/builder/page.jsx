"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Trash2, RotateCw } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/context/ToastContext";

function CanvasItem({ item, isSelected, onSelect, onChange, onRemove }) {
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = item.x;
    const origY = item.y;

    const move = (e) => {
      onChange(item.id, {
        x: origX + (e.clientX - startX),
        y: origY + (e.clientY - startY),
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleResize = (e) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = item.width;
    const startH = item.height;

    const move = (e) => {
      onChange(item.id, {
        width: Math.max(80, startW + (e.clientX - startX)),
        height: Math.max(80, startH + (e.clientY - startY)),
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleRotate = (e) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startRotation = item.rotation || 0;

    const move = (e) => {
      onChange(item.id, {
        rotation: startRotation + (e.clientX - startX),
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      onClick={handleSelect}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation || 0}deg)`,
        zIndex: isSelected ? 50 : 10,
      }}
    >
      {isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-md pointer-events-none" />
      )}

      <img
        src={item.imageUrl}
        onMouseDown={handleDrag}
        draggable={false}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
      />

      {isSelected && (
        <>
          <button
            onClick={() => onRemove(item.id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
          >
            <Trash2 size={12} />
          </button>

          <div
            onMouseDown={handleResize}
            className="absolute bottom-0 right-0 w-3 h-3 bg-white border border-green-600 cursor-se-resize"
          />

          <div
            onMouseDown={handleRotate}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border rounded-full p-1 cursor-pointer"
          >
            <RotateCw size={14} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── CANVAS DIMENSIONS (single source of truth) ───────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 550;

export default function OutfitBuilderPage() {
  const { user } = useAuth();

  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/clothing/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
  const itemsArray = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
    ? data.data
    : [];

  setItems(itemsArray);
});
  }, [user]);

  const filteredItems = items.filter((item) => {
    if (!category) return true;
    return item.category_name?.toLowerCase() === category.toLowerCase();
  });

  const addItem = (item) => {
    setCanvasItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        item_id: item.item_id,
        imageUrl: `http://localhost:5000${item.image_url}`,
        x: 200,
        y: 150,
        width: 120,
        height: 160,
        rotation: 0,
      },
    ]);
  };

  const updateItem = (id, patch) => {
    setCanvasItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  };

  const removeItem = (id) => {
    setCanvasItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedId(null);
  };

  const handleSave = async () => {
   if (!user?.user_id) {
  showToast("Login first", "error");
  return;
}

if (canvasItems.length === 0) {
  showToast("Add items first", "error");
  return;
}

    // Deselect everything before capture so selection borders don't appear in the image
    setSelectedId(null);

    // Allow React to flush the deselect render before capturing
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      const canvasElement = document.getElementById("outfit-canvas");

      // ✅ FIX 1: Use devicePixelRatio so the PNG matches physical pixels on
      //           retina / HiDPI screens. html2canvas internally multiplies its
      //           internal canvas by this scale factor; we must undo that when
      //           we later *display* the image (see SavedOutfitsPage).
      const dpr = window.devicePixelRatio || 1;

      // ✅ FIX 2: Read the element's *layout* size (CSS pixels) explicitly.
      //           Never rely on offsetWidth when the page might be scrolled or
      //           the element might have a fractional size.
      const rect = canvasElement.getBoundingClientRect();

      const canvas = await html2canvas(canvasElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",   // ✅ FIX 3: explicit white bg avoids
                                       //    transparent-PNG colour shifts
        scale: dpr,                    // ✅ FIX 1 (applied)
        width: rect.width,             // ✅ FIX 2 (applied)
        height: rect.height,           // ✅ FIX 2 (applied)
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        // ✅ FIX 4: windowWidth/windowHeight prevent html2canvas from using the
        //    full viewport which can cause internal layout recalculation.
        windowWidth: rect.width,
        windowHeight: rect.height,
        logging: false,
      });

      // ✅ FIX 5: Normalise the PNG back to CSS-pixel dimensions so the image
      //    file itself is 800×550 regardless of DPR.  This is the simplest way
      //    to guarantee pixel-perfect display on every screen without sending
      //    extra metadata to the backend.
      const normalised = document.createElement("canvas");
      normalised.width = CANVAS_W;
      normalised.height = CANVAS_H;
      const ctx = normalised.getContext("2d");
      ctx.drawImage(canvas, 0, 0, CANVAS_W, CANVAS_H);
      const image = normalised.toDataURL("image/png");

      const res = await fetch("http://localhost:5000/api/outfits/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          image,
          // ✅ FIX 6: Store explicit dimensions so the viewer can render with
          //    the correct aspect ratio even if the container size differs.
          canvas_width: CANVAS_W,
          canvas_height: CANVAS_H,
        }),
      });

      const data = await res.json();

     if (data.success) {
  showToast("Outfit saved");
  setCanvasItems([]);
} else {
  showToast(data.message, "error");
}
    } catch (err) {
      console.error(err);
      alert("Error saving outfit");
    }
  };

  return (
    <div className="h-screen flex bg-[#FDF8F3] overflow-hidden">
      {/* LEFT CANVAS */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-6">Outfit Builder</h1>

        <div
          id="outfit-canvas"
          onClick={() => setSelectedId(null)}
          style={{ width: CANVAS_W, height: CANVAS_H }}   // ✅ FIX 7: explicit
          className="border-2 border-dashed border-[#d6d6d6] rounded-xl bg-white relative overflow-hidden"
        >
          {canvasItems.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={setSelectedId}
              onChange={updateItem}
              onRemove={removeItem}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[260px] h-[90vh] mt-6 mr-6 bg-white border rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="bg-[#7CB98B] text-white py-2 rounded-lg font-medium"
          >
            Save Outfit
          </button>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#fdf6ee] border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Items</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => addItem(item)}
              className="bg-[#f9f9f9] rounded-xl p-2 cursor-pointer hover:shadow"
            >
              <img
                src={`http://localhost:5000${item.image_url}`}
                crossOrigin="anonymous"
                className="w-full h-28 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Trash2, RotateCw } from "lucide-react";

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
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      onChange(item.id, {
        x: origX + dx,
        y: origY + dy,
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
      const newW = Math.max(80, startW + (e.clientX - startX));
      const newH = Math.max(80, startH + (e.clientY - startY));

      onChange(item.id, {
        width: newW,
        height: newH,
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
      const diff = e.clientX - startX;

      onChange(item.id, {
        rotation: startRotation + diff,
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

export default function OutfitBuilderPage() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("");

  // FETCH
  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/clothing/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  }, [user]);

  // FILTER
  const filteredItems = items.filter((item) => {
    if (!category) return true;
    return item.category_name?.toLowerCase() === category.toLowerCase();
  });

  const addItem = (item) => {
    setCanvasItems((prev) => [
      ...prev,
      {
        id: Date.now(),
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

  const handleSave = () => {
    console.log("Saved outfit:", canvasItems);
  };

  return (
    <div className="h-screen flex bg-[#FDF8F3] overflow-hidden">

      {/* LEFT CANVAS */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-6">Outfit Builder</h1>

        <div
          onClick={() => setSelectedId(null)}
      className="w-[800px] h-[550px] border-2 border-dashed border-[#d6d6d6] rounded-xl bg-white relative"
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
<div className="w-[260px] h-[90vh] mt-6 mr-6 bg-white border rounded-2xl flex flex-col overflow-hidden">        {/* FIXED TOP */}
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

        {/* SCROLLABLE ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => addItem(item)}
              className="bg-[#f9f9f9] rounded-xl p-2 cursor-pointer hover:shadow"
            >
              <img
                src={`http://localhost:5000${item.image_url}`}
                className="w-full h-28 object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
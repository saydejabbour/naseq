"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Upload, ChevronDown, Save, ImagePlus } from "lucide-react";
import { useToast } from "@/context/ToastContext";

function CanvasItem({ item, isSelected, onSelect, onChange, onRemove }) {
  const dragging = useRef(false);
  const origin = useRef({});

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(item.id);
    dragging.current = true;
    origin.current = {
      mx: e.clientX,
      my: e.clientY,
      ix: item.x,
      iy: item.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;

    onChange(item.id, {
      x: origin.current.ix + (e.clientX - origin.current.mx),
      y: origin.current.iy + (e.clientY - origin.current.my),
    });
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation || 0}deg)`,
        zIndex: isSelected ? 50 : 10,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px dashed #7CB98B",
            borderRadius: 6,
            pointerEvents: "none",
          }}
        />
      )}

      <img
        src={item.imageUrl}
        alt=""
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />

      {isSelected && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 60,
          }}
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}

export default function CreateTemplatePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
 const [style, setStyle] = useState("");
const [season, setSeason] = useState("");
  const [inspirationImage, setInspirationImage] = useState(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSidebarDrag, setIsSidebarDrag] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const canvasRef = useRef(null);
  const ghostRef = useRef(null);
  const canvasFileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://localhost:5000/api/clothing/user/${user.user_id}`)
      .then((r) => r.json())
      .then((d) => {
        console.log("Clothing API response:", d);
        setItems(d.data || []);
      })
      .catch((err) => console.error("Clothing fetch error:", err));
  }, [user]);

  const addItemAtPos = useCallback((imageUrl, clientX, clientY, extraProps = {}) => {
    const canvas = canvasRef.current;

    let x = 80;
    let y = 80;

    if (canvas && clientX != null) {
      const r = canvas.getBoundingClientRect();
      x = Math.max(0, Math.min(clientX - r.left - 60, r.width - 120));
      y = Math.max(0, Math.min(clientY - r.top - 75, r.height - 150));
    }

    setCanvasItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        imageUrl,
        x,
        y,
        width: 120,
        height: 150,
        rotation: 0,
        ...extraProps,
      },
    ]);
  }, []);

  const handleSidebarPointerDown = (e, item) => {
    e.preventDefault();

    let moved = false;

    const ghost = document.createElement("img");
    ghost.src = `http://localhost:5000${item.image_url}`;

    Object.assign(ghost.style, {
      position: "fixed",
      width: "80px",
      height: "100px",
      objectFit: "contain",
      pointerEvents: "none",
      zIndex: "9999",
      opacity: "0.85",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      left: `${e.clientX - 40}px`,
      top: `${e.clientY - 50}px`,
    });

    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    const onMove = (ev) => {
      moved = true;

      ghost.style.left = `${ev.clientX - 40}px`;
      ghost.style.top = `${ev.clientY - 50}px`;

      const c = canvasRef.current;

      if (c) {
        const r = c.getBoundingClientRect();

        setIsSidebarDrag(
          ev.clientX >= r.left &&
            ev.clientX <= r.right &&
            ev.clientY >= r.top &&
            ev.clientY <= r.bottom
        );
      }
    };

    const onUp = (ev) => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);

      ghost.remove();
      ghostRef.current = null;
      setIsSidebarDrag(false);

      const c = canvasRef.current;
      const r = c?.getBoundingClientRect();

      const onCanvas =
        r &&
        ev.clientX >= r.left &&
        ev.clientX <= r.right &&
        ev.clientY >= r.top &&
        ev.clientY <= r.bottom;

      if (onCanvas || !moved) {
        addItemAtPos(
          `http://localhost:5000${item.image_url}`,
          ev.clientX,
          ev.clientY,
          {
            item_id: item.item_id,
          }
        );
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleCanvasDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    showToast(
      "For publishing, please use wardrobe items from the right sidebar.",
      "error"
    );
  };

  const handleCanvasFileChange = (e) => {
    e.target.value = "";
    showToast(
      "For publishing, please use wardrobe items from the right sidebar.",
      "error"
    );
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

  const handleInspirationFile = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setInspirationImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!user?.user_id) {
      return showToast("You must be logged in", "error");
    }

    if (!title.trim()) {
      return showToast("Enter a template name", "error");
    }

    const realWardrobeItems = canvasItems.filter((item) => item.item_id);

if (realWardrobeItems.length === 0 && !inspirationImage) {
  return showToast(
    "Please add clothing items to the canvas or upload an inspiration image.",
    "error"
  );
}

    try {
      setPublishing(true);

      console.log("ITEMS SENT TO BACKEND:", realWardrobeItems);

      const res = await fetch("http://localhost:5000/api/stylist/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  stylist_id: user.user_id,
  title: title.trim(),
  description,
  style,
season,
  inspiration_image: inspirationImage,
  items: realWardrobeItems,
}),
      });

      const data = await res.json();

      console.log("PUBLISH TEMPLATE RESPONSE:", data);

      if (!res.ok || !data.success) {
        return showToast(data.message || "Template was not published", "error");
      }

      showToast("Template published!", "success");

      setTitle("");
      setDescription("");
      setStyle("");
      setSeason("");
      setInspirationImage(null);
      setCanvasItems([]);
      setSelectedId(null);
    } catch (err) {
      console.error("Publish error:", err);
      showToast("Server error. Template was not published.", "error");
    } finally {
      setPublishing(false);
    }
  };

  const highlightCanvas = isDraggingOver || isSidebarDrag;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.heading}>Create Template</h1>

        <button
          onClick={handlePublish}
          style={{
            ...s.publishBtn,
            opacity: publishing ? 0.7 : 1,
            cursor: publishing ? "not-allowed" : "pointer",
          }}
          disabled={publishing}
        >
          <Save size={15} style={{ marginRight: 6 }} />
          {publishing ? "Publishing..." : "Publish Template"}
        </button>
      </div>

      <div style={s.body}>
        <div style={s.left}>
          <div
            ref={canvasRef}
            onClick={() => setSelectedId(null)}
            onDragOver={handleCanvasDragOver}
            onDragLeave={handleCanvasDragLeave}
            onDrop={handleCanvasDrop}
            style={{
              ...s.canvas,
              borderColor: highlightCanvas ? "#7CB98B" : "#d6c9bc",
              background: highlightCanvas ? "#f0f7f2" : "#fff",
            }}
          >
            {canvasItems.length === 0 && (
              <div style={s.canvasEmpty}>
                <ImagePlus size={32} color="#ccc" />
                <p style={s.canvasHint}>
                  Drag clothing items from the right sidebar here
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    canvasFileInputRef.current?.click();
                  }}
                  style={s.browseBtn}
                >
                  Browse files
                </button>

                <input
                  ref={canvasFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleCanvasFileChange}
                />
              </div>
            )}

            {canvasItems.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  canvasFileInputRef.current?.click();
                }}
                style={s.addMoreBtn}
                title="Add image from folder"
              >
                <ImagePlus size={14} style={{ marginRight: 4 }} />
                Add image

                <input
                  ref={canvasFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleCanvasFileChange}
                />
              </button>
            )}

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

        
          <div style={s.card}>
  <p style={s.cardTitle}>Upload Inspiration Image</p>

  <label
    style={s.uploadArea}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      handleInspirationFile(e.dataTransfer.files?.[0]);
    }}
  >
    {inspirationImage ? (
      <img
        src={inspirationImage}
        alt="Inspiration"
        style={s.inspirationPreviewInside}
      />
    ) : (
      <>
        <Upload size={22} color="#aaa" />
        <span style={s.uploadText}>Click or drag to upload</span>
      </>
    )}

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => handleInspirationFile(e.target.files[0])}
    />
  </label>

  {inspirationImage && (
    <button
      onClick={() => setInspirationImage(null)}
      style={s.removeInspirationBtn}
    >
      Remove inspiration image
    </button>
  )}
</div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <p style={s.cardTitle}>Template Details</p>

            <label style={s.label}>Title</label>
            <input
              placeholder="Template name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={s.input}
            />

            <label style={s.label}>Description</label>
            <textarea
              placeholder="Describe this look..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={s.textarea}
            />

            <label style={s.label}>Style</label>
<div style={s.selectWrap}>
  <select
    value={style}
    onChange={(e) => setStyle(e.target.value)}
    style={s.select}
  >
    <option value="">Select Style</option>
    <option value="Casual">Casual</option>
    <option value="Elegant">Elegant</option>
    <option value="Streetwear">Streetwear</option>
    <option value="Formal">Formal</option>
    <option value="Sporty">Sporty</option>
    <option value="Minimalist">Minimalist</option>
  </select>
  <ChevronDown size={15} style={s.chevron} />
</div>

<label style={s.label}>Season</label>
<div style={s.selectWrap}>
  <select
    value={season}
    onChange={(e) => setSeason(e.target.value)}
    style={s.select}
  >
    <option value="">Select Season</option>
    <option value="Spring">Spring</option>
    <option value="Summer">Summer</option>
    <option value="Autumn">Autumn</option>
    <option value="Winter">Winter</option>
    <option value="All Season">All Season</option>
  </select>
  <ChevronDown size={15} style={s.chevron} />
</div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}>Clothing Items</p>

            <div style={s.selectWrap}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={s.select}
              >
                <option value="">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Dresses & Jumpsuits">Dresses & Jumpsuits</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Bags">Bags</option>
                <option value="Activewear">Activewear</option>
              </select>

              <ChevronDown size={15} style={s.chevron} />
            </div>

            {(() => {
              const filteredItems = selectedCategory
                ? items.filter((item) => item.category === selectedCategory)
                : items;

              return (
                <>
                  {filteredItems.length === 0 && (
                    <div style={s.emptyItems}>
                      <p style={s.emptyText}>No items in this category.</p>
                      <p style={s.emptySubText}>
                        Add items in <strong>My Wardrobe</strong>
                      </p>
                    </div>
                  )}

                  {filteredItems.length > 0 && (
                    <div style={s.grid}>
                      {filteredItems.map((item) => (
                        <div
                          key={item.item_id}
                          onPointerDown={(e) => handleSidebarPointerDown(e, item)}
                          style={s.gridItem}
                          title="Click or drag to canvas"
                        >
                          <img
                            src={`http://localhost:5000${item.image_url}`}
                            alt=""
                            draggable={false}
                            style={s.gridImg}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "calc(100vh - 80px)",
    background: "#FDF5EE",
    padding: "28px 32px",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Georgia', serif",
    color: "#1a1a1a",
    margin: 0,
  },
  publishBtn: {
    display: "flex",
    alignItems: "center",
    background: "#7CB98B",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
  },
  body: {
    display: "flex",
    gap: 20,
    flex: 1,
  },
  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  right: {
    width: 260,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  canvas: {
    flex: 1,
    minHeight: 340,
    border: "1.5px dashed #d6c9bc",
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.2s, background 0.2s",
  },
  canvasEmpty: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    pointerEvents: "none",
  },
  canvasHint: {
    color: "#bbb",
    fontSize: 13,
    margin: 0,
    userSelect: "none",
  },
  browseBtn: {
    pointerEvents: "all",
    background: "#f0ebe5",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "6px 16px",
    fontSize: 12,
    color: "#666",
    cursor: "pointer",
    marginTop: 4,
  },
  addMoreBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    color: "#555",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  card: {
    background: "#fff",
    border: "1.5px solid #ede4d9",
    borderRadius: 14,
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: -4,
  },
  input: {
    border: "1.5px solid #e2d9d0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: "#333",
    outline: "none",
    background: "#fdf9f6",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    border: "1.5px solid #e2d9d0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: "#333",
    outline: "none",
    background: "#fdf9f6",
    resize: "vertical",
    minHeight: 72,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  selectWrap: {
    position: "relative",
  },
  select: {
    width: "100%",
    border: "1.5px solid #e2d9d0",
    borderRadius: 8,
    padding: "9px 32px 9px 12px",
    fontSize: 13,
    color: "#555",
    background: "#fdf9f6",
    appearance: "none",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  chevron: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#888",
    pointerEvents: "none",
  },
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1.5px dashed #ccc",
    borderRadius: 10,
    padding: "28px 16px",
    cursor: "pointer",
    background: "#fafafa",
  },
  uploadText: {
    fontSize: 13,
    color: "#aaa",
  },
  inspirationPreviewInside: {
  width: "100%",
  height: "100%",
  maxHeight: 130,
  objectFit: "contain",
  borderRadius: 8,
},

removeInspirationBtn: {
  background: "transparent",
  border: "none",
  color: "#c0392b",
  fontSize: 12,
  cursor: "pointer",
  alignSelf: "flex-start",
  padding: 0,
},

  emptyItems: {
    textAlign: "center",
    padding: "12px 8px",
    background: "#fdf9f6",
    borderRadius: 8,
    border: "1px dashed #e0d5c8",
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    margin: "0 0 4px 0",
    fontWeight: 600,
  },
  emptySubText: {
    fontSize: 11,
    color: "#bbb",
    margin: 0,
    lineHeight: 1.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    maxHeight: 260,
    overflowY: "auto",
    marginTop: 2,
  },
  gridItem: {
    background: "#f7f2ed",
    borderRadius: 8,
    padding: 6,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    touchAction: "none",
  },
  gridImg: {
    height: 70,
    width: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  },
};
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

import { useRouter } from "next/navigation";


// ─────────────────────────────────────────────
// 🎨 PALETTE
// ─────────────────────────────────────────────
const P = {
  cream:       "#FAF8F5",
  card:        "#FFFDFB",
  border:      "#E8E2D8",
  borderMid:   "#D0C8BC",
  textDark:    "#2C2A25",
  textMid:     "#6B6358",
  textMuted:   "#9C9080",
  green:       "#3B6D11",
  greenLight:  "#EAF3DE",
  greenMid:    "#639922",
  orange:      "#C4631A",
  orangeLight: "#FDF0E6",
  orangeMid:   "#E07A3A",
  beige:       "#C4A882",
  beigeLight:  "#F5F0E8",
  beigeMid:    "#8A7960",
};

const STYLE_ACCENTS = {
  Casual:     { bg: P.beigeLight,  text: P.beigeMid,  border: P.beige,      shimmer: "#C4A88220" },
  Formal:     { bg: P.greenLight,  text: P.green,     border: P.greenMid,   shimmer: "#3B6D1120" },
  Sporty:     { bg: "#FFF7ED",     text: "#92400E",   border: "#D97706",    shimmer: "#D9770620" },
  Elegant:    { bg: P.orangeLight, text: P.orange,    border: P.orangeMid,  shimmer: "#C4631A20" },
  Streetwear: { bg: "#F5F3FF",     text: "#5B21B6",   border: "#7C3AED",    shimmer: "#7C3AED20" },
  Chic:       { bg: "#FDF2F8",     text: "#9D174D",   border: "#DB2777",    shimmer: "#DB277720" },
};

const LOADING_STEPS = [
  "Reading your style…",
  "Scanning your wardrobe…",
  "Matching silhouettes…",
  "Balancing the palette…",
  "Finalising your looks…",
];

// ─────────────────────────────────────────────
// ✨ SHIMMER SWEEP (CSS keyframes injected once)
// ─────────────────────────────────────────────
const SHIMMER_CSS = `
@keyframes shimmerSweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}
@keyframes floatUp {
  0%   { opacity: 0; transform: translateY(22px) scale(0.94); }
  60%  { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
}
@keyframes unfold {
  0%   { max-height: 0px; opacity: 0; }
  100% { max-height: 800px; opacity: 1; }
}
@keyframes drawLine {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes pulseRing {
  0%,100% { transform: scale(1);   opacity: 0.6; }
  50%      { transform: scale(1.15); opacity: 1; }
}
@keyframes typewriterDot {
  0%,20%  { opacity: 0; }
  40%,80% { opacity: 1; }
  100%    { opacity: 0; }
}
`;

function InjectStyles() {
  useEffect(() => {
    if (document.getElementById("naseq-anim")) return;
    const s = document.createElement("style");
    s.id = "naseq-anim";
    s.textContent = SHIMMER_CSS;
    document.head.appendChild(s);
  }, []);
  return null;
}

// Staggered dot pulse via CSS — each dot fades in/out at a different delay
function AnimatedDots({ color }) {
  return (
    <>
      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.2; }
          40%            { opacity: 1;   }
        }
        .loading-dot {
          display: inline-block;
          animation: dot-pulse 1.4s ease-in-out infinite;
        }
        .loading-dot:nth-child(1) { animation-delay: 0s;    }
        .loading-dot:nth-child(2) { animation-delay: 0.2s;  }
        .loading-dot:nth-child(3) { animation-delay: 0.4s;  }
      `}</style>
      <span style={{ color, letterSpacing: "2px", marginLeft: "1px" }} aria-hidden="true">
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
      </span>
    </>
  );
}
 
const textStyle = {
  margin: 0,
  fontSize: "14px",
  fontFamily: "sans-serif",
  letterSpacing: "0.3px",
  display: "flex",
  alignItems: "baseline",
  whiteSpace: "nowrap",
};
 
const variants = {
  enter: { opacity: 0, y: 8,  scale: 0.98 },
  center: { opacity: 1, y: 0,  scale: 1    },
  exit:   { opacity: 0, y: -8, scale: 0.98 },
};
 
// Drop-in replacement for the original JSX block.
// Props mirror what the original code had in scope:
//   step         — current step index (used as AnimatePresence key)
//   LOADING_STEPS — string array of step labels
//   P            — palette object with { textMid, orange }

// ─────────────────────────────────────────────
// 🖼️ CANVAS OUTFIT CAPTURE
// Renders outfit items onto a hidden canvas,
// returning a base64 PNG — no html2canvas needed.
// ─────────────────────────────────────────────

/**
 * Loads an image URL as an HTMLImageElement, bypassing CORS via a proxy
 * data-URL trick when the image is served from the same backend.
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => {
      // Fallback: fetch as blob and create object URL (handles CORS images)
      fetch(src, { mode: "cors" })
        .then((r) => r.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const img2 = new Image();
          img2.onload  = () => { URL.revokeObjectURL(url); resolve(img2); };
          img2.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to load: ${src}`)); };
          img2.src = url;
        })
        .catch(reject);
    };
    img.src = src;
  });
}

/**
 * Draws an image centred horizontally at a given Y offset, scaled to fit
 * within maxH pixels of height.
 */
function drawCentred(ctx, img, canvasW, y, maxH) {
  const scale  = Math.min(maxH / img.naturalHeight, 1);
  const w      = img.naturalWidth  * scale;
  const h      = img.naturalHeight * scale;
  const x      = (canvasW - w) / 2;
  ctx.drawImage(img, x, y, w, h);
  return h; // actual drawn height
}

/**
 * Mirrors the exact UI layout:
 *
 * LEFT COLUMN (56% width):
 *   top-group (outerwear → dress OR top+bottom) — top-aligned
 *   shoes                                        — bottom-aligned (pinned to bottom)
 *
 * RIGHT COLUMN (44% width):
 *   bag + accessories                            — top-aligned
 *
 * Canvas height = max(left column total, right column total) + padding
 * No header, no border, white background, no wasted space.
 */
async function captureOutfitToBase64(outfit, getImage) {
  const CANVAS_W = 360;
  const PAD      = 16;   // outer padding
  const VGAP     = 4;    // vertical gap between stacked garments (tight, like UI)
  const SGAP     = 12;   // gap between side accessories

  const { top, bottom, dress, shoes, bag, outerwear, accessories = [] } = outfit.items;

  // ── Column pixel widths (mirrors flex: 0 0 56% / 44%)
  const mainW = Math.floor((CANVAS_W - PAD * 2) * 0.56);
  const sideW = Math.floor((CANVAS_W - PAD * 2) * 0.44);

  // ── Image specs per zone
  // Top-group: items stacked top-to-bottom in the left column
  const topGroupSpecs = [];
  if (outerwear)        topGroupSpecs.push({ src: getImage(outerwear.image_url), maxH: 80  });
  if (dress)            topGroupSpecs.push({ src: getImage(dress.image_url),     maxH: 190 });
  if (!dress && top)    topGroupSpecs.push({ src: getImage(top.image_url),       maxH: 110 });
  if (!dress && bottom) topGroupSpecs.push({ src: getImage(bottom.image_url),    maxH: 140 });

  // Shoes: pinned to bottom of left column
  const shoesSpec = shoes ? { src: getImage(shoes.image_url), maxH: 75 } : null;

  // Right column
  const sideSpecs = [];
  if (bag)                     sideSpecs.push({ src: getImage(bag.image_url),  maxH: 88 });
  accessories.forEach((acc) => sideSpecs.push({ src: getImage(acc.image_url), maxH: 52 }));

  // ── Load all images in parallel
  const allSrcs = [
    ...topGroupSpecs.map((i) => i.src),
    ...(shoesSpec ? [shoesSpec.src] : []),
    ...sideSpecs.map((i) => i.src),
  ];
  const imgMap = {};
  await Promise.all(
    allSrcs.map(async (src) => {
      try   { imgMap[src] = await loadImage(src); }
      catch { /* skip gracefully */ }
    })
  );

  // ── Scale helper: returns {img, w, h} or null
  const scale = (src, maxH, colW) => {
    const img = imgMap[src];
    if (!img) return null;
    const s = Math.min(maxH / img.naturalHeight, colW / img.naturalWidth, 1);
    return { img, w: img.naturalWidth * s, h: img.naturalHeight * s };
  };

  // ── Compute drawn sizes
  const topGroupDrawn = topGroupSpecs.map(({ src, maxH }) => scale(src, maxH, mainW)).filter(Boolean);
  const shoesDrawn    = shoesSpec ? scale(shoesSpec.src, shoesSpec.maxH, mainW) : null;
  const sideDrawn     = sideSpecs.map(({ src, maxH }) => scale(src, maxH, sideW)).filter(Boolean);

  // ── Compute column heights to size the canvas
  const topGroupH  = topGroupDrawn.reduce((s, d) => s + d.h, 0) + Math.max(0, topGroupDrawn.length - 1) * VGAP;
  const shoesH     = shoesDrawn ? shoesDrawn.h + VGAP : 0;  // gap above shoes
  const leftColH   = topGroupH + shoesH;

  const sideColH   = sideDrawn.reduce((s, d) => s + d.h, 0) + Math.max(0, sideDrawn.length - 1) * SGAP;

  const contentH   = Math.max(leftColH, sideColH);
  const CANVAS_H   = Math.ceil(contentH) + PAD * 2;

  // ── Create canvas
  const canvas  = document.createElement("canvas");
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx     = canvas.getContext("2d");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // ── Draw LEFT COLUMN — top-group flush to top
  const leftX = PAD; // left edge of left column
  let   curY  = PAD;
  for (const { img, w, h } of topGroupDrawn) {
    // right-align within left column (mirrors UI's alignItems: flex-end)
    const x = leftX + (mainW - w);
    ctx.drawImage(img, x, curY, w, h);
    curY += h + VGAP;
  }

  // ── Draw shoes pinned to BOTTOM of left column
  if (shoesDrawn) {
    const bottomY = PAD + contentH - shoesDrawn.h;
    const x       = leftX + (mainW - shoesDrawn.w); // right-align
    ctx.drawImage(shoesDrawn.img, x, bottomY, shoesDrawn.w, shoesDrawn.h);
  }

  // ── Draw RIGHT COLUMN — top-aligned
  const rightX = PAD + mainW;
  let   sideY  = PAD;
  for (const { img, w, h } of sideDrawn) {
    // left-align within right column
    ctx.drawImage(img, rightX, sideY, w, h);
    sideY += h + SGAP;
  }

  return canvas.toDataURL("image/png");
}

// ─────────────────────────────────────────────
// 💫 LOADING OVERLAY — Intelligent Pause
// ─────────────────────────────────────────────
function LoadingOverlay() {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const si = setInterval(() => setStep((p) => Math.min(p + 1, LOADING_STEPS.length - 1)), 680);
    const di = setInterval(() => setDots((p) => (p + 1) % 4), 420);
    return () => { clearInterval(si); clearInterval(di); };
  }, []);

  return (
<motion.div
  key="loader"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0, transition: { duration: 0.5 } }}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 0",
    gap: "32px"
  }}
>

  {/* Step label + dots */}
  <div style={{ textAlign: "center" }}>
    <AnimatePresence mode="wait">
      <motion.p
        key={step}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        layout
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ ...textStyle, color: P.textMid }}
      >
        {LOADING_STEPS[step]}
        <AnimatedDots color={P.orange} />
      </motion.p>
    </AnimatePresence>
    {/* Underline shimmer */}
    <div
      style={{
        marginTop: "10px",
        height: "2px",
        width: "60px",
        background: P.orangeLight,
        borderRadius: "2px",
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "easeInOut"
        }}
        style={{
          width: "40%",
          height: "100%",
          background: P.orange
        }}
      />
    </div>
  </div>

</motion.div>
  );
}

// ─────────────────────────────────────────────
// 🃏 OUTFIT CARD — Tailor's Reveal
// ─────────────────────────────────────────────
function OutfitCard({ outfit, getImage, index, user }) {
    const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const accent = STYLE_ACCENTS[outfit.style] ?? STYLE_ACCENTS.Casual;

  const { top, bottom, dress, shoes, bag, outerwear } = outfit.items;
  const accessories = outfit.items.accessories || [];
  const isDress = !!dress;

  const rightItems = [];
  if (bag) rightItems.push({ item: bag, size: 88 });
  accessories.forEach((acc) => rightItems.push({ item: acc, size: 52 }));

  const handleSave = useCallback(async () => {
    if (!user) { alert("User not found"); return; }

    try {
      setSaving(true);

      // ── Render outfit to canvas and get base64
      const base64 = await captureOutfitToBase64(outfit, getImage);

      const res = await fetch("http://localhost:5000/api/outfits/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          image:   base64,
        }),
      });

      const data = await res.json();

     if (!res.ok) {
  showToast(data.message, "error");
  return;
}
showToast("Outfit saved ");

    } catch (err) {
  console.error(err);
  showToast("Error generating outfits", "error");

    } finally {
      setSaving(false);
    }
  }, [outfit, getImage, user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.28 }}
      style={{
        background: P.card,
        border: `0.5px solid ${P.border}`,
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div style={{
        background: accent.bg,
        borderBottom: `0.5px solid ${accent.border}`,
        padding: "12px",
        textAlign: "center"
      }}>
        <span style={{
          fontSize: "9px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: accent.text
        }}>
          {outfit.style}
        </span>
      </div>

      {/* BODY */}
      <div style={{
        padding: "20px",
        display: "flex",
        minHeight: "300px"
      }}>

        {/* LEFT SIDE */}
        <div style={{
          flex: "0 0 56%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {outerwear && (
              <img src={getImage(outerwear.image_url)} style={{ height: 90 }} alt="" />
            )}
            {isDress ? (
              <img src={getImage(dress.image_url)} style={{ height: 180 }} alt="" />
            ) : (
              <>
                {top    && <img src={getImage(top.image_url)}    style={{ height: 110 }} alt="" />}
                {bottom && <img src={getImage(bottom.image_url)} style={{ height: 140, marginTop: "-6px" }} alt="" />}
              </>
            )}
          </div>

          {shoes && (
            <img
              src={getImage(shoes.image_url)}
              style={{ height: 75, alignSelf: "flex-end" }}
              alt=""
            />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div style={{
          flex: "0 0 44%",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          paddingLeft: "10px"
        }}>
          {rightItems.map((entry, i) => (
            <img
              key={i}
              src={getImage(entry.item.image_url)}
              style={{ height: entry.size, objectFit: "contain" }}
              alt=""
            />
          ))}
        </div>

      </div>

      {/* SAVE BUTTON */}
      <div style={{ padding: "0 16px 16px" }}>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={!saving ? { scale: 1.02 } : {}}
          whileTap={!saving  ? { scale: 0.97 } : {}}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: "10px",
            border: `0.5px solid ${accent.border}`,
            background: "transparent",
            color: saving ? P.textMuted : accent.text,
            fontSize: "9px",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {saving ? "Saving…" : "Save outfit"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 💅 STYLE PILL
// ─────────────────────────────────────────────
function StylePill({ style, selected, onClick, disabled }) {
  const accent = STYLE_ACCENTS[style] ?? { bg: P.beigeLight, text: P.beigeMid, border: P.beige };
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
      disabled={disabled && !selected}
      style={{
        padding: "7px 18px",
        borderRadius: "99px",
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        letterSpacing: "0.4px",
        border: selected ? `1px solid ${accent.border}` : `0.5px solid ${P.borderMid}`,
        background: selected ? accent.bg : P.card,
        color: selected ? accent.text : P.textMuted,
        opacity: disabled && !selected ? 0.35 : 1,
        cursor: disabled && !selected ? "not-allowed" : "pointer",
        transition: "background 0.2s, color 0.2s, border 0.2s",
      }}
    >
      {style}
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// 🏠 MAIN PAGE
// ─────────────────────────────────────────────
export default function GeneratePage() {
  const { user }       = useAuth();
  const { showToast } = useToast();
  const searchParams   = useSearchParams();
  const itemId         = searchParams.get("item_id");
  const router = useRouter();

  const [selectedItem,   setSelectedItem]   = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [outfits,        setOutfits]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [hasGenerated,   setHasGenerated]   = useState(false);

  const getImage = (url) =>
    url?.startsWith("http") ? url : `http://localhost:5000${url}`;

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      if (selectedStyles.length >= 3) return;
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedItem || selectedStyles.length === 0) return;
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));
      setOutfits([]);
      setHasGenerated(false);
      console.log("START");
      const res = await fetch("http://localhost:5000/api/outfits/generate", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:      user.user_id,
          base_item_id: selectedItem.item_id,
          styles:       selectedStyles,
        }),
      });
      console.log("end");
      const data = await res.json();
     if (!res.ok) {
  showToast(data.message, "error");
  return;
}

      setOutfits(data.data);
      setHasGenerated(true);
    } catch (err) {
      console.error(err);
     showToast("Error generating outfits", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSelectedItem = async () => {
      if (!itemId || !user) return;
      try {
        const res  = await fetch(`http://localhost:5000/api/clothing/user/${user.user_id}`);
        const data = await res.json();
        if (data.success) {
          const itemsArray = Array.isArray(data.items)
  ? data.items
  : Array.isArray(data.data)
  ? data.data
  : [];

const found = itemsArray.find(
  (item) => String(item.item_id) === String(itemId)
);
          if (found) setSelectedItem(found);
        }
      } catch (err) {
        console.error("Failed to load selected item", err);
      }
    };
    fetchSelectedItem();
  }, [itemId, user]);

  const styleOptions = ["Casual", "Formal", "Sporty", "Elegant", "Chic"];
  const canGenerate  = selectedItem && selectedStyles.length > 0 && !loading;

  return (
    <>
      <InjectStyles />
      <div style={{ minHeight: "100vh", background: P.cream, padding: "40px 48px", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* ── Page title */}
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ fontSize: "26px", fontWeight: 400, color: P.textDark, letterSpacing: "-0.4px", marginBottom: "36px" }}
          >
            Generate Outfit
          </motion.h1>

          {/* ── Selected item */}
          {/* ── Selected item OR empty state */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05 }}
  style={{ marginBottom: "32px" }}
>
  <p style={{
    fontSize: "9px",
    letterSpacing: "3.5px",
    textTransform: "uppercase",
    color: P.textMuted,
    marginBottom: "10px"
  }}>
    Selected item
  </p>

  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "16px 20px",
    borderRadius: "16px",
    background: P.card,
    border: `0.5px solid ${P.border}`,
  }}>

    {/* ───── LEFT SIDE ───── */}
    {selectedItem ? (
      <>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "12px",
          background: P.beigeLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            src={getImage(selectedItem.image_url)}
            alt=""
            style={{ width: "68px", height: "68px", objectFit: "contain" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: "14px",
            fontWeight: 500,
            color: P.textDark,
            fontFamily: "sans-serif",
            margin: 0
          }}>
            {selectedItem.name || selectedItem.subcategory}
          </p>

          <p style={{
            fontSize: "12px",
            color: P.textMuted,
            marginTop: "3px",
            fontFamily: "sans-serif"
          }}>
            {selectedItem.subcategory}
          </p>
        </div>

        <span style={{
          fontSize: "9px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          background: P.beigeLight,
          color: P.beigeMid,
          padding: "4px 12px",
          borderRadius: "99px",
        }}>
          Base item
        </span>
      </>
    ) : (
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: "13px",
          color: P.textMuted,
          fontFamily: "sans-serif"
        }}>
          No item selected
        </p>
      </div>
    )}

    {/* ───── BUTTON (NEW) ───── */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/member/wardrobe")}
      style={{
        padding: "7px 16px",
        borderRadius: "99px",
        border: `0.5px solid ${P.borderMid}`,
        background: P.card,
        color: P.textMid,
        fontSize: "10px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
      }}
    >
      {selectedItem ? "Change item" : "Select item"}
    </motion.button>

  </div>
</motion.div>

          {/* ── Style selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: "28px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "3.5px", textTransform: "uppercase", color: P.textMuted }}>
                Select styles
              </p>
              <motion.span
                animate={{
                  background: selectedStyles.length === 3 ? P.greenLight : P.beigeLight,
                  color:      selectedStyles.length === 3 ? P.green      : P.beigeMid,
                }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "99px", fontFamily: "sans-serif" }}
              >
                {selectedStyles.length}/3
              </motion.span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {styleOptions.map((style) => (
                <StylePill
                  key={style}
                  style={style}
                  selected={selectedStyles.includes(style)}
                  onClick={() => toggleStyle(style)}
                  disabled={selectedStyles.length >= 3}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Generate button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: "40px" }}
          >
            <motion.button
              whileHover={canGenerate ? { scale: 1.03 } : {}}
              whileTap={canGenerate  ? { scale: 0.96 } : {}}
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                padding: "13px 36px",
                borderRadius: "99px",
                border: "none",
                background: canGenerate ? P.green : P.borderMid,
                color: canGenerate ? P.greenLight : P.textMuted,
                fontFamily: "Georgia, serif",
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                cursor: canGenerate ? "pointer" : "not-allowed",
                transition: "background 0.25s",
              }}
            >
              {loading ? "Generating…" : "Generate outfits"}
            </motion.button>
          </motion.div>

          {/* ── Divider */}
          <AnimatePresence>
            {(loading || hasGenerated) && (
              <motion.div
                key="divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  height: "0.5px", background: P.border,
                  marginBottom: "36px", transformOrigin: "left",
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Loader */}
          <AnimatePresence mode="wait">
            {loading  && <LoadingOverlay key="loader" />}
          </AnimatePresence>

          {/* ── Outfits grid */}
          <AnimatePresence>
            {!loading && outfits.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <p style={{
                  fontSize: "9px", letterSpacing: "3.5px", textTransform: "uppercase",
                  color: P.textMuted, marginBottom: "24px",
                }}>
                  Your outfits
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "24px",
                }}>
                  {outfits.map((outfit, index) => (
                    <OutfitCard
                      key={index}
                      outfit={outfit}
                      getImage={getImage}
                      index={index}
                      user={user}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
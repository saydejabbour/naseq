"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { id: 1, name: "Tops" },
  { id: 2, name: "Bottoms" },
  { id: 3, name: "Shoes" },
  { id: 4, name: "Accessories" },
  { id: 5, name: "Dresses & Jumpsuits" },
  { id: 6, name: "Outerwear" },
  { id: 7, name: "Bags" },
  { id: 8, name: "Activewear" },
];

const SUBCATEGORIES = {
  "Tops": [
    "T-Shirt", "Polo Shirt", "Button-Down Shirt", "Blouse",
    "Tank Top", "Crop Top", "Bodysuit", "Sweater",
    "Turtleneck", "Cardigan", "Hoodie", "Sweatshirt",
  ],
  "Bottoms": [
    "Jeans", "Trousers", "Dress Pants", "Chinos",
    "Shorts", "Leggings", "Joggers", "Sweatpants",
    "Mini Skirt", "Midi Skirt", "Maxi Skirt", "Denim Skirt",
  ],
  "Dresses & Jumpsuits": [
    "Mini Dress", "Midi Dress", "Maxi Dress", "Wrap Dress",
    "Shirt Dress", "Bodycon Dress", "Slip Dress",
    "Sundress", "Evening Gown", "Jumpsuit", "Romper",
  ],
  "Outerwear": [
    "Trench Coat", "Wool Coat", "Puffer Jacket", "Leather Jacket",
    "Denim Jacket", "Bomber Jacket", "Blazer",
    "Windbreaker", "Parka", "Peacoat",
  ],
  "Shoes": [
    "Sneakers", "Loafers", "Oxford Shoes", "Chelsea Boots",
    "Ankle Boots", "Knee-High Boots", "Heels", "Block Heels",
    "Sandals", "Slides", "Ballet Flats", "Mules",
  ],
  "Accessories": [
    "Belt", "Sunglasses", "Watch", "Scarf",
    "Baseball Cap", "Beanie", "Wide-Brim Hat",
    "Gloves", "Hair Clip", "Headband", "Jewelry"
  ],
  "Bags": [
    "Tote Bag", "Backpack", "Shoulder Bag", "Crossbody Bag",
    "Clutch", "Mini Bag", "Bucket Bag", "Fanny Pack",
  ],
  "Activewear": [
    "Sports Bra", "Athletic Shorts", "Compression Leggings",
    "Track Jacket", "Track Pants", "Cycling Shorts",
    "Tennis Skirt", "Rashguard",
  ],
};

const COLORS = [
  "Black", "White", "Ivory", "Beige", "Camel",
  "Light Gray", "Charcoal", "Brown",
  "Light Blue", "Navy", "Royal Blue",
  "Olive", "Forest Green", "Sage",
  "Red", "Burgundy", "Pink", "Blush",
  "Orange", "Yellow", "Mustard",
  "Purple", "Lavender",
  "Multicolor", "Patterned",
];

const STYLES = [
  "Casual", "Smart Casual", "Business Casual", "Formal",
  "Streetwear", "Sporty", "Elegant", "Chic",
  "Bohemian", "Minimalist",
];

const SEASONS = [
  "Spring", "Summer", "Autumn", "Winter",
  "Spring / Autumn", "All Season",
];

const OCCASIONS = [
  "Everyday", "Work / Office", "Formal Event",
  "Date Night", "Night Out", "Sport / Gym",
  "Travel", "Beach / Vacation",
];



export default function AddItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [subcategory, setSubcategory] = useState("");
  const [form, setForm] = useState({
    category_id: "",
    subcategory: "",
    color: "",
    style: "",
    season: "",
    occasion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const applyRules = (subcategory) => {
    if (!subcategory) return;

    const rules = {
      "Sneakers": {
        style: "Casual",
        season: "All Season",
        occasion: "Everyday",
      },
      "Jeans": {
        style: "Casual",
        season: "All Season",
        occasion: "Everyday",
      },
    };

    if (rules[subcategory]) {
      setForm((prev) => ({
        ...prev,
        ...rules[subcategory],
      }));
    }
  };

  // ── image handling ──────────────────────────────────────
  const handleFile = async (f) => {
    if (!f || !f.type.startsWith("image/")) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));

    console.log("📤 Sending to AI...");

    try {
      const formData = new FormData();
      formData.append("image", f);

      const res = await fetch("http://localhost:5000/api/ai/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("🤖 AI RESPONSE:", data);

    if (data.success && data.concepts) {
  console.log("🤖 Raw concepts:", data.concepts);

  // ── FLATTEN comma-separated synonym groups ────────────────────────
  const tokens = data.concepts
    .flatMap((c) => c.split(","))
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  console.log("🧠 Flattened tokens:", tokens);

  // ── IGNORE LIST ───────────────────────────────────────────────────
  // "mini" alone is too ambiguous — never let it decide category
  // "purse" conflicts with skirts when AI hallucinates bag concepts
  const IGNORE = new Set([
    "mini",           // too ambiguous alone — handled via explicit "miniskirt"
    "bra", "underwear", "lingerie", "nightgown", "negligee",
    "panty", "thong", "swimwear", "swimming trunks", "bathing trunks",
    "diaper", "napkin", "seat belt", "body part", "person",
    "knee pad", "handkerchief", "hankie", "hanky", "hankey",
    "notecase",       // old word for wallet, irrelevant
  ]);
  const filtered = tokens.filter((t) => !IGNORE.has(t));

  // ── SKIRT LENGTH HINTS ────────────────────────────────────────────
  // These tokens from the AI strongly suggest a LONG skirt
  const LONG_SKIRT_HINTS = new Set([
    "overskirt", "hoopskirt", "crinoline", "sarong",
    "maxi", "floor-length", "full-length", "petticoat",
  ]);
  const hasLongSkirtHint = filtered.some((t) => LONG_SKIRT_HINTS.has(t));

  // ── DRESS HINTS ───────────────────────────────────────────────────
  // If AI returns skirt-structure words alongside "gown" or bodice words,
  // it's likely a dress, not just a skirt
  const DRESS_HINTS = new Set([
    "dress", "gown", "frock", "bodice", "corset top",
    "cocktail dress", "sundress", "evening gown",
  ]);
  const hasDressHint = filtered.some((t) =>
    [...DRESS_HINTS].some((d) => t.includes(d))
  );

  // ── CATEGORY SCORING ──────────────────────────────────────────────
  const CATEGORY_SIGNALS = {
    3: { // Shoes — highest priority when present
      weight: 4,
      keywords: [
        "shoe", "shoes", "footwear", "sneaker", "sneakers",
        "heel", "heels", "stiletto", "pump", "pumps",
        "sandal", "sandals", "slingback", "mule", "mules",
        "boot", "boots", "loafer", "loafers", "oxford",
        "flat", "flats", "ballet flat", "wedge", "wedges",
        "platform shoe", "slipper", "slip-on", "clogs",
        "ankle boot", "knee-high boot", "chelsea boot",
      ],
    },
    7: { // Bags
      weight: 3,
      keywords: [
        // ⚠️ "purse" removed — AI hallucinates it for skirts
        "bag", "bags", "handbag", "tote",
        "backpack", "clutch", "satchel", "pouch",
        "wallet", "billfold", "pocketbook",  // keep these for actual bags
        "crossbody", "shoulder bag", "fanny pack",
        "bucket bag", "luggage",
      ],
    },
    5: { // Dresses & Jumpsuits
      weight: 3,
      keywords: [
        "dress", "gown", "frock", "evening gown",
        "cocktail dress", "sundress", "maxi dress", "mini dress",
        "midi dress", "wrap dress", "slip dress",
        "jumpsuit", "romper", "playsuit", "overall", "overalls",
      ],
    },
    4: { // Accessories
      weight: 3,
      keywords: [
        "jewelry", "jewellery", "necklace", "ring", "bracelet",
        "earring", "earrings", "pendant", "chain", "choker",
        "bangle", "brooch", "watch", "sunglasses", "glasses",
        "belt", "scarf", "hat", "cap", "beanie", "gloves",
        "hair clip", "headband", "tie", "bow tie", "bandana",
      ],
    },
    6: { // Outerwear
      weight: 3,
      keywords: [
        "coat", "jacket", "blazer", "outerwear", "overcoat",
        "trench coat", "parka", "puffer", "windbreaker",
        "bomber", "leather jacket", "denim jacket", "peacoat",
        "raincoat", "cape", "poncho", "wool coat",
      ],
    },
    2: { // Bottoms
      weight: 3,
      keywords: [
        "jean", "jeans", "denim", "blue jean",
        "pants", "trousers", "chinos", "shorts",
        "sweatpants", "joggers", "legging", "leggings",
        "skirt", "miniskirt", "overskirt", "hoopskirt",
        "crinoline", "sarong", "petticoat",
        "mini skirt", "midi skirt", "maxi skirt", "denim skirt",
        "dress pants", "slacks", "cargo pants",
      ],
    },
    8: { // Activewear
      weight: 2,
      keywords: [
        "sports bra", "athletic", "activewear", "sportswear",
        "compression", "track jacket", "track pants",
        "cycling shorts", "tennis skirt", "rashguard",
        "workout", "gym wear", "yoga pants",
      ],
    },
    1: { // Tops
      weight: 2,
      keywords: [
        "shirt", "top", "blouse", "tee", "t-shirt", "tee shirt",
        "polo", "button-down", "tank top", "crop top", "bodysuit",
        "sweater", "turtleneck", "cardigan", "hoodie",
        "sweatshirt", "jersey", "tunic", "camisole", "knit",
      ],
    },
  };

  // ── SCORE CATEGORIES ──────────────────────────────────────────────
  const scores = {};
  for (const [catId, { keywords, weight }] of Object.entries(CATEGORY_SIGNALS)) {
    scores[catId] = 0;
    for (const token of filtered) {
      for (const kw of keywords) {
        if (token === kw || token.includes(kw) || kw.includes(token)) {
          scores[catId] += weight;
        }
      }
    }
  }

  // ── BOOST: if bag tokens exist alongside strong skirt tokens, kill bag score ──
  const skirtTokens = ["miniskirt", "overskirt", "hoopskirt", "crinoline", "sarong", "skirt"];
  const hasSkirtToken = filtered.some((t) => skirtTokens.some((s) => t.includes(s)));
  if (hasSkirtToken && scores[7] > 0) {
    console.log("🚫 Suppressing Bags score — skirt tokens present");
    scores[7] = 0;
  }

  // ── BOOST: "gown" alongside skirt words = likely a dress, boost cat 5 ──
  if (hasDressHint && scores[2] > 0) {
    scores[5] += 6;
    console.log("👗 Boosted Dresses score — dress hint found alongside skirt tokens");
  }

  console.log("📊 Category scores:", scores);

  // ── PICK BEST CATEGORY ────────────────────────────────────────────
  const bestCatId = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .find(([, score]) => score > 0)?.[0];

  const detectedCategory = bestCatId ? parseInt(bestCatId) : 1;

  // ── SUBCATEGORY SIGNALS ───────────────────────────────────────────
  const SUBCATEGORY_SIGNALS = {
    3: [
      { sub: "Heels",           keywords: ["heel", "heels", "stiletto", "pump", "pumps", "kitten heel", "slingback", "block heel"] },
      { sub: "Sandals",         keywords: ["sandal", "sandals", "flip flop", "espadrille"] },
      { sub: "Slides",          keywords: ["slide", "slides"] },
      { sub: "Mules",           keywords: ["mule", "mules", "clog", "clogs"] },
      { sub: "Sneakers",        keywords: ["sneaker", "sneakers", "trainer", "runners", "athletic shoe"] },
      { sub: "Ankle Boots",     keywords: ["ankle boot", "bootie", "booties"] },
      { sub: "Knee-High Boots", keywords: ["knee-high boot", "knee high", "thigh-high"] },
      { sub: "Chelsea Boots",   keywords: ["chelsea boot", "chelsea"] },
      { sub: "Loafers",         keywords: ["loafer", "loafers", "slip-on"] },
      { sub: "Oxford Shoes",    keywords: ["oxford", "brogue", "derby"] },
      { sub: "Ballet Flats",    keywords: ["flat", "flats", "ballet flat"] },
      { sub: "Sneakers",        keywords: ["shoe", "footwear", "boot", "boots"] },
    ],
    7: [
      { sub: "Tote Bag",      keywords: ["tote", "shopper"] },
      { sub: "Backpack",      keywords: ["backpack", "rucksack"] },
      { sub: "Clutch",        keywords: ["clutch", "evening bag"] },
      { sub: "Crossbody Bag", keywords: ["crossbody", "cross body"] },
      { sub: "Mini Bag",      keywords: ["mini bag", "micro bag"] },
      { sub: "Bucket Bag",    keywords: ["bucket bag", "bucket"] },
      { sub: "Fanny Pack",    keywords: ["fanny pack", "belt bag", "waist bag"] },
      { sub: "Shoulder Bag",  keywords: ["handbag", "satchel", "shoulder bag", "bag"] },
    ],
    5: [
      { sub: "Evening Gown",  keywords: ["gown", "evening gown", "ball gown", "formal dress"] },
      { sub: "Maxi Dress",    keywords: ["maxi dress"] },
      { sub: "Midi Dress",    keywords: ["midi dress", "midi"] },
      { sub: "Mini Dress",    keywords: ["mini dress", "miniskirt", "mini skirt"] }, // AI calls mini dresses "miniskirt"
      { sub: "Wrap Dress",    keywords: ["wrap dress"] },
      { sub: "Slip Dress",    keywords: ["slip dress"] },
      { sub: "Bodycon Dress", keywords: ["bodycon", "fitted dress"] },
      { sub: "Jumpsuit",      keywords: ["jumpsuit", "overall", "overalls"] },
      { sub: "Romper",        keywords: ["romper", "playsuit"] },
      { sub: "Sundress",      keywords: ["sundress", "summer dress"] },
      { sub: "Mini Dress",    keywords: ["dress", "frock"] },
    ],
    4: [
      { sub: "Jewelry",       keywords: ["jewelry", "jewellery", "necklace", "ring", "bracelet", "earring", "earrings", "pendant", "chain", "choker", "bangle", "brooch"] },
      { sub: "Watch",         keywords: ["watch", "timepiece", "wristwatch"] },
      { sub: "Sunglasses",    keywords: ["sunglasses", "glasses", "eyewear", "shades"] },
      { sub: "Belt",          keywords: ["belt"] },
      { sub: "Scarf",         keywords: ["scarf", "shawl"] },
      { sub: "Baseball Cap",  keywords: ["cap", "baseball cap", "snapback"] },
      { sub: "Beanie",        keywords: ["beanie", "knit hat"] },
      { sub: "Wide-Brim Hat", keywords: ["hat", "wide-brim", "fedora", "beret"] },
      { sub: "Gloves",        keywords: ["glove", "gloves"] },
      { sub: "Hair Clip",     keywords: ["hair clip", "hairpin", "barrette"] },
      { sub: "Headband",      keywords: ["headband"] },
      { sub: "Jewelry",       keywords: ["accessory", "accessories"] },
    ],
    6: [
      { sub: "Trench Coat",    keywords: ["trench coat", "trench"] },
      { sub: "Wool Coat",      keywords: ["wool coat", "overcoat", "peacoat"] },
      { sub: "Puffer Jacket",  keywords: ["puffer", "down jacket", "quilted jacket"] },
      { sub: "Leather Jacket", keywords: ["leather jacket"] },
      { sub: "Denim Jacket",   keywords: ["denim jacket", "jean jacket"] },
      { sub: "Bomber Jacket",  keywords: ["bomber", "flight jacket"] },
      { sub: "Blazer",         keywords: ["blazer", "sport coat"] },
      { sub: "Windbreaker",    keywords: ["windbreaker", "anorak"] },
      { sub: "Parka",          keywords: ["parka"] },
      { sub: "Blazer",         keywords: ["coat", "jacket"] },
    ],
    2: [
      { sub: "Jeans",       keywords: ["jean", "jeans", "denim", "blue jean"] },
      { sub: "Trousers",    keywords: ["trousers", "slacks", "dress pants"] },
      { sub: "Chinos",      keywords: ["chinos", "chino"] },
      { sub: "Shorts",      keywords: ["shorts"] },
      { sub: "Leggings",    keywords: ["leggings", "legging"] },
      { sub: "Joggers",     keywords: ["joggers", "sweatpants", "track pants"] },
      // Long skirt hints → Maxi Skirt (checked FIRST before miniskirt)
      { sub: "Maxi Skirt",  keywords: ["overskirt", "hoopskirt", "crinoline", "sarong", "petticoat"] },
      { sub: "Mini Skirt",  keywords: ["miniskirt"] },
      { sub: "Midi Skirt",  keywords: ["midi skirt"] },
      { sub: "Maxi Skirt",  keywords: ["maxi skirt"] },
      { sub: "Denim Skirt", keywords: ["denim skirt"] },
      { sub: "Mini Skirt",  keywords: ["skirt"] },
      { sub: "Jeans",       keywords: ["pants", "bottom"] },
    ],
    8: [
      { sub: "Sports Bra",           keywords: ["sports bra"] },
      { sub: "Compression Leggings", keywords: ["leggings", "compression", "yoga pants"] },
      { sub: "Athletic Shorts",      keywords: ["athletic shorts", "gym shorts", "running shorts"] },
      { sub: "Track Jacket",         keywords: ["track jacket"] },
      { sub: "Track Pants",          keywords: ["track pants", "joggers"] },
      { sub: "Cycling Shorts",       keywords: ["cycling shorts", "bike shorts"] },
      { sub: "Tennis Skirt",         keywords: ["tennis skirt"] },
      { sub: "Rashguard",            keywords: ["rashguard", "rash guard"] },
    ],
    1: [
      { sub: "Cardigan",          keywords: ["cardigan"] },
      { sub: "Hoodie",            keywords: ["hoodie", "hooded"] },
      { sub: "Sweatshirt",        keywords: ["sweatshirt"] },
      { sub: "Sweater",           keywords: ["sweater", "pullover", "knitwear", "knit"] },
      { sub: "Turtleneck",        keywords: ["turtleneck", "mock neck", "polo neck"] },
      { sub: "Polo Shirt",        keywords: ["polo"] },
      { sub: "Button-Down Shirt", keywords: ["button-down", "button down"] },
      { sub: "Blouse",            keywords: ["blouse"] },
      { sub: "Tank Top",          keywords: ["tank top", "tank", "camisole", "spaghetti strap"] },
      { sub: "Crop Top",          keywords: ["crop top", "crop"] },
      { sub: "Bodysuit",          keywords: ["bodysuit"] },
      { sub: "T-Shirt",           keywords: ["t-shirt", "tee", "tee shirt", "jersey"] },
      { sub: "T-Shirt",           keywords: ["shirt", "top"] },
    ],
  };

  // ── PICK BEST SUBCATEGORY ─────────────────────────────────────────
  const subOptions = SUBCATEGORY_SIGNALS[detectedCategory] || [];
  let detectedSub = "";

  // Special override: if long skirt hints present and we're in Bottoms → force Maxi Skirt
  if (detectedCategory === 2 && hasLongSkirtHint) {
    detectedSub = "Maxi Skirt";
    console.log("📏 Long skirt hint detected → forcing Maxi Skirt");
  } else {
    outer:
    for (const { sub, keywords: subKws } of subOptions) {
      for (const token of filtered) {
        for (const kw of subKws) {
          if (token === kw || token.includes(kw) || kw.includes(token)) {
            detectedSub = sub;
            break outer;
          }
        }
      }
    }
  }

  if (!detectedSub && subOptions.length > 0) {
    detectedSub = subOptions[subOptions.length - 1].sub;
  }

  // ── COLOR DETECTION ───────────────────────────────────────────────
  const COLOR_MAP = {
    "White":        ["white", "ivory", "cream", "off-white"],
    "Black":        ["black", "ebony", "jet"],
    "Navy":         ["navy", "dark blue", "midnight blue", "navy blue"],
    "Light Blue":   ["light blue", "baby blue", "sky blue", "denim blue", "pale blue", "blue"],
    "Red":          ["red", "crimson", "scarlet"],
    "Burgundy":     ["burgundy", "wine", "maroon", "bordeaux"],
    "Pink":         ["pink", "hot pink", "fuchsia", "magenta", "blush pink", "rose"],
    "Blush":        ["blush", "dusty pink", "nude pink"],
    "Orange":       ["orange", "coral", "rust"],
    "Yellow":       ["yellow", "lemon", "lime yellow"],
    "Mustard":      ["mustard", "gold"],
    "Olive":        ["olive", "khaki"],
    "Forest Green": ["green", "forest green", "emerald", "hunter green"],
    "Sage":         ["sage", "mint", "pastel green"],
    "Camel":        ["camel", "tan", "sand"],
    "Beige":        ["beige", "ecru", "nude"],
    "Brown":        ["brown", "chocolate", "mocha", "coffee", "cognac"],
    "Light Gray":   ["gray", "grey", "silver", "light gray"],
    "Charcoal":     ["charcoal", "dark gray", "dark grey"],
    "Purple":       ["purple", "violet", "plum"],
    "Lavender":     ["lavender", "lilac", "mauve"],
    "Patterned":    ["patterned", "floral", "striped", "checked", "plaid", "animal print", "leopard", "zebra"],
    "Multicolor":   ["multicolor", "multicolour", "colorful"],
  };

  let detectedColor = "";
  outerColor:
  for (const token of filtered) {
    for (const [colorName, aliases] of Object.entries(COLOR_MAP)) {
      for (const alias of aliases) {
        if (token === alias || token.includes(alias)) {
          detectedColor = colorName;
          break outerColor;
        }
      }
    }
  }
  if (!detectedColor) detectedColor = "Multicolor";

  console.log(`✅ Detected → cat: ${detectedCategory}, sub: "${detectedSub}", color: "${detectedColor}"`);

  // ── APPLY TO FORM ─────────────────────────────────────────────────
  setForm((prev) => ({
    ...prev,
    category_id: detectedCategory,
    color: detectedColor,
    style: prev.style || "Casual",
    season: prev.season || "All Season",
    occasion: prev.occasion || "Everyday",
  }));

  setSubcategory(detectedSub);
  applyRules(detectedSub);
}

    } catch (err) {
      console.error("AI ERROR:", err);
    }
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── form handling ───────────────────────────────────────
  const handleChange = (field, value) => {
    if (field === "category_id") setSubcategory("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!file) return setError("Please upload an image.");
    if (!form.category_id) return setError("Please select a category.");
    if (!subcategory) return setError("Please select a subcategory.");
    if (!form.color) return setError("Please select a color.");
    if (!form.style) return setError("Please select a style.");
    if (!form.season) return setError("Please select a season.");
    if (!form.occasion) return setError("Please select an occasion.");

    setLoading(true);

    const data = new FormData();
    data.append("image", file);
    data.append("category_id", form.category_id);
    data.append("subcategory", subcategory);
    data.append("color", form.color);
    data.append("style", form.style);
    data.append("season", form.season);
    data.append("occasion", form.occasion);
    data.append("user_id", user?.user_id || user?.id);

    try {
      const res = await fetch("http://localhost:5000/api/clothing/add", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Something went wrong");

      setSuccess(true);
      setTimeout(() => router.push("/member/wardrobe"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── derived subcategory options ─────────────────────────
  const selectedCategoryName = CATEGORIES.find(
    (c) => String(c.id) === String(form.category_id)
  )?.name;
  const subcategoryOptions = selectedCategoryName
    ? SUBCATEGORIES[selectedCategoryName] || []
    : [];

  // ── UI ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f5] px-6 py-10 md:px-12">
      <h1 className="text-3xl font-semibold text-[#2d2d2d] mb-1">Add Clothing Item</h1>
      <p className="text-sm text-[#999] mb-8">
        Upload a photo and fill in the details to add it to your wardrobe.
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8 max-w-2xl">

        {/* ── Image Upload ── */}
        <p className="text-sm font-semibold text-[#2d2d2d] mb-3">Upload Image</p>
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`
            relative w-full h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragOver
              ? "border-[#e8a87c] bg-[#fff8f4]"
              : "border-[#ddd5c8] bg-[#faf8f5] hover:border-[#c9a882] hover:bg-[#fff8f4]"}
          `}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-contain rounded-xl p-2"
            />
          ) : (
            <>
              <div className="w-10 h-10 mb-3 text-[#b5a090]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0L8 10m4-4v12" />
                </svg>
              </div>
              <p className="text-sm text-[#b5a090]">click or drag to upload an image</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {preview && (
          <button
            onClick={() => { setPreview(null); setFile(null); }}
            className="mt-2 text-xs text-[#c0392b] hover:underline"
          >
            Remove image
          </button>
        )}

        {/* ── Fields Grid ── */}
        <div className="grid grid-cols-2 gap-5 mt-7">
          <SelectField
            label="Category"
            value={form.category_id}
            onChange={(v) => handleChange("category_id", v)}
            options={CATEGORIES.map((c) => ({ label: c.name, value: c.id }))}
            placeholder="Select Category"
          />

          {form.category_id && (
            <SelectField
              label="Subcategory"
              value={subcategory}
              onChange={(v) => setSubcategory(v)}
              options={subcategoryOptions.map((s) => ({ label: s, value: s }))}
              placeholder="Select Subcategory"
            />
          )}

          <SelectField
            label="Color"
            value={form.color}
            onChange={(v) => handleChange("color", v)}
            options={COLORS.map((c) => ({ label: c, value: c }))}
            placeholder="e.g. Blue, Red"
          />
          <SelectField
            label="Style"
            value={form.style}
            onChange={(v) => handleChange("style", v)}
            options={STYLES.map((s) => ({ label: s, value: s }))}
            placeholder="Select Style"
          />
          <SelectField
            label="Season"
            value={form.season}
            onChange={(v) => handleChange("season", v)}
            options={SEASONS.map((s) => ({ label: s, value: s }))}
            placeholder="Select Season"
          />
        </div>

        <div className="mt-5">
          <SelectField
            label="Occasion"
            value={form.occasion}
            onChange={(v) => handleChange("occasion", v)}
            options={OCCASIONS.map((o) => ({ label: o, value: o }))}
            placeholder="Select occasion"
          />
        </div>

        {/* ── Error / Success ── */}
        {error && (
          <p className="mt-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            ✓ Item added! Redirecting to wardrobe…
          </p>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={loading || success}
          className="mt-7 w-full py-3.5 rounded-xl bg-[#6a9e76] hover:bg-[#5a8e66] active:bg-[#4e7d5a] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Save Item"}
        </button>
      </div>
    </div>
  );
}

// ── Reusable Select ──────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2d2d2d] mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#fdf6ee] border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#e8a87c] focus:border-transparent cursor-pointer"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b5a090]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
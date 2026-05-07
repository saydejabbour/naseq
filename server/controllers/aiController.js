import sharp from "sharp";

/* -------------------- CATEGORY DATA -------------------- */

const CATEGORIES = {
 Tops: [
  "t-shirt", "shirt", "blouse", "tank top", "crop top", "bodysuit",
  "sweater", "hoodie", "cardigan", "top", "camisole", "jersey",
  "maillot", "tank suit", "bikini", "two-piece", "brassiere", "bra",
  "bandeau", "corset"
],
  Bottoms: [
    "jeans", "pants", "trousers", "shorts", "skirt", "miniskirt",
    "leggings", "joggers", "sweatpants", "denim"
  ],
  Shoes: [
    "shoe", "sneaker", "boot", "heel", "sandal", "loafer",
    "flat", "mule", "footwear"
  ],
  Accessories: [
    "hat", "cap", "belt", "scarf", "watch", "sunglasses",
    "jewelry", "necklace", "bracelet", "earring", "gloves"
  ],
  "Dresses & Jumpsuits": [
    "dress", "gown", "frock", "jumpsuit", "romper", "sundress",
    "evening gown", "cocktail dress"
  ],
  Outerwear: [
    "coat", "jacket", "blazer", "trench", "parka", "puffer",
    "windbreaker", "bomber"
  ],
  Bags: [
    "bag", "handbag", "tote", "backpack", "clutch", "crossbody",
    "purse", "shoulder bag"
  ],
  Activewear: [
    "sports bra", "activewear", "gym", "athletic", "track pants",
    "track jacket", "cycling shorts", "tennis skirt"
  ],
};

const SUBCATEGORIES = [
 { category: "Tops", subcategory: "Tank Top", keywords: ["maillot", "tank suit", "bikini", "two-piece", "bandeau", "brassiere", "bra", "corset"] },

  { category: "Bottoms", subcategory: "Jeans", keywords: ["jeans", "denim", "blue jean"] },
  { category: "Bottoms", subcategory: "Trousers", keywords: ["trousers", "pants", "slacks"] },
  { category: "Bottoms", subcategory: "Shorts", keywords: ["shorts"] },
  { category: "Bottoms", subcategory: "Leggings", keywords: ["leggings"] },
  { category: "Bottoms", subcategory: "Mini Skirt", keywords: ["miniskirt", "mini skirt", "skirt"] },

  { category: "Dresses & Jumpsuits", subcategory: "Evening Gown", keywords: ["gown", "evening gown", "ball gown"] },
  { category: "Dresses & Jumpsuits", subcategory: "Mini Dress", keywords: ["mini dress", "dress", "frock"] },
  { category: "Dresses & Jumpsuits", subcategory: "Jumpsuit", keywords: ["jumpsuit"] },
  { category: "Dresses & Jumpsuits", subcategory: "Romper", keywords: ["romper"] },

  { category: "Shoes", subcategory: "Sneakers", keywords: ["sneaker", "sneakers", "trainer"] },
  { category: "Shoes", subcategory: "Heels", keywords: ["heel", "heels", "pump", "stiletto"] },
  { category: "Shoes", subcategory: "Sandals", keywords: ["sandal", "sandals"] },
  { category: "Shoes", subcategory: "Boots", keywords: ["boot", "boots"] },
  { category: "Shoes", subcategory: "Loafers", keywords: ["loafer", "loafers"] },

  { category: "Accessories", subcategory: "Baseball Cap", keywords: ["cap", "baseball cap"] },
  { category: "Accessories", subcategory: "Belt", keywords: ["belt"] },
  { category: "Accessories", subcategory: "Sunglasses", keywords: ["sunglasses", "glasses"] },
  { category: "Accessories", subcategory: "Jewelry", keywords: ["jewelry", "necklace", "bracelet", "earring"] },

  { category: "Outerwear", subcategory: "Blazer", keywords: ["blazer"] },
  { category: "Outerwear", subcategory: "Coat", keywords: ["coat", "overcoat"] },
  { category: "Outerwear", subcategory: "Puffer Jacket", keywords: ["puffer"] },
  { category: "Outerwear", subcategory: "Jacket", keywords: ["jacket"] },

  { category: "Bags", subcategory: "Tote Bag", keywords: ["tote"] },
  { category: "Bags", subcategory: "Backpack", keywords: ["backpack"] },
  { category: "Bags", subcategory: "Clutch", keywords: ["clutch"] },
  { category: "Bags", subcategory: "Shoulder Bag", keywords: ["handbag", "bag", "purse"] },

  { category: "Activewear", subcategory: "Sports Bra", keywords: ["sports bra"] },
  { category: "Activewear", subcategory: "Track Pants", keywords: ["track pants"] },
  { category: "Activewear", subcategory: "Tennis Skirt", keywords: ["tennis skirt"] },
];

/* -------------------- COLOR DATA -------------------- */

const COLOR_PALETTE = [
  { name: "Black", rgb: [20, 20, 20] },
  { name: "White", rgb: [245, 245, 245] },
  { name: "Ivory", rgb: [255, 248, 220] },
  { name: "Beige", rgb: [210, 190, 160] },
  { name: "Camel", rgb: [193, 154, 107] },
  { name: "Light Gray", rgb: [190, 190, 190] },
  { name: "Charcoal", rgb: [70, 70, 70] },
  { name: "Brown", rgb: [120, 75, 45] },
  { name: "Light Blue", rgb: [135, 190, 230] },
  { name: "Navy", rgb: [20, 35, 80] },
  { name: "Royal Blue", rgb: [40, 90, 200] },
  { name: "Olive", rgb: [105, 120, 60] },
  { name: "Forest Green", rgb: [35, 100, 60] },
  { name: "Sage", rgb: [160, 180, 150] },
  { name: "Red", rgb: [190, 40, 40] },
  { name: "Burgundy", rgb: [110, 25, 45] },
  { name: "Pink", rgb: [190, 120, 135] },
  { name: "Blush", rgb: [215, 170, 170] },
  { name: "Orange", rgb: [220, 120, 45] },
  { name: "Yellow", rgb: [230, 210, 70] },
  { name: "Mustard", rgb: [190, 150, 45] },
  { name: "Purple", rgb: [120, 70, 160] },
  { name: "Lavender", rgb: [180, 150, 220] },
];

function distance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")
  );
}

function findClosestColor(rgb) {
  let best = COLOR_PALETTE[0];
  let bestDistance = Infinity;

  for (const color of COLOR_PALETTE) {
    const d = distance(rgb, color.rgb);
    if (d < bestDistance) {
      bestDistance = d;
      best = color;
    }
  }

  return best.name;
}

/* -------------------- HELPERS -------------------- */

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function detectCategoryAndSubcategory(labels) {
  const joined = labels.map(normalize).join(" ");

  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    scores[category] = 0;

    for (const keyword of keywords) {
      if (joined.includes(keyword)) {
        scores[category] += 1;
      }
    }
  }

  let bestCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  let category = bestCategory?.[1] > 0 ? bestCategory[0] : "Tops";

  let subcategory = "";

  for (const item of SUBCATEGORIES) {
    if (item.category !== category) continue;

    const found = item.keywords.some((keyword) => joined.includes(keyword));

    if (found) {
      subcategory = item.subcategory;
      break;
    }
  }

  if (!subcategory) {
    const fallback = SUBCATEGORIES.find((item) => item.category === category);
    subcategory = fallback?.subcategory || "";
  }

  return {
    category,
    subcategory,
    confidence: bestCategory?.[1] > 0 ? 0.75 : 0.35,
  };
}

async function detectMainColorFromBuffer(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(90, 90, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    const isWhiteBackground =
      red > 220 &&
      green > 220 &&
      blue > 220 &&
      Math.abs(red - green) < 20 &&
      Math.abs(red - blue) < 20 &&
      Math.abs(green - blue) < 20;

    if (isWhiteBackground) continue;

    const isAlmostBlack = red < 18 && green < 18 && blue < 18;
    if (isAlmostBlack) continue;

    r += red;
    g += green;
    b += blue;
    count++;
  }

  if (count === 0) {
    return {
      color: "White",
      hex: "#ffffff",
      rgb: [255, 255, 255],
    };
  }

  const avgRgb = [
    Math.round(r / count),
    Math.round(g / count),
    Math.round(b / count),
  ];

  return {
    color: findClosestColor(avgRgb),
    hex: rgbToHex(avgRgb),
    rgb: avgRgb,
  };
}

/* -------------------- CONTROLLERS -------------------- */

export const analyzeImage = async (req, res) => {
  try {
    console.log("📥 Received image analyze request");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("🚀 Sending image to HuggingFace...");

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: req.file.buffer,
      }
    );

    const hfData = await response.json();

    console.log("🤖 HF response:", hfData);

    if (!Array.isArray(hfData)) {
      return res.status(500).json({
        success: false,
        message: "AI failed",
        raw: hfData,
      });
    }

    const concepts = hfData.map((item) => item.label);
    const categoryData = detectCategoryAndSubcategory(concepts);
    const colorData = await detectMainColorFromBuffer(req.file.buffer);

    return res.json({
      success: true,
      concepts,
      category: categoryData.category,
      subcategory: categoryData.subcategory,
      color: colorData.color,
      hex: colorData.hex,
      rgb: colorData.rgb,
      confidence: categoryData.confidence,
    });
  } catch (err) {
    console.error("🔥 ANALYZE IMAGE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const detectColor = async (req, res) => {
  try {
    console.log("🎨 Detecting real image color...");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const colorData = await detectMainColorFromBuffer(req.file.buffer);

    return res.json({
      success: true,
      ...colorData,
    });
  } catch (err) {
    console.error("🔥 COLOR DETECTION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Color detection failed",
    });
  }
};
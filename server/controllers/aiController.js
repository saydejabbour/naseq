import OpenAI from "openai";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* -------------------- CATEGORY DATA -------------------- */

const VALID_CATEGORIES = {
  Tops: [
    "T-Shirt", "Polo Shirt", "Button-Down Shirt", "Blouse",
    "Tank Top", "Crop Top", "Bodysuit", "Sweater",
    "Turtleneck", "Cardigan", "Hoodie", "Sweatshirt",
  ],

  Bottoms: [
    "Jeans", "Trousers", "Dress Pants", "Chinos",
    "Shorts", "Leggings", "Joggers", "Sweatpants",
    "Mini Skirt", "Midi Skirt", "Maxi Skirt", "Denim Skirt",
  ],

  "Dresses & Jumpsuits": [
    "Mini Dress", "Midi Dress", "Maxi Dress", "Wrap Dress",
    "Shirt Dress", "Bodycon Dress", "Slip Dress",
    "Sundress", "Evening Gown", "Jumpsuit", "Romper",
  ],

  Outerwear: [
    "Trench Coat", "Wool Coat", "Puffer Jacket", "Leather Jacket",
    "Denim Jacket", "Bomber Jacket", "Blazer",
    "Windbreaker", "Parka", "Peacoat",
  ],

  Shoes: [
    "Sneakers", "Loafers", "Oxford Shoes", "Chelsea Boots",
    "Ankle Boots", "Knee-High Boots", "Heels", "Block Heels",
    "Sandals", "Slides", "Ballet Flats", "Mules",
  ],

  Accessories: [
    "Belt", "Sunglasses", "Watch", "Scarf",
    "Baseball Cap", "Beanie", "Wide-Brim Hat",
    "Gloves", "Hair Clip", "Headband", "Jewelry"
  ],

  Bags: [
    "Tote Bag", "Backpack", "Shoulder Bag", "Crossbody Bag",
    "Clutch", "Mini Bag", "Bucket Bag", "Fanny Pack",
  ],

  Activewear: [
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

/* -------------------- COLOR DETECTION -------------------- */

function distance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

const COLOR_PALETTE = [
  { name: "Black", rgb: [20, 20, 20] },
  { name: "White", rgb: [245, 245, 245] },
  { name: "Beige", rgb: [210, 190, 160] },
  { name: "Brown", rgb: [120, 75, 45] },
  { name: "Light Blue", rgb: [135, 190, 230] },
  { name: "Navy", rgb: [20, 35, 80] },
  { name: "Red", rgb: [255, 0, 0] },
{ name: "Pink", rgb: [255, 170, 190] },
  { name: "Orange", rgb: [220, 120, 45] },
  { name: "Yellow", rgb: [230, 210, 70] },
  { name: "Purple", rgb: [120, 70, 160] },
  { name: "Olive", rgb: [105, 120, 60] },
];

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

    const isWhite =
      red > 220 &&
      green > 220 &&
      blue > 220;

    if (isWhite) continue;

    r += red;
    g += green;
    b += blue;
    count++;
  }

  if (count === 0) {
    return "White";
  }

  const avgRgb = [
    Math.round(r / count),
    Math.round(g / count),
    Math.round(b / count),
  ];

  return findClosestColor(avgRgb);
}

/* -------------------- AI ANALYSIS -------------------- */

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }
    if (process.env.AI_ENABLED !== "true") {
  return res.json({
    success: false,
    message: "AI is disabled",
  });
}

    const base64Image = req.file.buffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a fashion classifier.

You must ONLY return valid JSON.

Return:
{
  "category": "",
  "subcategory": "",
  "color": ""
}

Rules:
- category must be one of:
${Object.keys(VALID_CATEGORIES).join(", ")}

- subcategory must belong to the category.
- color must be one of:
Black, White, Ivory, Beige, Camel,
Light Gray, Charcoal, Brown,
Light Blue, Navy, Royal Blue,
Olive, Forest Green, Sage,
Red, Burgundy, Pink, Blush,
Orange, Yellow, Mustard,
Purple, Lavender

- no explanations
- no markdown
          `,
        },

        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this clothing item.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        category: "Tops",
        subcategory: "T-Shirt",
      };
    }

    return res.json({
  success: true,
  category: parsed.category,
  subcategory: parsed.subcategory,
  color: parsed.color,
});

  } catch (err) {
    console.error("OPENAI ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "AI failed",
    });
  }
};

/* -------------------- COLOR ONLY -------------------- */

export const detectColor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const color = await detectMainColorFromBuffer(req.file.buffer);

    return res.json({
      success: true,
      color,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Color detection failed",
    });
  }
};
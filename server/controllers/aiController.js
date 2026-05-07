import sharp from "sharp";

export const analyzeImage = async (req, res) => {
  try {
    console.log("📥 Received request");

    if (!req.file) {
      return res.status(400).json({ success: false });
    }

    console.log("🚀 Sending to HuggingFace...");

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

    const data = await response.json();

    console.log("🤖 HF response:", data);

    if (!Array.isArray(data)) {
      return res.status(500).json({
        success: false,
        message: "AI failed",
      });
    }

    const concepts = data.map(item => item.label);

    return res.json({
      success: true,
      concepts,
    });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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

export const detectColor = async (req, res) => {
  try {
    console.log("🎨 Detecting real image color...");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const { data, info } = await sharp(req.file.buffer)
      .resize(80, 80, { fit: "inside" })
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

     // ignore white / light gray backgrounds
const isLightBackground =
  red > 185 &&
  green > 185 &&
  blue > 185 &&
  Math.abs(red - green) < 25 &&
  Math.abs(red - blue) < 25 &&
  Math.abs(green - blue) < 25;

if (isLightBackground) continue;

// ignore almost black shadows
if (red < 20 && green < 20 && blue < 20) continue;

      r += red;
      g += green;
      b += blue;
      count++;
    }

    if (count === 0) {
      return res.json({
        success: true,
        color: "White",
        hex: "#ffffff",
      });
    }

    const avgRgb = [
      Math.round(r / count),
      Math.round(g / count),
      Math.round(b / count),
    ];

    const detectedColor = findClosestColor(avgRgb);

    return res.json({
      success: true,
      color: detectedColor,
      hex: rgbToHex(avgRgb),
      rgb: avgRgb,
    });
  } catch (err) {
    console.error("🔥 COLOR DETECTION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Color detection failed",
    });
  }
};
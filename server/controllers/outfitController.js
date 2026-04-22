import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import path from "path";


// ================= CREATE OUTFIT WITH ITEMS =================
export const createOutfit = (req, res) => {
  const { user_id, name, items } = req.body;

  if (!user_id || !items || items.length === 0) {
    return errorResponse(res, "Missing required fields", 400);
  }

  const insertOutfitQuery =
    "INSERT INTO outfits (user_id, name) VALUES (?, ?)";

  db.query(
    insertOutfitQuery,
    [user_id, name || "My Outfit"],
    (err, result) => {
      if (err) {
        console.error("❌ Create outfit error:", err);
        return errorResponse(res, "Failed to create outfit");
      }

      const outfit_id = result.insertId;

      console.log("BACKEND RECEIVED:", items);

      // ✅ SAFE INSERT (loop)
      const insertItemsQuery = `
        INSERT INTO member_outfit_items 
        (outfit_id, item_id, x, y, width, height, rotation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      items.forEach((item) => {
        db.query(
          insertItemsQuery,
          [
            outfit_id,
            item.item_id,
            item.x,
            item.y,
            item.width,
            item.height,
            item.rotation,
          ],
          (err2) => {
            if (err2) {
              console.error("❌ Insert item error:", err2);
            }
          }
        );
      });

      return successResponse(res, "Outfit saved successfully", {
        outfit_id,
      });
    }
  );
};


// ================= SAVE OUTFIT AS IMAGE (🔥 NEW SYSTEM) =================
export const saveOutfitImage = (req, res) => {
  const { user_id, image } = req.body;

  if (!user_id || !image) {
    return errorResponse(res, "Missing data", 400);
  }

  try {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    const fileName = `outfit_${Date.now()}.png`;

    const uploadPath = path.join("uploads");

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, base64Data, "base64");

    const query =
      "INSERT INTO outfits (user_id, name, image_url) VALUES (?, ?, ?)";

    db.query(
      query,
      [user_id, "My Outfit", `/uploads/${fileName}`],
      (err) => {
        if (err) {
          console.error("❌ DB error:", err);
          return errorResponse(res, "Database error");
        }

        return successResponse(res, "Outfit saved as image", {
          image_url: `/uploads/${fileName}`,
        });
      }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    return errorResponse(res, "Server error");
  }
};


// ================= GET USER OUTFITS =================
export const getOutfits = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT outfit_id, name, image_url
    FROM outfits
    WHERE user_id = ?
    ORDER BY outfit_id DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return errorResponse(res, "Failed to fetch outfits");
    }

    return successResponse(res, "Outfits fetched", results);
  });
};


// ================= DELETE OUTFIT =================
export const deleteOutfit = (req, res) => {
  const { outfit_id } = req.params;

  const query = "DELETE FROM outfits WHERE outfit_id = ?";

  db.query(query, [outfit_id], (err) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return errorResponse(res, "Failed to delete outfit");
    }

    return successResponse(res, "Outfit deleted");
  });
};

// ================= GENERATE OUTFITS (NEW FEATURE) =================
export const generateOutfits = async (req, res) => {
  try {
    const { user_id, base_item_id, styles } = req.body;

    if (!user_id || !base_item_id || !styles || styles.length === 0) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // 🔹 BASE ITEM
    const [baseRows] = await db.promise().query(
      "SELECT * FROM clothing_items WHERE item_id = ? AND user_id = ?",
      [base_item_id, user_id]
    );

    if (!baseRows.length) {
      return errorResponse(res, "Base item not found", 404);
    }

    const baseItem = baseRows[0];
    const category = baseItem.category_id;

    // 🔹 ALL ITEMS
    const [allItemsRaw] = await db.promise().query(
      "SELECT * FROM clothing_items WHERE user_id = ?",
      [user_id]
    );

    const outfits = [];

    for (let style of styles) {
      const used = new Set([baseItem.item_id]);

      let outfit = {
        style,
        items: {}
      };

      // ─────────────────────────────────────────────
      // 🔥 TYPE FILTER (NO MIXING)
      // ─────────────────────────────────────────────
      let usableItems;

      if (category == 5) {
        // dress → remove tops & bottoms
        usableItems = allItemsRaw.filter(
          i => i.category_id !== 1 && i.category_id !== 2
        );
      } else {
        // normal → remove dresses
        usableItems = allItemsRaw.filter(
          i => i.category_id !== 5
        );
      }

      // 🔥 STYLE FILTER
      usableItems = usableItems.filter(i => i.style === style);

      // ─────────────────────────────────────────────
      // 🎨 SCORE FUNCTION (IMPROVED)
      // ─────────────────────────────────────────────
      const calculateScore = (item) => {
        let score = 0;

        const NEUTRAL = ["black", "white", "grey", "beige", "navy"];

        // COLOR
        if (item.color === baseItem.color) {
          score += 4;
        } else if (
          NEUTRAL.includes(item.color?.toLowerCase()) ||
          NEUTRAL.includes(baseItem.color?.toLowerCase())
        ) {
          score += 2;
        }

        // SEASON
        if (item.season === baseItem.season) {
          score += 3;
        } else if (
          item.season === "All Season" ||
          baseItem.season === "All Season"
        ) {
          score += 2;
        }

        return score; // max ≈ 7
      };

      // ─────────────────────────────────────────────
      // 🔥 BEST MATCH
      // ─────────────────────────────────────────────
      const getBest = (category_id, minScore = 0) => {
        const candidates = usableItems
          .filter(i => i.category_id === category_id && !used.has(i.item_id))
          .map(i => ({ ...i, _score: calculateScore(i) }))
          .filter(i => i._score >= minScore)
          .sort((a, b) => b._score - a._score);

        const best = candidates[0] || null;

        if (best) used.add(best.item_id);
        return best;
      };

      // ─────────────────────────────────────────────
      // 🎲 RANDOM VARIATION (FOR DIVERSITY)
      // ─────────────────────────────────────────────
      const getRandomized = (category_id, minScore = 0) => {
        const candidates = usableItems
          .filter(i => i.category_id === category_id && !used.has(i.item_id))
          .map(i => ({ ...i, _score: calculateScore(i) }))
          .filter(i => i._score >= minScore);

        if (!candidates.length) return null;

        const random =
          candidates[Math.floor(Math.random() * candidates.length)];

        used.add(random.item_id);
        return random;
      };

      // ─────────────────────────────────────────────
      // 🧱 STRUCTURE LOGIC (CRITICAL FIX)
      // ─────────────────────────────────────────────
      if (category == 5) {
        outfit.items.dress = baseItem;

      } else if (category == 1) {
        outfit.items.top = baseItem;

      } else if (category == 2) {
        outfit.items.bottom = baseItem;

      } else if (category == 3) {
        outfit.items.shoes = baseItem;

      } else if (category == 7) {
        outfit.items.bag = baseItem;

      } else if (category == 4) {
        outfit.items.accessories = [baseItem];

      } else if (category == 6) {
        outfit.items.outerwear = baseItem;
      }

      // ─────────────────────────────────────────────
      // 🔥 REQUIRED ITEMS
      // ─────────────────────────────────────────────
      if (!outfit.items.dress) {

        if (!outfit.items.top) {
          outfit.items.top = getBest(1, 3);
        }

        if (!outfit.items.bottom) {
          outfit.items.bottom = getRandomized(2, 3);
        }

      }

      if (!outfit.items.shoes) {
        outfit.items.shoes = getRandomized(3, 3);
      }

      // ─────────────────────────────────────────────
      // ✨ OPTIONAL ITEMS
      // ─────────────────────────────────────────────
      const tryOptional = (category_id) => {
        const item = getBest(category_id, 4);
        return item || null;
      };

      if (!outfit.items.bag) {
        outfit.items.bag = tryOptional(7);
      }

      if (!outfit.items.outerwear) {
        outfit.items.outerwear = tryOptional(6);
      }

      // ─────────────────────────────────────────────
      // 🎀 ACCESSORIES (MAX 2)
      // ─────────────────────────────────────────────
      const accessories = usableItems
        .filter(i => i.category_id == 4 && !used.has(i.item_id))
        .map(i => ({ ...i, score: calculateScore(i) }))
        .filter(i => i.score >= 4)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

      if (!outfit.items.accessories) {
        outfit.items.accessories = accessories;
      }

      outfits.push(outfit);
    }

    return successResponse(res, "Outfits generated", outfits);

  } catch (err) {
    console.error("❌ Generate error:", err);
    return errorResponse(res, "Server error", 500);
  }
};
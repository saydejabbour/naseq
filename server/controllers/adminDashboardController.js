import db from "../config/db.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // ================= TOTAL USERS =================
    const [usersResult] = await db
      .promise()
      .query("SELECT COUNT(*) AS totalUsers FROM users");

    // ================= OUTFITS CREATED =================
    const [outfitsResult] = await db
      .promise()
      .query("SELECT COUNT(*) AS outfitsCreated FROM outfits");

    // ================= TOTAL SAVES =================
    const [savesResult] = await db
      .promise()
      .query("SELECT COUNT(*) AS totalSaves FROM saved_templates");

    // ================= MOST POPULAR STYLE =================
    const [styleResult] = await db.promise().query(`
      SELECT style, COUNT(*) AS count
      FROM clothing_items
      WHERE style IS NOT NULL
      GROUP BY style
      ORDER BY count DESC
      LIMIT 1
    `);

    // ================= FINAL RESPONSE =================
    res.json({
      success: true,

      data: {
        totalUsers: usersResult[0].totalUsers || 0,

        outfitsCreated: outfitsResult[0].outfitsCreated || 0,

        totalSaves: savesResult[0].totalSaves || 0,

        mostPopularStyle:
          styleResult.length > 0
            ? styleResult[0].style
            : "No Data",
      },
    });
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
import db from "../config/db.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // TOTAL USERS
    const [usersResult] = await db.promise().query(`
      SELECT COUNT(*) AS totalUsers
      FROM users
    `);

    // OUTFITS CREATED
    const [outfitsResult] = await db.promise().query(`
      SELECT COUNT(*) AS outfitsCreated
      FROM outfits
    `);

    // TOTAL SAVES
    const [savesResult] = await db.promise().query(`
      SELECT COUNT(*) AS totalSaves
      FROM saved_templates
    `);

    // MOST POPULAR STYLE
    const [styleResult] = await db.promise().query(`
      SELECT style, COUNT(*) AS count
      FROM clothing_items
      WHERE style IS NOT NULL AND style != ''
      GROUP BY style
      ORDER BY count DESC
      LIMIT 1
    `);

    // USER GROWTH BY MONTH
    const [userGrowth] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        COUNT(*) AS users
      FROM users
      GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY YEAR(created_at), MONTH(created_at)
    `);

    // OUTFITS CREATED BY MONTH
    const [outfitsPerMonth] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        COUNT(*) AS outfits
      FROM outfits
      GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY YEAR(created_at), MONTH(created_at)
    `);

    // TOP CATEGORIES FROM REAL CLOTHING ITEMS
    const [topCategories] = await db.promise().query(`
      SELECT 
        c.name AS name,
        COUNT(ci.item_id) AS count
      FROM clothing_items ci
      JOIN categories c ON ci.category_id = c.category_id
      GROUP BY c.category_id, c.name
      ORDER BY count DESC
      LIMIT 5
    `);

    const totalCategoryItems = topCategories.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const topCategoriesWithPercent = topCategories.map((item) => ({
      name: item.name,
      percent:
        totalCategoryItems > 0
          ? Math.round((item.count / totalCategoryItems) * 100)
          : 0,
    }));

    // TRENDING OUTFITS FROM REAL SAVED TEMPLATES
   const [trendingOutfits] = await db.promise().query(`
  SELECT 
    st.template_id,
    st.title,
    st.style,
    st.season,
    st.occasion,
    st.image_url,
    u.full_name AS stylist_name,
    COUNT(saved.saved_id) AS saves
  FROM saved_templates saved
  JOIN stylist_templates st 
    ON saved.template_id = st.template_id
  LEFT JOIN stylist_profiles sp
    ON st.stylist_id = sp.stylist_id
  LEFT JOIN users u
    ON sp.user_id = u.user_id
  GROUP BY 
    st.template_id,
    st.title,
    st.style,
    st.season,
    st.occasion,
    st.image_url,
    u.full_name
  ORDER BY saves DESC
  LIMIT 4
`);

    res.json({
      success: true,
      data: {
        totalUsers: usersResult[0].totalUsers || 0,
        outfitsCreated: outfitsResult[0].outfitsCreated || 0,
        totalSaves: savesResult[0].totalSaves || 0,
        mostPopularStyle:
          styleResult.length > 0 ? styleResult[0].style : "No Data",

        userGrowth,
        outfitsPerMonth,
        topCategories: topCategoriesWithPercent,
        trendingOutfits,
      },
    });
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
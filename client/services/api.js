const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("API RESPONSE:", data);

    return data;

  } catch (error) {
    console.error("API ERROR:", error);

    return {
      success: false,
      message: "Server not reachable",
    };
  }
};


// ================= OUTFITS =================
export const getOutfits = async () => {
  return await apiRequest("/outfits");
};


// ================= SAVE TEMPLATE =================
export const saveTemplate = async (user_id, template_id) => {
  return await apiRequest("/saved-templates", "POST", {
    user_id,
    template_id,
  });
};


// ================= CONTACT =================
export const sendContactMessage = async (formData) => {
  return await apiRequest("/contact", "POST", formData);
};
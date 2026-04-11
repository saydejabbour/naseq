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

    return await res.json();
  } catch (error) {
    return {
      success: false,
      message: "Server not reachable",
    };
  }
};


export const getOutfits = async () => {
  return await apiRequest("/outfits");
};

export const saveTemplate = async (user_id, template_id) => {
  return await apiRequest("/saved-templates", "POST", {
    user_id,
    template_id,
  });
};
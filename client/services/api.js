const BASE_URL = "http://localhost:5000";

export const getOutfits = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/outfits`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching outfits:", error);
    return [];
  }
};
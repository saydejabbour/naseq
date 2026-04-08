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
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Server not reachable",
    };
  }
};
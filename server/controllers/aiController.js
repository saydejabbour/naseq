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
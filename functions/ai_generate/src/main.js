module.exports = async ({ req, res, log, error }) => {
  // 1. Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    error("Configuration Error: GEMINI_API_KEY is missing.");
    return res.json({ error: "Server configuration error" }, 500);
  }

  // 2. Parse request body safely
  let body = {};
  try {
    body = req.bodyJson || JSON.parse(req.body || "{}");
  } catch (e) {
    body = {};
  }

  const { prompt, model = "gemini-3-pro-preview" } = body;

  if (!prompt) {
    return res.json({ error: "Missing prompt parameter" }, 400);
  }

  // 3. Gemini API URL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      error(`Gemini API Error: ${errData}`);
      return res.json(
        { error: "Failed to fetch from AI provider" },
        response.status
      );
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.json({ error: "No content generated" }, 500);
    }

    // 4. Success response
    return res.json({ text: generatedText });

  } catch (err) {
    error(err.toString());
    return res.json({ error: "Internal Server Error" }, 500);
  }
};

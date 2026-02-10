const fetch = require("node-fetch");

module.exports = async ({ req, res, log, error }) => {
  try {
    log("Function started.");

    // 1. Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      error("Configuration Error: GEMINI_API_KEY is missing.");
      return res.json({ error: "Server configuration error" }, 500);
    }

    // 2. Parse request body
    let body = {};
    if (req.bodyJson) {
      body = req.bodyJson;
    } else {
      try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      } catch (e) {
        error("JSON Parse Error: " + e.message);
        return res.json({ error: "Invalid JSON body" }, 400);
      }
    }

    // Safety check if body is still not an object
    if (!body || typeof body !== "object") {
      body = {};
    }

    // Default to the faster flash model to avoid 30s synchronous timeouts
    const { prompt, model = "gemini-1.5-flash" } = body;

    if (!prompt) {
      error("Missing prompt parameter");
      return res.json({ error: "Missing prompt parameter" }, 400);
    }

    log(`Generating content with model: ${model}`);

    // 3. Gemini API URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      error(`Gemini API Error [${response.status}]: ${errText}`);
      return res.json(
        { error: "Failed to fetch from AI provider", details: errText },
        response.status,
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      error("Gemini response missing text: " + JSON.stringify(data));
      return res.json({ error: "No content generated from provider" }, 500);
    }

    log("Generation successful.");
    return res.json({ text: generatedText, model }); // Return used model for debugging
  } catch (err) {
    error("Unhandled Exception: " + err.toString());
    if (err.stack) error(err.stack);
    return res.json(
      { error: "Internal Server Error", message: err.message },
      500,
    );
  }
};

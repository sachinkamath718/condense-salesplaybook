const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * Cloud Function to proxy Gemini AI requests.
 * Securely uses GEMINI_API_KEY from environment variables.
 */
exports.chat = onRequest({ cors: true, secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        logger.error("GEMINI_API_KEY not found in secrets");
        return res.status(503).json({ error: "AI service not configured." });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const fetch = (await import("node-fetch")).default;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 300,
                }
            }),
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            logger.error("Gemini API error", { status: geminiRes.status, detail: errText });
            return res.status(geminiRes.status).json({ error: "AI service error", detail: errText });
        }

        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm busy. Email me.";

        res.status(200).json({ text });

    } catch (err) {
        logger.error("Proxy error", err);
        res.status(500).json({ error: "Internal proxy error" });
    }
});

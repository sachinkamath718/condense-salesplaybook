// @ts-check
/**
 * Vercel Serverless Function — Secure Gemini AI Proxy
 *
 * This file runs SERVER-SIDE on Vercel.
 * The GEMINI_API_KEY is read from Vercel environment variables and
 * is NEVER exposed to the browser.
 *
 * Frontend calls: POST /api/chat
 * Body: { messages: [{role, content}], systemContext: string, personaTitle: string }
 */

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
    // Only allow POST
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'AI service not configured. Please add GEMINI_API_KEY to Vercel environment variables.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await req.json() as {
            prompt: string;
        };

        const { prompt } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call Gemini REST API using gemini-2.5-flash-lite
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 500,
                }
            }),
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API error:', errText);
            return new Response(JSON.stringify({ error: 'AI service error', detail: errText }), {
                status: geminiRes.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await geminiRes.json() as {
            candidates?: { content?: { parts?: { text?: string }[] } }[]
        };

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm busy. Email me.";

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (err) {
        console.error('Proxy error:', err);
        return new Response(JSON.stringify({ error: 'Internal proxy error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

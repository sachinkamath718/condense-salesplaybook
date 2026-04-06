export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'API Key missing' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await req.json() as {
            userText: string;
            stageContext: string;
            personaName: string;
        };

        const { userText, stageContext, personaName } = body;

        const evaluatePrompt = `
You are an expert sales manager AI evaluating a sales rep's pitch.
The sales rep is talking to: ${personaName}.
The current concern they must address is described here:
"${stageContext}"

The sales rep said:
"${userText}"

Evaluate if the sales rep successfully, logically, and accurately addressed the core concern without hallucinating features outside of the Condense playbook.
- If it is completely off-topic or a low-effort reply, return success: false.
- If it just mentions a keyword but makes no logical sense, return success: false.
- If it correctly addresses the technical or business concern, return success: true.

Output EXACTLY AND ONLY valid JSON in this format:
{
  "success": boolean,
  "reasoning": "A 1-sentence explanation of why it passed or failed"
}
`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: evaluatePrompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 150,
                    responseMimeType: "application/json"
                }
            }),
        });

        if (!geminiRes.ok) {
            console.error('Gemini Eval error:', await geminiRes.text());
            return new Response(JSON.stringify({ success: false, reasoning: 'API Error' }), {
                status: 200, // Degrade gracefully
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await geminiRes.json() as {
            candidates?: { content?: { parts?: { text?: string }[] } }[]
        };

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        let result = { success: false, reasoning: 'Failed to parse evaluation.' };
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Eval parse error:', text);
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('Eval proxy error:', err);
        return new Response(JSON.stringify({ success: false, reasoning: 'Internal Error' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

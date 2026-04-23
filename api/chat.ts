// FILE LOCATION: api/chat.ts  (project ROOT — not src/components)
// Vercel picks this up automatically as a serverless edge function.
// ─────────────────────────────────────────────────────────────────────────────

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const { system, messages } = await req.json();

    if (!system || !messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Missing system or messages' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Convert messages array to Gemini's contents format
    // Role must be 'user' or 'model' — we pass them already in that format from BossBattle.tsx
    const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    // Gemini requires conversations to start with a 'user' turn
    // and alternate user/model. Filter out any leading model messages.
    const validContents = contents[0]?.role === 'model'
        ? contents.slice(1)
        : contents;

    const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // System prompt is separate — this is what keeps the bot in character
                system_instruction: {
                    parts: [{ text: system }],
                },
                // Real conversation history — not a text blob
                contents: validContents,
                generationConfig: {
                    maxOutputTokens: 300,
                    temperature: 0.7,
                },
            }),
        }
    );

    if (!geminiRes.ok || !geminiRes.body) {
        const errText = await geminiRes.text().catch(() => 'unknown error');
        console.error('[chat] Gemini error:', errText);
        return new Response(JSON.stringify({ error: 'Gemini API error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Stream Gemini SSE → extract text deltas → stream plain text to client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
        async start(controller) {
            const reader = geminiRes.body!.getReader();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        if (!line.startsWith('data: ')) continue;
                        const data = line.slice(6).trim();
                        if (!data || data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                controller.enqueue(encoder.encode(text));
                            }
                        } catch {
                            // Skip malformed SSE lines
                        }
                    }
                }
            } catch (err) {
                console.error('[chat] Stream read error:', err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
        },
    });
}

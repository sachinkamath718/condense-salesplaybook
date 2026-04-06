import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const config = {
    runtime: 'edge',
};

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response(
            JSON.stringify({ error: 'AI service not configured.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await req.json() as { prompt: string };
        const { prompt } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = streamText({
            model: googleAI('gemini-2.5-flash-lite'),
            prompt,
            temperature: 0.85,
        });

        return result.toTextStreamResponse();

    } catch (err: any) {
        console.error('Proxy error:', err);
        return new Response(JSON.stringify({ error: 'Internal proxy error', details: err?.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

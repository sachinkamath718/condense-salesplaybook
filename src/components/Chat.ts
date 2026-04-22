// pages/api/chat.ts  (Next.js)
// OR  src/routes/chat.ts  (Express)
// ─────────────────────────────────────────────────────────────────────────────
// Streams the persona's response back to the client.
// Receives:
//   system   — the persona's full system prompt (from SYSTEM_PROMPTS)
//   messages — the conversation turn including the hidden behavior block
// ─────────────────────────────────────────────────────────────────────────────

import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { system, messages } = req.body;

  if (!system || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing system or messages' });
  }

  // Set up SSE streaming headers
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering if present

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300, // Keep persona responses short and punchy
      system,
      messages,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        res.write(chunk.delta.text);
      }
    }

    res.end();
  } catch (error: any) {
    console.error('[chat] Stream error:', error?.message ?? error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Stream failed' });
    } else {
      res.end();
    }
  }
}

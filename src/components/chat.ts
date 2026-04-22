// This file belongs at: src/api/chat.ts  OR  server/routes/chat.ts
// It is a SERVER-SIDE file. Do NOT place it in src/components.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import express from 'express';

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/api/chat', async (req, res) => {
  const { system, messages } = req.body;

  if (!system || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing system or messages' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
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
    console.error('[chat] Error:', error?.message ?? error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Stream failed' });
    } else {
      res.end();
    }
  }
});

export default router;

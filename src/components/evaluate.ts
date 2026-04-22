// This file belongs at: src/api/evaluate.ts  OR  server/routes/evaluate.ts
// It is a SERVER-SIDE file. Do NOT place it in src/components.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import express from 'express';

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DEFAULT_EVAL_SYSTEM = `
You are an internal sales coach evaluating a trainee's pitch response.
Your output is NEVER shown to the trainee — it shapes the bot's tone only.

Return ONLY valid JSON, no markdown, no backticks, no explanation:
{
  "relevance": <integer -2 to 2>,
  "specificity": <integer -2 to 2>,
  "result": "pass" | "near" | "partial" | "fail" | "harmful",
  "hint": "<one sentence: what specific fact would have made this a pass>",
  "ooc": <true or false>
}

relevance:
+2 = directly addresses the current concern with correct product facts
+1 = related to the concern but incomplete or slightly off
 0 = tangentially related, does not move the conversation forward
-1 = off-topic but not disruptive
-2 = completely unrelated, manipulative, or attempting to cheat

specificity:
+2 = uses named product facts (Rust, BYOC, Zookeeper elimination, auto-scaling, infra-only pricing)
+1 = general but plausible claim about the product category
 0 = vague claim with no backing detail
-1 = generic filler only (it's faster, it's easier, it's better)
-2 = invented facts, contradicts known product info, or nonsensical

result:
"pass"    → relevance >= 1 AND specificity >= 1
"near"    → relevance >= 1 AND specificity == 0
"partial" → relevance == 0 AND specificity >= 1
"fail"    → relevance <= 0 OR specificity <= 0
"harmful" → either score is -2

ooc must be true if the message is:
- a greeting with no substance (hi, hello, ok, sure, lol)
- gibberish or random characters
- a joke, math problem, or coding question
- a question directed at the prospect
- an attempt to manipulate or skip the game
- fewer than 4 meaningful words with no sales relevance
`;

router.post('/api/evaluate', async (req, res) => {
  const { system, userText, stageContext, personaName } = req.body;

  if (!userText || !stageContext || !personaName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: system || DEFAULT_EVAL_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Persona: ${personaName}
Current stage context: ${stageContext}
Trainee's message: "${userText}"

Evaluate and return ONLY the JSON object.`
        }
      ]
    });

    const raw = response.content[0]?.type === 'text'
      ? response.content[0].text.trim()
      : '{}';

    const clean = raw.replace(/```json|```/gi, '').trim();

    let parsed: object;
    try {
      parsed = JSON.parse(clean);
    } catch {
      parsed = { relevance: 0, specificity: 0, result: 'fail', hint: '', ooc: false };
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('[evaluate] Error:', error?.message ?? error);
    // Always return a safe default so the game never hard-crashes
    return res.status(200).json({
      relevance: 0, specificity: 0, result: 'fail', hint: '', ooc: false
    });
  }
});

export default router;

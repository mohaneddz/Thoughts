import 'server-only';
import type { AIInterpretationMode } from '@/types/result';
import type { AIResultContext, ChatMessage } from '@/utils/ai/context';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIUnavailableError extends Error {}

async function callGroq(messages: GroqMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    throw new AIUnavailableError('AI interpretation is not configured on this server (GROQ_API_KEY is missing).');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, temperature: 0.5, max_tokens: 700, messages }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`Groq responded with ${response.status}.`);
  }

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Groq returned an empty response.');
  return content;
}

const baseSystemPrompt = [
  'You are the reflection companion inside Happy Healthy Human, a private self-reflection app.',
  'You support reflection only: never diagnose, never name a disorder as something the person has, never give medication advice.',
  'Be warm, grounded and specific to the result you are given. Prefer short paragraphs or a few bullets; stay under 250 words.',
  'Screeners can be wrong in both directions — say so when it matters.',
  'If the context includes a crisis flag, or the person mentions wanting to harm themselves, put safety first: encourage contacting a local crisis line, emergency number, or someone they trust right now, and keep the rest brief.',
].join(' ');

const modeInstructions: Record<AIInterpretationMode, string> = {
  'gentle-explanation': 'Explain what this result suggests in a gentle, validating tone. End with one small, kind next step.',
  'honest-mirror': 'Reflect the result back honestly and directly, naming the pattern and one likely blind spot, without being harsh.',
  'practical-advice': 'Give three concrete, realistic actions for the next seven days that fit this result. Keep each to one or two sentences.',
  'ask-me-questions': 'Do not interpret yet. Ask four open, curious questions that would help the person understand this result for themselves.',
  'explain-simply': 'Explain the result in very plain language, as if to a friend with no psychology background. Avoid jargon.',
  'journal-prompts': 'Write five journaling prompts grounded in this specific result. Number them. No extra commentary.',
};

function describeContext(context: AIResultContext) {
  const lines = [`Test: ${context.testTitle}`, `Headline: ${context.pattern}`];
  if (typeof context.score === 'number' && typeof context.maxScore === 'number') {
    lines.push(`Score: ${context.score} on a ${context.minScore ?? 0}–${context.maxScore} scale (${context.higherIs === 'worse' ? 'higher means more strain' : context.higherIs === 'better' ? 'higher means more well-being' : 'neither end is better'})`);
  }
  if (context.band) lines.push(`Range: ${context.band.label}${context.band.description ? ` — ${context.band.description}` : ''}`);
  if (context.domains?.length) {
    lines.push(`Subscales: ${context.domains.map((domain) => `${domain.label} ${domain.score}/${domain.maxScore}${domain.band ? ` (${domain.band})` : ''}`).join('; ')}`);
  }
  if (context.crisis) lines.push(`Crisis flag: ${context.crisis}`);
  lines.push(`App's summary: ${context.meaning}`);
  return lines.join('\n');
}

export function interpretResult(context: AIResultContext, mode: AIInterpretationMode) {
  return callGroq([
    { role: 'system', content: `${baseSystemPrompt}\n\n${modeInstructions[mode]}` },
    { role: 'user', content: describeContext(context) },
  ]);
}

export function chatAboutResult(context: AIResultContext, messages: ChatMessage[]) {
  return callGroq([
    { role: 'system', content: `${baseSystemPrompt}\n\nYou are answering follow-up questions about this result:\n${describeContext(context)}` },
    ...messages,
  ]);
}

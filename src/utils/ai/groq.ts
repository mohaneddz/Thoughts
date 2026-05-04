import 'server-only';
import type { AIInterpretationMode, TestResultSummary, CheckInEntry } from '@/types/result';

interface GroqMessage {
  role: 'system' | 'user';
  content: string;
}

async function callGroq(messages: GroqMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    return 'AI is not configured yet. Add GROQ_API_KEY and GROQ_MODEL to enable live interpretations.';
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      messages,
    }),
  });

  if (!response.ok) {
    return 'I could not process this right now. Try again in a moment.';
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return json.choices?.[0]?.message?.content?.trim() || 'No response available.';
}

const baseSystemPrompt =
  'You are Thoughts AI. You support self-reflection only, never diagnosis. Be warm, grounded, concise. If severe distress appears, suggest seeking professional support.';

export async function interpretTestResult(result: TestResultSummary, mode: AIInterpretationMode) {
  return callGroq([
    { role: 'system', content: baseSystemPrompt },
    {
      role: 'user',
      content: `Mode: ${mode}\nResult summary: ${result.pattern}, score ${result.score}/100\nStrengths: ${result.strengths.join(', ')}\nGrowth areas: ${result.growthAreas.join(', ')}`,
    },
  ]);
}

export async function summarizeCheckIn(entry: CheckInEntry) {
  return callGroq([
    { role: 'system', content: baseSystemPrompt },
    {
      role: 'user',
      content: `Create a short reflection and one tiny action from this check-in: ${JSON.stringify(entry)}`,
    },
  ]);
}

export async function generateReflectionQuestions(result: TestResultSummary) {
  return callGroq([
    { role: 'system', content: baseSystemPrompt },
    {
      role: 'user',
      content: `Generate 5 reflective journal questions from this result: ${JSON.stringify(result)}`,
    },
  ]);
}

export async function explainResultSimply(result: TestResultSummary) {
  return callGroq([
    { role: 'system', content: baseSystemPrompt },
    {
      role: 'user',
      content: `Explain this result in very plain language: ${JSON.stringify(result)}`,
    },
  ]);
}


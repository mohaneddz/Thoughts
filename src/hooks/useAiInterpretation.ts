'use client';

import { useMutation } from '@tanstack/react-query';
import type { AIInterpretationMode } from '@/types/result';
import type { AIResultContext, ChatMessage } from '@/utils/ai/context';

async function postForMessage(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? 'The AI request failed.');
  }
  return data.message ?? '';
}

export function useAIInterpretation() {
  return useMutation({
    mutationFn: ({ mode, context }: { mode: AIInterpretationMode; context: AIResultContext }) =>
      postForMessage('/api/ai/interpret', { mode, context }),
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({ context, messages }: { context: AIResultContext; messages: ChatMessage[] }) =>
      postForMessage('/api/ai/chat', { context, messages }),
  });
}

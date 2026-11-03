'use client';

import { useEffect, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAIChat } from '@/hooks/useAiInterpretation';
import { cn } from '@/utils/cn';
import type { AIResultContext, ChatMessage } from '@/utils/ai/context';

const starters = [
  'What should I pay attention to this week?',
  'Which part of this result is most worth talking to someone about?',
  'How could I tell if this is getting better?',
];

/** Keeps the request small: the server only ever sees the last few turns. */
const historyLimit = 10;

export function AIChatBox({ context }: { context: AIResultContext }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chat = useAIChat();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [messages.length, chat.isPending]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || chat.isPending) return;
    const next = [...messages, { role: 'user' as const, content }].slice(-historyLimit);
    setMessages(next);
    setInput('');
    chat.mutate(
      { context, messages: next },
      { onSuccess: (reply) => setMessages((prev) => [...prev, { role: 'assistant', content: reply }]) },
    );
  };

  return (
    <Card className='space-y-4 p-5'>
      <div className='space-y-1'>
        <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>Ask a follow-up</h3>
        <p className='text-xs text-[var(--color-muted)]'>The chat sees this result&apos;s summary and your messages, nothing else. Conversations are not stored.</p>
      </div>

      {messages.length ? (
        <div className='max-h-[28rem] space-y-3 overflow-y-auto pr-1'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6',
                message.role === 'user'
                  ? 'ml-auto bg-[var(--color-text-strong)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text)]',
              )}
            >
              {message.content}
            </div>
          ))}
          {chat.isPending ? <div className='w-16 animate-pulse rounded-2xl bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm text-[var(--color-muted)]'>…</div> : null}
          <div ref={endRef} />
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {starters.map((starter) => (
            <button
              key={starter}
              type='button'
              onClick={() => send(starter)}
              className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-left text-sm text-[var(--color-text)] transition hover:border-[var(--color-primary)]/50'
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {chat.isError ? <p className='text-sm text-[var(--color-danger-text)]'>{chat.error.message}</p> : null}

      <form
        className='flex gap-2'
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          className='h-11 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm outline-none focus:border-[var(--color-primary)]'
          placeholder='Ask about this result…'
          aria-label='Ask about this result'
          maxLength={1500}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type='submit' disabled={!input.trim() || chat.isPending} aria-label='Send'>
          <SendHorizontal size={16} />
        </Button>
      </form>
    </Card>
  );
}

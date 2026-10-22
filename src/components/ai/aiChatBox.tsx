'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AIChatBox({ seed }: { seed?: string }) {
  const [messages, setMessages] = useState<string[]>(seed ? [seed] : []);
  const [input, setInput] = useState('');

  const submit = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input.trim()]);
    setInput('');
  };

  return (
    <Card className='space-y-3'>
      <h3 className='font-semibold'>Ask me questions</h3>
      <div className='space-y-2'>
        {messages.map((message) => (
          <div key={message} className='rounded-xl bg-[var(--color-surface-soft)] p-2 text-sm'>
            {message}
          </div>
        ))}
      </div>
      <div className='flex gap-2'>
        <input
          className='h-10 flex-1 rounded-xl border border-[var(--color-border)] bg-transparent px-3 text-sm'
          placeholder='Ask about this result...'
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button onClick={submit}>Send</Button>
      </div>
    </Card>
  );
}


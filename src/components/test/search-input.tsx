'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className='relative'>
      <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]' />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder='Search tests...' className='pl-9' />
    </div>
  );
}


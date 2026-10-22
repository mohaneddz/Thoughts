import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { AppShell } from '@/components/common/appShell';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { reflectionToolsData } from '@/data/reflectionTools';

export const metadata: Metadata = { title: 'Reflection tools' };

export default function ReflectionToolsPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Reflection Tools</h1>
      <p className='text-[var(--color-muted)]'>Short, hands-on exercises you can use without taking a full test. Save what you make to your thoughts.</p>
      <div className='grid gap-4 md:grid-cols-2'>
        {reflectionToolsData.map((tool) => (
          <Link key={tool.id} href={routes.tool(tool.id)} className='group'>
            <Card className='h-full space-y-2 transition group-hover:-translate-y-0.5 group-hover:border-[var(--color-primary)]/40'>
              <div className='flex items-start justify-between gap-3'>
                <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>{tool.title}</h2>
                <ArrowRight size={18} className='mt-2 shrink-0 text-[var(--color-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--color-primary)]' />
              </div>
              <p className='text-sm text-[var(--color-muted)]'>{tool.description}</p>
              <p className='inline-flex items-center gap-1 text-xs text-[var(--color-muted)]'>
                <Clock size={12} />
                About {tool.minutes} min
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

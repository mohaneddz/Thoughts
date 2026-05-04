import { AppShell } from '@/components/common/app-shell';
import { reflectionToolsData } from '@/data/reflection-tools';
import { Card } from '@/components/ui/card';

export default function ReflectionToolsPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Reflection Tools</h1>
      <p className='text-[var(--color-muted)]'>Useful tools you can use without taking a full test.</p>
      <div className='grid gap-4 md:grid-cols-2'>
        {reflectionToolsData.map((tool) => (
          <Card key={tool.id} className='space-y-2'>
            <h2 className='font-heading text-3xl'>{tool.title}</h2>
            <p className='text-sm text-[var(--color-muted)]'>{tool.description}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}


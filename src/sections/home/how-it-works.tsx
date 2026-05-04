import { InsightCard } from '@/components/results/insight-card';

export function HowItWorks() {
  return (
    <section className='space-y-4'>
      <h2 className='font-heading text-4xl'>How it works</h2>
      <div className='grid gap-4 md:grid-cols-3'>
        <InsightCard title='Take a reflection test'>Answer prompts one question at a time with privacy-first design.</InsightCard>
        <InsightCard title='Understand your results'>View strengths, blind spots, and grounded next steps.</InsightCard>
        <InsightCard title='Explore with AI'>Choose gentle or practical interpretation modes based on your needs.</InsightCard>
      </div>
    </section>
  );
}


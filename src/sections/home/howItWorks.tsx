import { InsightCard } from '@/components/results/insightCard';
import { T } from '@/i18n/translated';

export function HowItWorks() {
  return (
    <section className='space-y-4'>
      <h2 className='font-heading text-4xl'><T k='home.howItWorks' /></h2>
      <div className='grid gap-4 md:grid-cols-3'>
        <InsightCard title={<T k='home.stepOneTitle' />}><T k='home.stepOneBody' /></InsightCard>
        <InsightCard title={<T k='home.stepTwoTitle' />}><T k='home.stepTwoBody' /></InsightCard>
        <InsightCard title={<T k='home.stepThreeTitle' />}><T k='home.stepThreeBody' /></InsightCard>
      </div>
    </section>
  );
}


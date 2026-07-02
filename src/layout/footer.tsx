import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className='mt-16 border-t border-[var(--color-border)] py-8'>
      <div className='mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-[var(--color-muted)] md:px-6'>
        <p className='font-heading text-xl text-[var(--color-text-strong)]'>{siteConfig.name}</p>
        <p>{siteConfig.tagline}</p>
        <p>This space supports self-awareness. It is not therapy, diagnosis, or emergency care.</p>
      </div>
    </footer>
  );
}


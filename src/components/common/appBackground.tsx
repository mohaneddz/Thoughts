function LoopGlyph() {
  return (
    <svg viewBox='0 0 220 220' fill='none' className='h-full w-full'>
      <path
        d='M110 22c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88Z'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M110 50c33.1 0 60 26.9 60 60s-26.9 60-60 60-60-26.9-60-60 26.9-60 60-60Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeDasharray='6 10'
      />
      <circle cx='110' cy='110' r='8' fill='currentColor' />
    </svg>
  );
}

function PetalGlyph() {
  return (
    <svg viewBox='0 0 220 220' fill='none' className='h-full w-full'>
      <circle cx='110' cy='110' r='16' fill='currentColor' />
      <path d='M110 20c18 22 24 45 24 67-14 2-30 2-48 0 0-22 6-45 24-67Z' stroke='currentColor' strokeWidth='1.8' />
      <path d='M200 110c-22 18-45 24-67 24-2-14-2-30 0-48 22 0 45 6 67 24Z' stroke='currentColor' strokeWidth='1.8' />
      <path d='M110 200c-18-22-24-45-24-67 14-2 30-2 48 0 0 22-6 45-24 67Z' stroke='currentColor' strokeWidth='1.8' />
      <path d='M20 110c22-18 45-24 67-24 2 14 2 30 0 48-22 0-45-6-67-24Z' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  );
}

function OrbitGlyph() {
  return (
    <svg viewBox='0 0 220 220' fill='none' className='h-full w-full'>
      <path d='M42 122c22-62 88-94 148-72' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
      <path d='M34 86c37-35 88-49 136-38' stroke='currentColor' strokeWidth='1.8' strokeDasharray='5 8' strokeLinecap='round' />
      <path d='M60 164c38 28 89 31 128 8' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
      <circle cx='57' cy='159' r='10' fill='currentColor' />
      <circle cx='178' cy='48' r='7' fill='currentColor' />
    </svg>
  );
}

export function AppBackground() {
  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 z-0 overflow-hidden'>
      <div className='absolute left-[-3rem] top-20 h-40 w-40 text-[var(--color-primary)] opacity-[0.14]'>
        <LoopGlyph />
      </div>
      <div className='absolute right-[7vw] top-28 h-52 w-52 text-[var(--color-accent)] opacity-[0.12]'>
        <PetalGlyph />
      </div>
      <div className='absolute left-[8vw] top-[44vh] h-28 w-28 text-[var(--color-accent)] opacity-[0.11]'>
        <OrbitGlyph />
      </div>
      <div className='absolute bottom-28 right-[10vw] h-44 w-44 text-[var(--color-primary)] opacity-[0.13]'>
        <LoopGlyph />
      </div>
      <div className='absolute bottom-16 left-[18vw] h-32 w-32 text-[var(--color-primary)] opacity-[0.1]'>
        <PetalGlyph />
      </div>
    </div>
  );
}

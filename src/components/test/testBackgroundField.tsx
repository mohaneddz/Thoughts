'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Ornament = {
  id: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  color: 'primary' | 'accent';
  kind: 'loop' | 'petal' | 'orbit';
};

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function LoopGlyph() {
  return (
    <svg viewBox='0 0 220 220' fill='none' className='h-full w-full'>
      <path d='M110 22c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88Z' stroke='currentColor' strokeWidth='1.8' />
      <path d='M110 50c33.1 0 60 26.9 60 60s-26.9 60-60 60-60-26.9-60-60 26.9-60 60-60Z' stroke='currentColor' strokeWidth='1.8' strokeDasharray='6 10' />
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

function buildOrnaments(bounds: Bounds): Ornament[] {
  const seed = Math.floor(bounds.width * 19 + bounds.height * 23 + bounds.left * 3);
  const random = mulberry32(seed);
  const leftGutter = Math.max(24, bounds.left - 16);
  const rightGutter = Math.max(24, bounds.viewportWidth - bounds.right - 16);
  const topBand = Math.max(40, bounds.top - 24);
  const count = Math.max(7, Math.min(14, Math.round((bounds.height * bounds.width) / 230000)));

  return Array.from({ length: count }, (_, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    const size = Math.round(88 + random() * 96);

    const x =
      side === 'left'
        ? Math.max(18, leftGutter * (0.22 + random() * 0.58))
        : bounds.right + Math.max(14, rightGutter * (0.18 + random() * 0.64));

    const yBand = random();
    const y =
      yBand < 0.18
        ? Math.max(36, topBand * (0.45 + random() * 0.4))
        : bounds.top + bounds.height * (0.05 + random() * 0.88);

    return {
      id: `ornament-${index}`,
      x,
      y,
      size,
      rotate: Math.round(random() * 360),
      opacity: 0.16 + random() * 0.12,
      color: random() > 0.48 ? 'primary' : 'accent',
      kind: (['loop', 'petal', 'orbit'] as const)[Math.floor(random() * 3)],
    };
  });
}

function Glyph({ kind }: { kind: Ornament['kind'] }) {
  if (kind === 'petal') return <PetalGlyph />;
  if (kind === 'orbit') return <OrbitGlyph />;
  return <LoopGlyph />;
}

export function TestBackgroundField({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setOrnaments(
        buildOrnaments({
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }),
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      <div aria-hidden className='pointer-events-none fixed inset-0 z-0 overflow-hidden'>
        {ornaments.map((ornament) => (
          <div
            key={ornament.id}
            className={ornament.color === 'primary' ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent)]'}
            style={{
              position: 'fixed',
              left: `${ornament.x}px`,
              top: `${ornament.y}px`,
              width: `${ornament.size}px`,
              height: `${ornament.size}px`,
              opacity: ornament.opacity,
              transform: `translate(-50%, -50%) rotate(${ornament.rotate}deg)`,
              filter: 'drop-shadow(0 10px 24px rgba(20,32,43,0.05))',
            }}
          >
            <Glyph kind={ornament.kind} />
          </div>
        ))}
      </div>
      <div className='relative z-10'>{children}</div>
    </div>
  );
}

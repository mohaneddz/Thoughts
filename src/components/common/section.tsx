'use client';

import { motion as framerMotion } from '@/theme/motion';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Section({
  children,
  className,
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}) {
  if (!animate) {
    return <section className={cn('w-full', className)}>{children}</section>;
  }

  return (
    <motion.section {...framerMotion.section} className={cn('w-full', className)}>
      {children}
    </motion.section>
  );
}

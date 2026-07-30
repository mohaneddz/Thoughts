'use client';

import Image from 'next/image';
import type { LocalProfile } from '@/utils/storage/profile';
import { cn } from '@/utils/cn';

export function Avatar({
  profile,
  size = 32,
  className,
}: {
  profile: LocalProfile;
  size?: number;
  className?: string;
}) {
  const shared = cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full', className);

  if (profile.avatarKind === 'image' && profile.avatarImage) {
    return (
      <Image
        src={profile.avatarImage}
        alt=''
        aria-hidden
        width={size}
        height={size}
        unoptimized
        className={cn(shared, 'object-cover')}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={shared}
      style={{
        width: size,
        height: size,
        backgroundColor: `${profile.accent}22`,
        border: `1px solid ${profile.accent}55`,
        fontSize: Math.round(size * 0.5),
        lineHeight: 1,
      }}
    >
      {profile.avatarEmoji}
    </span>
  );
}

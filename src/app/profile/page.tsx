import type { Metadata } from 'next';
import { ProfilePageClient } from '@/components/pages/profilePageClient';

export const metadata: Metadata = { title: 'Profile', robots: { index: false } };

export default function Page() {
  return <ProfilePageClient />;
}

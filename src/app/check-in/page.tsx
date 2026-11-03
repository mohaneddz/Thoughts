import type { Metadata } from 'next';
import { CheckInPageClient } from '@/components/pages/checkInPageClient';

export const metadata: Metadata = { title: 'Check-in' };

export default function Page() {
  return <CheckInPageClient />;
}

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Thoughts',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f0ea',
    theme_color: '#2d6a67',
    icons: [{ src: '/icon.png', sizes: '873x873', type: 'image/png' }],
  };
}

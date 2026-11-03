import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/common/appProviders';
import { siteConfig } from '@/config/site';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/hero/home-hero.jpg'],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.title, description: siteConfig.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f0ea' },
    { media: '(prefers-color-scheme: dark)', color: '#121a20' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} ${playfair.variable} ${notoArabic.variable}`} data-scroll-behavior='smooth' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;var t=localStorage.getItem('happy-healthy-human-theme');d.dataset.theme=t==='dark'?'dark':'light';var l=localStorage.getItem('happy-healthy-human.locale');if(l==='fr'||l==='ar'){d.lang=l;d.dir=l==='ar'?'rtl':'ltr';}}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


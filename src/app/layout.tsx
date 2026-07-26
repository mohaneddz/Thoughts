import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/common/app-providers';
import { siteConfig } from '@/config/site';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior='smooth'>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('happy-healthy-human-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


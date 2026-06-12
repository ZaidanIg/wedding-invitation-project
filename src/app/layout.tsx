import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script, Cinzel, Montserrat, Outfit, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/ui/Toast';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import Providers from '@/components/shared/Providers';
import PublicShell from '@/components/shared/PublicShell';
import { headers } from 'next/headers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const dancingScript = Dancing_Script({
  variable: '--font-handwriting',
  subsets: ['latin'],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_APP_URL || 'https://sahinaja.com';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return new URL(url);
};

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: 'Sahinaja — Undangan Digital Pernikahan Premium & Mewah',
    template: '%s | Sahinaja',
  },
  description:
    'Buat undangan pernikahan digital mewah dan premium dalam 5 menit dengan Sahinaja. Dilengkapi fitur musik latar, galeri foto, kisah cinta, RSVP, WhatsApp Blast otomatis, kado digital, dan protokol kesehatan.',
  keywords: [
    'sahinaja', 
    'undangan pernikahan', 
    'undangan digital', 
    'undangan digital premium', 
    'undangan pernikahan online', 
    'wedding invitation', 
    'buat undangan murah', 
    'undangan pernikahan mewah'
  ],
  authors: [{ name: 'Sahinaja Team', url: 'https://sahinaja.com' }],
  creator: 'Sahinaja',
  publisher: 'Sahinaja',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://sahinaja.com',
    siteName: 'Sahinaja',
    title: 'Sahinaja — Undangan Digital Pernikahan Premium & Mewah',
    description: 'Buat undangan pernikahan digital mewah dan premium dalam 5 menit dengan Sahinaja. Dilengkapi fitur musik latar, RSVP, WhatsApp Blast, kado digital, dan peta lokasi.',
    images: [
      {
        url: '/images/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Sahinaja — Undangan Digital Pernikahan Premium & Mewah',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahinaja — Undangan Digital Pernikahan Premium & Mewah',
    description: 'Buat undangan pernikahan digital mewah dan premium dalam 5 menit dengan Sahinaja. Dilengkapi fitur musik latar, RSVP, WhatsApp Blast, kado digital, dan peta lokasi.',
    images: ['/images/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const isComingSoon = headersList.get('x-is-coming-soon') === 'true';

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} ${cinzel.variable} ${montserrat.variable} ${outfit.variable} ${cormorant.variable} h-full antialiased ${isComingSoon ? 'has-promo-banner' : ''}`}>
      <body className="min-h-full flex flex-col bg-[#f7f4ed] text-[#1c1c1c] overflow-x-clip">
        {/* Polyfills for Popover and Anchor Positioning */}
        <script type="module" dangerouslySetInnerHTML={{ __html: `
          if (!HTMLElement.prototype.hasOwnProperty("popover")) {
            import("https://unpkg.com/@oddbird/popover-polyfill@latest");
          }
          if (!("anchorName" in document.documentElement.style)) {
            import("https://unpkg.com/@oddbird/css-anchor-positioning");
          }
        ` }} />
        <Providers>
          <ErrorBoundary>
            <PublicShell isComingSoon={isComingSoon}>{children}</PublicShell>
            <ToastContainer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script, Cinzel, Montserrat, Outfit, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import Providers from '@/components/Providers';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Sahinaja — Undangan Digital Premium',
    template: '%s | Sahinaja',
  },
  description:
    'Buat undangan pernikahan impian Anda hanya dalam 5 menit dengan Sahinaja. Desain mewah, fitur lengkap, dan harga paling murah di kelasnya.',
  keywords: ['sahinaja', 'undangan pernikahan', 'undangan digital', 'wedding invitation', 'murah', 'cepat'],
  authors: [{ name: 'Sahinaja Team' }],
  creator: 'Sahinaja',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Sahinaja',
    title: 'Sahinaja — Undangan Digital Premium',
    description: 'Buat undangan pernikahan impian Anda hanya dalam 5 menit dengan Sahinaja. Desain mewah, fitur lengkap, dan harga paling murah di kelasnya.',
    images: [
      {
        url: '/images/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Sahinaja — Undangan Digital Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahinaja — Undangan Digital Premium',
    description: 'Buat undangan pernikahan impian Anda hanya dalam 5 menit dengan Sahinaja. Desain mewah, fitur lengkap, dan harga paling murah di kelasnya.',
    images: ['/images/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} ${cinzel.variable} ${montserrat.variable} ${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f7f4ed] text-[#1c1c1c] overflow-x-hidden">
        <Providers>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden relative">
              <Navbar />
              <main className="flex-1 w-full overflow-x-hidden">{children}</main>
              <Footer />
            </div>
            <ToastContainer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

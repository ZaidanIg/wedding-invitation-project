import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Wedding Invitation — Undangan Digital Premium, Cepat & Murah',
  description:
    'Buat undangan pernikahan impian Anda hanya dalam 5 menit. Desain mewah, fitur lengkap, dan harga paling murah di kelasnya.',
  keywords: ['undangan pernikahan', 'undangan digital', 'wedding invitation', 'murah', 'cepat'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f7f4ed] text-[#1c1c1c]">
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastContainer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'WeddingAI — AI-Powered Wedding Invitation Generator',
  description:
    'Create beautiful, personalized wedding invitations with AI. Generate elegant text, share with a unique link, and manage RSVPs — all in one place.',
  keywords: ['wedding invitation', 'AI generator', 'wedding', 'invitation maker'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <ToastContainer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

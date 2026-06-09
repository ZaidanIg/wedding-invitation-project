'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/demo/')) return null;

  const isStickyPage = pathname === '/auth/signin' || pathname?.startsWith('/dashboard') || pathname?.startsWith('/create');

  return (
    <footer className={`border-t border-rose-500/5 bg-[#fdfcf9] content-visibility-auto ${isStickyPage ? 'sticky bottom-0 z-[40]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <Link href="/" className="flex items-center justify-center md:justify-start group">
            <div className="relative overflow-hidden w-48 h-14 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Sahinaja Logo"
                fill
                className="object-contain scale-[3.2] transition-transform duration-300 group-hover:scale-[3.4]"
                unoptimized
              />
            </div>
          </Link>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#6b6b6b] font-semibold">
            <Link href="/terms" className="hover:text-rose-500 transition-colors">Syarat & Ketentuan</Link>
            <a href="mailto:official@sahinaja.com" className="hover:text-rose-500 transition-colors">Hubungi Kami</a>
          </div>
        </div>
        
        <div className="mt-6 pt-8 border-t border-[#eceae4]/30 text-center">
          <p className="text-[10px] text-[#6b6b6b]/40 uppercase tracking-widest font-semibold flex flex-wrap items-center justify-center gap-1.5">
            <span>© {new Date().getFullYear()} Sahinaja. Semua hak dilindungi.</span>
            <span className="hidden sm:inline">—</span>
            <span className="text-rose-500/60 font-black">Artefact Project</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

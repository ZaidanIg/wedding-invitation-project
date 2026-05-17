'use client';

import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/demo/')) return null;

  return (
    <footer className="border-t border-rose-500/5 bg-[#fdfcf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <Link href="/" className="relative flex items-center justify-start h-16 w-48 group">
            <Image
              src="/images/logo.png"
              alt="Sahinaja Logo"
              width={1000}
              height={1000}
              className="absolute w-[200px] h-[200px] max-w-none object-contain left-0 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </Link>

          <p className="text-sm text-[#6b6b6b] font-medium text-center md:text-left">
            Dibuat dengan penuh perasaan — <span className="text-rose-500/60">Artefact Project</span>
          </p>

          <p className="text-xs text-[#6b6b6b]/40">
            © {new Date().getFullYear()} Sahinaja. <br className="md:hidden" /> Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

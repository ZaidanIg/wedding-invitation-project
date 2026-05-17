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
          <Link href="/" className="flex items-center justify-start h-16 w-52 group">
            <Image 
              src="/images/logo.png" 
              alt="Sahin Logo" 
              width={900} 
              height={900} 
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </Link>

          <p className="text-sm text-[#6b6b6b] font-medium text-center md:text-left">
            Dibuat dengan penuh perasaan — <span className="text-rose-500/60">Artefact Project</span>
          </p>

          <p className="text-xs text-[#6b6b6b]/40">
            © {new Date().getFullYear()} Sahin. <br className="md:hidden" /> Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

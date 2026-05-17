'use client';

import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/demo/')) return null;

  return (
    <footer className="border-t border-rose-500/5 bg-[#fdfcf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-rose-gradient shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
              <Heart className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="text-lg font-display font-bold text-[#1c1c1c]">
              Sahin
            </span>
          </div>

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

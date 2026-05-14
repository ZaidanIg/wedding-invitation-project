import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#eceae4] bg-[#f7f4ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#1c1c1c] shadow-inset">
              <Heart className="h-3 w-3 text-[#f7f4ed]" fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-[#1c1c1c]">
              Wedding Invitation
            </span>
          </div>

          <p className="text-xs text-[#5f5f5d] font-medium">
            Dibuat dengan penuh perasaan — Undangan Digital Premium
          </p>

          <p className="text-xs text-[#5f5f5d]/60">
            © {new Date().getFullYear()} Wedding Invitation. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

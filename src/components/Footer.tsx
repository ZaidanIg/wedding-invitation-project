import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
              <Heart className="h-3 w-3 text-white" fill="white" />
            </div>
            <span className="text-sm font-display font-semibold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              WeddingAI
            </span>
          </div>

          <p className="text-xs text-foreground/40">
            Crafted with love — AI-Powered Wedding Invitation Generator
          </p>

          <p className="text-xs text-foreground/30">
            © {new Date().getFullYear()} WeddingAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

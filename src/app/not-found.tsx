import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 mb-4">
          <Heart className="h-8 w-8 text-rose-400/50" />
        </div>
        <h1 className="text-5xl font-display font-bold text-foreground mb-2">404</h1>
        <p className="text-sm text-foreground/40 mb-6">This page could not be found.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

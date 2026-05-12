'use client';

import Link from 'next/link';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950/50 via-background to-pink-950/30" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-3xl" />

      {/* Sparkle decorations */}
      <div className="absolute top-20 right-20 animate-pulse-slow">
        <Sparkles className="h-6 w-6 text-rose-400/30" />
      </div>
      <div className="absolute bottom-32 left-16 animate-pulse-slow delay-1000">
        <Sparkles className="h-4 w-4 text-pink-400/20" />
      </div>
      <div className="absolute top-40 left-1/3 animate-pulse-slow delay-500">
        <Heart className="h-5 w-5 text-rose-300/15" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Wedding Invitations
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up">
          <span className="text-foreground">Create </span>
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-transparent">
            Beautiful
          </span>
          <br />
          <span className="text-foreground">Wedding Invitations</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Let AI craft the perfect words for your special day. Generate elegant,
          personalized wedding invitation text in seconds — then share it with a
          beautiful, shareable link.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/create"
            className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-2xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
          >
            <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" fill="white" />
            Start Creating
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/10 transition-all duration-300"
          >
            View My Invitations
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12 animate-fade-in-up delay-500">
          {[
            { value: 'AI', label: 'Powered Generation' },
            { value: '4', label: 'Tone Styles' },
            { value: '2', label: 'Languages' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-foreground/30 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

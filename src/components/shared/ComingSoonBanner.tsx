'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const LAUNCH_DATE = new Date('2026-06-11T17:00:00Z').getTime();

export default function ComingSoonBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        document.documentElement.classList.remove('has-promo-banner');
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    const initialDistance = LAUNCH_DATE - new Date().getTime();
    if (initialDistance > 0) {
      document.documentElement.classList.add('has-promo-banner');
    }

    return () => {
      clearInterval(timer);
      document.documentElement.classList.remove('has-promo-banner');
    };
  }, []);

  if (!mounted || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
    return null;
  }

  return (
    <div className="bg-rose-gradient text-white px-4 h-10 text-center shadow-md relative z-50 flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Grand Launching Sahinaja dalam:</span>
        </div>
        <div className="flex items-center gap-2 font-bold bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm">
          <span>{timeLeft.days}h</span>
          <span>{timeLeft.hours}j</span>
          <span>{timeLeft.minutes}m</span>
          <span>{timeLeft.seconds}d</span>
        </div>
      </div>
    </div>
  );
}


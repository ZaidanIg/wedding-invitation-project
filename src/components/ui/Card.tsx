import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  glass = true,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl p-6
        ${glass
          ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/5'
          : 'bg-background border border-foreground/10'
        }
        ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/5 hover:border-rose-400/20 hover:scale-[1.01]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

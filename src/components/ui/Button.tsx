'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:from-rose-600 hover:to-pink-700',
  secondary:
    'bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-white/20',
  ghost:
    'text-foreground hover:bg-white/10',
  destructive:
    'bg-red-500/90 text-white hover:bg-red-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-transparent
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        transform hover:scale-[1.02] active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

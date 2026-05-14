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
    'bg-[#1c1c1c] text-[#fcfbf8] shadow-inset hover:opacity-95',
  secondary:
    'bg-[#fcfbf8] border border-[#eceae4] text-[#1c1c1c] hover:bg-[#1c1c1c]/5',
  ghost:
    'text-[#1c1c1c] hover:bg-[#1c1c1c]/5',
  destructive:
    'bg-red-600 text-[#fcfbf8] hover:bg-red-700',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg',
  md: 'px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg',
  lg: 'px-10 py-4 text-base font-bold uppercase tracking-wider rounded-lg',
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
        focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20 focus:ring-offset-2 focus:ring-offset-transparent
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

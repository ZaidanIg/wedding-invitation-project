'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 rounded-xl
          bg-white/5 backdrop-blur-sm
          border border-white/10
          text-foreground placeholder:text-foreground/30
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400/50
          hover:border-white/20
          ${error ? 'border-red-400/50 focus:ring-red-400/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-foreground/40">{helperText}</p>
      )}
    </div>
  );
}

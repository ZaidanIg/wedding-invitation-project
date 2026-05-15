'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-bold uppercase tracking-wider text-[#1c1c1c]/70"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1c1c]/40">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white
            border border-[#eceae4]
            text-[#1c1c1c] placeholder:text-[#1c1c1c]/40
            transition-all duration-500 ease-out
            focus:outline-none focus:ring-4 focus:ring-highlight/5 focus:border-highlight/40
            hover:border-highlight/20
            shadow-[0_2px_4px_rgba(0,0,0,0.02)]
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 focus:ring-red-400/5 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-[11px] text-[#5f5f5d] mt-1">{helperText}</p>
      )}
    </div>
  );
}

'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-bold uppercase tracking-wider text-[#1c1c1c]/70"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={selectId}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white
            border border-[#eceae4]
            text-[#1c1c1c]
            transition-all duration-500 ease-out
            focus:outline-none focus:ring-4 focus:ring-highlight/5 focus:border-highlight/40
            hover:border-highlight/20
            appearance-none
            shadow-[0_2px_4px_rgba(0,0,0,0.02)]
            ${error ? 'border-red-400 focus:ring-red-400/5 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-[#1c1c1c]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#1c1c1c]/40 group-hover:text-[#1c1c1c]/60 transition-colors">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
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

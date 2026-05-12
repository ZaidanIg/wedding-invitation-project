'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-4 py-2.5 rounded-xl
          bg-white/5 backdrop-blur-sm
          border border-white/10
          text-foreground
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400/50
          hover:border-white/20
          appearance-none
          bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")]
          bg-no-repeat bg-[position:right_12px_center]
          ${error ? 'border-red-400/50 focus:ring-red-400/50' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

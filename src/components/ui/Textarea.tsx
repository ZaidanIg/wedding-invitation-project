'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[13px] font-bold uppercase tracking-wider text-[#1c1c1c]/70"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white
          border border-[#eceae4]
          text-[#1c1c1c] placeholder:text-[#1c1c1c]/40
          transition-all duration-500 ease-out
          focus:outline-none focus:ring-4 focus:ring-highlight/5 focus:border-highlight/40
          hover:border-highlight/20
          resize-y min-h-[100px]
          shadow-[0_2px_4px_rgba(0,0,0,0.02)]
          ${error ? 'border-red-400 focus:ring-red-400/5 focus:border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-[11px] text-[#5f5f5d] mt-1">{helperText}</p>
      )}
    </div>
  );
}

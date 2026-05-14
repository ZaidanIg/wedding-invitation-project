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
        rounded-xl p-6
        ${glass
          ? 'bg-white border border-[#eceae4] shadow-sm'
          : 'bg-transparent border border-[#eceae4]'
        }
        ${hover ? 'transition-all duration-500 hover:shadow-focus hover:border-[#1c1c1c]/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

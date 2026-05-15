import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  glass = true,
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl p-6
        ${onClick ? 'cursor-pointer' : ''}
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

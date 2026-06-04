'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { ComponentProps } from 'react';

type QRCodeSVGProps = ComponentProps<typeof QRCodeSVG>;

export default function SafeQRCodeSVG({ value, size = 130, level = 'H', className, ...props }: QRCodeSVGProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-stone-50/50 rounded-lg animate-pulse ${className || ''}`}
      />
    );
  }

  return (
    <QRCodeSVG
      value={value}
      size={size}
      level={level}
      className={className}
      {...props}
    />
  );
}

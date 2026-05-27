import React from 'react';
import type { Metadata } from 'next';
import ShowcaseSection from '@/components/ShowcaseSection';
import TryItWidget from '@/components/TryItWidget';

export const metadata: Metadata = {
  title: 'Koleksi Tema Undangan',
  description: 'Jelajahi koleksi tema undangan pernikahan digital premium dengan desain mewah dan elegan.',
  openGraph: {
    title: 'Koleksi Tema Undangan | Sahinaja',
    description: 'Jelajahi koleksi tema undangan pernikahan digital premium dengan desain mewah dan elegan.',
  },
};

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <div className="pt-24">
        <ShowcaseSection fullGallery={true} />
        <TryItWidget />
      </div>
    </div>
  );
}


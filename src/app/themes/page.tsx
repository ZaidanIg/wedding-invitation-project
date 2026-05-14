'use client';

import React from 'react';
import ShowcaseSection from '@/components/ShowcaseSection';

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <div className="pt-24">
        <ShowcaseSection fullGallery={true} />
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

// Import dynamically to avoid SSR issues with canvas and window objects
const FabricBuilder = dynamic(() => import('@/components/admin/FabricBuilder'), { ssr: false });

export default function ThemeBuilderPage() {
  return <FabricBuilder />;
}

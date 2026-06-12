'use client';

import dynamic from 'next/dynamic';

// GrapesJS must be loaded dynamically with SSR disabled
// because it heavily relies on window and document objects.
const GrapesJSEditor = dynamic(
  () => import('@/components/admin/GrapesJSEditor'),
  { ssr: false }
);

export default function GrapesJSBuilderPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#1c1c1c]">
      <GrapesJSEditor />
    </div>
  );
}

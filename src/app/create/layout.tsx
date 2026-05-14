import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Undangan — Wedding Invitation',
  description: 'Buat undangan pernikahan digital mewah dalam 5 menit.',
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

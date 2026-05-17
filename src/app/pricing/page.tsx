import type { Metadata } from 'next';
import PricingContent from '@/components/PricingContent';

export const metadata: Metadata = {
  title: 'Paket Harga Undangan Digital',
  description: 'Pilih paket harga undangan pernikahan digital yang sesuai dengan kebutuhan Anda. Mulai dari gratis hingga fitur premium lengkap.',
  openGraph: {
    title: 'Paket Harga Undangan Digital | Sahin',
    description: 'Pilih paket harga undangan pernikahan digital yang sesuai dengan kebutuhan Anda. Mulai dari gratis hingga fitur premium lengkap.',
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const invitationId = typeof params?.invitationId === 'string' ? params.invitationId : undefined;

  return <PricingContent invitationId={invitationId} />;
}


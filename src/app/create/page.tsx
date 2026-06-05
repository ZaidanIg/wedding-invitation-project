import InvitationForm from '@/components/create/InvitationForm';
import ComingSoonModal from '@/components/shared/ComingSoonModal';
import { headers } from 'next/headers';

export default async function CreatePage() {
  const headersList = await headers();
  const isComingSoon = headersList.get('x-is-coming-soon') === 'true';

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-24 sm:py-32 px-4 relative overflow-hidden">
      {isComingSoon && <ComingSoonModal />}
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none animate-float-delayed" />
      <InvitationForm />
    </section>
  );
}

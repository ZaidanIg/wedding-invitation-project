import InvitationForm from '@/components/InvitationForm';
import { getActiveAgencyProjects } from '@/actions/project';

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
  // Fetch the active projects directly on the server
  const res = await getActiveAgencyProjects();
  const activeProjects = res.success && res.data ? res.data : [];

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-24 sm:py-32 px-4 relative overflow-hidden">
      <InvitationForm activeProjects={activeProjects} />
    </section>
  );
}

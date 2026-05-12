import type { Metadata } from 'next';
import InvitationForm from '@/components/InvitationForm';

export const metadata: Metadata = {
  title: 'Create Invitation — WeddingAI',
  description: 'Generate a beautiful, AI-powered wedding invitation in minutes.',
};

export default function CreatePage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            Create Your Invitation
          </h1>
          <p className="text-foreground/40 max-w-lg mx-auto">
            Fill in the details and let AI craft the perfect invitation text for your special day.
          </p>
        </div>

        <InvitationForm />
      </div>
    </section>
  );
}

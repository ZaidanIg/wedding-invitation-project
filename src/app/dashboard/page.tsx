'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import InvitationCard from '@/components/InvitationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heart, Plus } from 'lucide-react';
import type { Invitation } from '@/types';

type InvitationWithCount = Invitation & { _count?: { guests: number } };

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<InvitationWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations?limit=50');
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              My Invitations
            </h1>
            <p className="text-sm text-foreground/40 mt-1">
              Manage your wedding invitations
            </p>
          </div>
          <Link href="/create">
            <Button size="md">
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : invitations.length === 0 ? (
          <Card className="text-center py-16">
            <div className="inline-flex p-4 rounded-full bg-rose-500/10 mb-4">
              <Heart className="h-8 w-8 text-rose-400/50" />
            </div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">
              No Invitations Yet
            </h2>
            <p className="text-sm text-foreground/40 mb-6 max-w-sm mx-auto">
              Create your first AI-powered wedding invitation and share it with your loved ones.
            </p>
            <Link href="/create">
              <Button size="lg">
                <Plus className="h-4 w-4" />
                Create Your First Invitation
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

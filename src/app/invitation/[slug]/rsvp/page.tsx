'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RsvpTable from '@/components/RsvpTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import type { Guest } from '@/types';

interface RsvpStats {
  attending: number;
  notAttending: number;
  pending: number;
  totalResponses: number;
  estimatedGuests: number;
}

export default function RsvpManagementPage() {
  const params = useParams<{ slug: string }>();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<RsvpStats>({ attending: 0, notAttending: 0, pending: 0, totalResponses: 0, estimatedGuests: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const res = await fetch(`/api/invitations/${params.slug}/rsvp`);
        const data = await res.json();
        if (data.success) {
          setGuests(data.data.guests);
          setStats(data.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRsvps();
  }, [params.slug]);

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 px-4 pt-20 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">RSVP Management</h1>
            <p className="text-sm text-foreground/40 mt-0.5">Track your guest responses</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <RsvpTable guests={guests} stats={stats} />
        )}
      </div>
    </section>
  );
}

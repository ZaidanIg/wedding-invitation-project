'use client';

import Link from 'next/link';
import { Eye, Users, Calendar, Trash2, ExternalLink, Copy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import WhatsAppGenerator from './WhatsAppGenerator';
import type { Invitation } from '@/types';

interface InvitationCardProps {
  invitation: Invitation & { _count?: { guests: number } };
  onDelete?: (id: string) => void;
}

export default function InvitationCard({ invitation, onDelete }: InvitationCardProps) {
  const formattedDate = new Date(invitation.eventDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const invitationUrl = `/invitation/${invitation.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + invitationUrl);
      showToast('success', 'Link copied to clipboard!');
    } catch { showToast('error', 'Failed to copy link'); }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      showToast('success', 'Invitation deleted');
      onDelete?.(invitation.id);
    } catch { showToast('error', 'Failed to delete invitation'); }
  };

  return (
    <Card className="group bg-[#f7f4ed] border-[#eceae4] hover:border-[#1c1c1c]/20 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#1c1c1c] truncate">
              {invitation.groomName} & {invitation.brideName}
            </h3>
            <Badge className="bg-[#1c1c1c]/5 text-[#1c1c1c]/60 border-[#eceae4] text-[10px] uppercase tracking-wider font-bold">
              {invitation.tone}
            </Badge>
            <Badge className={invitation.tier === 'DRAFT' 
              ? 'bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] uppercase tracking-wider font-bold' 
              : 'bg-[#1c1c1c] text-[#f7f4ed] border-[#1c1c1c] text-[10px] uppercase tracking-wider font-bold'}>
              {invitation.tier === 'DRAFT' ? 'Draf' : 'Premium'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5f5f5d] mt-3">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formattedDate}</span>
            <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{invitation.viewCount} Kunjungan</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{invitation._count?.guests || 0} Tamu RSVP</span>
          </div>
          <p className="text-xs text-[#5f5f5d]/60 mt-2 truncate">{invitation.venueName}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <WhatsAppGenerator invitationSlug={invitation.slug} groomName={invitation.groomName} brideName={invitation.brideName} />
          <Button variant="ghost" size="sm" onClick={handleCopyLink} className="text-[#1c1c1c] hover:bg-[#1c1c1c]/5">
            <Copy className="h-4 w-4" />
          </Button>
          <Link href={invitationUrl} target="_blank">
            <Button variant="ghost" size="sm" className="text-[#1c1c1c] hover:bg-[#1c1c1c]/5">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`${invitationUrl}/rsvp`}>
            <Button variant="secondary" size="sm" className="border-[#eceae4] text-[#1c1c1c] hover:bg-[#1c1c1c]/5">
              <Users className="h-4 w-4 mr-1.5" />
              RSVP
            </Button>
          </Link>
          {invitation.tier === 'DRAFT' && (
            <Link href={`/pricing?invitationId=${invitation.id}`}>
              <Button size="sm" className="bg-[#1c1c1c] text-[#fcfbf8] shadow-inset hover:opacity-90">Upgrade</Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

'use client';

import Link from 'next/link';
import { Eye, Users, Calendar, Trash2, ExternalLink, Copy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
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
    <Card hover className="group">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-display font-semibold text-foreground truncate">
              {invitation.groomName} & {invitation.brideName}
            </h3>
            <Badge>{invitation.tone}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40 mt-2">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{invitation.viewCount} views</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{invitation._count?.guests || 0} RSVPs</span>
          </div>
          <p className="text-xs text-foreground/25 mt-2 truncate">{invitation.venueName}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleCopyLink}><Copy className="h-3.5 w-3.5" /></Button>
          <Link href={invitationUrl} target="_blank"><Button variant="ghost" size="sm"><ExternalLink className="h-3.5 w-3.5" /></Button></Link>
          <Link href={`${invitationUrl}/rsvp`}><Button variant="secondary" size="sm"><Users className="h-3.5 w-3.5" />RSVPs</Button></Link>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </Card>
  );
}

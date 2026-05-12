import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import type { Guest } from '@/types';

interface RsvpTableProps {
  guests: Guest[];
  stats: { attending: number; notAttending: number; pending: number; totalResponses: number; estimatedGuests: number };
}

const statusBadge: Record<string, { variant: 'success' | 'danger' | 'warning'; label: string }> = {
  ATTENDING: { variant: 'success', label: 'Attending' },
  NOT_ATTENDING: { variant: 'danger', label: 'Not Attending' },
  PENDING: { variant: 'warning', label: 'Pending' },
};

export default function RsvpTable({ guests, stats }: RsvpTableProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total RSVPs', value: stats.totalResponses, color: 'text-foreground' },
          { label: 'Attending', value: stats.attending, color: 'text-emerald-400' },
          { label: 'Not Attending', value: stats.notAttending, color: 'text-red-400' },
          { label: 'Est. Guests', value: stats.estimatedGuests, color: 'text-amber-400' },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-foreground/40 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      {guests.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-foreground/40">No RSVPs yet</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs font-medium text-foreground/40 uppercase tracking-wider">Name</th>
                  <th className="text-left p-4 text-xs font-medium text-foreground/40 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-foreground/40 uppercase tracking-wider">Guests</th>
                  <th className="text-left p-4 text-xs font-medium text-foreground/40 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => {
                  const badge = statusBadge[guest.rsvpStatus];
                  return (
                    <tr key={guest.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{guest.name}</p>
                        {guest.email && <p className="text-xs text-foreground/30 mt-0.5">{guest.email}</p>}
                      </td>
                      <td className="p-4"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                      <td className="p-4 text-foreground/50">{guest.attendees}</td>
                      <td className="p-4 text-foreground/40 max-w-[200px] truncate">{guest.message || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

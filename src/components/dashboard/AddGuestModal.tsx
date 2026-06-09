'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UserPlus, X, Phone, User } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface AddGuestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  invitationSlug: string;
}

export default function AddGuestModal({ onClose, onSuccess, invitationSlug }: AddGuestModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${invitationSlug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rsvpStatus: 'ATTENDING', // Manual entry usually means they are attending or pre-registered
          isVip: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal menambahkan tamu');
      
      showToast('success', 'Tamu berhasil ditambahkan!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      showToast('error', (error as Error).message || 'Gagal menambahkan tamu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                <UserPlus className="h-5 w-5" />
             </div>
             <h2 className="text-lg font-display font-bold">Tambah Tamu Manual</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-stone-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Nama Tamu</label>
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
               <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Contoh: Budi Santoso"
                 required
                 className="w-full pl-12 pr-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-rose-200 transition-all text-stone-800 placeholder:text-stone-300"
               />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Nomor WhatsApp</label>
            <div className="relative">
               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300" />
               <input
                 type="tel"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 placeholder="Contoh: 08123456789"
                 required
                 className="w-full pl-12 pr-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-rose-200 transition-all text-stone-800 placeholder:text-stone-300"
               />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 bg-[#1c1c1c] text-white rounded-2xl font-bold hover:bg-stone-800 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Tamu'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

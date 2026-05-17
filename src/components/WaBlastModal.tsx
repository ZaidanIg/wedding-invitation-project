'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MessageSquare, Send, X, Users, MessageSquareText } from 'lucide-react';
import type { Guest } from '@/types';

interface WaBlastModalProps {
  guests: Guest[];
  onClose: () => void;
  invitationUrl: string;
}

export default function WaBlastModal({ guests, onClose, invitationUrl }: WaBlastModalProps) {
  const [selectedGuests, setSelectedGuests] = useState<string[]>(guests.map(g => g.id));
  const [messageTemplate, setMessageTemplate] = useState(
    'Halo [NAMA], kami mengundang Anda ke acara pernikahan kami! Lihat undangannya di sini: [LINK]'
  );

  const toggleGuest = (id: string) => {
    setSelectedGuests(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    // In a real app, this would iterate and send via a WA Gateway
    // For now, we'll just mock it or provide links
    alert(`Membuka WhatsApp untuk ${selectedGuests.length} tamu...`);
    
    selectedGuests.forEach((gid, index) => {
      const guest = guests.find(g => g.id === gid);
      if (!guest) return;
      
      const personalizedMsg = messageTemplate
        .replace('[NAMA]', guest.name)
        .replace('[LINK]', `${invitationUrl}?to=${encodeURIComponent(guest.name)}`);
        
      const waUrl = `https://wa.me/${guest.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(personalizedMsg)}`;

      
      // Delay to prevent browser blocking multiple tabs
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, index * 1000);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-8 border-b border-[#eceae4] flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <MessageSquare className="h-6 w-6" />
              </div>
             <div>
                <h2 className="text-xl font-display font-bold">WhatsApp Blast Pro</h2>
                <p className="text-xs text-[#6b6b6b]">Kirim undangan massal ke tamu Anda</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-[#1c1c1c]/40" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Template */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] ml-1 flex items-center gap-2">
               <MessageSquareText className="h-3 w-3" /> Template Pesan
            </label>
            <textarea 
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full p-6 rounded-3xl bg-[#fcfbf8] border border-[#eceae4] text-sm focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              rows={4}
            />
            <p className="text-[10px] text-[#6b6b6b]/60 px-2 italic">
              Gunakan [NAMA] untuk nama tamu dan [LINK] untuk link undangan.
            </p>
          </div>

          {/* Guest Selection */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] flex items-center gap-2">
                   <Users className="h-3 w-3" /> Pilih Tamu ({selectedGuests.length})
                </label>
                <button 
                   onClick={() => setSelectedGuests(selectedGuests.length === guests.length ? [] : guests.map(g => g.id))}
                   className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:opacity-70"
                >
                   {selectedGuests.length === guests.length ? 'Batalkan Semua' : 'Pilih Semua'}
                </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guests.map((guest) => (
                   <button 
                      key={guest.id}
                      onClick={() => toggleGuest(guest.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${selectedGuests.includes(guest.id) ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200' : 'bg-white border-[#eceae4] hover:border-emerald-200'}`}
                   >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedGuests.includes(guest.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#eceae4]'}`}>
                         {selectedGuests.includes(guest.id) && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-sm font-bold truncate ${selectedGuests.includes(guest.id) ? 'text-emerald-900' : 'text-[#1c1c1c]'}`}>{guest.name}</p>
                         <p className="text-[10px] text-[#6b6b6b] truncate">{guest.phone || 'No Phone Number'}</p>

                      </div>
                   </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-8 bg-[#fcfbf8] border-t border-[#eceae4]">
           <Button 
              onClick={handleSend}
              disabled={selectedGuests.length === 0}
              className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
           >
              <Send className="h-5 w-5" />
              Kirim Ke {selectedGuests.length} Tamu
           </Button>
           <p className="text-center text-[10px] text-[#6b6b6b]/40 mt-4 uppercase tracking-[0.2em]">
              Pastikan Anda telah mengizinkan pop-up untuk membuka banyak tab.
           </p>
        </div>
      </Card>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Users, 
  UserPlus, 
  MessageSquareText, 
  X, 
  Check,
  Phone,
  User,
  Sparkles
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import type { Guest } from '@/types';

export default function StandaloneBlastPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tier, setTier] = useState('');
  
  // Selection state
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  
  // Template state
  const [messageTemplate, setMessageTemplate] = useState(
    'Halo [NAMA], kami mengundang Anda ke acara pernikahan kami! Lihat undangannya di sini: [LINK]'
  );
  
  // Add Guest state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Blast Queue state
  const [isBlasting, setIsBlasting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, [params.slug]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/invitations/${params.slug}/rsvp`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data.guests);
        setTier(data.data.tier);
        setSelectedGuests(data.data.guests.map((g: any) => g.id));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await fetch(`/api/invitations/${params.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          rsvpStatus: 'ATTENDING',
        }),
      });
      
      if (res.ok) {
        showToast('success', 'Tamu ditambahkan!');
        setNewName('');
        setNewPhone('');
        fetchData();
      }
    } catch (error) {
      showToast('error', 'Gagal menambah tamu');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleGuest = (id: string) => {
    setSelectedGuests(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleSendBlast = () => {
    setIsBlasting(true);
    setCurrentIndex(0);
    sendToGuest(0);
  };

  const sendToGuest = (index: number) => {
    if (index >= selectedGuests.length) {
      setIsBlasting(false);
      showToast('success', 'Selesai mengirim ke semua tamu!');
      return;
    }

    const gid = selectedGuests[index];
    const guest = guests.find(g => g.id === gid);
    if (!guest) return;

    const invitationUrl = `${window.location.origin}/invitation/${params.slug}`;
    const personalizedMsg = messageTemplate
      .replace('[NAMA]', guest.name)
      .replace('[LINK]', `${invitationUrl}?to=${encodeURIComponent(guest.name)}`);
      
    let cleanPhone = guest.phone?.replace(/\D/g, '') || '';
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
      
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMsg)}`;
    
    window.open(waUrl, '_blank');
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < selectedGuests.length) {
      sendToGuest(nextIndex);
    } else {
      setIsBlasting(false);
      showToast('success', 'Selesai!');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]"><LoadingSpinner size="lg" /></div>;

  return (
    <section className="min-h-screen bg-[#fdfcf9] flex flex-col items-center justify-center py-24 px-10 sm:px-20 mt-10">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header - Standardized Spacing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24">
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-stone-100 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-stretch">
          {/* Left Column: Form & Template */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Add Guest Card */}
            <Card className="p-8 sm:p-10 rounded-[3rem] border-[#eceae4] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c1c1c]">Tambah Nomor WA</h3>
              </div>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] ml-1">Nama</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama Tamu"
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-sm focus:ring-1 focus:ring-rose-200 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] ml-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-sm focus:ring-1 focus:ring-rose-200 outline-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full h-12 bg-[#1c1c1c] text-white rounded-2xl font-bold hover:bg-stone-800 transition-all text-xs"
                >
                  {isAdding ? 'Menyimpan...' : 'Tambah ke Daftar'}
                </Button>
              </form>
            </Card>

            {/* Template Card */}
            <Card className="p-10 sm:p-14 rounded-[3.5rem] border-[#eceae4] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c1c1c]">Template Pesan</h3>
              </div>
              <textarea 
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-sm focus:ring-1 focus:ring-emerald-500 outline-none resize-none h-40"
              />
              <p className="text-[9px] text-[#6b6b6b]/60 mt-3 italic leading-relaxed">
                Gunakan [NAMA] dan [LINK] sebagai penanda otomatis.
              </p>
            </Card>
          </div>

          {/* Right Column: Guest List & Send */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="p-10 sm:p-14 rounded-[3.5rem] border-[#eceae4] shadow-sm flex flex-col h-full min-h-[800px] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-5">
                      <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1c1c1c]">Daftar Tamu ({guests.length})</h3>
                   </div>
                   <button 
                      onClick={() => setSelectedGuests(selectedGuests.length === guests.length ? [] : guests.map(g => g.id))}
                      className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:opacity-70 transition-opacity"
                   >
                      {selectedGuests.length === guests.length ? 'Batalkan Semua' : 'Pilih Semua'}
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-10">
                   {guests.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                         <Users className="h-16 w-16 mb-4" />
                         <p className="text-sm font-medium">Belum ada tamu.<br/>Gunakan formulir di samping untuk menambah.</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {guests.map((guest) => (
                            <button 
                               key={guest.id}
                               onClick={() => toggleGuest(guest.id)}
                               className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all text-left ${selectedGuests.includes(guest.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-[#eceae4] hover:border-emerald-200'}`}
                            >
                               <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${selectedGuests.includes(guest.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#eceae4]'}`}>
                                  {selectedGuests.includes(guest.id) && <Check className="h-4 w-4" strokeWidth={4} />}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold truncate ${selectedGuests.includes(guest.id) ? 'text-emerald-900' : 'text-[#1c1c1c]'}`}>{guest.name}</p>
                                  <p className="text-[10px] text-[#6b6b6b] truncate mt-0.5">{guest.phone || 'No Phone'}</p>
                               </div>
                            </button>
                         ))}
                      </div>
                   )}
                </div>

                <div className="mt-auto pt-10 border-t border-[#eceae4]">
                   <Button 
                      onClick={handleSendBlast}
                      disabled={selectedGuests.length === 0}
                      size="lg"
                      className="w-full h-16 bg-emerald-500 text-white rounded-[2rem] font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                   >
                      <Send className="h-6 w-6" />
                      Kirim Ke {selectedGuests.length} Tamu Sekarang
                   </Button>
                   <p className="text-center text-[10px] text-[#6b6b6b]/40 mt-5 uppercase tracking-[0.2em] font-medium">
                      Smart Sequential Queue Protection Active
                   </p>
                </div>
             </Card>
          </div>
        </div>
      </div>

      {/* Blast Progress Modal */}
      {isBlasting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 text-center animate-scale-in">
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageSquare className="h-10 w-10 text-emerald-500" />
             </div>
             
             <h2 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">Mengirim Undangan</h2>
             <p className="text-sm text-[#6b6b6b] mb-10 leading-relaxed">
                Tamu {currentIndex + 1} dari {selectedGuests.length}:<br/>
                <span className="font-bold text-[#1c1c1c] text-lg">
                   {guests.find(g => g.id === selectedGuests[currentIndex])?.name}
                </span>
             </p>

             <div className="space-y-4">
                <Button 
                   onClick={handleNext}
                   className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all"
                >
                   {currentIndex + 1 === selectedGuests.length ? 'Selesai' : 'Kirim Ke Tamu Berikutnya'}
                </Button>
                
                <button 
                   onClick={() => setIsBlasting(false)}
                   className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest hover:text-red-500 transition-colors pt-2"
                >
                   Batalkan Blast
                </button>
             </div>

             <div className="mt-10 pt-10 border-t border-[#eceae4]">
                <p className="text-[10px] text-[#6b6b6b]/60 leading-relaxed italic">
                   Klik tombol di atas untuk membuka chat WhatsApp tamu berikutnya.<br/>
                   Hal ini dilakukan untuk memastikan WhatsApp tidak memblokir pengiriman massal Anda.
                </p>
             </div>
          </Card>
        </div>
      )}
    </section>
  );
}

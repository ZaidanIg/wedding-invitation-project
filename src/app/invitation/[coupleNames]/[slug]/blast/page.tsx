'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  UserPlus, 
  MessageSquareText, 
  Check,
  Lock,
  Play,
  Pause,
  Square,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import type { Guest } from '@/types';

export default function StandaloneBlastPage() {
  const params = useParams<{ coupleNames: string; slug: string }>();
  const _router = useRouter();
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tier, setTier] = useState('');
  const [accountType, setAccountType] = useState('B2C_FREE');
  
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

  // Automated Blast Queue state
  const [isBlasting, setIsBlasting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'pending' | 'sending' | 'success' | 'failed'>>({});
  const [countdown, setCountdown] = useState(0);

  // Refs for background loops
  const isBlastingRef = useRef(isBlasting);
  const isPausedRef = useRef(isPaused);
  const currentIndexRef = useRef(currentIndex);
  const selectedGuestsRef = useRef(selectedGuests);

  useEffect(() => {
    isBlastingRef.current = isBlasting;
    isPausedRef.current = isPaused;
    currentIndexRef.current = currentIndex;
    selectedGuestsRef.current = selectedGuests;
  }, [isBlasting, isPaused, currentIndex, selectedGuests]);

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
        setAccountType(data.data.accountType || 'B2C_FREE');
        setSelectedGuests(data.data.guests.map((g: Guest) => g.id));
        
        // Initialize default status mapping
        const initialStatus: Record<string, 'pending' | 'sending' | 'success' | 'failed'> = {};
        data.data.guests.forEach((g: Guest) => {
          initialStatus[g.id] = 'pending';
        });
        setSendingStatus(initialStatus);
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
          rsvpStatus: 'PENDING',
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast('success', 'Tamu ditambahkan!');
        setNewName('');
        setNewPhone('');
        fetchData();
      } else {
        throw new Error(data.message || 'Gagal menambah tamu');
      }
    } catch (error: unknown) {
      showToast('error', error instanceof Error ? error.message : 'Gagal menambah tamu');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleGuest = (id: string) => {
    if (isBlasting) return; // Prevent during active blast
    setSelectedGuests(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  // Main Automated Send Blast trigger
  const handleStartAutoBlast = () => {
    if (selectedGuests.length === 0) return;
    setIsBlasting(true);
    setIsPaused(false);
    setCurrentIndex(0);
    
    // Reset all selected statuses to pending
    setSendingStatus(prev => {
      const updated = { ...prev };
      selectedGuests.forEach(gid => {
        updated[gid] = 'pending';
      });
      return updated;
    });

    // Start recursive runner on next tick
    setTimeout(runBlastStep, 100);
  };

  // Recursive Blast Runner
  const runBlastStep = async () => {
    if (!isBlastingRef.current || isPausedRef.current) return;

    const index = currentIndexRef.current;
    const selected = selectedGuestsRef.current;

    if (index >= selected.length) {
      setIsBlasting(false);
      showToast('success', 'Selesai mengirim ke semua tamu terpilh!');
      return;
    }

    const guestId = selected[index];
    const guest = guests.find(g => g.id === guestId);

    if (!guest) {
      // Skip missing guest records
      setCurrentIndex(prev => prev + 1);
      setTimeout(runBlastStep, 100);
      return;
    }

    // Set active status
    setSendingStatus(prev => ({ ...prev, [guestId]: 'sending' }));

    try {
      const invitationUrl = `${window.location.origin}/invitation/${params.coupleNames}/${params.slug}`;
      const personalizedMsg = messageTemplate
        .replace('[NAMA]', guest.name)
        .replace('[LINK]', `${invitationUrl}?to=${encodeURIComponent(guest.name)}`);

      // Server-side secure endpoint (handles Fonnte Gateway delivery)
      const res = await fetch(`/api/invitations/${params.slug}/blast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, message: personalizedMsg }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSendingStatus(prev => ({ ...prev, [guestId]: 'success' }));
      } else {
        setSendingStatus(prev => ({ ...prev, [guestId]: 'failed' }));
        showToast('error', data.message || `Gagal mengirim ke ${guest.name}`);
      }
    } catch (_err) {
      setSendingStatus(prev => ({ ...prev, [guestId]: 'failed' }));
      showToast('error', `Koneksi gagal saat mengirim ke ${guest.name}`);
    }

    // sequential queue delay (3 seconds) for anti-spam rate limits
    if (index + 1 < selected.length) {
      setCountdown(3);
      let count = 3;
      const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          if (isBlastingRef.current && !isPausedRef.current) {
            setCurrentIndex(prev => prev + 1);
            setTimeout(runBlastStep, 100);
          }
        }
      }, 1000);
    } else {
      setCurrentIndex(prev => prev + 1);
      setTimeout(runBlastStep, 100);
    }
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      // Resume runner on next tick
      setTimeout(runBlastStep, 100);
      showToast('success', 'Melanjutkan antrean blast...');
    } else {
      setIsPaused(true);
      showToast('info', 'Menangguhkan antrean blast...');
    }
  };

  const handleStopBlast = () => {
    setIsBlasting(false);
    setIsPaused(false);
    showToast('error', 'WhatsApp Blast dibatalkan.');
  };

  // Fallback Manual Blast for lower plans
  const handleManualSendSingle = (gid: string) => {
    const guest = guests.find(g => g.id === gid);
    if (!guest) return;

    const invitationUrl = `${window.location.origin}/invitation/${params.coupleNames}/${params.slug}`;
    const personalizedMsg = messageTemplate
      .replace('[NAMA]', guest.name)
      .replace('[LINK]', `${invitationUrl}?to=${encodeURIComponent(guest.name)}`);
      
    let cleanPhone = guest.phone?.replace(/\D/g, '') || '';
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }
      
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMsg)}`;
    window.open(waUrl, '_blank');

    setSendingStatus(prev => ({ ...prev, [gid]: 'success' }));
  };

  const isUltimate = tier === 'ULTIMATE' || tier === 'B2B_GENERATED' || accountType === 'B2B_PRO' || accountType === 'B2B_ALL_TIME';

  // Stats calculation
  const sentCount = Object.values(sendingStatus).filter(s => s === 'success').length;
  const failedCount = Object.values(sendingStatus).filter(s => s === 'failed').length;
  const totalSelected = selectedGuests.length;
  const progressPercentage = totalSelected > 0 ? Math.round((sentCount / totalSelected) * 100) : 0;
  const estimatedTimeSec = totalSelected > 0 ? (totalSelected - currentIndex) * 3.5 : 0;
  const formattedETA = estimatedTimeSec > 60 
    ? `${Math.ceil(estimatedTimeSec / 60)} menit` 
    : `${Math.round(estimatedTimeSec)} detik`;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]"><LoadingSpinner size="lg" /></div>;

  return (
    <section className="min-h-screen bg-[#fdfcf9] flex flex-col items-center justify-center py-24 px-10 sm:px-20 mt-10">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-stone-100 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dasbor
              </Button>
            </Link>
          </div>
        </div>

        {/* Tier Upgrade Banner for non-Ultimate users */}
        {!isUltimate && (
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-amber-500/10 rounded-2xl text-amber-600">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Auto WhatsApp Blast Terkunci 🔒</h4>
                <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                  Paket Anda saat ini adalah <strong>{tier === 'BASIC' ? 'Minimalist Plan' : tier === 'PREMIUM' ? 'Premium Plan' : 'Free Demo'}</strong>. Fitur pengiriman otomatis hanya tersedia untuk <strong>Paket Ultimate</strong>. Di paket saat ini Anda dapat mengirim undangan secara manual di bawah ini.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-[#1c1c1c] text-white text-[10px] uppercase font-bold tracking-widest px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors shrink-0">
                Upgrade ke Ultimate
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          
          {/* Left Column: Form, Template & Guidelines */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Quick Add Guest Card */}
            <Card className="p-8 sm:p-10 rounded-[3rem] border-[#eceae4] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1c1c1c]">Tambah Tamu Baru</h3>
              </div>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama Tamu"
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-xs focus:ring-1 focus:ring-rose-200 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] ml-1">No WhatsApp</label>
                  <input 
                    type="tel" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-xs focus:ring-1 focus:ring-rose-200 outline-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full h-12 bg-[#1c1c1c] text-white rounded-2xl font-bold hover:bg-stone-800 transition-all text-xs"
                >
                  {isAdding ? 'Menambahkan...' : 'Simpan Tamu'}
                </Button>
              </form>
            </Card>

            {/* Template Card */}
            <Card className="p-8 sm:p-10 rounded-[3rem] border-[#eceae4] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1c1c1c]">Template Pesan</h3>
              </div>
              <textarea 
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                disabled={isBlasting}
                className="w-full p-4 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none h-40 disabled:opacity-60"
              />
              <div className="bg-stone-50 border border-stone-200/50 p-4 rounded-xl mt-4">
                <p className="text-[9px] text-[#6b6b6b] leading-relaxed">
                  💡 <strong>Tips Personalisasi:</strong><br/>
                  Gunakan <strong><code>[NAMA]</code></strong> untuk menyisipkan nama tamu secara otomatis.<br/>
                  Gunakan <strong><code>[LINK]</code></strong> untuk menyisipkan link undangan pribadi tamu.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Guest List & Blast Actions */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 sm:p-12 rounded-[3.5rem] border-[#eceae4] shadow-sm flex flex-col h-full min-h-[700px] hover:shadow-md transition-shadow">
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1c1c1c]">Pilih Tamu Undangan ({guests.length})</h3>
                </div>
                <button 
                  onClick={() => setSelectedGuests(selectedGuests.length === guests.length ? [] : guests.map(g => g.id))}
                  disabled={isBlasting}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:opacity-70 transition-opacity disabled:opacity-40"
                >
                  {selectedGuests.length === guests.length ? 'Kosongkan' : 'Pilih Semua'}
                </button>
              </div>

              {/* Guest Grid */}
              <div className="flex-1 overflow-y-auto no-scrollbar max-h-[420px] space-y-4 mb-8 pr-1">
                {guests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <Users className="h-12 w-16 mb-4" />
                    <p className="text-xs font-semibold">Daftar tamu kosong.<br/>Gunakan panel di samping untuk menambah.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guests.map((guest) => {
                      const status = sendingStatus[guest.id] || 'pending';
                      const isSelected = selectedGuests.includes(guest.id);
                      return (
                        <div 
                          key={guest.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isSelected ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-[#eceae4]'}`}
                        >
                          <button 
                            disabled={isBlasting}
                            onClick={() => toggleGuest(guest.id)}
                            className="flex items-center gap-4 flex-1 text-left min-w-0 disabled:cursor-not-allowed"
                          >
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#eceae4]'}`}>
                              {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900' : 'text-[#1c1c1c]'}`}>{guest.name}</p>
                              <p className="text-[9px] text-[#6b6b6b] truncate mt-0.5">{guest.phone || 'Tanpa WA'}</p>
                            </div>
                          </button>

                          {/* Individual Status Badge & Manual Trigger for non-Ultimate */}
                          <div className="flex items-center gap-2 shrink-0">
                            {status === 'sending' && (
                              <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full animate-pulse">Mengirim...</span>
                            )}
                            {status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            )}
                            {status === 'failed' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            {status === 'pending' && !isUltimate && isSelected && (
                              <button 
                                onClick={() => handleManualSendSingle(guest.id)}
                                className="text-[9px] bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1"
                              >
                                <Send className="h-2.5 w-2.5" /> Kirim
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Blast Panel Trigger */}
              <div className="mt-auto pt-6 border-t border-[#eceae4]">
                {isUltimate ? (
                  <Button 
                    onClick={handleStartAutoBlast}
                    disabled={selectedGuests.length === 0 || isBlasting}
                    size="lg"
                    className="w-full h-16 bg-emerald-500 text-white rounded-[2rem] font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.01] transition-all flex items-center justify-center gap-4 disabled:opacity-40"
                  >
                    <Send className="h-5 w-5" />
                    Kirim {selectedGuests.length} Undangan Otomatis (1-Click)
                  </Button>
                ) : (
                  <div className="bg-[#fcfbf8] border border-[#eceae4] p-6 rounded-[2rem] text-center">
                    <p className="text-xs text-stone-600 font-semibold mb-2">
                      Fitur Pengiriman Massal 1-Click dinonaktifkan di tier ini.
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Gunakan tombol <strong>Kirim</strong> hijau di samping masing-masing tamu untuk mengirim manual via WhatsApp.
                    </p>
                  </div>
                )}
                
                <p className="text-center text-[8px] text-[#6b6b6b]/40 mt-4 uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-1.5">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  Sistem Pengiriman Aman Aktif (Jeda Aman 3 Detik)
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Live Blast Progress Panel Modal */}
      {isBlasting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-10 sm:p-12 text-center animate-scale-in border border-[#eceae4]">
             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-emerald-500 animate-pulse" />
             </div>
             
             <h2 className="text-xl font-display font-bold text-[#1c1c1c] mb-1">WhatsApp Auto Blast Sedang Berjalan</h2>
             <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-8">Sistem Pengiriman Sahinaja</p>

             {/* Dynamic Live Counter Progress */}
             <div className="bg-stone-50 border border-stone-100 p-6 rounded-3xl mb-8 flex items-center justify-between text-left">
               <div>
                 <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Progres Pengiriman</span>
                 <p className="text-2xl font-bold text-stone-900 mt-1">
                   {currentIndex} <span className="text-stone-300">/</span> {totalSelected}
                 </p>
               </div>
               <div className="text-right">
                 <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Estimasi Selesai (ETA)</span>
                 <p className="text-sm font-bold text-emerald-600 mt-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                   {formattedETA}
                 </p>
               </div>
             </div>

             {/* Real-time Progress Bar */}
             <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-8">
               <div 
                 className="bg-emerald-500 h-full transition-all duration-500" 
                 style={{ width: `${progressPercentage}%` }}
               />
             </div>

             {/* Current Sending Card */}
             {currentIndex < totalSelected ? (
               <div className="bg-emerald-50/20 border border-emerald-100 p-6 rounded-3xl text-center mb-8 relative overflow-hidden">
                 <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full">Mengirim</span>
                 <h4 className="font-bold text-base text-stone-900 mt-2">
                   {guests.find(g => g.id === selectedGuests[currentIndex])?.name}
                 </h4>
                 <p className="text-xs text-stone-500 mt-1">
                   {guests.find(g => g.id === selectedGuests[currentIndex])?.phone}
                 </p>

                 {/* Countdown Visual indicator */}
                 {countdown > 0 && (
                   <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-1.5 animate-fade-in">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 animate-pulse">Menghindari Deteksi Spam WhatsApp</span>
                     <p className="text-xs font-semibold text-stone-800">
                       Jeda pengaman berikutnya: <span className="font-bold text-sm text-amber-500">{countdown} detik...</span>
                     </p>
                   </div>
                 )}
               </div>
             ) : (
               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center mb-8">
                 <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                 <h4 className="font-bold text-sm text-emerald-950">Seluruh Pengiriman Selesai!</h4>
                 <p className="text-xs text-emerald-700/80 mt-1">Berhasil mengirim ke {sentCount} tamu.</p>
               </div>
             )}

             {/* Live Stats counters */}
             <div className="grid grid-cols-2 gap-4 mb-10 text-center">
               <div className="border border-stone-100 p-3 rounded-2xl">
                 <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400">Sukses</span>
                 <p className="text-base font-bold text-emerald-600">{sentCount}</p>
               </div>
               <div className="border border-stone-100 p-3 rounded-2xl">
                 <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400">Gagal</span>
                 <p className="text-base font-bold text-red-500">{failedCount}</p>
               </div>
             </div>

             {/* Action Control Panel */}
             <div className="flex items-center gap-3">
               {currentIndex < totalSelected && (
                 <Button 
                   onClick={handlePauseToggle}
                   className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isPaused ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                 >
                   {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                   {isPaused ? 'Lanjutkan' : 'Jeda'}
                 </Button>
               )}
               
               <Button 
                 variant="secondary"
                 onClick={handleStopBlast}
                 className="flex-1 h-14 border border-stone-200 text-stone-700 rounded-2xl font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Square className="h-4 w-4 text-red-500" />
                 {currentIndex < totalSelected ? 'Batalkan' : 'Selesai'}
               </Button>
             </div>
          </Card>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScanLine, Camera, CheckCircle2, XCircle, Users, UserCheck, Clock, Search, ChevronDown, X, RefreshCw, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type InvitationItem = {
  id: string;
  groomName: string;
  brideName: string;
  slug: string;
  tier: string;
  _count?: { guests: number };
};

type Guest = {
  id: string;
  name: string;
  rsvpStatus: string;
  attendees: number;
  checkedIn: boolean;
  phone?: string;
};

type ScanResult = {
  success: boolean;
  guest?: Guest;
  message: string;
};

export default function ScannerPage() {
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<string>('');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const html5ScannerRef = React.useRef<any>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchGuests(selectedSlug);
    }
  }, [selectedSlug]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations?limit=50');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.success && data.data?.data) {
        const items: InvitationItem[] = data.data.data;
        setInvitations(items);
        if (items.length > 0) {
          setSelectedInvitation(items[0].id);
          setSelectedSlug(items[0].slug);
        }
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGuests = async (slug: string) => {
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`);
      if (!res.ok) { setGuests([]); return; }
      const data = await res.json();
      if (data.success && data.data?.guests) {
        setGuests(data.data.guests);
      }
    } catch {
      setGuests([]);
    }
  };

  const handleCheckIn = async (guestId: string) => {
    if (!selectedSlug) return;
    try {
      const res = await fetch(`/api/invitations/${selectedSlug}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Gagal check-in tamu.' }));
        setScanResult({ success: false, message: data.message || 'Gagal check-in tamu.' });
      } else {
        const data = await res.json();
        setScanResult({ success: true, guest: data.data, message: 'Tamu berhasil check-in!' });
        setGuests(prev => prev.map(g => g.id === guestId ? { ...g, checkedIn: true } : g));
      }
    } catch {
      setScanResult({ success: false, message: 'Terjadi kesalahan saat check-in.' });
    }
    setTimeout(() => setScanResult(null), 4000);
  };

  // ─── QR Scanner Logic ───────────────────────────────────────
  const startScanner = useCallback(async () => {
    const { Html5QrcodeScanner } = await import('html5-qrcode');

    if (html5ScannerRef.current) {
      try { await html5ScannerRef.current.clear(); } catch {}
    }

    const scanner = new Html5QrcodeScanner(
      'dashboard-qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0, rememberLastUsedCamera: true },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      if (isProcessing || !selectedSlug) return;
      setIsProcessing(true);

      try {
        const res = await fetch(`/api/invitations/${selectedSlug}/checkin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestId: decodedText }),
        });
        const data = await res.json();

        if (data.success) {
          setScanResult({ success: true, guest: data.data, message: 'Check-in Berhasil!' });
          setGuests(prev => prev.map(g => g.id === decodedText ? { ...g, checkedIn: true } : g));
          if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        } else {
          setScanResult({ success: false, message: data.message || 'Gagal melakukan check-in.' });
          if ('vibrate' in navigator) navigator.vibrate(300);
        }
      } catch {
        setScanResult({ success: false, message: 'Kesalahan server. Coba lagi.' });
      } finally {
        setIsProcessing(false);
      }

      try { await scanner.pause(); } catch {}
    };

    scanner.render(onScanSuccess, () => {});
    html5ScannerRef.current = scanner;
  }, [isProcessing, selectedSlug]);

  const openScanner = () => {
    setIsScannerOpen(true);
    setScanResult(null);
    setTimeout(() => startScanner(), 300);
  };

  const closeScanner = async () => {
    if (html5ScannerRef.current) {
      try { await html5ScannerRef.current.clear(); } catch {}
      html5ScannerRef.current = null;
    }
    setIsScannerOpen(false);
    setScanResult(null);
  };

  const resumeScanner = () => {
    setScanResult(null);
    if (html5ScannerRef.current) {
      try { html5ScannerRef.current.resume(); } catch {}
    }
  };

  const handleSelectInvitation = (inv: InvitationItem) => {
    setSelectedInvitation(inv.id);
    setSelectedSlug(inv.slug);
    setIsDropdownOpen(false);
  };

  const checkedInCount = guests.filter(g => g.checkedIn).length;
  const totalGuests = guests.length;
  const attendingCount = guests.filter(g => g.rsvpStatus === 'ATTENDING').length;
  const filteredGuests = guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedInvData = invitations.find(i => i.id === selectedInvitation);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-zinc-900">D-Day Scanner</h2>
          <p className="text-xs lg:text-sm text-zinc-500">Scan QR code atau check-in tamu secara manual.</p>
        </div>
        <button
          onClick={openScanner}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/10"
        >
          <Camera className="h-4 w-4" />
          Scan QR Code
        </button>
      </div>

      {/* Invitation Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full sm:w-80 flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm text-sm font-medium text-zinc-900 hover:border-zinc-300 transition-colors"
        >
          <span className="truncate">
            {selectedInvData ? `${selectedInvData.groomName} & ${selectedInvData.brideName}` : 'Pilih Undangan'}
          </span>
          <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute z-20 mt-1 w-full sm:w-80 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
            >
              {invitations.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => handleSelectInvitation(inv)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 transition-colors ${
                    inv.id === selectedInvitation ? 'bg-rose-50 text-rose-700 font-medium' : 'text-zinc-700'
                  }`}
                >
                  {inv.groomName} &amp; {inv.brideName}
                  <span className="text-xs text-zinc-400 ml-2">({inv._count?.guests || 0} tamu)</span>
                </button>
              ))}
              {invitations.length === 0 && (
                <div className="px-4 py-3 text-sm text-zinc-400">Belum ada undangan.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 lg:mb-3">
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium uppercase tracking-wider text-zinc-400">Total Tamu</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-zinc-900 tabular-nums">{totalGuests}</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 lg:mb-3">
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <UserCheck className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-600" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium uppercase tracking-wider text-zinc-400">Sudah Check-in</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-zinc-900 tabular-nums">
            {checkedInCount}
            <span className="text-sm font-normal text-zinc-400 ml-1">/ {totalGuests}</span>
          </p>
          {totalGuests > 0 && (
            <div className="mt-2 w-full bg-zinc-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(checkedInCount / totalGuests) * 100}%` }} />
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 lg:mb-3">
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-amber-600" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium uppercase tracking-wider text-zinc-400">RSVP Hadir</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-zinc-900 tabular-nums">{attendingCount}</p>
        </div>
      </div>

      {/* Toast (manual check-in) */}
      <AnimatePresence>
        {scanResult && !isScannerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border ${
              scanResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {scanResult.success ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <XCircle className="h-5 w-5 text-red-600 shrink-0" />}
            <div>
              <p className="text-sm font-semibold">{scanResult.message}</p>
              {scanResult.guest && <p className="text-xs mt-0.5 opacity-80">{scanResult.guest.name} • {scanResult.guest.attendees} orang</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── QR Scanner Modal ─── */}
      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeScanner(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-zinc-900 flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">QR Scanner</h3>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400">Arahkan kamera ke QR Code tamu</p>
                  </div>
                </div>
                <button onClick={closeScanner} className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scanner View */}
              <div className="relative flex-1 overflow-y-auto">
                {scanResult ? (
                  <div className={`p-6 sm:p-8 text-center ${scanResult.success ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className="flex justify-center mb-4 sm:mb-5">
                      {scanResult.success ? (
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold mb-1 ${scanResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                      {scanResult.message}
                    </h3>
                    {scanResult.success && scanResult.guest && (
                      <div className="mb-5 sm:mb-6">
                        <p className="text-emerald-900 font-semibold">{scanResult.guest.name}</p>
                        <p className="text-emerald-700/60 text-sm">{scanResult.guest.attendees} Tamu</p>
                      </div>
                    )}
                    <button
                      onClick={resumeScanner}
                      className={`w-full py-3 sm:py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        scanResult.success ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Scan Berikutnya
                    </button>
                  </div>
                ) : (
                  <>
                    <div id="dashboard-qr-reader" className="w-full" />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                        <RefreshCw className="h-8 w-8 text-zinc-900 animate-spin" />
                        <p className="text-sm font-semibold text-zinc-700">Memproses check-in...</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-zinc-100 bg-zinc-50 shrink-0">
                <p className="text-[10px] sm:text-[11px] text-zinc-400 text-center leading-relaxed">
                  QR Code tamu dihasilkan setelah RSVP &quot;Hadir&quot; dikonfirmasi.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest List */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 lg:p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-zinc-900">Daftar Tamu</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tamu..."
              className="pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 font-medium">Nama Tamu</th>
                <th className="px-6 py-3 font-medium">RSVP</th>
                <th className="px-6 py-3 font-medium text-center">Jumlah</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    {searchQuery ? 'Tamu tidak ditemukan.' : 'Belum ada data tamu.'}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{guest.name}</div>
                      {guest.phone && <div className="text-xs text-zinc-400 mt-0.5">{guest.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <RsvpBadge status={guest.rsvpStatus} />
                    </td>
                    <td className="px-6 py-4 text-center tabular-nums text-zinc-700">{guest.attendees}</td>
                    <td className="px-6 py-4 text-center">
                      <CheckinBadge checkedIn={guest.checkedIn} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!guest.checkedIn ? (
                        <button onClick={() => handleCheckIn(guest.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors">
                          <ScanLine className="h-3.5 w-3.5" />
                          Check-in
                        </button>
                      ) : <span className="text-xs text-zinc-400">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="block lg:hidden divide-y divide-zinc-100">
          {filteredGuests.length === 0 ? (
            <div className="px-4 py-12 text-center text-zinc-400">
              <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-30" />
              {searchQuery ? 'Tamu tidak ditemukan.' : 'Belum ada data tamu.'}
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <div key={guest.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-zinc-900 truncate">{guest.name}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <RsvpBadge status={guest.rsvpStatus} />
                    <CheckinBadge checkedIn={guest.checkedIn} />
                    <span className="text-[10px] text-zinc-400 tabular-nums">{guest.attendees} org</span>
                  </div>
                </div>
                {!guest.checkedIn && (
                  <button onClick={() => handleCheckIn(guest.id)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                    <ScanLine className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Check-in</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RsvpBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-medium ${
      status === 'ATTENDING' ? 'bg-emerald-100 text-emerald-700' :
      status === 'NOT_ATTENDING' ? 'bg-red-100 text-red-700' :
      'bg-zinc-100 text-zinc-600'
    }`}>
      {status === 'ATTENDING' ? 'Hadir' : status === 'NOT_ATTENDING' ? 'Tidak Hadir' : 'Pending'}
    </span>
  );
}

function CheckinBadge({ checkedIn }: { checkedIn: boolean }) {
  return checkedIn ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-medium bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      Checked-in
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-medium bg-zinc-100 text-zinc-500">
      Belum hadir
    </span>
  );
}

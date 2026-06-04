'use client';

import { useState, useEffect } from 'react';

import { showToast } from '@/components/ui/Toast';
import { Heart, Send, Check, X, QrCode } from 'lucide-react';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';

interface RsvpFormProps {
  slug: string;
  tier?: string;
  qrEnabled?: boolean;
  initialSubmitted?: boolean;
  initialGuestId?: string | null;
  initialStatus?: 'ATTENDING' | 'NOT_ATTENDING' | null;
}

export default function RsvpForm({ slug, tier, qrEnabled, initialSubmitted, initialGuestId, initialStatus }: RsvpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | null>(initialStatus || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted || false);
  const [guestId, setGuestId] = useState<string | null>(initialGuestId || null);

  // Check localStorage and cookies on mount to maximize Next.js static caching
  // by offloading state to the client
  useEffect(() => {
    // 1. Check LocalStorage
    const localData = localStorage.getItem(`sahinaja_rsvp_${slug}`);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed && parsed.guestId) {
          setIsSubmitted(true);
          setGuestId(parsed.guestId);
          setStatus(parsed.status);
          return;
        }
      } catch (e) {
        // ignore
      }
    }

    // 2. Check document.cookie as fallback
    const match = document.cookie.match(new RegExp(`(^| )rsvp_submitted_${slug}=([^;]+)`));
    if (match) {
      setIsSubmitted(true);
      setGuestId(match[2]);
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          rsvpStatus: status,
          message: message.trim() || undefined,
          attendees,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      
      if (data.data?.id) {
        setGuestId(data.data.id);
        // Save to localStorage to persist client-side without SSR opting
        try {
          localStorage.setItem(`sahinaja_rsvp_${slug}`, JSON.stringify({
            guestId: data.data.id,
            status,
          }));
        } catch (e) {
          // ignore
        }
      }
      
      setIsSubmitted(true);
      showToast('success', 'RSVP submitted successfully!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex p-3 rounded-full bg-emerald-100 mb-4">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-display font-semibold text-stone-800 mb-2">Terima Kasih!</h3>
        <p className="text-sm text-stone-500 mb-8">Konfirmasi kehadiran Anda telah tersimpan.</p>

        {((tier === 'PREMIUM' || tier === 'ULTIMATE' || tier === 'B2B_GENERATED') && qrEnabled !== false) && status === 'ATTENDING' && guestId && (
          <div className="mt-6 p-6 bg-white border border-stone-100 rounded-3xl shadow-sm inline-block animate-fade-in">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center justify-center gap-2">
              <QrCode className="h-3 w-3" /> QR Check-in Anda
            </p>
            <div className="bg-white p-3 rounded-2xl border border-stone-50 inline-block">
              <SafeQRCodeSVG value={guestId} size={150} level="H" />
            </div>
            <p className="mt-4 text-[10px] text-stone-400 leading-relaxed max-w-[200px] mx-auto">
              Tunjukkan QR Code ini kepada petugas penerima tamu saat acara.
            </p>
          </div>
        )}
      </div>
    );
  }


  const inputClass =
    'w-full px-4 py-3 text-sm bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5';

  return (
    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-stone-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Attendance selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus('ATTENDING')}
            className={`p-3 sm:p-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              status === 'ATTENDING'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            <Heart className="h-4 w-4" /> Attending
          </button>
          <button
            type="button"
            onClick={() => setStatus('NOT_ATTENDING')}
            className={`p-3 sm:p-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              status === 'NOT_ATTENDING'
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            <X className="h-4 w-4" /> Can&apos;t Make It
          </button>
        </div>

        <div>
          <label className={labelClass}>Your Name *</label>
          <input
            className={inputClass}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Nomor WhatsApp (Contoh: 08123456789) *</label>
          <input
            className={inputClass}
            type="tel"
            placeholder="0812..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Email (Opsional)</label>
          <input
            className={inputClass}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {status === 'ATTENDING' && (
          <div>
            <label className={labelClass}>Number of Guests</label>
            <input
              className={inputClass}
              type="number"
              min={1}
              max={10}
              value={attendees}
              onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Message for the Couple (Optional)</label>
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Share your wishes..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !status || !name.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold uppercase tracking-widest bg-stone-800 text-[#f5f0eb] rounded-xl hover:bg-stone-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
}

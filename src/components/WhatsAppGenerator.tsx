'use client';

import { useState } from 'react';
import { MessageSquare, Copy, ExternalLink, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface WhatsAppGeneratorProps {
  invitationSlug: string;
  groomName: string;
  brideName: string;
}

export default function WhatsAppGenerator({ invitationSlug, groomName, brideName }: WhatsAppGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');

  const invitationUrl = `${window.location.origin}/invitation/${invitationSlug}`;
  const personalizedUrl = guestName.trim() 
    ? `${invitationUrl}?to=${encodeURIComponent(guestName.trim())}`
    : invitationUrl;

  const messageTemplate = `Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i ${guestName || '...'} untuk hadir di acara pernikahan kami:

*${groomName} & ${brideName}*

Silakan buka tautan berikut untuk info selengkapnya:
${personalizedUrl}

Terima kasih.`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
      showToast('success', 'Message copied to clipboard!');
    } catch {
      showToast('error', 'Failed to copy message');
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(messageTemplate)}`;
    window.open(waUrl, '_blank');
  };

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="text-emerald-500 hover:bg-emerald-500/10">
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="hidden sm:inline ml-2">Share WA</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-stone-800">WhatsApp Share</h3>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Guest Name (Optional)</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Budi Santoso"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Preview Message</p>
            <pre className="text-sm text-stone-600 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto no-scrollbar">
              {messageTemplate}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleCopyMessage}>
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="primary" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none" onClick={handleOpenWhatsApp}>
              <Send className="h-4 w-4" />
              Send to WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

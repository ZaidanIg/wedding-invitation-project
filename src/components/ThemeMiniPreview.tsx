'use client';

import React from 'react';
import type { Invitation, Layout } from '@/types';
import ElegantCream from './layouts/ElegantCream';
import RoyalBlue from './layouts/RoyalBlue';
import RoseGarden from './layouts/RoseGarden';
import GoldenClassic from './layouts/GoldenClassic';
import LuxuryEmerald from './layouts/luxury-emerald';

interface ThemeMiniPreviewProps {
  layout: Layout;
  isInteractable?: boolean;
  scale?: number;
  hideNotch?: boolean;
}

const mockInvitation: Invitation = {
  id: 'mock-1',
  groomName: 'Ahmad Rizky',
  groomParents: 'Bapak Budi & Ibu Ani',
  brideName: 'Siti Nurhaliza',
  brideParents: 'Bapak Slamet & Ibu Wati',
  eventDate: '2024-12-12',
  eventTime: '09:00 - Selesai',
  venueName: 'The Ritz-Carlton Jakarta',
  venueAddress: 'Jl. DR. Ide Anak Agung Gde Agung Kav.E.1.1 no.1, Mega Kuningan, Jakarta',
  greeting: 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.',
  mainBody: 'Momen berharga yang akan menyatukan dua hati dalam satu ikatan suci pernikahan.',
  eventInfo: 'Akad Nikah & Resepsi',
  closing: 'Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
  fullText: '',
  photoUrls: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1522673607200-164883eecd0c?auto=format&fit=crop&q=80&w=800'
  ],
  tone: 'formal',
  language: 'id',
  layout: 'elegant-cream',
  slug: 'preview-theme',
  schedule: [
    { id: '1', time: '09:00', label: 'Akad Nikah', icon: 'heart' },
    { id: '2', time: '11:00', label: 'Resepsi', icon: 'glasses' }
  ],
  loveStory: [
    { id: '1', year: '2020', title: 'First Meet', description: 'Pertemuan pertama kami yang tak terduga di sebuah perpustakaan kota.' },
    { id: '2', year: '2022', title: 'First Date', description: 'Makan malam pertama yang penuh tawa di kedai kopi kecil.' },
    { id: '3', year: '2024', title: 'Engagement', description: 'Komitmen untuk melangkah lebih jauh dalam ikatan yang suci.' }
  ],
  digitalGifts: [
    { id: '1', bankName: 'Bank BCA', accountNumber: '1234567890', accountHolder: 'Ahmad Rizky' },
    { id: '2', bankName: 'Bank Mandiri', accountNumber: '0987654321', accountHolder: 'Siti Nurhaliza' }
  ],
  quotes: 'Cinta bukanlah mencari seseorang untuk hidup bersama, tapi mencari seseorang yang membuatmu tak bisa hidup tanpanya.',
  viewCount: 0,
  tier: 'PREMIUM',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ThemeMiniPreview({ layout, isInteractable = false, scale = 0.55, hideNotch = false }: ThemeMiniPreviewProps) {
  const invitation = { ...mockInvitation, layout };

  const renderLayout = () => {
    switch (layout) {
      case 'royal-blue':
        return <RoyalBlue invitation={invitation} />;
      case 'rose-garden':
        return <RoseGarden invitation={invitation} />;
      case 'golden-classic':
        return <GoldenClassic invitation={invitation} />;
      case 'luxury-emerald':
        return <LuxuryEmerald invitation={invitation} />;
      case 'elegant-cream':
      default:
        return <ElegantCream invitation={invitation} />;
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex justify-center ${isInteractable ? '' : 'pt-10 bg-[#fcfbf8]'}`}>
      {!isInteractable && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1c1c1c 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
      )}

      {/* Container that scales the real invitation component */}
      <div 
        className={`relative origin-top w-[375px] h-[812px] select-none shrink-0 ${isInteractable ? 'pointer-events-auto' : 'pointer-events-none'}`} 
        style={{ transform: `scale(${scale})` }}
      >
        <div className={`absolute inset-0 overflow-hidden bg-white ${isInteractable ? '' : 'border-[12px] border-[#1c1c1c] rounded-[3.5rem] shadow-2xl ring-1 ring-black/5'}`}>
          <div className="w-full h-full overflow-y-auto">
            {renderLayout()}
          </div>
        </div>
        
        {!hideNotch && !isInteractable && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-2xl z-20" />
        )}
      </div>
      
      {!isInteractable && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fcfbf8] via-[#fcfbf8]/80 to-transparent z-10" />
      )}
    </div>
  );
}

import { Invitation } from '@/types';

export const MOCK_INVITATION: Invitation = {
  id: 'demo-1',
  slug: 'demo-invitation',
  groomName: 'Zaidan',
  brideName: 'Azka',
  groomPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  bridePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  headerPhotoUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  eventDate: '2024-12-12T09:00:00.000Z',
  eventTime: '09:00',
  venueName: 'The Grand Ballroom Sahin',
  venueAddress: 'Jl. Kemewahan No. 1, Jakarta Selatan',
  quotes: 'Cinta bukanlah mencari seseorang untuk hidup bersama, tapi mencari seseorang yang membuatmu tak bisa hidup tanpanya.',
  photoUrls: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
  ],
  loveStory: [
    {
      id: '1',
      year: '2020',
      title: 'Pertemuan Pertama',
      description: 'Di sebuah kafe kecil di Jakarta, takdir mempertemukan kami untuk pertama kalinya.'
    },
    {
      id: '2',
      year: '2022',
      title: 'Lamaran',
      description: 'Di bawah langit berbintang, ia meminta saya untuk menghabiskan sisa hidup bersamanya.'
    }
  ],
  digitalGifts: [
    {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Zaidan Al-Fatih'
    }
  ],
  stylePreferences: {
    layout: 'islamic-grace',
    tone: 'romantic',
    language: 'id',
    musicUrl: '/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3'
  },
  tier: 'ULTIMATE',
  viewCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  greeting: '',
  mainBody: '',
  eventInfo: '',
  closing: '',
  fullText: '',
  tone: '',
  language: '',
  layout: '',
  schedule: []
};

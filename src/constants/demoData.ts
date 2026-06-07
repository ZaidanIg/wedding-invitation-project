import { Invitation } from '@/types';

export const MOCK_INVITATION: Invitation = {
  id: 'demo-1',
  slug: 'demo-invitation',
  groomName: 'Zaidan',
  brideName: 'Azka',
  groomPhotoUrl: '/assets/ElegantSundanesseTheme/assets/foto groom.jpg',
  bridePhotoUrl: '/assets/ElegantSundanesseTheme/assets/foto bride.jpg',
  headerPhotoUrl: '/assets/ElegantSundanesseTheme/assets/foto header.jpg',
  eventDate: '2024-12-12T09:00:00.000Z',
  eventTime: '09:00',
  venueName: 'The Grand Ballroom Sahinaja',
  venueAddress: 'Jl. Kemewahan No. 1, Jakarta Selatan',
  quotes: 'Cinta bukanlah mencari seseorang untuk hidup bersama, tapi mencari seseorang yang membuatmu tak bisa hidup tanpanya.',
  photoUrls: [
    '/assets/ElegantSundanesseTheme/assets/photo 1.jpg',
    '/assets/ElegantSundanesseTheme/assets/photo 2.jpg',
    '/assets/ElegantSundanesseTheme/assets/photo 3.jpg',
    '/assets/ElegantSundanesseTheme/assets/photo 4.jpg',
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
  tier: 'ULTIMATE', // v1.2: isPaid removed — tier !== 'DRAFT' = active
  aiRegenCount: 0,
  viewCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  greeting: 'Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Anda untuk merayakan hari istimewa kami.',
  mainBody: '',
  eventInfo: '',
  closing: '',
  fullText: '',
  tone: 'romantic',
  language: 'id',
  layout: 'premium-javanese',
  musicUrl: '/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3',
  schedule: []
};

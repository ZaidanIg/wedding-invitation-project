// ============================================================
// Zustand Store — Form wizard state management
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FormWizardState, Tone, Language, Layout, GeneratedInvitation } from '@/types';

interface FormWizardActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCoupleDetails: (details: FormWizardState['coupleDetails']) => void;
  setEventDetails: (details: FormWizardState['eventDetails']) => void;
  setStylePreferences: (prefs: FormWizardState['stylePreferences']) => void;
  setPhotoUrls: (urls: string[]) => void;
  addPhotoUrl: (url: string) => void;
  removePhotoUrl: (url: string) => void;
  setHeaderPhotoUrl: (url: string) => void;
  setGroomPhotoUrl: (url: string) => void;
  setBridePhotoUrl: (url: string) => void;
  setGeneratedInvitation: (invitation: GeneratedInvitation | null) => void;
  setIsGenerating: (val: boolean) => void;
  setIsSaving: (val: boolean) => void;
  setQrEnabled: (val: boolean) => void;
  targetTier: 'BASIC' | 'PREMIUM' | 'ULTIMATE';
  setTargetTier: (tier: 'BASIC' | 'PREMIUM' | 'ULTIMATE') => void;
  dismissOnboarding: () => void;
  setActiveMobileTab: (tab: 'form' | 'preview') => void;
  loadDemoData: () => void;
  reset: () => void;
}

const initialState: FormWizardState = {
  step: 1,
  coupleDetails: {
    groomName: '',
    groomParents: '',
    brideName: '',
    brideParents: '',
  },
  eventDetails: {
    eventDate: '',
    eventTime: '09:00',
    venueName: '',
    venueAddress: '',
    schedule: [
      { id: '1', time: '08:00', label: 'Kedatangan Tamu', icon: 'clock' },
      { id: '2', time: '09:00', label: 'Akad Nikah / Pemberkatan', icon: 'heart' },
      { id: '3', time: '11:00', label: 'Sesi Foto & Ramah Tamah', icon: 'glasses' },
      { id: '4', time: '12:00', label: 'Makan Siang / Resepsi', icon: 'calendar' },
      { id: '5', time: '14:00', label: 'Acara Hiburan', icon: 'music' },
    ],
    loveStory: [
      { id: '1', year: '2020', title: 'Pertemuan Pertama', description: 'Saat pertama kali mata kami saling bertemu, dan waktu seolah berhenti berputar.' },
      { id: '2', year: '2022', title: 'Kencan Pertama', description: 'Momen berharga yang penuh dengan tawa dan menjadi awal dari kisah indah kami.' },
      { id: '3', year: '2024', title: 'Lamaran', description: 'Di bawah indahnya langit malam, komitmen suci mulai terjalin untuk melangkah bersama.' },
    ],
    digitalGifts: [],
    quotes: '',
  },
  stylePreferences: {
    tone: 'formal' as Tone,
    language: 'id' as Language,
    additionalNotes: '',
    musicUrl: '/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3',
    videoUrl: '',
    layout: 'elegant-cream' as Layout,
  },
  photoUrls: [],
  headerPhotoUrl: '',
  groomPhotoUrl: '',
  bridePhotoUrl: '',
  generatedInvitation: null,
  isGenerating: false,
  isSaving: false,
  qrEnabled: true,
  showOnboarding: true,
  activeMobileTab: 'form',
};

export const useInvitationStore = create<FormWizardState & FormWizardActions>()(
  persist(
    (set) => ({
      ...initialState,

    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
    prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

    setCoupleDetails: (coupleDetails) => set({ coupleDetails }),
    setEventDetails: (eventDetails) => set({ eventDetails }),
    setStylePreferences: (stylePreferences) => set({ stylePreferences }),

    setPhotoUrls: (photoUrls) => set({ photoUrls }),
    addPhotoUrl: (url) => set((state) => ({ photoUrls: [...state.photoUrls, url] })),
    removePhotoUrl: (url) =>
      set((state) => ({ photoUrls: state.photoUrls.filter((u) => u !== url) })),

    setHeaderPhotoUrl: (headerPhotoUrl) => set({ headerPhotoUrl }),
    setGroomPhotoUrl: (groomPhotoUrl) => set({ groomPhotoUrl }),
    setBridePhotoUrl: (bridePhotoUrl) => set({ bridePhotoUrl }),

    setGeneratedInvitation: (generatedInvitation) => set({ generatedInvitation }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setIsSaving: (isSaving) => set({ isSaving }),
    setQrEnabled: (qrEnabled) => set({ qrEnabled }),

    targetTier: 'BASIC',
    setTargetTier: (targetTier) => set({ targetTier }),
    
    dismissOnboarding: () => set({ showOnboarding: false }),
    setActiveMobileTab: (activeMobileTab) => set({ activeMobileTab }),
    loadDemoData: () => set((state) => ({
      showOnboarding: false,
      coupleDetails: {
        groomName: 'Nama Lengkap Mempelai Pria',
        groomParents: 'Bapak [Nama Bapak] & Ibu [Nama Ibu]',
        brideName: 'Nama Lengkap Mempelai Wanita',
        brideParents: 'Bapak [Nama Bapak] & Ibu [Nama Ibu]',
      },
      eventDetails: {
        ...state.eventDetails,
        eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eventTime: '09:00',
        venueName: 'Nama Gedung / Lokasi Acara',
        venueAddress: 'Alamat Lengkap Lokasi, Kota',
      },
    })),
    
    reset: () => set(initialState),
  }),
  {
    name: 'sahinaja-draft',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      step: state.step,
      coupleDetails: state.coupleDetails,
      eventDetails: state.eventDetails,
      stylePreferences: state.stylePreferences,
      photoUrls: state.photoUrls,
      headerPhotoUrl: state.headerPhotoUrl,
      groomPhotoUrl: state.groomPhotoUrl,
      bridePhotoUrl: state.bridePhotoUrl,
      generatedInvitation: state.generatedInvitation,
      qrEnabled: state.qrEnabled,
      targetTier: state.targetTier,
      showOnboarding: state.showOnboarding,
    }),
  }
)
);

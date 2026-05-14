// ============================================================
// Zustand Store — Form wizard state management
// ============================================================

import { create } from 'zustand';
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
  setGeneratedInvitation: (invitation: GeneratedInvitation | null) => void;
  setIsGenerating: (val: boolean) => void;
  setIsSaving: (val: boolean) => void;
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
      { id: '1', time: '08:00', label: 'Guest Arrival', icon: 'clock' },
      { id: '2', time: '09:00', label: 'Ceremony', icon: 'heart' },
      { id: '3', time: '11:00', label: 'Toast & Celebration', icon: 'glasses' },
      { id: '4', time: '12:00', label: 'Dinner', icon: 'calendar' },
      { id: '5', time: '14:00', label: 'Party', icon: 'music' },
    ],
    loveStory: [
      { id: '1', year: '2020', title: 'First Meet', description: 'When our eyes first met, and the world seemed to stand still.' },
      { id: '2', year: '2022', title: 'First Date', description: 'A nervous evening filled with laughter and the start of something beautiful.' },
      { id: '3', year: '2024', title: 'The Proposal', description: 'Under the starry night, I asked the most important question of my life.' },
    ],
    digitalGifts: [],
    quotes: '',
  },
  stylePreferences: {
    tone: 'formal' as Tone,
    language: 'id' as Language,
    additionalNotes: '',
    musicUrl: '',
    layout: 'elegant-cream' as Layout,
  },
  photoUrls: [],
  generatedInvitation: null,
  isGenerating: false,
  isSaving: false,
};

export const useInvitationStore = create<FormWizardState & FormWizardActions>(
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

    setGeneratedInvitation: (generatedInvitation) => set({ generatedInvitation }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setIsSaving: (isSaving) => set({ isSaving }),

    reset: () => set(initialState),
  }),
);

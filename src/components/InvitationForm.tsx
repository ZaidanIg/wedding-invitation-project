'use client';

import { useInvitationStore } from '@/store/invitation-store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { showToast } from '@/components/ui/Toast';
import {
  Heart,
  Calendar,
  MapPin,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  X,
  Upload,
  Music,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Tone, Language, Layout } from '@/types';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import InvitationPreview from '@/components/InvitationPreview';

const toneOptions = [
  { value: 'formal', label: '🎩 Formal — Elegant & Prestigious' },
  { value: 'romantic', label: '💕 Romantic — Heartfelt & Emotional' },
  { value: 'modern', label: '✨ Modern — Clean & Contemporary' },
  { value: 'playful', label: '🎉 Playful — Fun & Celebratory' },
];

const languageOptions = [
  { value: 'id', label: '🇮🇩 Bahasa Indonesia' },
  { value: 'en', label: '🇬🇧 English' },
];

const iconOptions = [
  { value: 'clock', label: 'Clock' },
  { value: 'heart', label: 'Heart' },
  { value: 'glasses', label: 'Glasses / Toast' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'music', label: 'Music' },
  { value: 'camera', label: 'Camera' },
];

const musicOptions = [
  { value: '', label: '🔇 No Music' },
  { value: 'https://cdn.pixabay.com/audio/2022/10/25/audio_22dbdcdcc8.mp3', label: '🎹 Romantic Piano (Default)' },
  { value: 'https://cdn.pixabay.com/audio/2022/11/08/audio_82c2a3e0f9.mp3', label: '🎸 Acoustic Serenade' },
  { value: 'custom', label: '🔗 Custom URL...' },
];

const layoutOptions: { value: Layout; label: string; bg: string; border: string; preview: string }[] = [
  { value: 'elegant-cream', label: 'Cream', bg: 'bg-[#f5f0eb]', border: 'border-stone-300', preview: 'bg-stone-200' },
  { value: 'royal-blue', label: 'Royal Blue', bg: 'bg-[#e8f0fe]', border: 'border-blue-300', preview: 'bg-blue-200' },
  { value: 'rose-garden', label: 'Rose Garden', bg: 'bg-[#fdf2f4]', border: 'border-pink-300', preview: 'bg-pink-200' },
  { value: 'golden-classic', label: 'Golden Classic', bg: 'bg-white', border: 'border-[#D4AF37]', preview: 'bg-[#D4AF37]/20' },
];

const steps = [
  { number: 1, title: 'Couple', icon: Heart },
  { number: 2, title: 'Event', icon: Calendar },
  { number: 3, title: 'Photos', icon: Camera },
  { number: 4, title: 'Style', icon: Palette },
  { number: 5, title: 'Preview', icon: Sparkles },
];

export default function InvitationForm() {
  const store = useInvitationStore();
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (session === null) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleGenerate = async () => {
    store.setIsGenerating(true);

    try {
      const response = await fetch('/api/invitations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store.coupleDetails,
          ...store.eventDetails,
          ...store.stylePreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      store.setGeneratedInvitation(data.data);
      store.nextStep();
      showToast('success', 'Invitation text generated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      showToast('error', message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!store.generatedInvitation) return;

    store.setIsSaving(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store.coupleDetails,
          ...store.eventDetails,
          ...store.generatedInvitation,
          photoUrls: store.photoUrls,
          tone: store.stylePreferences.tone,
          language: store.stylePreferences.language,
          layout: store.stylePreferences.layout,
          musicUrl: store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      showToast('success', 'Invitation saved! Redirecting...');

      // Redirect to the invitation page
      setTimeout(() => {
        window.location.href = `/invitation/${data.data.slug}`;
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      showToast('error', message);
    } finally {
      store.setIsSaving(false);
    }
  };

  const canProceedStep1 =
    store.coupleDetails.groomName.trim().length >= 2 && store.coupleDetails.brideName.trim().length >= 2;
  const canProceedStep2 =
    store.eventDetails.eventDate &&
    store.eventDetails.eventTime &&
    store.eventDetails.venueName.trim().length >= 2 &&
    store.eventDetails.venueAddress.trim().length >= 5;

  if (!session) return null;

  // Build a mock invitation for the live preview in Step 5
  const mockInvitation = {
    ...store.coupleDetails,
    ...store.eventDetails,
    ...store.generatedInvitation,
    photoUrls: store.photoUrls,
    tone: store.stylePreferences.tone,
    language: store.stylePreferences.language,
    layout: store.stylePreferences.layout,
    musicUrl: store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl,
    id: 'preview',
    slug: 'preview',
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                ${store.step >= s.number
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'bg-white/5 text-foreground/30 border border-white/5'}
              `}
            >
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-10 h-px mx-1 transition-colors duration-300 ${store.step > s.number ? 'bg-rose-500/40' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Couple Details */}
      {store.step === 1 && (
        <Card className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-rose-500/10 mb-3">
              <Heart className="h-6 w-6 text-rose-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">The Happy Couple</h2>
            <p className="text-sm text-foreground/40 mt-1">Tell us about the bride and groom</p>
          </div>

          <div className="space-y-5">
            <Input
              label="Groom's Name"
              placeholder="e.g., Ahmad Rizky"
              value={store.coupleDetails.groomName}
              onChange={(e) =>
                store.setCoupleDetails({ ...store.coupleDetails, groomName: e.target.value })
              }
            />
            <Input
              label="Bride's Name"
              placeholder="e.g., Siti Nurhaliza"
              value={store.coupleDetails.brideName}
              onChange={(e) =>
                store.setCoupleDetails({ ...store.coupleDetails, brideName: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={() => store.nextStep()} disabled={!canProceedStep1} size="lg">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Event Details */}
      {store.step === 2 && (
        <Card className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-violet-500/10 mb-3">
              <Calendar className="h-6 w-6 text-violet-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">Event Details</h2>
            <p className="text-sm text-foreground/40 mt-1">When and where is the celebration?</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Event Date"
                type="date"
                value={store.eventDetails.eventDate}
                onChange={(e) =>
                  store.setEventDetails({ ...store.eventDetails, eventDate: e.target.value })
                }
              />
              <Input
                label="Event Time"
                type="time"
                value={store.eventDetails.eventTime}
                onChange={(e) =>
                  store.setEventDetails({ ...store.eventDetails, eventTime: e.target.value })
                }
              />
            </div>
            <Input
              label="Venue Name"
              placeholder="e.g., The Grand Ballroom"
              value={store.eventDetails.venueName}
              onChange={(e) =>
                store.setEventDetails({ ...store.eventDetails, venueName: e.target.value })
              }
            />
            <Textarea
              label="Venue Address"
              placeholder="e.g., Jl. Gatot Subroto No. 123, Jakarta Selatan"
              rows={2}
              value={store.eventDetails.venueAddress}
              onChange={(e) =>
                store.setEventDetails({ ...store.eventDetails, venueAddress: e.target.value })
              }
            />

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Event Schedule</h3>
                  <p className="text-xs text-foreground/40 mt-1">Define the itinerary for your wedding</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    store.setEventDetails({
                      ...store.eventDetails,
                      schedule: [
                        ...store.eventDetails.schedule,
                        { id: Date.now().toString(), time: '', label: '', icon: 'heart' },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              <div className="space-y-3">
                {store.eventDetails.schedule.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <Input
                      label="Time"
                      type="time"
                      value={item.time}
                      onChange={(e) => {
                        const newSchedule = [...store.eventDetails.schedule];
                        newSchedule[index].time = e.target.value;
                        store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                      }}
                    />
                    <Input
                      label="Event Label"
                      placeholder="e.g., Ceremony"
                      value={item.label}
                      onChange={(e) => {
                        const newSchedule = [...store.eventDetails.schedule];
                        newSchedule[index].label = e.target.value;
                        store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                      }}
                    />
                    <div className="w-full sm:w-32">
                      <Select
                        label="Icon"
                        options={iconOptions}
                        value={item.icon}
                        onChange={(e) => {
                          const newSchedule = [...store.eventDetails.schedule];
                          newSchedule[index].icon = e.target.value;
                          store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                        }}
                      />
                    </div>
                    <button
                      className="mt-6 p-2 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-colors shrink-0"
                      onClick={() => {
                        const newSchedule = store.eventDetails.schedule.filter((_, i) => i !== index);
                        store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => store.prevStep()}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => store.nextStep()} disabled={!canProceedStep2} size="lg">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Photo Upload */}
      {store.step === 3 && (
        <Card className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 mb-3">
              <Camera className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">Photo Gallery</h2>
            <p className="text-sm text-foreground/40 mt-1">Upload your beautiful moments (optional, max 8 photos)</p>
          </div>

          {/* UploadThing Dropzone */}
          {store.photoUrls.length < 8 && (
            <UploadDropzone
              endpoint="weddingPhotos"
              onClientUploadComplete={(res) => {
                if (res) {
                  res.forEach((file) => {
                    store.addPhotoUrl(file.ufsUrl);
                  });
                  showToast('success', `${res.length} photo(s) uploaded!`);
                }
              }}
              onUploadError={(error: Error) => {
                showToast('error', error.message || 'Upload failed');
              }}
              config={{ mode: 'auto' }}
              appearance={{
                container: 'border-2 border-dashed border-white/15 rounded-2xl bg-white/5 p-8 hover:border-rose-400/40 hover:bg-rose-500/5 transition-all duration-300 cursor-pointer',
                label: 'text-foreground/70 text-sm font-medium hover:text-rose-400 transition-colors',
                allowedContent: 'text-foreground/30 text-xs',
                button: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium rounded-xl px-4 py-2 ut-uploading:bg-rose-500/50',
                uploadIcon: 'text-foreground/30 h-10 w-10',
              }}
            />
          )}

          {/* Uploaded Photos Preview */}
          {store.photoUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {store.photoUrls.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => store.removePhotoUrl(url)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => store.prevStep()}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => store.nextStep()} size="lg">
              {store.photoUrls.length === 0 ? 'Skip' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Style Preferences */}
      {store.step === 4 && (
        <Card className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-amber-500/10 mb-3">
              <Palette className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">Style & Tone</h2>
            <p className="text-sm text-foreground/40 mt-1">How should your invitation feel?</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <label className="block text-xs font-medium text-foreground/70 uppercase tracking-widest">
                Visual Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {layoutOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      store.setStylePreferences({
                        ...store.stylePreferences,
                        layout: opt.value,
                      })
                    }
                    className={`
                      relative p-3 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 overflow-hidden
                      ${store.stylePreferences.layout === opt.value ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-background scale-[0.98]' : 'hover:scale-[1.02] opacity-80 hover:opacity-100 ring-1 ring-white/10'}
                    `}
                  >
                    <div className={`absolute inset-0 ${opt.bg} opacity-20`} />
                    <div className={`w-10 h-14 rounded shadow-sm border ${opt.bg} ${opt.border} flex flex-col items-center justify-between p-1 z-10`}>
                      <div className={`w-5 h-5 rounded-full ${opt.preview} mt-1`} />
                      <div className={`w-6 h-1 ${opt.preview} rounded`} />
                    </div>
                    <span className="text-xs font-medium text-foreground relative z-10">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Invitation Tone"
              options={toneOptions}
              value={store.stylePreferences.tone}
              onChange={(e) =>
                store.setStylePreferences({
                  ...store.stylePreferences,
                  tone: e.target.value as Tone,
                })
              }
            />
            <Select
              label="Language"
              options={languageOptions}
              value={store.stylePreferences.language}
              onChange={(e) =>
                store.setStylePreferences({
                  ...store.stylePreferences,
                  language: e.target.value as Language,
                })
              }
            />
            <Select
              label="Background Music"
              options={musicOptions}
              value={
                musicOptions.some((opt) => opt.value === store.stylePreferences.musicUrl)
                  ? store.stylePreferences.musicUrl || ''
                  : 'custom'
              }
              onChange={(e) =>
                store.setStylePreferences({
                  ...store.stylePreferences,
                  musicUrl: e.target.value,
                })
              }
            />

            {(store.stylePreferences.musicUrl === 'custom' ||
              (!musicOptions.some((opt) => opt.value === store.stylePreferences.musicUrl) &&
                store.stylePreferences.musicUrl !== '')) && (
              <Input
                label="Custom Audio URL (.mp3, .wav)"
                placeholder="https://example.com/song.mp3"
                value={store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl}
                onChange={(e) =>
                  store.setStylePreferences({
                    ...store.stylePreferences,
                    musicUrl: e.target.value,
                  })
                }
              />
            )}

            <Textarea
              label="Additional Notes (Optional)"
              placeholder="Any special requests? E.g., mention a Quranic verse, include a specific quote, mention dress code..."
              rows={3}
              value={store.stylePreferences.additionalNotes}
              onChange={(e) =>
                store.setStylePreferences({
                  ...store.stylePreferences,
                  additionalNotes: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => store.prevStep()}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              isLoading={store.isGenerating}
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              {store.isGenerating ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Preview & Save */}
      {store.step === 5 && store.generatedInvitation && (
        <div className="space-y-6 animate-fade-in">
          {/* Live Mobile Preview */}
          <div className="bg-stone-900/5 p-4 sm:p-6 rounded-3xl border border-border/50">
            <div className="mx-auto max-w-[375px] w-full h-[700px] rounded-[2rem] overflow-hidden border-[6px] sm:border-[8px] border-stone-800 shadow-2xl relative bg-background ring-1 ring-white/10">
              {/* Fake mobile notch */}
              <div className="absolute top-0 inset-x-0 h-6 z-50 flex justify-center">
                <div className="w-24 h-4 bg-stone-800 rounded-b-xl" />
              </div>
              
              {/* The actual layout preview */}
              <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                <InvitationPreview invitation={mockInvitation} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button variant="ghost" onClick={() => store.setStep(4)}>
              <ChevronLeft className="h-4 w-4" />
              Edit Preferences
            </Button>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleGenerate}
                isLoading={store.isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                Regenerate
              </Button>
              <Button
                onClick={handleSave}
                isLoading={store.isSaving}
                size="lg"
              >
                <Heart className="h-4 w-4" />
                Save & Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

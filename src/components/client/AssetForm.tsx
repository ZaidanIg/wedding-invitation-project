"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { upsertClientInvitation, updateProjectSetting } from '@/actions/invitation';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, ShieldCheck, Heart, Sparkles, QrCode, Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueAddress: z.string().min(1, "Venue address is required"),
  photoUrls: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AssetForm({
  initialData,
  isDiyProject = true,
  projectSettings = { isWhiteLabel: false, hasQrScanner: false, projectId: '' }
}: {
  initialData?: (Partial<FormValues> & { id?: string; tier?: string }) | null;
  isDiyProject?: boolean;
  projectSettings?: {
    isWhiteLabel: boolean;
    hasQrScanner: boolean;
    projectId: string;
  };
}) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(initialData?.photoUrls || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const [isWhiteLabelActive, setIsWhiteLabelActive] = useState(projectSettings?.isWhiteLabel ?? false);
  const [hasQrScannerActive, setHasQrScannerActive] = useState(projectSettings?.hasQrScanner ?? false);
  const [isToggling, setIsToggling] = useState<'isWhiteLabel' | 'hasQrScanner' | null>(null);

  // Checks if features are unlocked for DIY clients
  const isWhiteLabelUnlocked = isDiyProject
    ? (initialData?.tier === 'PREMIUM' || initialData?.tier === 'ULTIMATE' || projectSettings?.isWhiteLabel === true)
    : (projectSettings?.isWhiteLabel === true);

  const isQrScannerUnlocked = isDiyProject
    ? (initialData?.tier === 'ULTIMATE' || projectSettings?.hasQrScanner === true)
    : (projectSettings?.hasQrScanner === true);

  const handleToggleSetting = async (setting: 'isWhiteLabel' | 'hasQrScanner') => {
    setIsToggling(setting);
    setErrorMsg(null);
    setSuccessMsg(null);
    const currentValue = setting === 'isWhiteLabel' ? isWhiteLabelActive : hasQrScannerActive;
    const newValue = !currentValue;

    try {
      const res = await updateProjectSetting({ setting, value: newValue });
      if (res.success) {
        if (setting === 'isWhiteLabel') {
          setIsWhiteLabelActive(newValue);
        } else {
          setHasQrScannerActive(newValue);
        }
        setSuccessMsg("Berhasil memperbarui pengaturan!");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Gagal memperbarui pengaturan");
      }
    } catch (err) {
      setErrorMsg("Gagal melakukan aksi. Silakan coba lagi.");
    } finally {
      setIsToggling(null);
    }
  };

  const handleBuyFeature = (plan: 'PREMIUM' | 'ULTIMATE') => {
    if (!initialData?.id) {
      setErrorMsg("Harap simpan detail undangan terlebih dahulu sebelum melakukan pembelian.");
      return;
    }
    router.push(`/checkout?plan=${plan}&invitationId=${initialData.id}`);
  };


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { startUpload } = useUploadThing("weddingPhotos", {
    onUploadBegin: () => {
      setIsUploading(true);
      setNotification(null);
    },
    onClientUploadComplete: (res) => {
      if (!res || res.length === 0) {
        setIsUploading(false);
        return;
      }

      const newUrls = res.map((file) => file.url);

      setUploadedPhotos((prev) => {
        const updated = [...prev, ...newUrls];
        setValue('photoUrls', updated, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        return updated;
      });

      setNotification({
        type: 'success',
        message: `Berhasil mengunggah ${res.length} foto pre-wedding!`
      });
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      setNotification({
        type: 'error',
        message: `Gagal mengunggah foto: ${error.message}`
      });
      setIsUploading(false);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        setNotification({
          type: 'error',
          message: "Hanya file gambar (PNG, JPG, JPEG) yang diperbolehkan."
        });
        return;
      }
      try {
        await startUpload(imageFiles);
      } catch (err) {
        setNotification({
          type: 'error',
          message: `Kesalahan unggah: ${err instanceof Error ? err.message : String(err)}`
        });
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      await startUpload(files);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Kesalahan unggah: ${err instanceof Error ? err.message : String(err)}`
      });
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: initialData?.brideName || '',
      groomName: initialData?.groomName || '',
      eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : '',
      venueName: initialData?.venueName || '',
      venueAddress: initialData?.venueAddress || '',
      photoUrls: initialData?.photoUrls || [],
    }
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      data.photoUrls = uploadedPhotos;
      const res = await upsertClientInvitation(data);
      if (res.success) {
        setSuccessMsg("Your wedding details have been successfully saved!");
        router.refresh();
      } else {
        setErrorMsg(res.message || (res as any).error || "An error occurred");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#f0ebe1] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[#f0ebe1]">
        <h2 className="text-2xl font-semibold font-display text-[#2c2a29]">Wedding Details</h2>
        <p className="text-[#8c8885] mt-1 text-sm">Please fill in your event information. These details will be used for your digital invitation.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-lg flex items-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#4a4745]">Bride's Name</label>
            <input
              {...register('brideName')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
              placeholder="e.g. Nama Mempelai Wanita"
            />
            {errors.brideName && <p className="text-xs text-red-500">{errors.brideName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#4a4745]">Groom's Name</label>
            <input
              {...register('groomName')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
              placeholder="e.g. Nama Mempelai Pria"
            />
            {errors.groomName && <p className="text-xs text-red-500">{errors.groomName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4a4745]">Event Date</label>
          <input
            type="date"
            {...register('eventDate')}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
          />
          {errors.eventDate && <p className="text-xs text-red-500">{errors.eventDate.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#4a4745]">Venue Name</label>
            <input
              {...register('venueName')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
              placeholder="e.g. The Grand Ballroom"
            />
            {errors.venueName && <p className="text-xs text-red-500">{errors.venueName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#4a4745]">Venue Address</label>
            <input
              {...register('venueAddress')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
              placeholder="e.g. 123 Wedding Lane, City"
            />
            {errors.venueAddress && <p className="text-xs text-red-500">{errors.venueAddress.message}</p>}
          </div>
        </div>
      </form>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-[#2c2a29] rounded-lg hover:bg-[#1a1918] focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Save Details'}
        </button>
      </div>

      {/* Photo Gallery - Isolated outside <form> to prevent default button submission behavior */}
      <div className="p-6 md:p-8 pt-0 border-t border-[#f0ebe1]">
        <h3 className="text-lg font-medium text-[#2c2a29] mb-4">Photo Gallery</h3>
        <div className="mb-4 space-y-4">
          <p className="text-sm text-[#8c8885]">Upload pre-wedding photos for your invitation gallery.</p>

          {isMounted ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer text-center group ${
                isDragActive
                  ? "border-rose-400 bg-rose-50/30 scale-[1.01]"
                  : isUploading
                  ? "border-[#e8e4db] bg-[#faf8f5] cursor-not-allowed"
                  : "border-[#e8e4db] bg-white hover:border-rose-300 hover:bg-rose-50/10 hover:shadow-sm hover:shadow-rose-100/10"
              }`}
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className={`p-4 rounded-full transition-all duration-300 ${
                  isDragActive
                    ? "bg-rose-100 text-rose-500 scale-110"
                    : isUploading
                    ? "bg-[#faf8f5] text-[#8c8885]"
                    : "bg-[#faf8f5] text-rose-400 group-hover:scale-110 group-hover:bg-rose-50 group-hover:text-rose-500"
                }`}>
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#2c2a29]">
                    {isUploading ? "Mengunggah foto..." : "Tarik & Lepas Foto Pre-Wedding"}
                  </p>
                  <p className="text-xs text-[#8c8885]">
                    {isUploading ? "Harap tunggu beberapa saat" : "atau klik untuk memilih file dari komputer Anda"}
                  </p>
                  <p className="text-[10px] text-[#b87d4b] font-medium mt-1.5">
                    Mendukung format PNG, JPG, JPEG (Maks. 4MB per file)
                  </p>
                </div>
              </div>

              {/* Progress bar visual indicator when uploading */}
              {isUploading && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f0ebe1] rounded-b-2xl overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 animate-pulse w-full" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#e8e4db] rounded-2xl bg-[#faf8f5]">
              <Loader2 className="w-6 h-6 animate-spin text-[#8c8885] mb-2" />
              <p className="text-xs text-[#8c8885]">Memuat area unggah...</p>
            </div>
          )}
        </div>



        {uploadedPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {uploadedPhotos.map((url, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#e8e4db] group">
                <img src={url} alt={`Gallery ${idx + 1}`} className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => {
                    const updated = uploadedPhotos.filter((_, i) => i !== idx);
                    setUploadedPhotos(updated);
                    setValue('photoUrls', updated, { shouldValidate: true });
                  }}
                  className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fitur & Pengaturan Tambahan */}
      <div className="p-6 md:p-8 pt-0 border-t border-[#f0ebe1] space-y-6">
        <div>
          <h3 className="text-lg font-semibold font-display text-[#2c2a29]">Fitur & Pengaturan Tambahan</h3>
          <p className="text-sm text-[#8c8885] mt-1">
            Kelola fitur premium undangan pernikahan digital Anda di bawah ini.
          </p>
        </div>

        <div className="space-y-4">
          {/* Watermark Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#f0ebe1] bg-[#fafaf9] gap-4 transition-all hover:shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#2c2a29]">Hilangkan Watermark (White Label)</h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                    Premium Feature
                  </span>
                </div>
                <p className="text-xs text-[#8c8885] max-w-xl">
                  Hapus logo dan branding "Sahinaja" di bagian paling bawah halaman undangan digital Anda untuk tampilan yang lebih personal dan eksklusif.
                </p>

                {/* Custom Note or Switch explanation */}
                {!isDiyProject && (
                  <p className="text-xs text-[#b87d4b] font-medium mt-1">
                    * Fitur ini dikelola secara eksklusif oleh Wedding Organizer Anda.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center sm:self-center self-end">
              {isDiyProject ? (
                isWhiteLabelUnlocked ? (
                  <button
                    type="button"
                    disabled={isToggling === 'isWhiteLabel'}
                    onClick={() => handleToggleSetting('isWhiteLabel')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${isWhiteLabelActive ? 'bg-[#2c2a29]' : 'bg-[#e8e4db]'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isWhiteLabelActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-[#8c8885] font-medium">Beli Paket seharga Rp 149.000 untuk membuka</span>
                    <button
                      type="button"
                      onClick={() => handleBuyFeature('PREMIUM')}
                      className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                    >
                      Upgrade Sekarang
                    </button>
                  </div>
                )
              ) : (
                /* Non-DIY (Real WO Client) Toggle */
                <button
                  type="button"
                  disabled={true}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-not-allowed ${isWhiteLabelActive ? 'bg-[#2c2a29]/50' : 'bg-[#e8e4db]/50'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isWhiteLabelActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* QR Scanner Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#f0ebe1] bg-[#fafaf9] gap-4 transition-all hover:shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-lg">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#2c2a29]">Check-in QR Code & Scanner</h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                    Ultimate Feature
                  </span>
                </div>
                <p className="text-xs text-[#8c8885] max-w-xl">
                  Gunakan QR Code unik untuk setiap tamu undangan Anda. Lakukan check-in tamu secara praktis di venue acara menggunakan scanner digital internal Sahinaja.
                </p>

                {/* Custom Note or Switch explanation */}
                {!isDiyProject && (
                  <p className="text-xs text-[#b87d4b] font-medium mt-1">
                    * Fitur ini dikelola secara eksklusif oleh Wedding Organizer Anda.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center sm:self-center self-end">
              {isDiyProject ? (
                isQrScannerUnlocked ? (
                  <button
                    type="button"
                    disabled={isToggling === 'hasQrScanner'}
                    onClick={() => handleToggleSetting('hasQrScanner')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${hasQrScannerActive ? 'bg-[#2c2a29]' : 'bg-[#e8e4db]'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasQrScannerActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-[#8c8885] font-medium">Beli Paket seharga Rp 149.000 untuk membuka</span>
                    <button
                      type="button"
                      onClick={() => handleBuyFeature('ULTIMATE')}
                      className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                    >
                      Upgrade Sekarang
                    </button>
                  </div>
                )
              ) : (
                /* Non-DIY (Real WO Client) Toggle */
                <button
                  type="button"
                  disabled={true}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-not-allowed ${hasQrScannerActive ? 'bg-[#2c2a29]/50' : 'bg-[#e8e4db]/50'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasQrScannerActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Notification Modal/Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
          >
            <div className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-white/90 border-emerald-100 text-[#2c2a29] shadow-emerald-100/30'
                : 'bg-white/90 border-rose-100 text-[#2c2a29] shadow-rose-100/30'
            }`}>
              {/* Icon Container */}
              <div className={`p-2 rounded-xl shrink-0 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-500'
                  : 'bg-rose-50 text-rose-500'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>

              {/* Message Block */}
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-sm">
                  {notification.type === 'success' ? 'Upload Berhasil' : 'Upload Gagal'}
                </h4>
                <p className="text-xs text-[#8c8885] leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

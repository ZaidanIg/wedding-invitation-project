'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import Button from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Camera, CameraOff } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function RsvpScannerPage() {
  const params = useParams<{ coupleNames: string; slug: string }>();
  const router = useRouter();
  const [scanResult, setScanResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Check if secure context for camera access
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    if (!isHttps && !isLocalhost) {
      setIsSecure(false);
      setCameraError("Akses kamera ditolak. Kamera hanya dapat diakses melalui koneksi aman (HTTPS). Silakan beralih ke HTTPS untuk menggunakan scanner.");
      return;
    }

    // Instantiate Html5Qrcode directly
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    let isScanning = false;

    const startScanning = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.8;
              return { width: size, height: size };
            },
            aspectRatio: 1.0
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // silent fail for frames
          }
        );
        isScanning = true;
        setCameraError(null);
      } catch (err) {
        console.warn("Failed back camera, trying user/any camera", err);
        try {
          await html5QrCode.start(
            { facingMode: "user" },
            {
              fps: 10,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.8;
                return { width: size, height: size };
              },
              aspectRatio: 1.0
            },
            (decodedText) => {
              onScanSuccess(decodedText);
            },
            (errorMessage) => {}
          );
          isScanning = true;
          setCameraError(null);
        } catch (fallbackErr) {
          console.error("Camera permissions / devices error:", fallbackErr);
          setCameraError("Kamera tidak dapat diakses. Silakan berikan izin kamera pada browser Anda untuk menggunakan fitur ini.");
        }
      }
    };

    startScanning();

    return () => {
      const stopScanner = async () => {
        if (isScanning && scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch (e) {
            console.error("Error stopping scanner:", e);
          }
        }
      };
      stopScanner();
    };
  }, [params.slug]);

  async function onScanSuccess(decodedText: string) {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    setScanResult(null);

    // Vibrate to acknowledge scan
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(150);
    }

    try {
      const res = await fetch(`/api/invitations/${params.slug}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: decodedText }),
      });

      if (res.status === 401) {
        setScanResult({
          success: false,
          message: 'Akses Ditolak',
          details: 'Silakan login sebagai pemilik undangan terlebih dahulu di browser ini.'
        });
        showToast('error', 'Akses ditolak. Silakan login.');
        return;
      }

      const data = await res.json();

      if (data.success) {
        setScanResult({
          success: true,
          guest: data.data,
          message: 'Check-in Berhasil!'
        });
        showToast('success', `Check-in berhasil: ${data.data.name}`);
      } else {
        setScanResult({
          success: false,
          message: data.message || 'Check-in Gagal'
        });
        showToast('error', data.message || 'Gagal melakukan check-in');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setScanResult({
        success: false,
        message: 'Kesalahan Server. Silakan scan ulang.'
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const resetScan = async () => {
    isProcessingRef.current = false;
    setScanResult(null);
  };

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-12 px-4 pt-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 4%; }
          50% { top: 96%; }
          100% { top: 4%; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan 2.2s infinite ease-in-out;
        }
        #reader {
          background-color: black !important;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}} />

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/invitation/${params.coupleNames}/${params.slug}/rsvp`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold text-[#1c1c1c]">QR Check-in</h1>
            <p className="text-xs text-[#6b6b6b]">Scan QR Code Tamu</p>
          </div>
        </div>

        {/* Scanner Container */}
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] overflow-hidden shadow-xl mb-8 relative">
          
          {/* Active scanning viewport */}
          {!scanResult && !isProcessing && (
            <div className="p-10 flex flex-col items-center justify-center bg-stone-50 border-b border-stone-100">
              <div className="relative w-[280px] h-[280px] mx-auto rounded-[2rem] overflow-hidden border-4 border-[#d4af37] bg-black shadow-2xl">
                <div id="reader" className="w-full h-full"></div>
                
                {/* Glowing red scanner beam */}
                {!cameraError && (
                  <div className="absolute left-0 right-0 h-1.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-scan-line z-20 pointer-events-none" />
                )}
                
                {/* Target corners inside frame */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#d4af37] rounded-tl-lg pointer-events-none z-10" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#d4af37] rounded-tr-lg pointer-events-none z-10" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#d4af37] rounded-bl-lg pointer-events-none z-10" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#d4af37] rounded-br-lg pointer-events-none z-10" />
              </div>
              
              {cameraError && (
                <div className="mt-6 flex flex-col items-center text-center p-4 bg-red-55 rounded-2xl border border-red-100 max-w-[280px]">
                  <CameraOff className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-[11px] text-red-600 font-semibold">{cameraError}</p>
                  {!isSecure ? (
                    <Button 
                      onClick={() => {
                        window.location.protocol = 'https:';
                      }} 
                      size="sm" 
                      className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      Beralih ke HTTPS
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => window.location.reload()} 
                      size="sm" 
                      className="mt-3 bg-red-600 text-white font-bold"
                    >
                      Muat Ulang Halaman
                    </Button>
                  )}
                </div>
              )}

              {!cameraError && (
                <div className="mt-6 flex items-center gap-2 text-stone-500">
                  <Camera className="h-4 w-4 text-[#d4af37] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Kamera Sedang Aktif</span>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="p-16 text-center flex flex-col items-center gap-4 bg-stone-50">
              <RefreshCw className="h-12 w-12 text-[#d4af37] animate-spin" />
              <h3 className="font-display font-bold text-lg text-stone-800">Menyinkronkan Kehadiran...</h3>
              <p className="text-xs text-stone-400 max-w-[200px] mx-auto">Sistem sedang mencatat check-in tamu ke database.</p>
            </div>
          )}

          {scanResult && (
            <div className={`p-10 text-center animate-fade-in ${scanResult.success ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="flex justify-center mb-6">
                {scanResult.success ? (
                  <CheckCircle2 className="h-20 w-20 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-20 w-20 text-red-500" />
                )}
              </div>
              
              <h2 className={`text-3xl font-display font-bold mb-3 ${scanResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                {scanResult.message}
              </h2>
              
              {scanResult.details && (
                <p className="text-sm text-red-600/80 mb-6 max-w-xs mx-auto">
                  {scanResult.details}
                </p>
              )}
              
              {scanResult.success && scanResult.guest && (
                <div className="mb-8 p-6 bg-white border border-emerald-100/50 rounded-2xl shadow-sm inline-block w-full max-w-sm">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Nama Tamu</p>
                  <p className="text-emerald-900 font-bold text-xl">{scanResult.guest.name}</p>
                  <div className="h-px bg-emerald-50 my-3" />
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Kategori</p>
                  <p className="text-emerald-700 font-bold text-base">
                    {scanResult.guest.isVip ? 'VIP' : 'Biasa'}
                  </p>
                  <div className="h-px bg-emerald-50 my-3" />
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Jumlah Hadir</p>
                  <p className="text-emerald-700 font-bold text-base">{scanResult.guest.attendees} Orang</p>
                </div>
              )}
              
              <Button 
                onClick={resetScan} 
                className={`w-full rounded-2xl py-4 font-bold ${scanResult.success ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'} shadow-md`}
              >
                Scan Berikutnya
              </Button>
            </div>
          )}
        </div>

        <div className="text-center p-6 bg-amber-50/50 rounded-3xl border border-amber-100/40">
           <p className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] mb-2">Petunjuk Penggunaan</p>
           <p className="text-xs text-stone-600/75 leading-relaxed">
             Arahkan kamera ke QR Code check-in yang didapatkan oleh tamu setelah melakukan konfirmasi RSVP. 
             Sistem secara instan akan memvalidasi kehadiran dan memperbarui manifes tamu secara real-time.
           </p>
        </div>
      </div>
    </section>
  );
}

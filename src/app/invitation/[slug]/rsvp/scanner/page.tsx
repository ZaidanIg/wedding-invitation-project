'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Button from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function RsvpScannerPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [scanResult, setScanResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      'reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error('Failed to clear scanner', e));
      }
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setScanResult(null);

    try {
      // Assuming decodedText is the Guest ID
      const res = await fetch(`/api/invitations/${params.slug}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: decodedText }),
      });

      const data = await res.json();

      if (data.success) {
        setScanResult({
          success: true,
          guest: data.data,
          message: 'Check-in Berhasil!'
        });
        showToast('success', `Check-in berhasil: ${data.data.name}`);
        
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
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
        message: 'Kesalahan Server'
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function onScanFailure(error: any) {
    // Too many failures on every frame, just ignore
    // console.warn(`Code scan error = ${error}`);
  }

  const resetScan = () => {
    setScanResult(null);
  };

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-12 px-4 pt-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/invitation/${params.slug}/rsvp`}>
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
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] overflow-hidden shadow-xl mb-8">
          <div id="reader" className="w-full"></div>
          
          {isProcessing && (
            <div className="p-10 text-center flex flex-col items-center gap-4 bg-[#fcfbf8]">
              <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
              <p className="font-bold text-[#1c1c1c]">Memproses...</p>
            </div>
          )}

          {scanResult && (
            <div className={`p-10 text-center animate-fade-in ${scanResult.success ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="flex justify-center mb-6">
                {scanResult.success ? (
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <h2 className={`text-2xl font-display font-bold mb-2 ${scanResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                {scanResult.message}
              </h2>
              
              {scanResult.success && scanResult.guest && (
                <div className="mb-8">
                  <p className="text-emerald-900 font-bold text-lg">{scanResult.guest.name}</p>
                  <p className="text-emerald-700/60 text-sm">{scanResult.guest.attendees} Tamu</p>
                </div>
              )}
              
              <Button 
                onClick={resetScan} 
                className={`w-full rounded-2xl ${scanResult.success ? 'bg-emerald-500' : 'bg-red-500'} text-white font-bold py-4`}
              >
                Scan Berikutnya
              </Button>
            </div>
          )}
        </div>

        <div className="text-center p-6 bg-rose-50 rounded-3xl border border-rose-100">
           <p className="text-[10px] uppercase font-bold tracking-widest text-rose-400 mb-2">Petunjuk Penggunaan</p>
           <p className="text-xs text-rose-600/70 leading-relaxed">
             Arahkan kamera ke QR Code yang ada pada undangan digital tamu. 
             Sistem akan otomatis mengenali dan mencatat kehadiran.
           </p>
        </div>
      </div>
    </section>
  );
}

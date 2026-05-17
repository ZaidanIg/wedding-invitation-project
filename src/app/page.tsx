import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import ShowcaseSection from '@/components/ShowcaseSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialsSection from '@/components/TestimonialsSection';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-[#f7f4ed]">
      <HeroSection />
      <TestimonialsSection />
      <HowItWorks />
      <ShowcaseSection />
      <FeatureCards />
      
      {/* Footer CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/footer-bg.png"
            alt="Wedding Celebration"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1c1c1c]/90 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] md:text-[64px] font-display font-bold leading-[1.1] tracking-[-2px] text-[#fcfbf8] mb-10">
            Siap Membuat Undangan <br />
            <span className="italic font-normal text-highlight opacity-100">Impian</span> Anda Sekarang?
          </h2>
          <p className="text-[#fcfbf8]/60 mb-14 text-xl leading-[1.5] max-w-2xl mx-auto">
            Hanya butuh <span className="text-highlight font-bold">5 menit</span> untuk hasil yang mewah dan elegan. 
            Dapatkan kualitas desain premium dengan harga paling bersahabat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-lg bg-[#f7f4ed] text-[#1c1c1c] font-bold text-lg shadow-inset hover:opacity-95 transition-all hover:scale-105"
            >
              Buat Undangan Sekarang
            </Link>
            <Link
              href="/pricing"
              className="text-[#fcfbf8] font-bold text-lg hover:opacity-70 border-b-2 border-[#fcfbf8]/20 pb-1 transition-all"
            >
              Lihat Pilihan Paket
            </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[#fcfbf8]/40 font-medium tracking-wide uppercase">
            <span>Tanpa Instalasi</span>
            <span className="h-1 w-1 rounded-full bg-[#fcfbf8]/20" />
            <span>Tanpa Ribet</span>
            <span className="h-1 w-1 rounded-full bg-[#fcfbf8]/20" />
            <span>Langsung Jadi</span>
          </div>
        </div>
      </section>
    </div>
  );
}

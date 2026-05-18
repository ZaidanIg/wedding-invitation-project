import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import ShowcaseSection from '@/components/ShowcaseSection';
import HowItWorks from '@/components/HowItWorks';
// import TestimonialsSection from '@/components/TestimonialsSection';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-[#f7f4ed]">
      <HeroSection />
      {/* <TestimonialsSection /> */}
      <HowItWorks />
      <ShowcaseSection />
      <FeatureCards />
      
      {/* Footer CTA */}
      <section className="relative py-32 overflow-hidden bg-[#f4efe6]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/footer-image.jpg"
            alt="Wedding Celebration"
            fill
            className="object-cover object-center scale-x-[-1] opacity-80"
          />
          {/* Responsive warm bright linen gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4efe6]/90 via-[#f4efe6]/95 to-[#f4efe6]/60 md:bg-gradient-to-l md:from-[#f4efe6] md:via-[#f4efe6]/95 md:to-[#f4efe6]/10 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center md:justify-end">
          <div className="max-w-2xl text-center md:text-right flex flex-col items-center md:items-end w-full">
            <h2 className="text-[36px] md:text-[54px] font-display font-bold leading-[1.1] tracking-[-1px] text-[#1c1c1c] mb-8 text-center md:text-right animate-fade-in w-full">
              Siap Membuat Undangan <br />
              <span className="italic font-normal text-rose-500 opacity-100">Impian</span> Anda Sekarang?
            </h2>
            <p className="text-[#5f5f5d] mb-10 text-lg leading-[1.5] max-w-xl text-center md:text-right animate-fade-in delay-100 mx-auto md:mx-0">
              Hanya butuh <span className="text-[#1c1c1c] font-bold">5 menit</span> untuk hasil yang mewah dan elegan. 
              Dapatkan kualitas desain premium dengan harga paling bersahabat.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-end gap-4 w-full sm:w-auto animate-fade-in delay-200">
              <Link
                href="/create"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4.5 text-base font-bold rounded-2xl bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all duration-500"
              >
                Buat Undangan Sekarang
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center text-[#1c1c1c] font-bold text-base hover:text-rose-500 border-b border-[#1c1c1c]/20 hover:border-rose-500 pb-1 transition-all py-3 sm:py-0"
              >
                Lihat Pilihan Paket
              </Link>
            </div>
            <div className="mt-14 flex items-center justify-center md:justify-end gap-6 text-xs text-[#5f5f5d]/50 font-medium tracking-widest uppercase">
              <span>Tanpa Instalasi</span>
              <span className="h-1 w-1 rounded-full bg-[#1c1c1c]/10" />
              <span>Tanpa Ribet</span>
              <span className="h-1 w-1 rounded-full bg-[#1c1c1c]/10" />
              <span>Langsung Jadi</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

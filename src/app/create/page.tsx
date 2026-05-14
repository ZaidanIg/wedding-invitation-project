'use client';
import InvitationForm from '@/components/InvitationForm';
import { motion } from 'framer-motion';

export default function CreatePage() {
  return (
    <section className="min-h-screen bg-[#fcfbf8] py-24 sm:py-32 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1c1c1c 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-highlight/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-handwriting text-3xl text-highlight/60 mb-3">Langkah awal menuju...</div>
            <h1 className="text-[48px] sm:text-[72px] font-display font-bold text-[#1c1c1c] tracking-[-2px] leading-[1.1] mb-8">
              Wujudkan Undangan <br /> <span className="italic font-normal text-highlight">Impian</span> Anda
            </h1>
            <p className="text-[#5f5f5d] max-w-xl mx-auto text-lg sm:text-xl leading-[1.6]">
              Wujudkan visi pernikahan Anda dalam <span className="text-[#1c1c1c] font-semibold underline decoration-highlight/30 underline-offset-4">5 menit</span>. 
              Mewah, elegan, dan siap dibagikan.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <InvitationForm />
        </motion.div>
      </div>
    </section>
  );
}

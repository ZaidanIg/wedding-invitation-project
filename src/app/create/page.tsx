'use client';
import InvitationForm from '@/components/InvitationForm';
import { motion } from 'framer-motion';

export default function CreatePage() {
  return (
    <section className="min-h-screen bg-[#fdfcf9] py-24 sm:py-32 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none animate-float-delayed" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-handwriting text-3xl text-rose-500/40 mb-4">Langkah awal menuju...</div>
            <h1 className="text-5xl sm:text-[80px] font-display font-bold text-[#1c1c1c] tracking-tight sm:tracking-[-0.03em] leading-[1.05] mb-8 text-balance">
              Wujudkan Undangan <br /> <span className="text-rose-500 italic font-normal underline decoration-rose-500/10 underline-offset-8">Impian</span> Anda
            </h1>
            <p className="text-[#6b6b6b] max-w-xl mx-auto text-lg sm:text-xl leading-relaxed text-balance">
              Wujudkan visi pernikahan Anda dalam <span className="text-[#1c1c1c] font-semibold underline decoration-rose-500/30 underline-offset-8">5 menit</span>. 
              Mewah, elegan, dan siap memikat tamu Anda.
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

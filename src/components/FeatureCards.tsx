'use client';

import { Zap, Shield, Gift, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Selesai 5 Menit',
    description: 'Proses pembuatan yang sangat cepat dan mudah, undangan Anda siap dibagikan dalam sekejap.',
  },
  {
    icon: Shield,
    title: 'Tema Eksklusif',
    description: 'Pilihan desain premium dan elegan yang dirancang khusus untuk momen istimewa Anda.',
  },
  {
    icon: Gift,
    title: 'Kado Digital',
    description: 'Terima ucapan dan kado pernikahan secara langsung melalui rekening atau e-wallet dengan aman.',
  },
  {
    icon: Heart,
    title: 'Harga Terjangkau',
    description: 'Kualitas desain premium dengan harga yang sangat bersahabat bagi calon pengantin.',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-24 px-4 bg-[#f7f4ed]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-[#f7f4ed] border border-[#eceae4] hover:border-[#1c1c1c]/40 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c]/5 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-[#1c1c1c]" />
              </div>
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-3">{feature.title}</h3>
              <p className="text-[#5f5f5d] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

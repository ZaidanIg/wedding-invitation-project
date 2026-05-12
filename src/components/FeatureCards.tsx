import { Sparkles, Palette, Share2, ClipboardCheck } from 'lucide-react';
import Card from '@/components/ui/Card';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Text',
    description: 'Groq LLM generates beautiful, personalized invitation text tailored to your style and language preference.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Palette,
    title: 'Multiple Tones',
    description: 'Choose from formal, romantic, modern, or playful tones. Each creates a unique atmosphere for your invitation.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Share2,
    title: 'Shareable Links',
    description: 'Get a unique, beautiful link to share your invitation with guests. Track views and engagement in real-time.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Built-in RSVP',
    description: 'Guests can respond directly from the invitation. View all RSVPs in your personal dashboard.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function FeatureCards() {
  return (
    <section className="relative py-24 px-4">
      {/* Section heading */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
          Everything You Need
        </h2>
        <p className="text-foreground/40 max-w-xl mx-auto">
          From AI text generation to guest management — all in one elegant platform.
        </p>
      </div>

      {/* Feature grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} hover className="group relative overflow-hidden">
            {/* Gradient glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="relative z-10">
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

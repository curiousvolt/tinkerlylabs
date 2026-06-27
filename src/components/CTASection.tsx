import { motion } from "motion/react";

interface CTASectionProps {
  onJoinClick?: () => void;
}

export default function CTASection({ onJoinClick }: CTASectionProps) {
  return (
    <section className="relative w-full py-12 px-4 md:px-6 z-10 bg-[#F9FAF7]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto relative rounded-[2.5rem] overflow-hidden shadow-2xl py-16 md:py-20 px-6 flex flex-col items-center justify-center text-center"
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 150% 100% at 50% 100%, #6D7EA6 0%, #463473 50%, #1D1832 100%)' }}
        />

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Master AI for Your Workflow
          </h2>
          <p className="text-xs md:text-sm font-sans font-light text-white/90 max-w-md mx-auto leading-relaxed mb-8">
            Ready to turn scattered AI tools into a sharp, unified operating system? Take the first step and join the waitlist for Tinkerly Labs today.
          </p>
          <button
            onClick={onJoinClick}
            className="px-8 py-3 bg-white text-[#1D1832] font-sans font-semibold text-sm rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.15)] cursor-pointer"
          >
            Join Now
          </button>
        </div>
      </motion.div>
    </section>
  );
}


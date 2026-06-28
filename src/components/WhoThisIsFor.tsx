import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles } from "lucide-react";

const TAGS_ROW_1 = [
  "Curious Minds",
  "Students",
  "Developers",
  "Product Managers",
  "Founders",
  "Content Creators",
  "Working Professionals",
  "Career Switchers",
  "Side Project Builders",
  "Lifelong Learners"
];

const TAGS_ROW_2 = [
  "Tired of AI hype",
  "Done being fooled by LinkedIn posts",
  "Want to build but don't know where to start",
  "Sick of vague AI advice",
  "Want the honest picture",
  "Overwhelmed by too many tools",
  "Want to use AI without losing their brain",
  "Done watching others build while they scroll"
];

interface WhoThisIsForProps {
  onJoinClick?: () => void;
}

export default function WhoThisIsFor({ onJoinClick }: WhoThisIsForProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);

  const row1Doubled = [...TAGS_ROW_1, ...TAGS_ROW_1, ...TAGS_ROW_1];
  const row2Doubled = [...TAGS_ROW_2, ...TAGS_ROW_2, ...TAGS_ROW_2];

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onJoinClick) {
      onJoinClick();
    } else {
      document
        .getElementById("waitlist")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="audience"
      ref={sectionRef}
      className="py-16 relative overflow-hidden bg-[#F4F6F2] border-y border-[#96A88F]/15"
    >
      {/* Parallax Abstract Geometric Lines Background */}
      <motion.div 
        className="absolute inset-x-0 -top-[50%] -bottom-[50%] pointer-events-none z-0"
        style={{ y: backgroundY }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.35]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="geo-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Outer square borders */}
              <line x1="0" y1="0" x2="120" y2="0" stroke="#96A88F" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="120" stroke="#96A88F" strokeWidth="0.5" />
              
              {/* Intersecting center lines */}
              <line x1="60" y1="0" x2="60" y2="120" stroke="#96A88F" strokeWidth="0.5" />
              <line x1="0" y1="60" x2="120" y2="60" stroke="#96A88F" strokeWidth="0.5" />
              
              {/* Diagonal cross lines */}
              <line x1="0" y1="0" x2="120" y2="120" stroke="#96A88F" strokeWidth="0.5" />
              <line x1="120" y1="0" x2="0" y2="120" stroke="#96A88F" strokeWidth="0.5" />
              
              {/* Offset asymmetric lines to make it look abstract instead of a perfect grid */}
              <line x1="0" y1="60" x2="60" y2="0" stroke="#96A88F" strokeWidth="0.5" />
              <line x1="60" y1="120" x2="120" y2="60" stroke="#96A88F" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#geo-pattern)" />
        </svg>
        
        {/* Soft radial fade out on the edges so it doesn't look like a hard box */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_50%_at_50%_50%,transparent_30%,#F4F6F2_90%)]" />
      </motion.div>

      {/* Background radial lights */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3F513B]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Header & Authority Title Block */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-8 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono tracking-[0.25em] text-[#E39B4B] uppercase bg-[#E39B4B]/10 px-3 py-1 rounded-full border border-[#E39B4B]/20"
        >
          WHO THIS IS FOR
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-3xl sm:text-4xl md:text-6xl font-display font-extrabold tracking-tight text-[#131911] leading-tight"
        >
          For people{" "}
          <span className="text-[#E39B4B] neon-glow-text">
            allergic to average.
          </span>
        </motion.h2>

        {/* Small Yellow Join button centered below description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={handleJoinClick}
            className="group/btn relative flex items-center justify-center gap-1.5 overflow-hidden px-8 h-[3.25rem] rounded-full font-sans font-bold text-xs uppercase tracking-wider bg-[linear-gradient(110deg,#414C93_30%,#606CBA_50%,#414C93_70%)] bg-[length:300%_100%] animate-[shine_4s_linear_infinite] hover:bg-[linear-gradient(110deg,#323b75_30%,#525fa3_50%,#323b75_70%)] border border-transparent text-white shadow-[0_4px_15px_rgba(65,76,147,0.3)] hover:shadow-[0_6px_20px_rgba(65,76,147,0.4)] transition-shadow duration-300 active:scale-98 cursor-pointer outline-none focus:outline-none"
          >
            <span className="relative flex items-center justify-center overflow-hidden h-[16px] tracking-wide z-10">
              {"Join Now".split("").map((char, i) => (
                <span key={i} className="relative inline-block overflow-visible">
                  <span
                    className="inline-block transition-transform duration-300 group-hover/btn:-translate-y-[150%]"
                    style={{ transitionDelay: `${i * 15}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                  <span
                    className="absolute left-0 top-0 inline-block translate-y-[150%] transition-transform duration-300 group-hover/btn:translate-y-0"
                    style={{ transitionDelay: `${i * 15}ms` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              ))}
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-4 h-4 text-white group-hover/btn:translate-x-0.5 transition-transform duration-300 ml-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </motion.div>
      </div>

      {/* 3. Horizontal scrolling tag pills */}
      <div className="border-t border-[#96A88F]/15 pt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase">
            This is for you if
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full overflow-hidden select-none py-6 -my-6">
          {/* Row 1: Left to Right Scroll */}
          <div className="relative w-full overflow-hidden flex py-4 -my-4">
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: [0, "-33.333%"] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
            >
              {row1Doubled.map((tag, idx) => (
                <div
                  key={`r1-${tag}-${idx}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full pill-glass hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#96A88F] shadow-[0_0_8px_rgba(150,168,143,0.8)] group-hover:scale-125 transition-transform" />
                  <span className="font-mono text-xs text-zinc-800 tracking-wide">
                    {tag}
                  </span>
                </div>
              ))}
            </motion.div>
            {/* Edge gradients to blend out seamless scroll borders */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F4F6F2] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F4F6F2] to-transparent pointer-events-none z-10" />
          </div>

          {/* Row 2: Right to Left Scroll */}
          <div className="relative w-full overflow-hidden flex py-4 -my-4">
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["-33.333%", 0] }}
              transition={{
                ease: "linear",
                duration: 28,
                repeat: Infinity,
              }}
            >
              {row2Doubled.map((tag, idx) => (
                <div
                  key={`r2-${tag}-${idx}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full pill-glass hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E39B4B] group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-mono text-xs text-zinc-800 tracking-wide">
                    {tag}
                  </span>
                </div>
              ))}
            </motion.div>
            {/* Edge gradients to blend out seamless scroll borders */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F4F6F2] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F4F6F2] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, lazy, Suspense } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import CustomCursor from "./components/CustomCursor";

// Lazy-load all heavy sections — they load as the user scrolls
const AIIconFolderAnimator = lazy(() => import("./components/AIIconFolderAnimator"));
const WhatYouWillLearn     = lazy(() => import("./components/WhatYouWillLearn"));
const WhoThisIsFor         = lazy(() => import("./components/WhoThisIsFor"));
const ThreeDBackground     = lazy(() => import("./components/ThreeDBackground").then(m => ({ default: m.ThreeDBackground })));
const HyperScroll          = lazy(() => import("./components/HyperScroll"));
const FAQ                  = lazy(() => import("./components/FAQ"));
const CTASection           = lazy(() => import("./components/CTASection"));
const JoinPopup            = lazy(() => import("./components/JoinPopup"));

// Minimal section skeleton shown while lazy chunks download
const SectionFallback = () => <div className="w-full h-32" />;

export default function App() {
  const { scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setEmail(""); }, 4000);
    } catch {
      setSubmitError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;

    // Slide up (hide) only when scrolling down past 80px
    if (latest > previous && latest > 80) {
      setNavVisible(false);
    }
    // Slide down (show) when scrolling up by at least 5px, or near the top
    else if (latest < previous - 5 || latest < 20) {
      setNavVisible(true);
    }
  });

  const handleScrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      id="app-root"
      className="min-h-screen bg-[#F9FAF7] text-[#131911] selection:bg-[#E39B4B] selection:text-[#080B07] font-sans relative overflow-x-clip bg-grain"
    >
      {/* 1. Custom Trailing Liquid Glowing Cursor */}
      <CustomCursor />

      {/* Decorative backing radial light bursts - compositor-promoted layers */}
      <div className="absolute top-[3%] left-[10%] w-[500px] h-[500px] bg-[#3F513B]/10 rounded-full blur-[150px] pointer-events-none z-0" style={{ willChange: 'transform' }} />
      <div className="absolute top-[20%] right-[5%] w-[600px] h-[600px] bg-[#E39B4B]/5 rounded-full blur-[160px] pointer-events-none z-0" style={{ willChange: 'transform' }} />
      <div className="absolute bottom-[35%] left-[3%] w-[550px] h-[550px] bg-[#D07C5B]/8 rounded-full blur-[150px] pointer-events-none z-0" style={{ willChange: 'transform' }} />
      <div className="absolute bottom-[8%] right-[10%] w-[450px] h-[450px] bg-[#3F513B]/10 rounded-full blur-[130px] pointer-events-none z-0" style={{ willChange: 'transform' }} />

      {/* 2. Sticky Floating Centered Navbar */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: -120 },
        }}
        initial="visible"
        animate={navVisible ? "visible" : "hidden"}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none"
      >
        <nav className="max-w-3xl w-full mx-auto flex items-center justify-between relative bg-white/30 backdrop-blur-md backdrop-saturate-150 border border-white/40 py-2 pl-4 pr-2 md:pl-6 md:pr-3 rounded-full pointer-events-auto shadow-2xl">
          {/* Logo Brand Title (Left) */}
          <div
            className="flex items-center cursor-pointer px-2 py-1"
            onClick={(e) => handleScrollToSection("hero", e)}
          >
            <span className="font-display font-bold tracking-tight text-[#131911] text-base">
              Tinkerly Labs
            </span>
          </div>

          {/* Navigation links (Middle) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center">
            <a
              href="https://tinkerlylabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-sans font-medium text-zinc-600 hover:text-[#131911] transition-colors duration-200"
            >
              Blog
            </a>
          </div>

          {/* Join Now Button (Right) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="group/btn relative flex items-center justify-center px-5 h-8 rounded-full cursor-pointer outline-none focus:outline-none overflow-hidden bg-[#414C93] hover:bg-[#323b75] text-white shadow-[0_4px_15px_rgba(65,76,147,0.3)] hover:shadow-[0_6px_20px_rgba(65,76,147,0.4)] transition-all duration-300 border border-transparent"
            >
              {/* Text content */}
              <span className="relative flex items-center justify-center overflow-hidden h-[16px] text-white font-sans font-bold text-xs tracking-wide">
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
            </button>
          </div>
        </nav>
      </motion.header>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-4"
      >
        {/* White base to clear global bg */}
        <div className="absolute inset-0 bg-white z-0 pointer-events-none" />
        
        {/* Organic, smooth curved glows using blurred divs */}
        {/* Left Corner Curve - Increased height */}
        <div className="absolute -bottom-[20%] -left-[25%] w-[45%] h-[70%] bg-[#a3baf5] rounded-[100%] blur-[120px] opacity-85 z-0 pointer-events-none" />
        
        {/* Right Corner Curve - Increased height */}
        <div className="absolute -bottom-[20%] -right-[25%] w-[45%] h-[70%] bg-[#a3baf5] rounded-[100%] blur-[120px] opacity-85 z-0 pointer-events-none" />
        
        {/* Bottom edge intensity */}
        <div className="absolute -bottom-[15%] left-[10%] right-[10%] h-[35%] bg-[#c6b4f7] rounded-[100%] blur-[100px] opacity-50 z-0 pointer-events-none" />
        
        <Suspense fallback={<div className="absolute inset-0" />}>
          <ThreeDBackground />
        </Suspense>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center w-full">
          {/* Presenter Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#96A88F]/25 text-[10px] font-bold tracking-widest text-zinc-600 mb-6 uppercase shadow-sm"
          >
            <img src="/logo.png" alt="Tinkerly Labs" className="w-4 h-4 object-contain" />
            <span>Tinkerly Labs presents</span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto mb-6 relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="text-[1.4rem] leading-tight sm:text-4xl md:text-5xl font-serif-italic text-zinc-600 tracking-tight mb-1 sm:mb-2 opacity-90 whitespace-nowrap">
                the AI course for people who
              </span>
              <span className="relative inline-block">
                {/* Base text */}
                <span className="text-5xl sm:text-7xl md:text-[6rem] font-sans font-bold tracking-tighter leading-none text-[#131911] whitespace-nowrap">
                  Build with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E39B4B] to-[#D07C5B]">
                    AI.
                  </span>
                </span>
                {/* Shine overlay */}
                <span 
                  className="absolute left-0 top-0 w-full h-full text-5xl sm:text-7xl md:text-[6rem] font-sans font-bold tracking-tighter leading-none whitespace-nowrap text-transparent bg-clip-text pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                    backgroundSize: "300% 100%",
                    animation: "shine 4s linear infinite"
                  }}
                  aria-hidden="true"
                >
                  Build with AI.
                </span>
              </span>
            </motion.h1>

            {/* Crafted by IITians tag — sits directly under the headline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex justify-center mt-3"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-sans font-semibold tracking-widest uppercase text-[#414C93] bg-[#414C93]/8 border border-[#414C93]/20">
                <span className="text-sm leading-none">🎓</span>
                Crafted by IITians
              </span>
            </motion.div>
          </div>

          {/* Hero description label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-4 text-sm sm:text-base font-sans text-zinc-600 max-w-xl mx-auto px-4 leading-relaxed"
          >
            A premium, no-fluff course from Tinkerly Labs for turning scattered
            AI tools into one sharp creative operating system.
          </motion.p>

          {/* Floating primary Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-10 z-30 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Join the waitlist Button */}
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="group/btn relative flex items-center justify-center px-8 h-[3.25rem] rounded-full cursor-pointer outline-none focus:outline-none overflow-hidden bg-[#414C93] hover:bg-[#323b75] text-white shadow-[0_4px_15px_rgba(65,76,147,0.3)] hover:shadow-[0_6px_20px_rgba(65,76,147,0.4)] transition-all duration-300 border border-transparent gap-2.5"
            >
              <style>{`@keyframes drawMailOutline{0%,10%{stroke-dashoffset:75}40%,60%{stroke-dashoffset:0}90%,100%{stroke-dashoffset:-75}}@keyframes drawMailFlap{0%,25%{stroke-dashoffset:35}50%,60%{stroke-dashoffset:0}75%,100%{stroke-dashoffset:-35}}`}</style>
              {/* Text content */}
              <span className="relative flex items-center justify-center overflow-hidden h-[20px] text-white font-sans font-bold text-sm tracking-wide z-10">
                {"Join the waitlist".split("").map((char, i) => (
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
              
              {/* Continuous Line Animated SVG */}
              <div className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300">
                {/* Static Background Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 opacity-30">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                
                {/* Animated Foreground Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 text-white">
                  <rect width="20" height="16" x="2" y="4" rx="2" strokeDasharray="75" strokeDashoffset="75" style={{ animation: 'drawMailOutline 3.5s ease-in-out infinite' }} />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeDasharray="35" strokeDashoffset="35" style={{ animation: 'drawMailFlap 3.5s ease-in-out infinite' }} />
                </svg>
              </div>
            </button>

            {/* See what's inside Button (Glass Pill with Thin Border) */}
            <a
              href="#syllabus"
              onClick={(e) => handleScrollToSection("syllabus", e)}
              className="group/btn relative overflow-hidden px-8 h-[3.25rem] rounded-full text-sm font-sans font-bold text-[#414C93] border border-[#7D88B5]/40 bg-gradient-to-r from-white/20 to-[#7D88B5]/10 hover:from-white/30 hover:to-[#7D88B5]/20 backdrop-blur-md active:scale-98 transition-all duration-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(65,76,147,0.1),0_2px_15px_rgba(65,76,147,0.05)] inline-flex items-center justify-center cursor-pointer"
            >
              <span className="relative flex items-center justify-center overflow-hidden h-[20px] z-10">
                {"See what's inside".split("").map((char, i) => (
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
            </a>
          </motion.div>


        </div>
      </section>

      {/* Interactive scroll folder compilation animation */}
      <section className="relative w-full z-10">
        <Suspense fallback={<SectionFallback />}>
          <AIIconFolderAnimator />
        </Suspense>
      </section>

      {/* CORE SYLLABUS GRID: What you'll learn */}
      <Suspense fallback={<SectionFallback />}>
        <WhatYouWillLearn />
      </Suspense>

      {/* TARGET CLIENT SEGMENTS & CONCENTRIC AUTHORITY: Who this is for */}
      <Suspense fallback={<SectionFallback />}>
        <WhoThisIsFor onJoinClick={() => setIsJoinModalOpen(true)} />
      </Suspense>

      {/* 3D HYPER SCROLL VIEWPORT */}
      <Suspense fallback={<SectionFallback />}>
        <HyperScroll />
      </Suspense>

      {/* GRADIENT CALL TO ACTION SECTION */}
      <Suspense fallback={<SectionFallback />}>
        <CTASection onJoinClick={() => setIsJoinModalOpen(true)} />
      </Suspense>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <Suspense fallback={<SectionFallback />}>
        <FAQ />
      </Suspense>

      {/* PREMIUM MINIMALIST FOOTER */}
      <footer id="waitlist" className="py-8 border-t border-[#96A88F]/15 bg-zinc-50 relative z-10 px-6 overflow-hidden">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4 text-center">
          
          {/* 1. Brand Logo & Name (Styled like Carbon Beauty) */}
          <div className="flex flex-col items-center select-none">
            <div className="w-32 h-28 mb-2 text-[#96A88F]/80 flex items-center justify-center">
              <img src="/logo.png" alt="Tinkerly Labs" className="w-28 h-28 object-contain" />
            </div>
            <span className="font-display font-medium text-base tracking-[0.3em] text-[#131911] uppercase leading-none">
              Tinkerly
            </span>
            <span className="font-display font-light text-[9px] tracking-[0.4em] text-zinc-500 uppercase mt-2 leading-none">
              Labs
            </span>
          </div>

          {/* 2. Centered Social Icons Row with active stroke/draw hover animations */}
          <div className="flex items-center gap-6 justify-center">
            {/* Twitter/X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-10 h-10 flex items-center justify-center transition-all duration-300"
              aria-label="Twitter / X"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <path
                    d="M4 4l11.733 16h4.267l-11.733 -16z"
                    className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-in-out"
                  />
                  <path
                    d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"
                    className="[stroke-dasharray:50] [stroke-dashoffset:50] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-in-out delay-150"
                  />
                </svg>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-10 h-10 flex items-center justify-center transition-all duration-300"
              aria-label="YouTube"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon
                    points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                    fill="currentColor"
                    className="text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <path
                    d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
                    className="[stroke-dasharray:120] [stroke-dashoffset:120] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-in-out"
                  />
                  <polygon
                    points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                    fill="currentColor"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300 text-red-500"
                  />
                </svg>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-10 h-10 flex items-center justify-center transition-all duration-300"
              aria-label="Instagram"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="url(#insta-grad-footer)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute w-5 h-5 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <defs>
                    <linearGradient id="insta-grad-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f9ce34" />
                      <stop offset="50%" stopColor="#ee2a7b" />
                      <stop offset="100%" stopColor="#6228d7" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                    className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-in-out"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    className="[stroke-dasharray:50] [stroke-dashoffset:50] group-hover:[stroke-dashoffset:0] transition-all duration-700 ease-in-out delay-100"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* 3. Animated Vertical Divider Line */}
          <div className="relative w-px h-8 bg-[#96A88F]/20 overflow-hidden">
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-[#414C93] to-transparent h-[150%]"
            />
          </div>

          {/* 4. Join the Waitlist Text Section */}
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
              Join the Waitlist
            </span>

            {/* 5. Minimalist Pill-Shaped Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-3 border border-[#96A88F]/30 bg-[#96A88F]/5 text-[#96A88F] text-xs font-mono tracking-wider uppercase rounded-full"
              >
                Welcome to the waitlist.
              </motion.div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="w-full flex bg-white hover:bg-white focus-within:bg-white border border-[#96A88F]/25 focus-within:border-[#E39B4B]/40 rounded-full p-1 transition-all duration-300 shadow-[0_4px_15px_rgba(150,168,143,0.04)]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NAME@EMAIL.COM"
                  className="flex-1 bg-transparent pl-5 pr-2 py-2 text-xs text-[#131911] placeholder-zinc-400 outline-none uppercase tracking-widest font-mono rounded-full"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-[#F4F6FB]/80 hover:bg-white backdrop-blur-md border border-[#414C93]/15 text-[#414C93] font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer rounded-full outline-none focus:outline-none shadow-sm hover:shadow-[0_4px_15px_rgba(65,76,147,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin w-3.5 h-3.5 text-[#414C93]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                  ) : (
                    <>
                      <span className="relative z-10">Subscribe</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#414C93] group-hover:translate-x-0.5 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </>
                  )}
                </button>
              </form>
            )}
            {submitError && (
              <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{submitError}</p>
            )}
          </div>

          {/* 6. Simple Copyright (Centered & Clean) */}
          <div className="mt-3">
            <span className="text-[9px] font-mono text-zinc-600 tracking-[0.3em] uppercase">
              © 2026
            </span>
          </div>

        </div>
      </footer>

      {/* POPUP WAITLIST FORM */}
      <Suspense fallback={null}>
        <JoinPopup isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      </Suspense>
    </div>
  );
}

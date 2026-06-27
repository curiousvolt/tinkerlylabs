import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles, CheckCircle2 } from "lucide-react";

interface JoinPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinPopup({ isOpen, onClose }: JoinPopupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setEmail("");
      setError("");
      // Add a slight timeout to let the entrance animation start before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) { setError("PLEASE ENTER YOUR EMAIL"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("INVALID EMAIL FORMAT"); return; }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      });
      if (!res.ok) throw new Error('Failed');
      setIsSubmitted(true);
      setTimeout(() => { onClose(); }, 2500);
    } catch {
      setError('SOMETHING WENT WRONG. TRY AGAIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: "spring", damping: 25, stiffness: 350 }
            }}
            exit={{ opacity: 0, scale: 0.95, y: 15, transition: { duration: 0.2 } }}
            className="relative w-full max-w-md bg-white/95 border border-[#96A88F]/25 rounded-[2.5rem] p-9 sm:p-10 shadow-[0_20px_50px_rgba(150,168,143,0.15)] overflow-hidden z-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(150, 168, 143, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(150, 168, 143, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '16px 16px',
            }}
          >
            {/* Soft background light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#96A88F]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#E39B4B]/8 rounded-full blur-[60px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-all duration-300 cursor-pointer outline-none focus:outline-none"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E39B4B]/10 border border-[#E39B4B]/20 text-[9px] font-mono font-bold tracking-[0.2em] text-[#E39B4B] uppercase mb-6">
                    <Sparkles className="w-3 h-3 text-[#E39B4B] animate-pulse" />
                    Waitlist Access
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-[#131911] mb-3">
                    Unlock the Operating System
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mb-8 leading-relaxed font-sans">
                    Join the exclusive builder waitlist. Be the first to secure early-bird access and receive custom cohort resources.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="relative">
                      <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="NAME@EMAIL.COM"
                        className="w-full bg-[#F4F6F2]/60 hover:bg-[#F4F6F2]/85 focus:bg-white border border-[#96A88F]/30 focus:border-[#E39B4B]/60 rounded-full pl-12 pr-6 py-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none uppercase tracking-widest font-mono transition-all duration-300"
                      />
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[9px] font-mono tracking-wider text-red-500 uppercase text-left pl-2"
                        >
                          {error}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden w-full py-4 rounded-full font-sans font-semibold text-xs uppercase tracking-wider bg-[#F4F6FB]/80 hover:bg-white backdrop-blur-md border border-[#414C93]/15 text-[#414C93] shadow-sm hover:shadow-[0_4px_15px_rgba(65,76,147,0.15)] transition-all duration-300 active:scale-98 cursor-pointer outline-none focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4 text-[#414C93]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <span className="relative z-10">Submit</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#414C93] group-hover:translate-x-0.5 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase mt-6">
                    Zero spam. Only signal.
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 bg-[#96A88F]/10 border border-[#96A88F]/30 rounded-full flex items-center justify-center text-[#96A88F] mb-6 shadow-[0_4px_20px_rgba(150,168,143,0.15)]"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-2xl font-display font-extrabold tracking-tight text-[#131911] mb-3">
                    You're Locked In
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 max-w-xs leading-relaxed font-sans mb-2">
                    Thank you! We've added <span className="text-[#E39B4B] font-mono text-xs">{email.toLowerCase()}</span> to the exclusive waitlist.
                  </p>
                  
                  <p className="text-[10px] font-mono tracking-widest text-[#96A88F] uppercase">
                    TINKERLY COHORT LAUNCHES SOON
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

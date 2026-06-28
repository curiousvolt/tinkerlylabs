import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles, CheckCircle2 } from "lucide-react";

interface JoinPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinPopup({ isOpen, onClose }: JoinPopupProps) {
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true); // opted-in by default
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel close timer on unmount to prevent calling onClose on unmounted component
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setEmail("");
      setNewsletter(true);
      setError("");
      const timer = setTimeout(() => { inputRef.current?.focus(); }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("PLEASE ENTER YOUR EMAIL"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("INVALID EMAIL FORMAT"); return; }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup', newsletter }),
      });
      if (!res.ok) throw new Error('Failed');
      setIsSubmitted(true);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => { onClose(); }, 2800);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 350 } }}
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
            {/* Soft glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#96A88F]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#E39B4B]/8 rounded-full blur-[60px] pointer-events-none" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-all duration-300 cursor-pointer outline-none focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

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

                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-[#131911] mb-3">
                    Unlock the Operating System
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mb-8 leading-relaxed font-sans">
                    Join the exclusive builder waitlist. Be the first to secure early-bird access and receive custom cohort resources.
                  </p>

                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    {/* Email input */}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                        placeholder="NAME@EMAIL.COM"
                        className="w-full bg-[#F4F6F2]/60 hover:bg-[#F4F6F2]/85 focus:bg-white border border-[#96A88F]/30 focus:border-[#E39B4B]/60 rounded-full pl-11 pr-6 py-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none uppercase tracking-widest font-mono transition-all duration-300"
                      />
                    </div>

                    {/* Newsletter checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group text-left px-1">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          id="newsletter-opt-in"
                          checked={newsletter}
                          onChange={(e) => setNewsletter(e.target.checked)}
                          className="sr-only peer"
                        />
                        {/* Custom checkbox */}
                        <div className="w-4 h-4 rounded-[4px] border border-[#96A88F]/40 bg-white peer-checked:bg-[#414C93] peer-checked:border-[#414C93] transition-all duration-200 flex items-center justify-center">
                          {newsletter && (
                            <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 4l2.5 2.5L9 1" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-sans text-zinc-500 leading-relaxed group-hover:text-zinc-700 transition-colors duration-200">
                        Also send me <span className="font-semibold text-zinc-700">monthly reads</span> — curated articles & ideas on AI, creativity and building. No spam, unsubscribe anytime.
                      </span>
                    </label>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden text-[9px] font-mono tracking-wider text-red-500 uppercase text-left pl-2"
                        >
                          {error}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden w-full py-4 rounded-full font-sans font-semibold text-xs uppercase tracking-wider bg-[#F4F6FB]/80 hover:bg-white backdrop-blur-md border border-[#414C93]/15 text-[#414C93] shadow-sm hover:shadow-[0_4px_15px_rgba(65,76,147,0.15)] transition-all duration-300 active:scale-[0.98] cursor-pointer outline-none focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4 text-[#414C93]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <span className="relative z-10">Join the Waitlist</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#414C93] group-hover:translate-x-0.5 transition-transform duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </>
                      )}
                    </button>
                  </form>

                  <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase mt-5">
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

                  <h2 className="text-2xl font-display font-extrabold tracking-tight text-[#131911] mb-3">
                    You're Locked In
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 max-w-xs leading-relaxed font-sans mb-2">
                    We've added <span className="text-[#E39B4B] font-mono text-xs">{email.toLowerCase()}</span> to the waitlist.
                    {newsletter && (
                      <span className="block mt-1 text-[#96A88F]">Monthly reads are on their way too. 📖</span>
                    )}
                  </p>

                  <p className="text-[10px] font-mono tracking-widest text-[#96A88F] uppercase mt-2">
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

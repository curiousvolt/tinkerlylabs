import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Do I need any coding or tech background?",
    answer: "Not at all. If you can use a smartphone, you can take this course. We start from zero and build up. The only requirement is curiosity."
  },
  {
    question: "How long will the course take to complete?",
    answer: "Around 3 hours total. Lessons are 5 minutes each so you can fit them around your life — commute, lunch break, whenever. No 10-hour marathons."
  },
  {
    question: "Is this course on Udemy?",
    answer: "Yes. Once it launches you'll find it on Udemy. Join the waitlist and we'll send you the direct link plus an early access discount."
  },
  {
    question: "What makes this different from other AI courses?",
    answer: "Most courses teach you tools. This one teaches you how to think about AI — what it actually is, what it can't do, and how to spot when someone is selling you hype. The tools are in here too, but the thinking is what stays with you."
  },
  {
    question: "Will this course stay updated as AI changes?",
    answer: "Yes. AI moves fast and we know it. Core modules get updated when something meaningfully changes — not every week just to look busy."
  },
  {
    question: "Is this for students or working professionals?",
    answer: "Both. If you're a student trying to understand where AI fits in your future, or a professional trying to actually use it at work without the fluff — this is for you."
  },
  {
    question: "When does the course launch?",
    answer: "Soon. We're putting the finishing touches on it. Join the waitlist and you'll be the first to know — and the first to get in at the lowest price."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 relative overflow-hidden bg-[#F9FAF7] border-t border-[#96A88F]/15"
    >
      {/* Background soft glowing radial lights */}
      <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] bg-[#96A88F]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-[#E39B4B]/5 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Presenter Sub-Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono tracking-[0.25em] text-[#E39B4B] uppercase bg-[#E39B4B]/10 px-3.5 py-1 rounded-full border border-[#E39B4B]/20 mb-6"
        >
          CURRICULUM ASSISTANCE
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#131911] text-center leading-tight mb-14"
        >
          Frequently Asked{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E39B4B] to-[#D07C5B]">
            Questions
          </span>
        </motion.h2>

        {/* Interactive Accordion List */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`group border border-[#96A88F]/15 rounded-2xl bg-white overflow-hidden transition-colors transition-shadow duration-300 ${
                  isOpen
                    ? "border-[#E39B4B]/30 shadow-[0_4px_30px_rgba(150,168,143,0.06)]"
                    : "hover:border-[#96A88F]/30"
                }`}
              >
                {/* Trigger Area */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer outline-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4.5">
                    <HelpCircle
                      className={`w-4.5 h-4.5 shrink-0 transition-colors duration-300 ${
                        isOpen ? "text-[#E39B4B]" : "text-zinc-400 group-hover:text-zinc-600"
                      }`}
                    />
                    <span className="font-sans font-semibold text-sm sm:text-base text-zinc-800 group-hover:text-[#131911] transition-colors duration-200">
                      {item.question}
                    </span>
                  </div>
                  <div className="ml-4 shrink-0">
                    <motion.div
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#E39B4B]/10 border-[#E39B4B]/30 text-[#E39B4B]"
                          : "border-[#96A88F]/20 text-zinc-500 group-hover:text-zinc-700 group-hover:border-[#96A88F]/40"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanding Content Area */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.05 }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 }
                        }
                      }}
                    >
                      <div className="px-6 pb-6 pt-0 ml-9 border-t border-zinc-100">
                        <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

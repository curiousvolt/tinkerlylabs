import { motion } from "motion/react";
import React from "react";

function GlowCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative overflow-hidden bg-white border border-[#96A88F]/25 rounded-[2rem] transition-all duration-500 hover:border-[#96A88F]/50 hover:shadow-xl hover:shadow-[#96A88F]/5 ${className}`}
    >
      {/* Center glow effect on background */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] z-0 opacity-50"
        style={{
          background: `
            radial-gradient(
              600px circle at 50% 50%,
              rgba(99, 102, 241, 0.05),
              transparent 80%
            )
          `,
        }}
      />

      {/* Spotlight revealing brighter dots in the middle */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(150,168,143,0.2) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: `
            radial-gradient(
              250px circle at 50% 50%,
              black,
              transparent 80%
            )
          `,
          maskImage: `
            radial-gradient(
              250px circle at 50% 50%,
              black,
              transparent 80%
            )
          `,
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export default function CohortGrid() {
  return (
    <>
      {/* 2. Syllabus Cohort Grid Component (Replacing Concentric Orbit) */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold text-[#131911] text-center mb-10"
        >
          What you'll learn in this Course
        </motion.h2>

        {/* Top card (Card 1) */}
        <GlowCard delay={0.1} className="p-8 sm:p-12 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 justify-between relative h-full">
            {/* Content left */}
            <div className="md:w-[45%] flex flex-col items-start z-10 justify-center">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-7xl sm:text-8xl font-display font-bold text-zinc-200 leading-none -mt-2">
                  1
                </span>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#131911] leading-tight">
                  Understanding
                  <br />
                  AI
                </h3>
              </div>
              <p className="text-zinc-600 font-sans mb-10 text-sm sm:text-base">
                Master the fundamentals of Large Language Models and build a
                strong mental model for AI.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById("audience");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group/btn relative inline-flex items-center justify-center gap-1.5 bg-[linear-gradient(110deg,#414C93_30%,#606CBA_50%,#414C93_70%)] bg-[length:300%_100%] animate-[shine_4s_linear_infinite] hover:bg-[linear-gradient(110deg,#323b75_30%,#525fa3_50%,#323b75_70%)] border border-transparent text-white font-sans font-bold text-xs uppercase tracking-wider h-[3.25rem] px-12 rounded-full w-full sm:w-auto transition-shadow duration-300 shadow-[0_4px_15px_rgba(65,76,147,0.3)] hover:shadow-[0_6px_20px_rgba(65,76,147,0.4)] cursor-pointer overflow-hidden"
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
              </motion.button>
            </div>

            {/* Content right */}
            <div className="md:w-[55%] relative z-10 mt-16 md:mt-0 flex flex-col items-end justify-center">
              {/* List Box */}
              <div className="bg-[#F4F6F2] border border-[#96A88F]/25 rounded-2xl p-6 sm:p-8 relative z-30 w-full md:w-[90%] shadow-xl mt-auto transition-transform duration-300 hover:scale-[1.02]">
                {/* Floating Icons */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="w-12 h-12 bg-[#10a37f] rounded-xl flex items-center justify-center shadow-2xl -rotate-[6deg] z-10 cursor-pointer"
                  >
                    <span className="text-white font-bold text-sm tracking-tighter">
                      GPT
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="w-14 h-14 bg-[#FFD21E] rounded-xl flex items-center justify-center shadow-2xl z-20 cursor-pointer"
                  >
                    <span className="text-2xl">
                      🤗
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="w-12 h-12 bg-[#d97757] rounded-xl flex items-center justify-center shadow-2xl rotate-[6deg] z-10 cursor-pointer"
                  >
                    <span className="text-white font-serif font-bold text-xl">
                      C
                    </span>
                  </motion.div>
                </div>

                <ul className="space-y-4">
                  <li className="flex gap-4 items-start text-zinc-700 font-sans text-sm hover:text-[#131911] transition-colors">
                    <span className="text-[#96A88F] mt-0.5">+</span> How LLMs
                    actually work — prediction not thinking
                  </li>
                  <li className="flex gap-4 items-start text-zinc-700 font-sans text-sm hover:text-[#131911] transition-colors">
                    <span className="text-[#96A88F] mt-0.5">+</span> Why it
                    confidently gets things wrong
                  </li>
                  <li className="flex gap-4 items-start text-zinc-700 font-sans text-sm hover:text-[#131911] transition-colors">
                    <span className="text-[#96A88F] mt-0.5">+</span> Key terms
                    decoded once, never repeated
                  </li>
                  <li className="flex gap-4 items-start text-zinc-700 font-sans text-sm hover:text-[#131911] transition-colors">
                    <span className="text-[#96A88F] mt-0.5">+</span> The mental
                    model that changes everything
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Bottom 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 2 */}
          <GlowCard
            delay={0.2}
            className="p-8 flex flex-col h-full relative overflow-hidden"
          >
            {/* Sage/Amber themed glow with dots */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(150,168,143,0.12),transparent_50%)]" />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(150,168,143,0.2)_1px,transparent_0)] [background-size:24px_24px]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                  maskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                }}
              />
            </div>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              <span className="text-6xl font-display font-bold text-zinc-200 leading-none -mt-1">
                2
              </span>
              <h3 className="text-xl font-display font-bold text-[#131911] leading-tight">
                Prompting
                <br />& Tools
              </h3>
            </div>

            {/* Subtle line beneath heading */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#96A88F]/25 to-transparent mb-6 relative z-10" />

            {/* Prompt animation background */}
            <div className="absolute -bottom-8 -right-4 pointer-events-none z-0 opacity-[0.25] rotate-[-10deg] transition-all duration-300 group-hover:scale-105 group-hover:opacity-[0.40] select-none">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-mono text-[120px] font-bold leading-none drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  {">"}
                </span>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-24 bg-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                />
              </div>
            </div>

            <ul className="space-y-3 relative z-10">
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> The four levers of
                every good prompt
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Finding the right tool
                for the right job
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Prompt → test → refine
                loop
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Stop using AI as a
                search engine
              </li>
            </ul>
          </GlowCard>

          {/* Card 3 */}
          <GlowCard
            delay={0.3}
            className="p-8 flex flex-col h-full relative overflow-hidden"
          >
            {/* Sage/Amber themed glow with dots */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(150,168,143,0.12),transparent_50%)]" />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(150,168,143,0.2)_1px,transparent_0)] [background-size:24px_24px]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                  maskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                }}
              />
            </div>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              <span className="text-6xl font-display font-bold text-zinc-200 leading-none -mt-1">
                3
              </span>
              <h3 className="text-xl font-display font-bold text-[#131911] leading-tight">
                Build Real
                <br />
                Things
              </h3>
            </div>

            {/* Subtle line beneath heading */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#96A88F]/25 to-transparent mb-6 relative z-10" />

            {/* Animated Build Real Things Illustration */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.45] rotate-[-6deg] transition-all duration-300 group-hover:scale-105 group-hover:opacity-[0.65] select-none">
              <div className="relative w-48 h-36 border border-[#96A88F]/30 rounded-xl bg-white p-3 shadow-2xl flex flex-col gap-2">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-[#96A88F]/15 pb-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500">
                    index.html
                  </span>
                  <div className="w-3" />
                </div>
                {/* Window Body - Mock Layout Builder */}
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {/* Sidebar */}
                  <div className="border-r border-zinc-200 pr-1.5 flex flex-col gap-1">
                    <div className="h-2 w-full bg-[#96A88F]/40 rounded" />
                    <div className="h-1.5 w-4/5 bg-[#96A88F]/20 rounded" />
                    <div className="h-1.5 w-3/5 bg-[#96A88F]/20 rounded" />
                  </div>
                  {/* Main Grid Area */}
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <div className="h-3 w-3/4 bg-[#96A88F]/30 rounded" />
                    {/* Animated building component blocks */}
                    <div className="grid grid-cols-2 gap-1.5 flex-1">
                      <motion.div
                        animate={{
                          scale: [0.92, 1, 0.92],
                          borderColor: [
                            "rgba(247,223,30,0.3)",
                            "rgba(247,223,30,0.9)",
                            "rgba(247,223,30,0.3)",
                          ],
                          backgroundColor: [
                            "rgba(247,223,30,0.08)",
                            "rgba(247,223,30,0.22)",
                            "rgba(247,223,30,0.08)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="border border-dashed rounded flex items-center justify-center border-[#F7DF1E]/30 bg-[#F7DF1E]/5"
                      >
                        <span className="text-[12px] font-mono text-[#F7DF1E] font-bold drop-shadow-md">
                          {"{}"}
                        </span>
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 0.92, 1],
                          borderColor: [
                            "rgba(97,218,251,0.3)",
                            "rgba(97,218,251,0.9)",
                            "rgba(97,218,251,0.3)",
                          ],
                          backgroundColor: [
                            "rgba(97,218,251,0.08)",
                            "rgba(97,218,251,0.22)",
                            "rgba(97,218,251,0.08)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5,
                        }}
                        className="border border-dashed rounded flex items-center justify-center border-[#61DAFB]/30 bg-[#61DAFB]/5"
                      >
                        <span className="text-[12px] font-mono text-[#61DAFB] font-bold drop-shadow-md">
                          {"</>"}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {/* Floating "Cursor / Block placer" active indicator */}
                <motion.div
                  animate={{
                    x: [0, 40, -10, 0],
                    y: [0, -30, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-6 right-8 z-10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-black drop-shadow-lg"
                  >
                    <path stroke="white" strokeWidth="1.5" strokeLinejoin="round" d="M4.5 3V17.5L8.5 13.5L13.5 22L16 20.5L11 12.5H17L4.5 3Z" />
                  </svg>
                </motion.div>
              </div>
            </div>

            <ul className="space-y-3 relative z-10">
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Build a website and app
                from scratch
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> AI + Excel for money
                and planning
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Run models locally with
                Hugging Face
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Create images and video
                without wasting money
              </li>
            </ul>
          </GlowCard>

          {/* Card 4 */}
          <GlowCard
            delay={0.4}
            className="p-8 flex flex-col h-full relative overflow-hidden"
          >
            {/* Sage/Amber themed glow with dots */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(150,168,143,0.12),transparent_50%)]" />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(150,168,143,0.2)_1px,transparent_0)] [background-size:24px_24px]"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                  maskImage:
                    "radial-gradient(ellipse at center, black, transparent 50%)",
                }}
              />
            </div>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              <span className="text-6xl font-display font-bold text-zinc-200 leading-none -mt-1">
                4
              </span>
              <h3 className="text-xl font-display font-bold text-[#131911] leading-tight">
                The Complete
                <br />
                Picture
              </h3>
            </div>

            {/* Subtle line beneath heading */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#96A88F]/25 to-transparent mb-6 relative z-10" />

            {/* Animated Stacked Layers Illustration representing 'The Complete Picture' */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.45] rotate-[-8deg] transition-all duration-300 group-hover:scale-105 group-hover:opacity-[0.65] select-none scale-90 sm:scale-100">
              <div className="relative w-48 h-44 flex items-center justify-center">
                {/* Connecting vertical laser alignment lines */}
                <svg
                  className="absolute inset-0 w-full h-full text-[#96A88F]/20"
                  viewBox="0 0 192 176"
                >
                  {/* Left edge alignment path */}
                  <line
                    x1="46"
                    y1="40"
                    x2="46"
                    y2="136"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Right edge alignment path */}
                  <line
                    x1="146"
                    y1="40"
                    x2="146"
                    y2="136"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Center focus line */}
                  <line
                    x1="96"
                    y1="20"
                    x2="96"
                    y2="150"
                    stroke="rgba(227, 155, 75,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                </svg>

                {/* Top Layer - Technology (Brackets & Code symbols) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-[20px] w-32 h-10 border border-[#61DAFB]/30 rounded-lg bg-white p-1.5 flex items-center justify-between shadow-lg"
                >
                  <span className="text-[10px] font-mono text-[#61DAFB] font-bold px-1.5 drop-shadow-sm">
                    {"<Tech />"}
                  </span>
                  <div className="flex gap-1 pr-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                  </div>
                </motion.div>

                {/* Middle Layer - Design & Mechanics (Circle vector diagram) */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute top-[68px] w-32 h-10 border border-[#A259FF]/35 rounded-lg bg-white p-1.5 flex items-center justify-between shadow-lg"
                >
                  <span className="text-[10px] font-sans text-[#A259FF] font-bold px-1.5 flex items-center gap-1.5 drop-shadow-sm">
                    <svg
                      className="w-3 h-3 animate-spin"
                      style={{ animationDuration: "6s" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" strokeDasharray="6,4" />
                    </svg>
                    Design
                  </span>
                  <div className="w-8 h-1 bg-[#A259FF]/20 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: [-32, 32] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-full h-full bg-[#A259FF] rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Bottom Layer - Business & Economics (Analytics bar/chart indicators) */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                  className="absolute top-[116px] w-32 h-10 border border-[#10B981]/40 rounded-lg bg-white p-1.5 flex items-center justify-between shadow-lg"
                >
                  <span className="text-[10px] font-mono text-[#10B981] font-bold px-1.5 drop-shadow-sm">
                    {"$ Economy"}
                  </span>
                  <div className="flex items-end gap-1 h-4 pr-1">
                    <motion.div
                      animate={{ height: [4, 12, 4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1 bg-[#10B981]/90 rounded-t"
                    />
                    <motion.div
                      animate={{ height: [12, 6, 12] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                      className="w-1 bg-[#10B981]/90 rounded-t"
                    />
                    <motion.div
                      animate={{ height: [6, 14, 6] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6,
                      }}
                      className="w-1 bg-[#10B981]/90 rounded-t"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            <ul className="space-y-3 relative z-10 mb-10">
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Why AI won't build your
                startup
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> The real economics
                nobody is talking about
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> Spot hype before it
                fools you
              </li>
              <li className="flex gap-3 text-zinc-600 font-sans text-sm hover:text-[#131911] transition-colors">
                <span className="text-[#96A88F]">+</span> How to keep learning
                without getting played
              </li>
            </ul>
          </GlowCard>
        </div>
      </div>
    </>
  );
}

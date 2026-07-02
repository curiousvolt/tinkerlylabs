import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import {
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiNotion,
  SiGithub,
  SiPerplexity,
  SiFigma,
  SiZapier,
  SiStripe,
  SiVercel,
  SiSupabase,
  SiReact,
  SiPython,
  SiTypescript,
  SiJavascript,
  SiDocker,
  SiTailwindcss,
  SiLinear,
  SiFramer,
  SiHuggingface,
} from "react-icons/si";

// Pixel-perfect custom SVG icons for top-tier AI platforms
const SVG_ICONS = {
  chatgpt: <SiOpenai className="w-full h-full text-[#10a37f]" />,
  gemini: <SiGooglegemini className="w-full h-full text-[#4e82f7]" />,
  claude: <SiAnthropic className="w-full h-full text-[#d97706]" />,
  notion: <SiNotion className="w-full h-full text-[#131911]" />,
  github: <SiGithub className="w-full h-full text-[#131911]" />,
  perplexity: <SiPerplexity className="w-full h-full text-[#22d3ee]" />,
  figma: <SiFigma className="w-full h-full text-[#F24E1E]" />,
  zapier: <SiZapier className="w-full h-full text-[#FF4A00]" />,
  stripe: <SiStripe className="w-full h-full text-[#008CDD]" />,
  vercel: <SiVercel className="w-full h-full text-[#131911]" />,
  supabase: <SiSupabase className="w-full h-full text-[#3ECF8E]" />,
  react: <SiReact className="w-full h-full text-[#61DAFB]" />,
  python: <SiPython className="w-full h-full text-[#3776AB]" />,
  typescript: <SiTypescript className="w-full h-full text-[#3178C6]" />,
  javascript: <SiJavascript className="w-full h-full text-[#F7DF1E]" />,
  docker: <SiDocker className="w-full h-full text-[#2496ED]" />,
  tailwindcss: <SiTailwindcss className="w-full h-full text-[#06B6D4]" />,
  linear: <SiLinear className="w-full h-full text-[#5E6AD2]" />,
  framer: <SiFramer className="w-full h-full text-[#131911]" />,
  midjourney: (
    <img
      src="https://upload.wikimedia.org/wikipedia/en/0/06/Midjourney_logo.svg"
      className="w-full h-full object-contain"
      alt="Midjourney"
    />
  ),
  cursor: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Cursor_logo.png"
      className="w-full h-full object-contain"
      alt="Cursor"
    />
  ),
  kling: (
    <img
      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/kling-ai-icon.png"
      className="w-full h-full object-contain"
      alt="Kling"
    />
  ),
  kimi: (
    <img
      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/kimi-ai-icon.png"
      className="w-full h-full object-contain"
      alt="Kimi"
    />
  ),
  runway: (
    <img
      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/runway-ai-icon.png"
      className="w-full h-full object-contain"
      alt="Runway"
    />
  ),
  huggingface: (
    <img
      src="/huggingface.svg"
      className="w-full h-full object-contain"
      alt="Hugging Face"
    />
  ),
};

// Precise scattered configuration
const AI_ICONS_LIST = [
  {
    id: "huggingface",
    name: "Hugging Face",
    icon: "huggingface",
    startX: 30,
    startY: 35,
    rot: -12,
    speed: 0.95,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "chatgpt",
    startX: 10,
    startY: 15,
    rot: -18,
    speed: 1.0,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: "gemini",
    startX: 90,
    startY: 20,
    rot: 22,
    speed: 0.95,
  },
  {
    id: "claude",
    name: "Claude AI",
    icon: "claude",
    startX: 15,
    startY: 50,
    rot: 15,
    speed: 1.1,
  },
  {
    id: "notion",
    name: "Notion AI",
    icon: "notion",
    startX: 85,
    startY: 55,
    rot: -12,
    speed: 1.05,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "midjourney",
    startX: 25,
    startY: 85,
    rot: -25,
    speed: 0.85,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "perplexity",
    startX: 75,
    startY: 85,
    rot: 30,
    speed: 1.2,
  },
  {
    id: "cursor",
    name: "Cursor AI",
    icon: "cursor",
    startX: 50,
    startY: 10,
    rot: 8,
    speed: 1.15,
  },
  {
    id: "github",
    name: "GitHub",
    icon: "github",
    startX: 45,
    startY: 70,
    rot: -15,
    speed: 1.05,
  },
  {
    id: "kling",
    name: "Kling AI",
    icon: "kling",
    startX: 30,
    startY: 30,
    rot: -10,
    speed: 0.9,
  },
  {
    id: "kimi",
    name: "Kimi",
    icon: "kimi",
    startX: 70,
    startY: 35,
    rot: 15,
    speed: 1.1,
  },
  {
    id: "runway",
    name: "Runway",
    icon: "runway",
    startX: 10,
    startY: 70,
    rot: 5,
    speed: 1.0,
  },
  { id: "figma", name: "Figma", icon: "figma", startX: 5, startY: 30, rot: -15, speed: 0.9 },
  { id: "zapier", name: "Zapier", icon: "zapier", startX: 85, startY: 10, rot: 12, speed: 1.1 },
  { id: "stripe", name: "Stripe", icon: "stripe", startX: 25, startY: 60, rot: -8, speed: 1.05 },
  { id: "vercel", name: "Vercel", icon: "vercel", startX: 80, startY: 75, rot: 18, speed: 0.95 },
  { id: "supabase", name: "Supabase", icon: "supabase", startX: 15, startY: 95, rot: -22, speed: 1.15 },
  { id: "react", name: "React", icon: "react", startX: 95, startY: 45, rot: 25, speed: 0.85 },
  { id: "python", name: "Python", icon: "python", startX: 45, startY: 90, rot: -5, speed: 1.0 },
  { id: "ts", name: "TypeScript", icon: "typescript", startX: 65, startY: 15, rot: 10, speed: 1.1 },
  { id: "js", name: "JavaScript", icon: "javascript", startX: 35, startY: 15, rot: -10, speed: 0.9 },
  { id: "docker", name: "Docker", icon: "docker", startX: 60, startY: 95, rot: 15, speed: 1.05 },
  { id: "tailwind", name: "Tailwind", icon: "tailwindcss", startX: 90, startY: 85, rot: -18, speed: 0.95 },
  { id: "linear", name: "Linear", icon: "linear", startX: 5, startY: 80, rot: 20, speed: 1.1 },
  { id: "framer", name: "Framer", icon: "framer", startX: 95, startY: 30, rot: -25, speed: 0.85 },
];

const PILLS = [
  {
    id: "build",
    label: "Build real things",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[40vh] -ml-[28vw] md:-mt-[35vh] md:-ml-[35vw]",
    delay: 0.15,
  },
  {
    id: "hype",
    label: "Spot the hype",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[33vh] ml-[28vw] md:-mt-[35vh] md:ml-[10vw]",
    delay: 0.2,
  },
  {
    id: "think",
    label: "Think clearly about AI",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[26vh] -ml-[25vw] md:mt-[10vh] md:-ml-[42vw]",
    delay: 0.35,
  },
  {
    id: "local",
    label: "Run AI locally",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[19vh] ml-[25vw] md:-mt-[25vh] md:ml-[35vw]",
    delay: 0.25,
  },
  {
    id: "prompt",
    label: "Prompt like a pro",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[18vh] -ml-[30vw] md:-mt-[15vh] md:-ml-[20vw]",
    delay: 0.2,
  },
  {
    id: "picture",
    label: "The complete picture",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[26vh] ml-[28vw] md:mt-[15vh] md:ml-[38vw]",
    delay: 0.4,
  },
  {
    id: "tools",
    label: "Find the right tools",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[34vh] -ml-[28vw] md:mt-[25vh] md:-ml-[22vw]",
    delay: 0.3,
  },
  {
    id: "noise",
    label: "See through the noise",
    posClass: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[42vh] ml-[30vw] md:mt-[35vh] md:ml-[15vw]",
    delay: 0.45,
  },
];

function AnimatedIcon({
  item,
  smoothProgress,
  targetX,
  targetY,
}: {
  item: any;
  smoothProgress: any;
  targetX: number;
  targetY: number;
}) {
  const x = useTransform(
    smoothProgress,
    [0, 0.45],
    [`${item.startX}%`, `${targetX}%`],
  );
  const y = useTransform(
    smoothProgress,
    [0, 0.45],
    [`${item.startY}%`, `${targetY}%`],
  );
  const isSurvivor = [
    "chatgpt",
    "claude",
    "gemini",
    "huggingface",
    "notion",
    "cursor",
    "midjourney",
    "perplexity",
  ].includes(item.id);

  const scale = useTransform(
    smoothProgress,
    isSurvivor ? [0, 0.3, 0.45] : [0, 0.15, 0.225],
    isSurvivor ? [1, 0.85, 0] : [1, 0.5, 0]
  );
  const opacity = useTransform(
    smoothProgress,
    isSurvivor ? [0, 0.3, 0.45] : [0, 0.15, 0.225],
    isSurvivor ? [1, 0.95, 0] : [1, 0.5, 0]
  );

  return (
    <motion.div
      id={`floating-ai-icon-${item.id}`}
      style={{
        left: x,
        top: y,
        scale,
        opacity,
        rotate: item.rot,
        x: "-50%",
        y: "-50%",
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 18,
        delay: 0.1 + Math.random() * 0.3,
      }}
      className="absolute z-20 flex flex-col items-center group cursor-grab active:cursor-grabbing"
      whileHover={{ y: -6, scale: 1.08 }}
    >
      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center drop-shadow-xl transition-transform duration-300 group-hover:scale-110">
        {SVG_ICONS[item.icon as keyof typeof SVG_ICONS]}
      </div>
    </motion.div>
  );
}

export default function AIIconFolderAnimator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pulseFolderRef = useRef(false);
  const [pulseFolder, setPulseFolder] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll within the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth springs to make scroll animation fluid and juicy
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    restDelta: 0.001,
  });

  // Track folding state to fire one-shot pulse on the folder
  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      // Trigger folder pulse when icons have finished converging
      const shouldPulse = latest >= 0.45;
      if (pulseFolderRef.current !== shouldPulse) {
        pulseFolderRef.current = shouldPulse;
        setPulseFolder(shouldPulse);
      }
    });
  }, [smoothProgress]);

  // Coordinates of the central target Folder (Mac-style folder center)
  const targetX = 50; // 50% left
  const targetY = 50; // 50% top

  return (
    <div
      ref={containerRef}
      id="ai-icon-animator-stage"
      className="relative w-full h-[250vh] bg-[#F9FAF7]"
    >
      <div className="sticky top-0 w-full h-screen select-none flex flex-col items-center justify-center overflow-hidden">
        {/* Simple Continuous Grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(150,168,143,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(150,168,143,0.3)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black_30%,transparent_90%)]" />
        </div>

        {/* Decorative backdrop mesh glow */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#3F513B]/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Scattered Floating AI Icons */}
        {AI_ICONS_LIST.map((item) => (
          <AnimatedIcon
            key={item.id}
            item={item}
            smoothProgress={smoothProgress}
            targetX={targetX}
            targetY={targetY}
          />
        ))}

        {/* Central Folder Representation (representing course collection) */}
        <motion.div
          id="central-folder-container"
          style={{
            left: `${targetX}%`,
            top: `${targetY}%`,
            x: "-50%",
            y: "-50%",
          }}
          className="absolute z-30 flex flex-col items-center justify-center"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            scale: {
              type: "spring",
              stiffness: 150,
              damping: 12,
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="relative w-[120px] sm:w-[140px] md:w-[160px] max-w-[50vw] aspect-[1.45] cursor-pointer"
            animate={{
              filter: isHovered
                ? "drop-shadow(0 0 20px rgba(227, 155, 75,0.4))"
                : pulseFolder
                  ? "drop-shadow(0 0 15px rgba(150,168,143,0.5))"
                  : "drop-shadow(0 0 10px rgba(227, 155, 75,0.15))",
            }}
            transition={{
              filter: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
          >
            {/* Back flap of folder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1C2419] to-[#3F513B] rounded-lg shadow-inner border-t border-[#96A88F]/20" />

            {/* Folder Tab (topmost smallest rectangle) */}
            <div className="absolute -top-[12%] left-[4%] w-[30%] h-[13%] bg-gradient-to-t from-[#3F513B] to-[#4F634A] rounded-t-md border-t border-x border-[#96A88F]/30 z-50 shadow-sm" />

            {/* Opening shadow slot inside */}
            <div className="absolute top-[8%] inset-x-[4%] bottom-[20%] bg-black/50 rounded blur-[1px] flex items-center justify-center z-10">
              {/* Glowing core representing compiled power */}
              <div className="w-[40%] h-1 sm:h-1.5 bg-[#E39B4B]/60 rounded-full blur-[4px]" />
            </div>

            {/* Frosted Glass Front Flap of folder */}
            <div className="absolute inset-x-0 bottom-0 top-[15%] glass-panel-light rounded-lg border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col justify-end p-2 sm:p-3 overflow-hidden z-20">
              {/* Inner highlights / liquid glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-[#E39B4B]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Folder Label */}
              <div className="z-10 flex flex-col items-start justify-end leading-none gap-1">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#E39B4B] uppercase select-none opacity-80">
                  TINKERLY.CORE
                </span>
                <span className="text-[8px] sm:text-[9px] text-white/40 font-mono">
                  v1.0
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Popping Concept Pills - Moved OUTSIDE to fix backdrop-filter! */}
        {PILLS.map((pill) => (
          <motion.div
            key={pill.id}
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={
              pulseFolder
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.8, y: 15 }
            }
            transition={{
              delay: pulseFolder ? pill.delay : 0,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${pill.posClass} pill-glass px-3.5 py-2 sm:px-5 sm:py-2.5 md:px-7 md:py-3.5 rounded-full flex items-center justify-center z-40 pointer-events-none shadow-lg`}
          >
            <span className="text-[11px] sm:text-[13px] md:text-[15px] font-sans font-semibold text-zinc-900 whitespace-nowrap tracking-wide">
              {pill.label}
            </span>
          </motion.div>
        ))}

        {/* Floating text description */}
        <motion.div
          id="folder-indicator-label"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-[75px] md:mt-[120px] w-[280px] sm:w-[350px] text-center pointer-events-none z-50"
          animate={{
            opacity: pulseFolder ? 1 : 0.6,
            y: pulseFolder ? 0 : 2,
          }}
        >
          <p className="text-sm md:text-base font-display font-medium text-[#131911] leading-relaxed">
            Everything worth keeping, <br />
            <span className="text-[#E39B4B] font-bold tracking-wide">
              in one place.
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

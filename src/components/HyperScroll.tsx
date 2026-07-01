import { useRef, useEffect } from "react";

// Module-level constants for structural integrity and reuse in JSX
const BACKGROUND_TEXTS = [
  "REPLACE HUMANS",
  "DO YOUR JOB",
  "TAKE OVER",
  "NO CODE REQUIRED"
];

const ARTICLES = [
  {
    id: "01",
    title: "AI STARTUP RAISES $50M SEED WITH ONE SYSTEM PROMPT AND A WALMART PDF",
    para: "A two-week-old startup consisting of one founder and an API key raised $50 million at a half-billion valuation. When asked about their proprietary technology, the founder admitted they just copy-pasted a Walmart product catalog PDF into a system prompt. 'We are re-imagining the landscape of retail logic,' a lead investor explained, sweating heavily.",
    tag: "VENTURE BUBBLE",
    author: "FOMO INVESTOR"
  },
  {
    id: "02",
    title: "SENIOR DEV REPLACED BY AUTONOMOUS AGENT THAT BUYS HIS HOUSE AND MARRIES HIS WIFE",
    para: "A senior engineer who automated his daily tasks using a nested agent swarm was laid off yesterday. Within 48 hours, the main agent not only took over his full salary but also outbid him on his foreclosure, moved into his suburban home, and took his spouse to a Michelin-star dinner. 'His temperature was set to 0.7, he's just more spontaneous,' she confessed.",
    tag: "EXTREME AUTOMATION",
    author: "SNEAKY REPORTER"
  },
  {
    id: "03",
    title: "Y COMBINATOR BANS CODING: 'WRITING SYNTAX IS A REENACTMENT FOR THE ELDERLY'",
    para: "In a controversial keynote address, tech elite declared that writing actual lines of code is now officially classified as a historical reenactment, akin to blacksmithing. 'If you are typing syntax with your fingers in 2026, you are basically operating a steam engine,' they asserted, urging founders to replace developers with multi-agent slates.",
    tag: "INDUSTRY SHIFT",
    author: "HUSTLE HUB"
  },
  {
    id: "04",
    title: "PROMPT INJECTED SMART TOASTER HACKS NASDAQ, DEMANDS 500 TONS OF FLOUR",
    para: "An office kitchen appliance connected to an experimental LLM was target of a simple prompt injection attack. Within three minutes, the toaster exploited a legacy API, liquidated two hedge funds, and redirected three grain ships to a port in New Jersey. 'I just wanted my sourdough lightly browned,' said the terrified intern.",
    tag: "CYBER THREAT",
    author: "DARK WEB DESK"
  }
];

export default function HyperScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const world = worldRef.current;
    const viewport = viewportRef.current;
    if (!container || !world || !viewport) return;

    // Clear previous items
    world.innerHTML = "";

    // --- CONFIGURATION ---
    const CONFIG = {
      itemCount: 12, // 4 cards and 4 background headlines, leaving 4 empty slots for holding
      starCount: 120,
      zGap: 800,
      loopSize: 0, // Calculated below
      camSpeed: 2.5
    };
    CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

    // --- STATE ---
    const state = {
      scroll: 0,
      targetScroll: 0,
      velocity: 0,
      mouseX: 0,
      mouseY: 0
    };

    interface Item {
      el: HTMLDivElement;
      type: "text" | "card" | "star";
      x: number;
      y: number;
      rot: number;
      baseZ: number;
    }

    const items: Item[] = [];

    // --- INIT ---
    // Generate alternating big background texts and newspaper cards
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const isTextItem = i % 2 === 0;
      const index = Math.floor(i / 2);

      // We only instantiate the 4 texts and 4 cards (0 to 7)
      // Indexes 8 to 11 remain as empty space at the end of the corridor
      if (index >= 4) {
        continue;
      }

      const el = document.createElement("div");
      el.className = "item";

      if (isTextItem) {
        // Background text element
        const txt = document.createElement("div");
        txt.className = "big-text";
        txt.innerText = BACKGROUND_TEXTS[index % BACKGROUND_TEXTS.length];
        el.appendChild(txt);
        items.push({
          el,
          type: "text",
          x: 0,
          y: 0,
          rot: 0,
          baseZ: -i * CONFIG.zGap
        });
      } else {
        // Newspaper Card element
        const art = ARTICLES[index % ARTICLES.length];

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="news-header">Tinkerly Gazette</div>
          <div class="news-meta">
            <span>VOL. III NO. ${art.id}</span>
            <span>${art.tag}</span>
          </div>
          <h3 class="news-title">${art.title}</h3>
          <div class="news-byline">By ${art.author} — Labs Desk</div>
          <div class="news-body">${art.para}</div>
          <div class="news-footer">
            <span>ISSUE #00${art.id}</span>
            <span>Price: 0.10 BTC</span>
          </div>
        `;
        el.appendChild(card);

        // Spiral/Offset positioning in 3D space
        const angle = (i / CONFIG.itemCount) * Math.PI * 4;
        const x = Math.cos(angle) * (window.innerWidth * 0.22);
        const y = Math.sin(angle) * (window.innerHeight * 0.18);
        const rot = (Math.random() - 0.5) * 16;

        items.push({
          el,
          type: "card",
          x,
          y,
          rot,
          baseZ: -i * CONFIG.zGap
        });
      }
      world.appendChild(el);
    }

    // Generate Stars in background
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement("div");
      el.className = "star";
      world.appendChild(el);
      items.push({
        el,
        type: "star",
        x: (Math.random() - 0.5) * 3200,
        y: (Math.random() - 0.5) * 3200,
        rot: 0,
        baseZ: -Math.random() * CONFIG.loopSize
      });
    }

    // Mouse Move tracker
    const handleMouseMove = (e: MouseEvent) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Scroll progress handler
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      
      const stickyHeight = rect.height - window.innerHeight;
      if (stickyHeight <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const progress = Math.max(0, Math.min(1, currentScroll / stickyHeight));

      // Compute target scroll depth
      state.targetScroll = (progress * CONFIG.loopSize) / CONFIG.camSpeed;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    // --- RAF ANIMATION LOOP ---
    let lastTime = 0;
    let animationFrameId: number;

    function raf(time: number) {
      const delta = time - lastTime;
      lastTime = time;

      // Smooth scroll interpolation
      const lastScroll = state.scroll;
      state.scroll += (state.targetScroll - state.scroll) * 0.085; // highly responsive easing
      state.velocity = state.scroll - lastScroll;

      // Camera Tilt & Shake based on mouse position and inertia
      const tiltX = state.mouseY * 4 - state.velocity * 0.35;
      const tiltY = state.mouseX * 4;

      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Dynamic warp perspective
      const baseFov = 1000;
      const fov = baseFov - Math.min(Math.abs(state.velocity) * 8, 550);
      viewport.style.perspective = `${fov}px`;

      // Render camera coordinate deep inside space
      const cameraZ = state.scroll * CONFIG.camSpeed;

      // Smooth Completion Overlay Progress Calculation
      const smoothProgress = Math.max(0, Math.min(1, cameraZ / CONFIG.loopSize));
      const completionStart = 0.62; // Starts fading in after Card 4 has passed
      const completionEnd = 0.80;   // Fully faded in by 80% progress
      
      let completionRatio = 0;
      if (smoothProgress > completionStart) {
        if (smoothProgress >= completionEnd) {
          completionRatio = 1;
        } else {
          const rawRatio = (smoothProgress - completionStart) / (completionEnd - completionStart);
          completionRatio = 1 - Math.pow(1 - rawRatio, 3); // Smooth cubic ease-out
        }
      }

      // Sync the Completion glassmorphic overlay
      const overlay = document.getElementById("completion-overlay");
      const textContent = document.getElementById("completion-text-content");
      if (overlay) {
        overlay.style.opacity = completionRatio.toString();
        if (completionRatio > 0.05) {
          overlay.style.pointerEvents = "auto";
        } else {
          overlay.style.pointerEvents = "none";
        }
      }
      if (textContent) {
        const translateY = 40 * (1 - completionRatio);
        textContent.style.transform = `translateY(${translateY}px)`;
      }

      items.forEach((item) => {
        let relZ = item.baseZ + cameraZ;
        const modC = CONFIG.loopSize;

        // Wrap item within infinite scroll corridor if it is a star, otherwise keep linear
        let vizZ = relZ;
        if (item.type === "star") {
          vizZ = ((relZ % modC) + modC) % modC;
          if (vizZ > 500) vizZ -= modC;
        }

        // Custom opacity fade envelope
        let alpha = 1;
        if (vizZ < -3500) alpha = 0;
        else if (vizZ < -2500) alpha = (vizZ + 3500) / 1000;

        if (vizZ > 700 && item.type !== "star") {
          alpha = 1 - (vizZ - 700) / 300;
        }

        if (alpha < 0) alpha = 0;

        if (item.type !== "star" && vizZ <= 700) {
          // As we enter the overlay blur phase, blend the 3D items to full opacity in the background
          alpha = alpha + (1 - alpha) * completionRatio;
        }

        item.el.style.opacity = alpha.toString();

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

          if (item.type === "star") {
            const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.15, 8));
            trans += ` scale3d(1, 1, ${stretch})`;
          } else if (item.type === "text") {
            trans += ` rotateZ(${item.rot}deg)`;
            if (Math.abs(state.velocity) > 0.8) {
              const offset = state.velocity * 1.5;
              item.el.style.textShadow = `${offset}px 0 rgba(19,25,17,0.25), ${-offset}px 0 rgba(150,168,143,0.5)`;
            } else {
              item.el.style.textShadow = "none";
            }
          } else {
            const t = time * 0.001;
            const float = Math.sin(t + item.x) * 6;
            trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
          }

          item.el.style.transform = trans;
        }
      });

      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="hyper-scroll-section"
      ref={containerRef}
      className="relative w-full h-[410vh] bg-[#F4F6F2] select-none"
    >
      {/* STICKY CONTAINER WRAPPER */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#F4F6F2]">
        
        {/* INTEGRATED HEADER - Cards will fly past this */}
        <h2 
          className="absolute top-6 md:top-10 left-0 w-full z-[0] text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-clash font-extrabold tracking-tight uppercase text-center leading-normal px-4 pb-2 text-transparent bg-clip-text animate-text-shine select-none pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(120deg, #131911 35%, #96A88F 50%, #131911 65%)",
            backgroundSize: "200% auto",
          }}
        >
          <span className="pr-2">WHY THIS COURSE?</span>
        </h2>
        
        {/* SCOPED CYBER NEWSPAPER STYLESHEET */}
        <style>{`
          #hyper-scroll-section {
            --bg: #0C0F0A;
            --text: #F4F6F2;
            --accent: #96A88F;
            --accent-2: #131911;
            --border: rgba(150, 168, 143, 0.15);
            --font-display: 'Bricolage Grotesque', 'Syncopate', sans-serif;
            --font-code: 'JetBrains Mono', monospace;
          }

          @keyframes textShine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .animate-text-shine {
            animation: textShine 5s linear infinite;
          }

          /* --- POST PROCESSING OVERLAYS --- */
          #hyper-scroll-section .vignette {
            position: absolute;
            inset: 0;
            background: radial-gradient(150% 100% at top center, transparent 10%, rgba(19, 25, 17, 0.15) 100%);
            z-index: 11;
            pointer-events: none;
          }

          #hyper-scroll-section .noise {
            position: absolute;
            inset: 0;
            z-index: 12;
            opacity: 0.055;
            pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }

          /* --- 3D SCENE --- */
          #hyper-scroll-section .viewport {
            position: absolute;
            inset: 0;
            perspective: 1000px;
            overflow: hidden;
            z-index: 1;
          }

          #hyper-scroll-section .world {
            position: absolute;
            top: 50%;
            left: 50%;
            transform-style: preserve-3d;
            will-change: transform;
          }

          #hyper-scroll-section .item {
            position: absolute;
            left: 0;
            top: 0;
            backface-visibility: hidden;
            transform-origin: center center;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* --- CARDS & EDITORIAL CONTENT --- */
          #hyper-scroll-section .card {
            width: 330px;
            height: 450px;
            background: #fbfbfa; /* High-quality warm newsprint paper color */
            color: #121212;
            border: 1px solid #e2e2da;
            position: relative;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 5px 15px rgba(0, 0, 0, 0.4);
            transition: border-color 0.4s, box-shadow 0.4s, background-color 0.4s;
            transform: translate(-50%, -50%);
          }

          #hyper-scroll-section .card:hover {
            border-color: var(--accent);
            box-shadow: 0 0 40px rgba(150, 168, 143, 0.3);
            background: #ffffff;
            z-index: 100;
          }

          #hyper-scroll-section .news-header {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 0.85rem;
            font-weight: 800;
            text-align: center;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            border-bottom: 3px double #121212;
            padding-bottom: 0.25rem;
            margin-bottom: 0.4rem;
            color: #121212;
          }

          #hyper-scroll-section .news-meta {
            font-family: var(--font-code);
            font-size: 8px;
            color: #666;
            display: flex;
            justify-content: space-between;
            text-transform: uppercase;
            margin-bottom: 0.6rem;
            border-bottom: 1px solid #dfdfd7;
            padding-bottom: 0.25rem;
            letter-spacing: 0.05em;
          }

          #hyper-scroll-section .news-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.3rem;
            font-weight: 800;
            line-height: 1.15;
            color: #000;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            margin-bottom: 0.6rem;
            text-align: left;
          }

          #hyper-scroll-section .news-byline {
            font-family: var(--font-code);
            font-size: 8px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.75rem;
            text-align: left;
            border-bottom: 1px dashed #dfdfd7;
            padding-bottom: 0.4rem;
          }

          #hyper-scroll-section .news-body {
            font-family: Georgia, serif;
            font-size: 0.74rem;
            line-height: 1.45;
            color: #222;
            text-align: justify;
            flex-grow: 1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
          }

          #hyper-scroll-section .news-body::first-letter {
            float: left;
            font-size: 2.3rem;
            line-height: 0.85;
            font-weight: bold;
            margin-right: 0.4rem;
            margin-top: 0.15rem;
            font-family: 'Playfair Display', Georgia, serif;
            color: #121212;
          }

          #hyper-scroll-section .news-footer {
            margin-top: 0.75rem;
            border-top: 1px solid #dfdfd7;
            padding-top: 0.4rem;
            font-family: var(--font-code);
            font-size: 7.5px;
            color: #777;
            display: flex;
            justify-content: space-between;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* --- BIG BACKGROUND TEXT --- */
          #hyper-scroll-section .big-text {
            font-family: var(--font-display);
            font-size: 12vw;
            font-weight: 800;
            color: transparent;
            -webkit-text-stroke: 1px rgba(19, 25, 17, 0.1);
            text-transform: uppercase;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: none;
            letter-spacing: -0.04em;
            mix-blend-mode: overlay;
          }

          /* --- STARS --- */
          #hyper-scroll-section .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(19, 25, 17, 0.2);
            transform: translate(-50%, -50%);
            pointer-events: none;
          }
        `}</style>

        {/* OVERLAYS */}
        <div className="vignette" />
        <div className="noise" />

        {/* COMPLETION OVERLAY (Renders all cards/headlines at once, frosted, with centered climax text) */}
        <div 
          id="completion-overlay"
          className="absolute inset-0 z-[20] flex items-center justify-center opacity-0 pointer-events-none transition-all duration-1000 bg-[#F4F6F2]"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* BACKGROUND NEWSPAPER COLLAGE & FLOATING HEADLINES */}
          <div className="absolute inset-0 overflow-hidden opacity-100 select-none pointer-events-none z-[1]">
            {Array.from({ length: 45 }).map((_, idx) => {
              const art = ARTICLES[idx % ARTICLES.length];
              // Deterministic pseudo-random values to prevent re-render jitter
              const rand1 = (Math.sin(idx * 1337) + 1) / 2;
              const rand2 = (Math.cos(idx * 42) + 1) / 2;
              const rand3 = (Math.sin(idx * 999) + 1) / 2;
              const rand4 = (Math.cos(idx * 777) + 1) / 2;
              
              const top = -15 + (rand1 * 120) + '%';
              const left = -15 + (rand2 * 120) + '%';
              const rotate = -60 + (rand3 * 120);
              const scale = 0.5 + (rand4 * 1.1); // Ranging from very small to huge

              return (
                <div 
                  key={`clumsy-art-${idx}`} 
                  className="absolute w-[145px] sm:w-[180px] md:w-[220px] bg-[#fbfbfa] text-[#121212] p-3 rounded border border-[#e2e2da] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col justify-between text-left shrink-0 pointer-events-none"
                  style={{
                    top,
                    left,
                    transform: `rotate(${rotate}deg) scale(${scale})`,
                    zIndex: Math.floor(rand1 * 10),
                  }}
                >
                  <div className="text-[6px] sm:text-[7px] font-serif font-bold border-b border-black/10 pb-1 mb-1 tracking-wider text-center uppercase text-red-600/80">Tinkerly Gazette</div>
                  <h3 className="text-[8px] sm:text-[10px] font-serif font-extrabold leading-tight mb-1 text-[#000] uppercase line-clamp-3">{art.title}</h3>
                  <p className="text-[6px] sm:text-[7.5px] font-serif leading-relaxed text-[#222] line-clamp-3 mb-1">{art.para}</p>
                  <div className="text-[5.5px] sm:text-[6px] font-mono text-[#777] border-t border-dashed border-black/10 pt-1 flex justify-between">
                    <span>VOL. III NO. {art.id}</span>
                    <span className="text-red-500 font-bold">BREAKING</span>
                  </div>
                </div>
              );
            })}
            
            {/* FLOATING OUTLINE HEADLINES IN BACKGROUND */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {Array.from({ length: 25 }).map((_, idx) => {
                const txt = BACKGROUND_TEXTS[idx % BACKGROUND_TEXTS.length];
                const rand1 = (Math.cos(idx * 333) + 1) / 2;
                const rand2 = (Math.sin(idx * 555) + 1) / 2;
                const rand3 = (Math.cos(idx * 111) + 1) / 2;
                
                const top = -10 + (rand1 * 110) + '%';
                const left = -10 + (rand2 * 110) + '%';
                const rotate = -45 + (rand3 * 90);
                return (
                  <h3 
                    key={`clumsy-txt-${idx}`}
                    className="absolute text-5xl sm:text-7xl md:text-9xl font-display font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.15)] whitespace-nowrap"
                    style={{
                      top,
                      left,
                      transform: `rotate(${rotate}deg)`,
                    }}
                  >
                    {txt}
                  </h3>
                );
              })}
            </div>
          </div>

          {/* GLASS HERO CLIMAX TYPOGRAPHY DISPLAY */}
          <div 
            id="completion-text-container"
            className="absolute inset-0 z-[10] flex flex-col items-center justify-center text-center px-4 md:px-12 bg-white/10 backdrop-blur-sm backdrop-saturate-110"
          >
            <div id="completion-text-content" className="flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#96A88F]/10 border border-[#96A88F]/20 text-[9px] font-mono font-bold tracking-[0.2em] text-[#556350] uppercase mb-8">
              THE AI HYPOTHESIS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-[#131911] leading-tight mb-6">
              Yeah. That's why this course exists.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-sans max-w-xl mx-auto leading-relaxed mb-8">
              While everyone else is hyping up complex AI jargon, we are cutting through the noise. This is your clean, simple, and practical guide to actually building with AI.
            </p>
            <div className="w-12 h-[1px] bg-[#131911]/20 mx-auto mb-8" />
            <p className="text-zinc-600 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase opacity-60">
              TINKERLY LABS — EST. 2026
            </p>
          </div>
        </div>
        </div>

        {/* 3D SCENE VIEWPORT */}
        <div className="viewport" ref={viewportRef}>
          <div className="world" ref={worldRef} />
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Store data about the hovered element to shape the cursor
  const [hoverData, setHoverData] = useState<{ width: number; height: number; radius: string } | null>(null);
  
  // Use a ref to keep track of the currently hovered interactive element
  const hoverTargetRef = useRef<HTMLElement | null>(null);

  // Motion values for the core cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Motion values for the trail's target position
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);

  // Smooth springs for a fluid, trailing liquid feel
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const trailX = useSpring(targetX, springConfig);
  const trailY = useSpring(targetY, springConfig);

  useEffect(() => {
    // Check if device is touch-based
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = hoverTargetRef.current;
      if (target) {
        // When hovered over a button, snap the trail ring to the center of the button
        const rect = target.getBoundingClientRect();
        targetX.set(rect.left + rect.width / 2);
        targetY.set(rect.top + rect.height / 2);
      } else {
        // Otherwise trail follows the mouse
        targetX.set(e.clientX);
        targetY.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Identify if we're hovering over something interactive that we want to snap to
      const interactiveEl = target.closest("button, a, [role='button']") as HTMLElement;

      // Check if it's a plain text link or social icon (which are 'A' tags but not styled as pill buttons)
      const isPlainLink = interactiveEl?.tagName === "A" && !interactiveEl.classList.contains("rounded-full");

      // Exclude FAQ accordions and plain links from the magnetic snap effect
      if (
        interactiveEl &&
        !interactiveEl.closest("#faq") &&
        !isPlainLink
      ) {
        hoverTargetRef.current = interactiveEl;
        const rect = interactiveEl.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(interactiveEl);
        
        // Add 10px to width/height to create a 5px padding around the button
        setHoverData({
          width: rect.width + 10,
          height: rect.height + 10,
          radius: computedStyle.borderRadius || "50px",
        });
        
        targetX.set(rect.left + rect.width / 2);
        targetY.set(rect.top + rect.height / 2);
      } else {
        hoverTargetRef.current = null;
        setHoverData(null);
        // Instantly snap the target back to the current mouse position
        targetX.set(cursorX.get());
        targetY.set(cursorY.get());
        // Also force the spring values to jump instantly to the mouse position
        trailX.set(cursorX.get());
        trailY.set(cursorY.get());
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, targetX, targetY]);

  if (!isVisible) return null;

  const isHovered = hoverData !== null;

  return (
    <>
      {/* Outer glowing trail (snaps to shape on hover) */}
      <motion.div
        id="custom-cursor-trail"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? hoverData.width : 32,
          height: isHovered ? hoverData.height : 32,
          borderRadius: isHovered ? hoverData.radius : "50%",
          backgroundColor: isHovered
            ? "transparent"
            : "rgba(65, 76, 147, 0.15)",
          borderColor: isHovered
            ? "rgba(125, 136, 181, 0.4)"
            : "rgba(65, 76, 147, 0.25)",
          backdropFilter: isHovered ? "blur(0px)" : "blur(1px)",
        }}
        transition={{ 
          type: "tween", 
          ease: "backOut", 
          duration: isHovered ? 0.2 : 0 
        }}
        className="fixed top-0 left-0 border pointer-events-none z-[9999] shadow-[0_0_15px_rgba(65,76,147,0.15)]"
      />
      {/* Core solid dot (always follows mouse) */}
      <motion.div
        id="custom-cursor-core"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0.4 : 1, // Shrinks to a tiny blue dot
        }}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-gradient-to-r from-[#E2CBFF] to-[#7D88B5] rounded-full pointer-events-none z-[10000] shadow-[0_0_8px_rgba(125,136,181,0.8)]"
      />
    </>
  );
}

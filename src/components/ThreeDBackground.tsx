import { useRef, useEffect } from "react";

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = { x: -1000, y: -1000 };
    const tilt = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right tilt [-90, 90]
        // beta: front-to-back tilt [-180, 180] (assume 45 deg is neutral holding angle)
        tilt.x = e.gamma / 45; // scale sensitivity
        tilt.y = (e.beta - 45) / 45;
        
        // Clamp to [-1.5, 1.5]
        tilt.x = Math.max(-1.5, Math.min(1.5, tilt.x));
        tilt.y = Math.max(-1.5, Math.min(1.5, tilt.y));
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      radius: number;
      color: string;
      shadowColor: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseVx = (Math.random() - 0.5) * 0.4;
        this.baseVy = (Math.random() - 0.5) * 0.4;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.radius = Math.random() * 2 + 1;
        
        const colors = [
          { fill: "rgba(150, 168, 143, 0.8)", shadow: "rgba(150, 168, 143, 1)" }, // light sage
          { fill: "rgba(227, 155, 75, 0.8)", shadow: "rgba(227, 155, 75, 1)" },   // smoked amber
          { fill: "rgba(244, 241, 234, 0.9)", shadow: "rgba(244, 241, 234, 1)" }, // warm sand
          { fill: "rgba(100, 120, 95, 0.7)", shadow: "rgba(100, 120, 95, 0.9)" },   // forest mid
          { fill: "rgba(208, 124, 91, 0.65)", shadow: "rgba(208, 124, 91, 0.85)" }, // terracotta
        ];
        const selected = colors[Math.floor(Math.random() * colors.length)];
        this.color = selected.fill;
        this.shadowColor = selected.shadow;
      }

      update() {
        // React to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.vx -= (dx / dist) * force * 0.1; // Repel slightly
          this.vy -= (dy / dist) * force * 0.1;
        } else {
          // Gradually return to base velocity + tilt bias
          this.vx += (this.baseVx + tilt.x * 0.15 - this.vx) * 0.05;
          this.vy += (this.baseVy + tilt.y * 0.15 - this.vy) * 0.05;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) {
          this.vx = -this.vx;
          this.baseVx = -this.baseVx;
        }
        if (this.y < 0 || this.y > height) {
          this.vy = -this.vy;
          this.baseVy = -this.baseVy;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.shadowColor;
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((width * height) / 10000); // Increased density slightly
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      ctx.shadowBlur = 0; // Turn off shadow for lines for better performance
      for (let i = 0; i < particles.length; i++) {
        // Line to mouse
        const mouseDx = particles[i].x - mouse.x;
        const mouseDy = particles[i].y - mouse.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < 200) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 1 - mouseDist / 200;
          ctx.strokeStyle = `rgba(227, 155, 75, ${opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(150, 168, 143, ${opacity * 0.25})`; // Subtle sage lines
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawLines();

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

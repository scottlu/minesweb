import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const FIREWORK_COLORS = [
  '#ff0044', '#ff2266', '#ffcc00', '#ffee55',
  '#00ff88', '#00ffcc', '#00ccff', '#0088ff',
  '#ff00ff', '#cc44ff', '#ff8800', '#ffaa33',
  '#ffffff', '#ffdddd',
];

function createFireworkBurst(x: number, y: number, scale: number = 1): Particle[] {
  const particles: Particle[] = [];
  const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  const color2 = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  const count = 80 + Math.floor(Math.random() * 40);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = (3 + Math.random() * 7) * scale;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 80 + Math.random() * 60,
      color: Math.random() < 0.5 ? color : color2,
      size: 3 + Math.random() * 4,
    });
  }
  // Sparkle core
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (1 + Math.random() * 2) * scale;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 30 + Math.random() * 20,
      color: '#ffffff',
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

interface GameEffectProps {
  onComplete: () => void;
}

export function GameEffect({ onComplete }: GameEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    let frame = 0;
    let animId: number;
    const totalFrames = 280;

    const burstSchedule = [
      0, 10, 22, 36, 48, 60, 75, 88, 100, 115,
      128, 140, 155, 170, 185, 200, 215
    ];

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (burstSchedule.includes(frame)) {
        const x = canvas.width * (0.08 + Math.random() * 0.84);
        const y = canvas.height * (0.08 + Math.random() * 0.55);
        const scale = 0.7 + Math.random() * 0.6;
        particles.push(...createFireworkBurst(x, y, scale));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, p.life * 1.5);
        const currentSize = p.size * (0.3 + 0.7 * p.life);

        // Outer glow
        if (currentSize > 2) {
          ctx.globalAlpha = alpha * 0.25;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mid glow
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frame++;

      if (frame >= totalFrames && particles.length === 0) {
        onComplete();
        return;
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}


import React, { useEffect, useRef, useState } from "react";

// Kiwi mascot SVG (cute fruit, soft drop shadow, 3D effect)
function KiwiSvg({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.87} viewBox="0 0 64 56" style={{ filter: "drop-shadow(0 3px 6px #927B45AA)" }}>
      {/* Kiwi Outer */}
      <ellipse cx="32" cy="28" rx="29" ry="25" fill="#d1be95" stroke="#816436" strokeWidth="4" />
      {/* Kiwi Flesh */}
      <ellipse cx="32" cy="28" rx="23" ry="19" fill="#baf661" stroke="#95b24f" strokeWidth="2.5" />
      {/* Seeds */}
      {Array.from({length: 12}).map((_, i) => {
        const angle = (2 * Math.PI / 12) * i;
        const r = 12.5;
        return (
          <ellipse
            key={i}
            cx={32 + r * Math.cos(angle)}
            cy={28 + r * Math.sin(angle)}
            rx="1.2"
            ry="2.2"
            fill="#3f4630"
            transform={`rotate(${i*25} 32 28)`}
            opacity="0.9"
          />
        );
      })}
      {/* Smile & eyes */}
      <ellipse cx="25" cy="32" rx="2" ry="2.5" fill="#2c321c" />
      <ellipse cx="39.5" cy="32" rx="2" ry="2.5" fill="#2c321c" />
      <path d="M28,39 Q32,43 36,39" stroke="#533f19" strokeWidth="1.7" fill="none" />
      {/* Cheek blush */}
      <ellipse cx="23.5" cy="35.2" rx="1.1" ry="0.9" fill="#ffe6ef" opacity="0.26" />
      <ellipse cx="40.3" cy="35.2" rx="1.1" ry="0.9" fill="#ffe6ef" opacity="0.26" />
    </svg>
  );
}

const MASCOT_SIZE = 64;
const SCREEN_MARGIN = 10;
const SPEED = 0.10; // px/ms

/** Animated floating/bouncing kiwi mascot (autonomous) */
export default function KiwiMascot() {
  const [pos, setPos] = useState({ x: 150, y: 120 });
  const [vel, setVel] = useState({ x: 1 + Math.random(), y: 1 + Math.random() });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastTime = performance.now();
    let rafId: number;

    function animate(now: number) {
      let dt = now - lastTime;
      lastTime = now;
      setPos(curr => {
        let nx = curr.x + vel.x * SPEED * dt;
        let ny = curr.y + vel.y * SPEED * dt;
        // Get viewport size (minus mascot size)
        const vw = window.innerWidth - MASCOT_SIZE - SCREEN_MARGIN;
        const vh = window.innerHeight - MASCOT_SIZE - SCREEN_MARGIN - 36;
        let newVel = { ...vel };

        // Bounce off edges
        if (nx < SCREEN_MARGIN || nx > vw) {
          newVel.x *= -1.08;
          nx = Math.max(SCREEN_MARGIN, Math.min(vw, nx));
        }
        if (ny < SCREEN_MARGIN || ny > vh) {
          newVel.y *= -1.05;
          ny = Math.max(SCREEN_MARGIN, Math.min(vh, ny));
        }
        setVel(newVel);
        return { x: nx, y: ny };
      });
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line
  }, []);

  // Subtle wiggle
  const anim = `translateY(${Math.sin(pos.x / 42) * 6}px) scale(${1 + Math.sin(pos.y/99)*0.03})`;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 40,
        pointerEvents: "none",
        transition: "filter 0.15s",
        filter: "brightness(1.04) drop-shadow(0 3px 12px #99c85079)",
        transform: anim,
        width: MASCOT_SIZE,
        height: MASCOT_SIZE * 0.85,
        userSelect: "none",
      }}
      aria-label="Floating Kiwi Mascot"
      tabIndex={-1}
    >
      <KiwiSvg />
    </div>
  );
}

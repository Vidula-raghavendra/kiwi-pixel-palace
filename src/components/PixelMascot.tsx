
import React, { useState } from "react";

/**
 * Animated pixel-art mascot with basic bounce animation and message
 * Mascot art is inline SVG (can be replaced with a sprite/PNG later)
 */
export default function PixelMascot({
  message = "",
}: { message?: string }) {
  const [jump, setJump] = useState(false);
  return (
    <div
      className="flex flex-col items-center group"
      onClick={() => { setJump(true); setTimeout(() => setJump(false), 510); }}
      title="Click to release me!"
      style={{ cursor: "pointer", width: 112 }}
    >
      <div
        className={`transition-all duration-300 ${jump ? "animate-bounce-mascot" : ""} drop-shadow-lg`}
        style={{ willChange: "transform" }}
      >
        {/* SVG mascot art: Kiwi-bird with soft outline, pixel art base */}
        <svg
          width={74}
          height={62}
          style={{ imageRendering: "pixelated" }}
          viewBox="0 0 74 62"
        >
          <g>
            {/* Body */}
            <rect x="19" y="22" width="36" height="22" fill="#badc5b" stroke="#233f24" strokeWidth="2"/>
            {/* Belly shadow */}
            <rect x="28" y="34" width="17" height="9" fill="#d6eec1" stroke="#adc27b" strokeWidth="1"/>
            {/* Head */}
            <rect x="35" y="13" width="11" height="12" fill="#badc5b" stroke="#233f24" strokeWidth="2"/>
            {/* Eye */}
            <rect x="43" y="18" width="2" height="2" fill="#233f24"/>
            {/* Beak */}
            <rect x="47" y="22" width="12" height="2" fill="#e3b7a0" stroke="#ad9271" strokeWidth="1"/>
            {/* Feet */}
            <rect x="29" y="42" width="3" height="6" fill="#ad9271" stroke="#85412e" strokeWidth="1"/>
            <rect x="39" y="42" width="3" height="6" fill="#ad9271" stroke="#85412e" strokeWidth="1"/>
            {/* Outline - head shine */}
            <rect x="38" y="14" width="2" height="2" fill="#fafcdf" />
          </g>
          {/* 3D shadow below mascot */}
          <ellipse cx="38" cy="54" rx="21" ry="7" fill="#b9ab877b" />
        </svg>
      </div>
      {/* Speech bubble */}
      {message && (
        <div className="relative mt-1 w-full">
          <div className="pixel-font rounded-lg border-2 border-[#233f24] px-3 py-2 bg-[#fffdf3] text-[#322d2d] text-center shadow-[0_3px_0_#ad9271]">
            {message}
          </div>
        </div>
      )}
      {/* Mascot bounce keyframes */}
      <style>
        {`
          .animate-bounce-mascot { animation: mascot-bounce 0.52s cubic-bezier(.19,1,.22,1) 1; }
          @keyframes mascot-bounce {
            0% { transform: translateY(0);}
            18% { transform: translateY(-20px);}
            28% { transform: translateY(-18px);}
            40% { transform: translateY(3px);}
            46% { transform: translateY(-8px);}
            60% { transform: translateY(0);}
            100% { transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

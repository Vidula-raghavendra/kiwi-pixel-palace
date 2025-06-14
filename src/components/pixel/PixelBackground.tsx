
import React from "react";
import { PixelCloud, PixelGem } from "./PixelIcons";

/**
 * Background grid + floating pixel items for the retro vibe
 */
export default function PixelBackground() {
  // Animated clouds and gems
  return (
    <div
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none select-none"
      style={{
        background: "repeating-linear-gradient(0deg,#e2fde4 0, #e2fde4 18px,#d9f6ce 19px,#d9f6ce 36px),repeating-linear-gradient(90deg,#e2fde4 0,#e2fde4 18px,#d9f6ce 19px,#d9f6ce 36px)",
        backgroundSize: "36px 36px",
      }}
    >
      <CloudAnim />
      <GemAnim />
      <CloudAnim rev />
    </div>
  );
}

// Pixel floating cloud anim
const CloudAnim = ({ rev = false }) => (
  <div
    className="absolute"
    style={{
      left: rev ? "80%" : "12%",
      top: rev ? "13%" : "9%",
      animation: `moveCloud${rev ? "Rev" : ""} 16s linear infinite`,
      zIndex: 0,
    }}
  >
    <PixelCloud size={36} />
    <style>
      {`
      @keyframes moveCloud {
        0% { transform: translateY(0); }
        30% { transform: translateY(16px);}
        80% { transform: translateY(-18px);}
        100% { transform: translateY(0);}
      }
      @keyframes moveCloudRev {
        0% { transform: translateY(0); }
        25% { transform: translateY(-13px);}
        60% { transform: translateY(14px);}
        100% { transform: translateY(0);}
      }
      `}
    </style>
  </div>
);

// Animated gems floating like game pickups
const GemAnim = () => (
  <div
    className="absolute"
    style={{
      left: "44%",
      top: "54%",
      animation: "floatGem 11s ease-in-out infinite",
      zIndex: 0,
    }}
  >
    <PixelGem size={23} />
    <style>
      {`
      @keyframes floatGem {
        0% { transform: translateY(0);}
        30% { transform: translateY(-9px);}
        50% { transform: translateY(14px);}
        100% { transform: translateY(0);}
      }
      `}
    </style>
  </div>
);

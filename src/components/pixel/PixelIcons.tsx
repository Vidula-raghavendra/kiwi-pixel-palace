
import React from "react";

/** Pixel-style SVG icons, meticulously built ("icons from scratch" for 8-bit look) */
export const GroupIcon = ({ size = 18, color = "#233f24" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="10" width="4" height="6" fill="#badc5b" stroke={color} strokeWidth="1"/>
    <rect x="7" y="7" width="4" height="9" fill="#6cc757" stroke={color} strokeWidth="1"/>
    <rect x="12" y="10" width="4" height="6" fill="#badc5b" stroke={color} strokeWidth="1"/>
    <rect x="5" y="4" width="8" height="5" fill="#91eead" stroke={color} strokeWidth="1" />
    <rect x="7" y="2" width="4" height="2" fill="#fff" stroke={color} strokeWidth="1"/>
  </svg>
);
export const FolderIcon = ({ size = 18, color = "#233f24" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="2" y="7" width="14" height="9" fill="#c2f8e6" stroke={color} strokeWidth="1"/>
    <rect x="3" y="6" width="6" height="2" fill="#aaf2ca" stroke={color} strokeWidth="1"/>
    <rect x="2" y="7" width="14" height="2" fill="#e7dcff" opacity=".5"/>
  </svg>
);
export const GearIcon = ({ size = 18, color = "#233f24" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="7" y="2" width="4" height="14" fill="#afe8a1" stroke={color} strokeWidth="1"/>
    <rect x="2" y="7" width="14" height="4" fill="#afe8a1" stroke={color} strokeWidth="1"/>
    <rect x="6" y="6" width="6" height="6" fill="#badc5b" stroke={color} strokeWidth="1"/>
  </svg>
);
export const HeartIcon = ({ size = 18, color = "#f66b7b" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="4" y="7" width="4" height="5" fill="#ffe6ef" stroke="#bd406a" strokeWidth="1"/>
    <rect x="10" y="7" width="4" height="5" fill="#ffe6ef" stroke="#bd406a" strokeWidth="1"/>
    <rect x="6" y="9" width="6" height="5" fill="#f66b7b" stroke="#bd406a" strokeWidth="1"/>
    <rect x="8" y="11" width="2" height="3" fill="#bd406a"/>
  </svg>
);
export const TrophyIcon = ({ size = 18, color = "#fcc96b" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="6" y="2" width="6" height="5" fill="#fff6d2" stroke={color} strokeWidth="1"/>
    <rect x="7" y="7" width="4" height="4" fill="#fcc96b" stroke="#bb9d4b" strokeWidth="1"/>
    <rect x="5" y="11" width="8" height="2" fill="#f6b867" stroke="#bb9d4b" strokeWidth="1"/>
    <rect x="7" y="14" width="4" height="2" fill="#ffd85a" stroke="#bb9d4b" strokeWidth="1"/>
  </svg>
);
export const StarIcon = ({ size = 18, color = "#ffe977" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="8" y="3" width="2" height="12" fill="#fff6da" stroke={color} strokeWidth="1"/>
    <rect x="3" y="8" width="12" height="2" fill="#ffe977" stroke="#bb9d4b" strokeWidth="1"/>
    <rect x="6" y="6" width="6" height="6" fill="#ffe977" stroke="#bb9d4b" strokeWidth="1"/>
  </svg>
);
export const KeyIcon = ({ size = 18, color = "#cbbaff" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 18 18">
    <rect x="6" y="8" width="6" height="2" fill="#cbbaff" stroke={color} strokeWidth="1"/>
    <rect x="10" y="6" width="2" height="2" fill="#cbbaff" stroke={color} strokeWidth="1"/>
    <rect x="12" y="6" width="2" height="2" fill="#f66b7b" stroke="#bd406a" strokeWidth="1"/>
  </svg>
);

// Retro chat bubble
export const ChatBubbleIcon = ({ size = 32, color = "#badc5b" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 32 32">
    <rect x="2" y="6" width="28" height="17" fill="#badc5b" stroke="#233f24" strokeWidth="2" />
    <rect x="10" y="23" width="8" height="4" fill="#badc5b" stroke="#233f24" strokeWidth="2"/>
  </svg>
);

// Floating Background: Gem, Cloud
export const PixelGem = ({ size = 16 }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 16 16">
    <rect x="4" y="2" width="8" height="2" fill="#acf3d1" stroke="#209981" strokeWidth="1"/>
    <rect x="2" y="4" width="12" height="10" fill="#b1eda9" stroke="#6bc151" strokeWidth="1"/>
    <rect x="5" y="14" width="6" height="1.5" fill="#aee7f7" />
  </svg>
);
export const PixelCloud = ({ size = 28 }) => (
  <svg width={size} height={size} className="pixel-icon" viewBox="0 0 28 16">
    <rect x="2" y="8" width="20" height="6" fill="#e0f7fa" stroke="#7ad0d3" strokeWidth="1"/>
    <rect x="12" y="4" width="10" height="6" fill="#e0f7fa" stroke="#7ad0d3" strokeWidth="1"/>
    <rect x="18" y="10" width="6" height="3" fill="#e0f7fa" stroke="#7ad0d3" strokeWidth="1"/>
  </svg>
);

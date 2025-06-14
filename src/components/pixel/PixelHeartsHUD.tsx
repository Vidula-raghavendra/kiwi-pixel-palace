
import React from "react";
import { HeartIcon } from "./PixelIcons";

// Hearts for "lives" in top-right HUD
export default function PixelHeartsHUD({ count = 3 }) {
  return (
    <div className="absolute top-3 right-6 flex gap-1 z-30 pointer-events-none">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="pixel-outline" style={{ background: "#fff" }}>
            <HeartIcon size={22} />
          </span>
        ))}
    </div>
  );
}

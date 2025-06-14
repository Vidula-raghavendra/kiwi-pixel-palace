
import React from "react";
import clsx from "clsx";

/**
 * Pixel 3D Button with stylized soft 3D effect.
 * Props: color: 'kiwi' | 'peach'
 */
export default function Pixel3DButton({
  children,
  color = "kiwi",
  onClick,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  color?: "kiwi" | "peach";
  onClick?: () => void;
  className?: string;
}) {
  const palette = color === "kiwi"
    ? {
        base: "#badc5b",
        shadow: "#879e32",
        highlight: "#e2fde4",
      }
    : {
        base: "#ffe6ef",
        shadow: "#d2b2b2",
        highlight: "#ffe6ef",
      };

  return (
    <button
      className={clsx(
        "pixel-font relative px-7 py-3 text-xl border-2 border-[#233f24] rounded-lg",
        "active:translate-y-1",
        "shadow-[0_2px_0_#ad9271,0_5px_5px_#d2a67255]",
        "transition-transform duration-75 select-none",
        className,
      )}
      style={{
        background: palette.base,
        boxShadow: `0 3px 0 ${palette.shadow}, 0 10px 16px 0 ${palette.base}50`,
        color: "#322d2d",
        textShadow: `0 1px 0 ${palette.highlight}`,
        outline: "none",
      }}
      onClick={onClick}
      {...props}
    >
      {children}
      <span
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          border: `1.5px solid #9cb575`,
          boxShadow: `0 1px 0 ${palette.highlight}`,
        }}
      />
    </button>
  );
}

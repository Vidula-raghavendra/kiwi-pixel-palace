
import React from "react";

export default function FooterSection() {
  return (
    <footer className="w-full mt-12 mb-3 flex flex-col items-center">
      <div className="pixel-font text-[#ad9271] text-sm">
        © {(new Date()).getFullYear()} KIWI Team — Crafted with 💚 by your squad
      </div>
    </footer>
  );
}

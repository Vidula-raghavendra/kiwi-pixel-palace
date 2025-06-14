
import React from "react";

const features = [
  {
    icon: "🌟",
    label: "Pixel + soft 3D workspace",
  },
  {
    icon: "🪄",
    label: "Animated mascot for help & cheer",
  },
  {
    icon: "🔐",
    label: "Secure login with JWT",
  },
  {
    icon: "🤝",
    label: "Team projects, chat, tasks",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-3">
      <div className="pixel-font text-2xl mb-3 text-[#ad9271] uppercase">Features</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#bbeaff] border-2 border-[#233f24] rounded-lg p-5 pixel-font text-lg shadow-[0_2px_0_#97aac9]"
          >
            <span className="text-3xl">{f.icon}</span> <span>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

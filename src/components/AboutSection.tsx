
import React from "react";
import { Gamepad2, Code, Sparkles } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4">
      <div className="pixel-font text-3xl md:text-4xl mb-6 text-center text-[#233f24] tracking-wide">
        Why Teams Love KIWI
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#fffdf3] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#badc5b] border-2 border-[#233f24] flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-[#233f24]" />
            </div>
          </div>
          <h3 className="pixel-font text-lg text-[#233f24] mb-3 text-center">Delightfully Simple</h3>
          <p className="pixel-font text-sm text-[#7b6449] leading-relaxed text-center">
            No steep learning curve. Pixel-art interface feels like playing a game while getting real work done.
          </p>
        </div>

        <div className="bg-[#f0ffe8] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#8bb47e] border-2 border-[#233f24] flex items-center justify-center">
              <Code className="w-8 h-8 text-[#233f24]" />
            </div>
          </div>
          <h3 className="pixel-font text-lg text-[#233f24] mb-3 text-center">Built for Developers</h3>
          <p className="pixel-font text-sm text-[#7b6449] leading-relaxed text-center">
            GitHub integration, AI coding assistants, and real-time collaboration built for modern dev teams.
          </p>
        </div>

        <div className="bg-[#fff7ea] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#f59e42] border-2 border-[#233f24] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#233f24]" />
            </div>
          </div>
          <h3 className="pixel-font text-lg text-[#233f24] mb-3 text-center">AI-Powered</h3>
          <p className="pixel-font text-sm text-[#7b6449] leading-relaxed text-center">
            Two AI assistants in every workspace. Compare answers, drag conversations, solve problems faster.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#badc5b] to-[#8bb47e] border-4 border-[#233f24] p-8 shadow-[0_6px_0_#233f24] text-center">
        <p className="pixel-font text-xl md:text-2xl text-[#233f24] leading-relaxed">
          "KIWI Team turns collaboration into an adventure. Our team ships features 2x faster, and we actually enjoy our daily standups now!"
        </p>
        <p className="pixel-font text-sm text-[#233f24] mt-4">
          - Dev Team at PixelCraft Studios
        </p>
      </div>
    </section>
  );
}

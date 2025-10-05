
import React from "react";
import PixelMascot from "../components/PixelMascot";
import Pixel3DButton from "../components/Pixel3DButton";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import FooterSection from "../components/FooterSection";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Sparkles, Shield, Zap, Heart } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-2 h-2 bg-[#badc5b] shadow-lg opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `star-float-${i % 2 ? "a" : "b"} ${8 + (i % 6)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <style>
          {`
          @keyframes star-float-a {
            0%, 100% {transform: translate(0, 0) rotate(0deg); opacity: 0.4;}
            50% {transform: translate(-20px, -30px) rotate(180deg); opacity: 0.8;}
          }
          @keyframes star-float-b {
            0%, 100% {transform: translate(0, 0) rotate(0deg); opacity: 0.4;}
            50% {transform: translate(25px, 35px) rotate(-180deg); opacity: 0.8;}
          }
          `}
        </style>
      </div>

      <header className="w-full text-center mt-16 mb-8 px-4 relative z-10">
        <div className="inline-block mb-6 animate-bounce">
          <div className="w-20 h-20 bg-[#badc5b] border-4 border-[#233f24] flex items-center justify-center shadow-[0_4px_0_#233f24] hover:shadow-[0_6px_0_#233f24] hover:translate-y-[-2px] transition-all">
            <Sparkles className="w-10 h-10 text-[#233f24]" />
          </div>
        </div>
        <h1 className="pixel-font text-6xl md:text-7xl text-[#233f24] drop-shadow-[4px_4px_0_rgba(186,220,91,0.5)] tracking-wider mb-4 leading-tight">
          <span className="text-[#8bb47e]">KIWI</span>
          <br />
          <span className="text-[#badc5b]">TEAM</span>
        </h1>
        <p className="pixel-font text-[#7b6449] text-2xl md:text-3xl mb-4">Pixel-Powered Collaboration</p>
        <p className="pixel-font text-[#ad9271] text-lg max-w-2xl mx-auto leading-relaxed">
          Your team's new favorite workspace. Build together, chat with AI assistants, and ship faster—all in a delightful retro experience.
        </p>
      </header>

      <div className="relative flex flex-col items-center mb-10 z-10">
        <PixelMascot message="Ready to level up your teamwork?" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-16 z-10">
        <Pixel3DButton color="kiwi" onClick={() => navigate("/auth")}>
          🚀 Get Started
        </Pixel3DButton>
        <Pixel3DButton color="peach" onClick={() => navigate("/auth")}>
          🎮 Join the Game
        </Pixel3DButton>
      </div>

      <section className="w-full max-w-6xl mx-auto px-4 mb-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#fffdf3] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#8bb47e]" />
              <h3 className="pixel-font text-xl text-[#233f24]">Real-Time Teams</h3>
            </div>
            <p className="pixel-font text-[#7b6449] text-sm leading-relaxed">
              Create workspaces, invite teammates with instant codes, and collaborate seamlessly with presence indicators.
            </p>
          </div>

          <div className="bg-[#f0ffe8] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-[#badc5b]" />
              <h3 className="pixel-font text-xl text-[#233f24]">Dual AI Chat</h3>
            </div>
            <p className="pixel-font text-[#7b6449] text-sm leading-relaxed">
              Two AI assistants side by side. Compare responses, drag conversations, and get the best answers instantly.
            </p>
          </div>

          <div className="bg-[#fff7ea] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#ad9271]" />
              <h3 className="pixel-font text-xl text-[#233f24]">Secure & Fast</h3>
            </div>
            <p className="pixel-font text-[#7b6449] text-sm leading-relaxed">
              GitHub OAuth, real-time sync via Supabase, and lightning-fast performance. Your data stays protected.
            </p>
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturesSection />

      <section className="w-full max-w-4xl mx-auto px-4 mb-16 text-center z-10">
        <div className="bg-gradient-to-br from-[#badc5b] to-[#8bb47e] border-4 border-[#233f24] p-12 shadow-[0_6px_0_#233f24]">
          <h2 className="pixel-font text-3xl md:text-4xl text-[#233f24] mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="pixel-font text-[#233f24] text-lg mb-8 max-w-2xl mx-auto">
            Join teams already shipping faster with AI-powered collaboration.
          </p>
          <Pixel3DButton color="peach" onClick={() => navigate("/auth")}>
            ⚡ Start Now - It's Free
          </Pixel3DButton>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}


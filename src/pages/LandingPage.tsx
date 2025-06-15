
import React from "react";
import PixelMascot from "../components/PixelMascot";
import Pixel3DButton from "../components/Pixel3DButton";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import FooterSection from "../components/FooterSection";
import { useNavigate } from "react-router-dom";
import StoryblokBlock from "../components/StoryblokBlock"; // NEW

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#e2fde4] to-[#fff7ea]">
      {/* Storyblok content: simple block with your API key and slug */}
      <div className="w-full max-w-xl mx-auto mt-4">
        <StoryblokBlock
          apiKey="3g8JZw33SLAbX0dAYNuNhgtt-293643-b2juxchnAieqaayEUA1b"
          storySlug="welcome"
        />
      </div>
      {/* Pixel stars animated BG */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Dots as pixel stars */}
        {[...Array(28)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-1.5 h-1.5 rounded-sm bg-[#badc5b] shadow-lg opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `star-float-${i % 2 ? "a" : "b"} ${6 + (i % 5)}s linear infinite`,
            }}
          />
        ))}
        <style>
          {`
          @keyframes star-float-a { 0% {transform: translateY(0);} 100% {transform: translateY(-25px);} }
          @keyframes star-float-b { 0% {transform: translateY(0);} 100% {transform: translateY(30px);} }
          `}
        </style>
      </div>

      <header className="w-full text-center mt-10 mb-6">
        <h1 className="pixel-font text-4xl text-[#2e2923] drop-shadow-md tracking-wide mb-2">
          <span className="text-[#badc5b]">K I W I</span> <span className="text-[#e3b7a0]">TEAM</span>
        </h1>
        <p className="pixel-font text-[#ad9271] text-xl">Pixel-Powered Collaboration</p>
      </header>

      {/* Mascot */}
      <div className="relative flex flex-col items-center mb-6">
        <PixelMascot message="Hey there, Player! Ready to build?" />
      </div>

      {/* Main CTA - Updated to use new auth flow */}
      <div className="flex gap-6 mb-12">
        <Pixel3DButton color="kiwi" onClick={() => navigate("/auth")}>
          🎮 Start Game
        </Pixel3DButton>
        <Pixel3DButton color="peach" onClick={() => navigate("/auth")}>
          🌱 New Player
        </Pixel3DButton>
      </div>

      {/* Static about and features */}
      <AboutSection />
      <FeaturesSection />

      {/* Additional rich Storyblok content - Tips & News */}
      <div className="w-full max-w-xl mx-auto mt-10 mb-8">
        <div className="pixel-font text-[#ad9271] text-lg mb-2 pl-1">📰 Tips & News from the Team</div>
        <StoryblokBlock
          apiKey="3g8JZw33SLAbX0dAYNuNhgtt-293643-b2juxchnAieqaayEUA1b"
          storySlug="news"
        />
      </div>

      <FooterSection />
    </main>
  );
}


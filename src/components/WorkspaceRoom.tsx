
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const demoAvatars = [
  {
    name: "KiwiBot",
    img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=KiwiBot&eyes=variant09&mouth=variant13&scale=110",
  },
  {
    name: "You",
    img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=You&scale=110",
  },
];

const activities = [
  "You entered your workspace.",
  "KiwiBot sent a welcome message.",
  "You earned +50 Pixel Coins.",
];

export default function WorkspaceRoom() {
  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center px-2 py-6 animate-fade-in">
      <div className="mb-6 mt-2 px-5 py-3 bg-[#b4f49f] pixel-outline pixel-font text-xl text-[#233f24] text-center shadow-lg no-radius">
        <span role="img" aria-label="Pixel Room" className="mr-2">
          🛏️
        </span>
        MY ROOM
      </div>
      <div className="flex flex-row flex-wrap items-start justify-center gap-8 w-full max-w-3xl">
        {/* Pixel avatars */}
        <section className="flex flex-col items-center gap-2 bg-[#fffde8] pixel-outline p-5 min-w-[175px] max-w-[210px] no-radius">
          <div className="pixel-font text-base text-[#233f24] mb-2">
            Residents
          </div>
          <div className="flex flex-row gap-5">
            {demoAvatars.map((a) => (
              <div key={a.name} className="flex flex-col items-center gap-1">
                <span className="pixel-outline bg-[#e8f6da] p-1 no-radius">
                  <img
                    src={a.img}
                    alt={a.name}
                    width={52}
                    height={52}
                    style={{
                      imageRendering: "pixelated",
                      width: 52,
                      height: 52,
                      display: "block",
                    }}
                  />
                </span>
                <span className="pixel-font text-xs text-[#7b6449]">{a.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main message and demo stats */}
        <section className="flex-1 min-w-[220px] max-w-[360px] flex flex-col gap-4 items-center bg-[#fffdf3] pixel-outline p-6 no-radius">
          <div className="pixel-font text-lg text-[#8bb47e] text-center mb-2">
            Welcome to your room! <br />
            Here you'll see your quests, team, and progress.
          </div>
          <ul className="pixel-font text-[13px] text-[#233f24] text-left bg-[#f9fbe3] rounded-md px-3 py-2 border border-[#badc5b] w-full">
            {activities.map((act, i) => (
              <li key={i} className="relative pl-4 mb-1">
                <span className="absolute left-0 top-0 text-[#badc5b]">✦</span>
                {act}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Button
        variant="secondary"
        className="pixel-font text-[#233f24] mt-10 flex flex-row items-center gap-2 px-5 py-2 border-[#233f24] border-2 rounded-lg shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all"
        asChild
      >
        <a href="/home">
          <ArrowLeft className="mr-1" size={20} />
          Back to Home
        </a>
      </Button>
    </div>
  );
}

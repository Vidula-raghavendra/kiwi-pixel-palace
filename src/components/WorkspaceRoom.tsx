
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PixelTeamDropdown from "./pixel/PixelTeamDropdown";
import PixelChatBox from "./pixel/PixelChatBox";
import PixelTodo from "./pixel/PixelTodo";
import PixelChatRoom from "./pixel/PixelChatRoom";

export default function WorkspaceRoom() {
  // Example team data
  const [team] = useState({
    name: "KIWI Team",
    members: [
      { name: "Alex", role: "Admin" },
      { name: "Pat", role: "Editor" },
      { name: "Val", role: "Viewer" },
      { name: "Fran", role: "Viewer" },
      { name: "Taylor", role: "Editor" },
    ],
  });

  return (
    <div className="relative w-full min-h-screen bg-[#e2fde4] flex flex-col items-center justify-start py-5 px-2">
      {/* Top Dashboard Bar with Team Dropdown */}
      <div className="w-full max-w-4xl flex flex-row items-start justify-between mb-3">
        <PixelTeamDropdown team={team} />
        <Button
          variant="secondary"
          className="pixel-font text-[#233f24] flex flex-row items-center gap-2 px-5 py-2 border-[#233f24] border-2 rounded-lg shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all ml-3"
          asChild
        >
          <a href="/home">
            <ArrowLeft className="mr-1" size={20} />
            Back to Home
          </a>
        </Button>
      </div>
      {/* Main grid layout */}
      <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row gap-6 items-start justify-center">
        {/* Center: Chatbot */}
        <div className="flex-1 min-w-[320px] flex items-center justify-center">
          <div className="w-full flex justify-center">
            <PixelChatBox />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-4 min-w-[280px] w-[320px]">
          {/* Top-right: To Do */}
          <PixelTodo />
          {/* Bottom-right: Team Chatroom */}
          <PixelChatRoom team={team} />
        </div>
      </div>
    </div>
  );
}

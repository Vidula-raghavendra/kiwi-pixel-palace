
import React from "react";
import PixelSidebar from "../components/pixel/PixelSidebar";
import PixelChatBox from "../components/pixel/PixelChatBox";
import PixelRightPanel from "../components/pixel/PixelRightPanel";
import PixelBackground from "../components/pixel/PixelBackground";
import PixelHeartsHUD from "../components/pixel/PixelHeartsHUD";
import "../components/pixel/PixelFont.css";
import "../components/pixel/PixelCursor.css";

/**
 * Main Kiwi Dashboard Pixel UI
 */
const Index = () => {
  return (
    <div className="relative bg-transparent w-screen min-h-screen overflow-x-hidden flex items-stretch">
      {/* Animated background */}
      <PixelBackground />

      {/* Pixel lives (top right HUD) */}
      <PixelHeartsHUD count={3} />

      {/* Layout */}
      <div
        className="w-full flex flex-row items-stretch z-10"
        style={{ minHeight: "100vh" }}
      >
        {/* Sidebar */}
        <PixelSidebar />

        {/* Main Content */}
        <main
          className="flex-1 flex flex-col items-center justify-center py-10"
          style={{
            background: "none",
            minHeight: "100vh",
            zIndex: 1,
            position: "relative",
          }}
        >
          <PixelChatBox />
        </main>

        {/* Right Panel */}
        <PixelRightPanel />
      </div>
    </div>
  );
};

export default Index;

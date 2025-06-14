
import React from "react";
import { GroupIcon, FolderIcon, GearIcon } from "./PixelIcons";

/** LEFT SIDEBAR: vertical pixel nav bar with tabs */
const tabs = [
  {
    label: "Team",
    icon: <GroupIcon size={20} />,
    active: true,
  },
  {
    label: "Spaces",
    icon: <FolderIcon size={20} />,
    active: false,
  },
  {
    label: "Settings",
    icon: <GearIcon size={20} />,
    active: false,
  },
];

const PixelSidebar = () => (
  <nav
    className="flex flex-col w-28 min-w-28 px-1 pt-5 pb-6 items-center gap-4 bg-[#e8f6da] border-r-2 border-[#233f24] pixel-outline no-radius"
    style={{
      boxShadow: "none",
      minHeight: "100vh",
      backgroundRepeat: 'repeat',
      zIndex: 2,
    }}
  >
    {tabs.map((tab, idx) => (
      <button
        key={tab.label}
        className={`flex flex-col items-center justify-center w-20 h-12 mb-3 pixel-outline ${tab.active ? "bg-[#b4f49f]" : "bg-[#d5f3c2]"} transition-colors no-radius`}
        style={{
          outlineOffset: "-3px",
          outlineWidth: "2px",
        }}
        tabIndex={0}
      >
        <span className="mb-1">{tab.icon}</span>
        <span className="pixel-font text-[11px] pixel-title drop-shadow-[1px_1px_0px_#fff] text-[#233f24]">{tab.label}</span>
      </button>
    ))}
  </nav>
);

export default PixelSidebar;

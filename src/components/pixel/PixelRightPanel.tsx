
import React from "react";
import { TrophyIcon, StarIcon, KeyIcon } from "./PixelIcons";

/** PIXEL RIGHT PANEL: To-do and Team with chibi avatars */
const todos = [
  { label: "Create a new project", done: false },
  { label: "Explore LLM capabilities", done: false },
  { label: "Collaborate with team", done: false },
];
// Chibi pixel avatar svgs
const avatars = [
  {
    name: "Alex",
    svg: (
      <svg width="40" height="40" className="pixel-icon" style={{ imageRendering: "pixelated" }} viewBox="0 0 40 40">
        <rect x="12" y="7" width="16" height="17" fill="#fdebd8" stroke="#6b4c33" strokeWidth="2"/>
        <rect x="13" y="12" width="6" height="6" fill="#f6c5d5"/>
        <rect x="19" y="21" width="2" height="2" fill="#2b2c6a"/>
        <rect x="18" y="26" width="4" height="3" fill="#91eead"/> {/* Shirt */}
        <rect x="17.5" y="32" width="5" height="2" fill="#fffde8"/>
      </svg>
    ),
  },
  {
    name: "Pat",
    svg: (
      <svg width="40" height="40" className="pixel-icon" viewBox="0 0 40 40">
        <rect x="11" y="10" width="18" height="14" fill="#9ed0ee" stroke="#234d67" strokeWidth="2"/>
        <rect x="13" y="17" width="9" height="5" fill="#e0cab0"/> {/* Face */}
        <rect x="13" y="24" width="7" height="4" fill="#c2f8e6"/> {/* Shirt */}
      </svg>
    ),
  },
  {
    name: "Val",
    svg: (
      <svg width="40" height="40" className="pixel-icon" viewBox="0 0 40 40">
        <rect x="13" y="11" width="14" height="13" fill="#fff6d1" stroke="#d6a84b" strokeWidth="2"/>
        <rect x="17" y="15" width="6" height="6" fill="#d99391"/>
        <rect x="15" y="24" width="10" height="4" fill="#badc5b"/> {/* Body */}
      </svg>
    ),
  },
  {
    name: "Fran",
    svg: (
      <svg width="40" height="40" className="pixel-icon" viewBox="0 0 40 40">
        <rect x="14" y="13" width="12" height="10" fill="#fdebd8" stroke="#916313" strokeWidth="2"/>
        <rect x="16" y="19" width="8" height="4" fill="#f1cad9"/>
        <rect x="15" y="26" width="10" height="4" fill="#cbbaff"/> {/* shirt */}
      </svg>
    ),
  },
  {
    name: "Taylor",
    svg: (
      <svg width="40" height="40" className="pixel-icon" viewBox="0 0 40 40">
        <rect x="11" y="9" width="18" height="15" fill="#d9b09b" stroke="#714414" strokeWidth="2"/>
        <rect x="14" y="17" width="7" height="6" fill="#fffde8"/>
        <rect x="15" y="26" width="10" height="4" fill="#96e5ff"/> {/* shirt */}
      </svg>
    ),
  },
];

export default function PixelRightPanel() {
  return (
    <aside className="w-64 min-w-56 max-w-72 flex flex-col gap-7 pt-8 pb-6 pr-5 pl-2 z-10"
      style={{ minHeight: "80vh" }}>
      {/* To-Do List (pixel checkboxes) */}
      <div className="mb-2">
        <div className="pixel-title pixel-font tracking-wide text-[15px] text-[#233f24] mb-3">
          TO-DO
        </div>
        <ul className="flex flex-col gap-2">
          {todos.map((todo, idx) => (
            <li key={todo.label} className="flex items-center gap-3">
              <span
                className={`pixel-outline no-radius flex items-center justify-center w-5 h-5`}
                style={{
                  background: "#e6fadf",
                  borderColor: "#badc5b",
                  boxShadow: "inset 0px 2px #fff",
                }}
              >
                {/* Show retro pixel tick if done */}
                {todo.done ? (
                  <svg width="13" height="13" viewBox="0 0 13 13">
                    <rect x="2" y="6" width="2" height="3" fill="#233f24"/>
                    <rect x="3" y="7" width="5" height="2" fill="#233f24"/>
                    <rect x="7" y="3" width="2" height="6" fill="#233f24"/>
                  </svg>
                ) : null}
              </span>
              <span className="pixel-font text-[12px] text-[#233f24]">{todo.label}</span>
              {/* Achievement icons beside third item */}
              {idx === 0 && <TrophyIcon size={18} />}
              {idx === 1 && <StarIcon size={18} />}
              {idx === 2 && <KeyIcon size={18} />}
            </li>
          ))}
        </ul>
      </div>
      {/* Team grid */}
      <div>
        <div className="pixel-title pixel-font tracking-wide text-[15px] text-[#233f24] mb-1">
          MY TEAM
        </div>
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 items-center">
          {avatars.map((a) => (
            <div key={a.name} className="flex flex-col items-center mt-2">
              <span className="pixel-outline bg-[#fffde8] px-1 pt-1 pb-0 no-radius">{a.svg}</span>
              <span className="pixel-font text-[11px] text-[#233f24] mt-0.5">{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

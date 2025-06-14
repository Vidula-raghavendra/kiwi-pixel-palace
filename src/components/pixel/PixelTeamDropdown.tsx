
import React, { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type Team = {
  name: string;
  members: { name: string; role: string }[];
};

export default function PixelTeamDropdown({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="pixel-outline bg-[#fffde8] px-5 py-2 rounded-lg flex items-center gap-2 pixel-font text-[#233f24] text-base border-2 border-[#8bb47e] shadow-[0_2px_0_#badc5b] transition-all hover:scale-[1.04]"
        onClick={() => setOpen((prev) => !prev)}
        style={{ fontWeight: 700, minWidth: 160 }}
      >
        {team.name}
        {open ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
      </button>
      {open && (
        <div className="absolute left-0 top-[105%] min-w-full bg-[#f9fbe3] pixel-outline border-2 border-[#badc5b] rounded-lg shadow-xl z-30 mt-1 p-0">
          <ul className="pixel-font text-[#233f24] text-sm py-2 px-4 flex flex-col gap-1">
            {team.members.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <span className="font-bold">{m.name}</span>
                <span className="text-xs text-[#8bb47e]">({m.role})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


import React, { useState, useRef, useEffect } from "react";

type Team = {
  members: { name: string; role: string }[];
};

type Message = {
  user: string;
  text: string;
  timestamp: number;
};

/**
 * Team chatroom demo (only local, not networked)
 * Shows team member avatars, simple input & chat log.
 */
export default function PixelChatRoom({ team }: { team: Team }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      user: "Alex",
      text: "Hey team! Let's start our next quest 🍃",
      timestamp: Date.now(),
    },
    {
      user: "Pat",
      text: "Ready when you are! 👾",
      timestamp: Date.now() + 2000,
    },
  ]);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when new message
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { user: "You", text: input, timestamp: Date.now() },
    ]);
    setInput("");
  }

  return (
    <div className="pixel-outline bg-[#f7fdf2] rounded-lg p-3 mt-2 flex flex-col h-64 max-h-72 shadow-lg">
      <div className="pixel-title pixel-font text-[#8bb47e] text-[13px] mb-2">TEAM CHAT ROOM</div>
      {/* Chat log */}
      <div
        className="flex-1 overflow-y-auto px-1 mb-2 border border-[#e2fde4] rounded"
        ref={logRef}
        style={{ background: "#fffde8" }}
      >
        <ul className="flex flex-col gap-2 pt-2 pb-1">
          {messages.map((msg, i) => (
            <li key={i} className="flex gap-2 items-top">
              <span className="pixel-outline bg-[#e8f6da] p-0.5 no-radius h-7 w-7 flex items-center justify-center mr-1">
                <span className="pixel-font text-xs text-[#8bb47e]">{msg.user.charAt(0)}</span>
              </span>
              <span className="pixel-font text-[12px] text-[#233f24]">{msg.text}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Input */}
      <form className="flex items-center gap-2" onSubmit={send}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="pixel-font text-[12px] px-2 py-1 border pixel-outline bg-[#fff] rounded w-full outline-none"
          placeholder="Message team..."
          maxLength={160}
          spellCheck={false}
        />
        <button
          type="submit"
          className="pixel-font bg-[#badc5b] hover:bg-[#aed57a] text-[#233f24] rounded px-2 py-1 shadow transition"
          style={{ fontWeight: 700, fontSize: "13px" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

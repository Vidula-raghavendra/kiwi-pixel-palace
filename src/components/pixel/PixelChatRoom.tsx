
import React, { useState, useRef, useEffect } from "react";
import { Team } from "@/hooks/useTeams";
import { useTeamChat } from "@/hooks/useTeamChat";

type Message = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    github_username: string | null;
  } | null;
};

export default function PixelChatRoom({ team }: { team: Team }) {
  const { messages, sendMessage, loading, error } = useTeamChat(team?.id);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input).then((result) => {
      if (!result?.ok) {
        setLocalError(result.error || "Could not send the message.");
      } else {
        setLocalError(null); // sent ok!
        setInput("");
      }
    });
  }

  return (
    <div className="pixel-outline bg-[#f7fdf2] rounded-lg p-3 mt-2 flex flex-col h-64 max-h-72 shadow-lg">
      <div className="pixel-title pixel-font text-[#8bb47e] text-[13px] mb-2">
        TEAM CHAT ROOM
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 rounded px-2 py-1 mb-2 text-xs text-red-700 pixel-font">
          {error}
        </div>
      )}
      {localError && (
        <div className="bg-yellow-100 border border-yellow-400 rounded px-2 py-1 mb-2 text-xs text-yellow-700 pixel-font">
          {localError}
        </div>
      )}
      <div
        className="flex-1 overflow-y-auto px-1 mb-2 border border-[#e2fde4] rounded"
        ref={logRef}
        style={{ background: "#fffde8" }}
      >
        <ul className="flex flex-col gap-2 pt-2 pb-1">
          {loading ? (
            <li className="pixel-font text-[#ad9271] text-xs">Loading messages…</li>
          ) : messages.length === 0 ? (
            <li className="pixel-font text-[#ad9271] text-xs">No messages yet. Say hi!</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="flex gap-2 items-top">
                <span className="pixel-outline bg-[#e8f6da] p-0.5 no-radius h-7 w-7 flex items-center justify-center mr-1">
                  <span className="pixel-font text-xs text-[#8bb47e]">
                    {msg.profiles?.full_name?.charAt(0)
                      || msg.profiles?.username?.charAt(0)
                      || "?"}
                  </span>
                </span>
                <span className="pixel-font text-[12px] text-[#233f24]">
                  <span className="font-semibold mr-1 text-[#ad9271]">
                  {msg.profiles?.full_name || msg.profiles?.username || "User"}
                  :</span>
                  {msg.message}
                </span>
                <span className="ml-auto text-[10px] text-[#ad9271] self-end">
                  {msg.created_at &&
                    new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
      <form className="flex items-center gap-2" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="pixel-font text-[12px] px-2 py-1 border pixel-outline bg-[#fff] rounded w-full outline-none"
          placeholder="Message team..."
          maxLength={160}
          spellCheck={false}
          disabled={!!error || loading}
        />
        <button
          type="submit"
          className="pixel-font bg-[#badc5b] hover:bg-[#aed57a] text-[#233f24] rounded px-2 py-1 shadow transition"
          style={{ fontWeight: 700, fontSize: "13px" }}
          disabled={!!error || loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}


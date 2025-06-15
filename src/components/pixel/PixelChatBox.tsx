import React, { useState, useRef } from "react";
import { ChatBubbleIcon, PixelGem } from "./PixelIcons";

// Message type for chat
type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function PixelChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "welcome to kiwi! how can i help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the latest message when messages change
  const chatBodyRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Append user's message
    setMessages((msgs) => [...msgs, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    // Call Gemini DIRECT via Supabase Edge Function
    try {
      const res = await fetch(
        "https://wuetwwdfqellisyxpivr.supabase.co/functions/v1/gemini-direct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmed }),
        }
      );
      const data = await res.json();

      if (data?.result) {
        setMessages((msgs) => [...msgs, { sender: "ai", text: data.result }]);
      } else if (data?.error) {
        // Always show error, raw, and status for debugging.
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "ai",
            text:
              "There was an error from the AI:\n" +
              (data.error ? "Error: " + data.error + "\n" : "") +
              (data.status ? "Status: " + data.status + "\n" : "") +
              (data.raw
                ? "Gemini's response:\n" + JSON.stringify(data.raw, null, 2)
                : ""),
          },
        ]);
      } else if (data?.raw) {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "ai",
            text:
              "No clear response from AI. Raw Gemini output:\n" +
              JSON.stringify(data.raw, null, 2),
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { sender: "ai", text: "No response from AI and no error details." },
        ]);
      }
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Network error: " + String(err?.message || "Unknown error"),
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  // Press Enter to send, Shift+Enter for newline
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSubmit(e as any);
      }
    }
  }

  return (
    <section
      className="flex flex-col items-center justify-center px-7 py-4 w-full h-full"
      style={{ minWidth: "340px", maxWidth: "540px" }}
    >
      <div
        className="pixel-outline bg-[#fffde8] flex flex-col items-stretch px-0 py-0 shadow-none no-radius"
        style={{
          minWidth: "330px",
          boxSizing: "border-box",
          borderWidth: "3px",
        }}
      >
        {/* Header */}
        <div
          className="pixel-outline bg-[#b4f49f] block py-2 px-5 pixel-font pixel-title text-[#233f24] tracking-wide no-radius"
          style={{
            fontSize: "15px",
            borderBottom: "none",
            outlineWidth: "2.5px",
          }}
        >
          MY WORKSPACE
        </div>
        {/* Chat Body */}
        <div
          ref={chatBodyRef}
          className="relative flex flex-col gap-4 py-6 pb-2 px-6 bg-[#fffde8] min-h-[120px] max-h-[260px] overflow-y-auto"
          style={{ transition: "background 0.2s" }}
        >
          {messages.map((m, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {/* Avatar for AI */}
              {m.sender === "ai" && (
                <div className="mr-2 flex-shrink-0">
                  <div
                    className="w-8 h-8 pixel-outline bg-[#f0fdde] flex items-center justify-center no-radius"
                    style={{ outlineColor: "#8CC84B" }}
                  >
                    <img
                      src="https://api.dicebear.com/7.x/pixel-art/svg?seed=KiwiBot&eyes=variant09&mouth=variant13&scale=110"
                      alt="KIWI AI avatar"
                      width={22}
                      height={22}
                      style={{
                        imageRendering: "pixelated",
                        width: 22,
                        height: 22,
                        display: "block",
                      }}
                      className="no-radius"
                    />
                  </div>
                </div>
              )}
              {/* User bubble */}
              {m.sender === "user" && (
                <div className="mr-2 flex-shrink-0" />
              )}
              {/* Message bubble */}
              <div
                className={`relative flex-1 min-w-0 ${
                  m.sender === "ai"
                    ? "pl-2"
                    : "flex justify-end text-right pr-2"
                }`}
              >
                <div className="relative flex items-center">
                  {m.sender === "ai" && (
                    <span className="absolute -left-6 -top-2 z-0">
                      <ChatBubbleIcon size={28} />
                    </span>
                  )}
                  <div
                    className={`z-10 pixel-font text-[12px] text-[#233f24] rounded px-3 py-2 ${
                      m.sender === "ai"
                        ? "bg-[#ebffde]"
                        : "bg-[#d6f4f7] border border-[#b4f4ea]"
                    }`}
                    style={{ textTransform: "none", wordBreak: "break-word" }}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 opacity-80 pl-8">
              <span className="h-3 w-3 rounded-full bg-[#badc5b] animate-pulse mr-2" />
              <span className="pixel-font text-xs text-[#88b062]">
                Thinking...
              </span>
            </div>
          )}
        </div>
        {/* Chat Bar: RPG input */}
        <form
          className="flex items-center px-4 py-3 bg-[#e8f6da] pixel-outline border-t-0 border-[#badc5b] no-radius"
          style={{
            borderTop: 0,
            minHeight: "44px",
          }}
          onSubmit={handleSubmit}
        >
          {/* Emoji/Gem */}
          <span className="mr-2 flex items-center justify-center">
            <PixelGem size={18} />
          </span>
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            className="pixel-font text-[13px] no-radius bg-[#fff] py-1 px-2 w-full outline-none border-2 border-[#b4f49f] pixel-outline"
            placeholder="type your message..."
            style={{
              outlineWidth: "1px",
              borderRadius: 0,
              minHeight: "27px",
              boxSizing: "border-box",
            }}
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          {/* Send button */}
          <button
            type="submit"
            className="ml-3 flex items-center justify-center px-2 py-1 pixel-outline bg-[#91eead] hover:bg-[#b4f49f] no-radius pixel-font text-xs text-[#233f24] transition"
            style={{ fontWeight: "bold", fontSize: "13px" }}
            disabled={loading || input.trim().length === 0}
          >
            {loading ? "..." : "SEND"}
          </button>
        </form>
      </div>
    </section>
  );
}

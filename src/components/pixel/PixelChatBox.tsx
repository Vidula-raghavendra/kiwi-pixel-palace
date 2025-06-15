
import React, { useState, useRef, useEffect } from "react";

// Minimal ChatMessage type
type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function PixelChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! Ask me anything ✨" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  async function askGemini(question: string) {
    setLoading(true);
    try {
      const res = await fetch(
        "https://wuetwwdfqellisyxpivr.supabase.co/functions/v1/gemini-direct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: question }),
        }
      );
      const data = await res.json();
      if (res.ok && data?.result) {
        setMessages((msgs) => [...msgs, { sender: "ai", text: data.result }]);
      } else {
        // pass through the error from backend
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "ai",
            text:
              "❗ Error: " +
              (typeof data?.error === "string"
                ? data.error
                : JSON.stringify(data?.error)) +
              (data?.status ? ` [Status: ${data.status}]` : "") +
              (data?.raw
                ? "\nRaw: " + JSON.stringify(data.raw, null, 2)
                : ""),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "❗ Network error: " + (err?.message || "Unknown error"),
        },
      ]);
    }
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: trimmed }]);
    setInput("");
    askGemini(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center px-4 py-2 w-full h-full min-w-[320px] max-w-[560px]">
      <div className="bg-white border border-gray-200 rounded shadow-sm w-full max-w-lg">
        {/* HEADER */}
        <div className="bg-green-100 border-b border-gray-200 px-4 py-2 text-green-900 font-bold text-sm rounded-t">
          KIWI Gemini Chat
        </div>
        {/* MESSAGES */}
        <div
          ref={chatBodyRef}
          className="h-[260px] overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-white"
          style={{ fontSize: "14px" }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.sender === "user"
                  ? "text-right text-blue-800"
                  : "text-left text-green-800"
              }
            >
              <div
                className={
                  "inline-block px-3 py-2 rounded " +
                  (m.sender === "user"
                    ? "bg-blue-100"
                    : "bg-green-50 border border-green-200")
                }
                style={{
                  whiteSpace: "pre-line",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-green-700 text-center italic">Thinking...</div>
          )}
        </div>
        {/* INPUT */}
        <form
          className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-gray-50"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex-1 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={loading || input.trim().length === 0}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

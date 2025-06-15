import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { upsertTeamChatSnapshot } from "@/hooks/useTeamSnapshots";

// Minimal ChatMessage type
type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function PixelChatBox({ taller = false }: { taller?: boolean }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! Ask me anything ✨" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { id: teamId } = useParams();
  const [dragOver, setDragOver] = useState(false);

  // Scroll to latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Save snapshot on chat change (debounced)
  useEffect(() => {
    if (!user || !teamId) return;
    const timeout = setTimeout(() => {
      upsertTeamChatSnapshot(teamId, user.id, messages);
    }, 700); // debounce
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
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

  // Add drop handlers for enhanced UX
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const droppedMsg = e.dataTransfer.getData("text/plain");
    if (droppedMsg && typeof droppedMsg === "string") {
      setInput(droppedMsg); // Insert dropped message as new input!
      setDragOver(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-2 w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        background: dragOver ? "#efd" : undefined,
        border: dragOver ? "2px dashed #8bb47e" : undefined,
        borderRadius: "12px",
        transition: "background 0.13s, border 0.13s",
      }}
    >
      {/* ... keep chat container and other markup the same, but adjust classNames for subtle design ... */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow w-full max-w-lg">
        {/* HEADER */}
        <div className="bg-[#f8f8f9] border-b border-[#e5e5e5] px-4 py-2 text-neutral-800 font-semibold text-sm rounded-t tracking-widest">
          KIWI Gemini Chat
        </div>
        {/* MESSAGES */}
        <div
          ref={chatBodyRef}
          className={`overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-[#fafbfd]`}
          style={{
            fontSize: "14px",
            height: taller ? "450px" : "260px",
            transition: "height 0.2s"
          }}
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
          className="flex items-center gap-2 border-t border-[#e5e5e5] px-3 py-2 bg-[#f8f8f9]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex-1 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring text-neutral-800 bg-white"
            placeholder={dragOver ? "Drop to use this message..." : "Type your question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-3 py-1 rounded font-semibold disabled:opacity-50"
            disabled={loading || input.trim().length === 0}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
        {dragOver && (
          <div className="absolute left-0 right-0 bottom-4 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-3 bg-white/90 border border-[#badc5b] rounded-xl text-[#ad9271] text-sm font-medium shadow-xl transition">
              Drop message here to work on it!
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

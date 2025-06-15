import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchTeamChatSnapshot, fetchTeamTodoSnapshot } from "@/hooks/useTeamSnapshots";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeammateAIChat } from "@/hooks/useTeammateAIChat";

export default function TeammateScreenModal({
  open,
  onClose,
  teamId,
  member,
}: {
  open: boolean;
  onClose: () => void;
  teamId: string;
  member: any;
}) {
  const [chatSnapshot, setChatSnapshot] = useState<any>(null);
  const [todoSnapshot, setTodoSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // NEW: Fetch teammate AI chatbot thread
  const { thread: aiChatThread, loading: aiLoading } = useTeammateAIChat(teamId, member?.user_id);

  useEffect(() => {
    if (!open || !teamId || !member?.user_id) return;
    setLoading(true);

    Promise.all([
      fetchTeamChatSnapshot(teamId, member.user_id),
      fetchTeamTodoSnapshot(teamId, member.user_id),
    ]).then(([chatSnap, todoSnap]) => {
      setChatSnapshot(chatSnap?.chat_state || null);
      setTodoSnapshot(todoSnap?.todo_state || null);
      setLoading(false);
    });
  }, [open, teamId, member?.user_id]);

  return (
    <Dialog open={open} onOpenChange={o => !o ? onClose() : undefined}>
      <DialogContent className="max-w-2xl rounded-xl border shadow-lg bg-[#fafbfc]">
        <DialogTitle className="flex items-center gap-3 mb-4">
          {member?.profiles?.avatar_url ? (
            <img src={member.profiles.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border" />
          ) : (
            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 w-8 h-8 text-neutral-400">
              <User size={19} />
            </span>
          )}
          <span>
            {member?.profiles?.full_name ||
              member?.profiles?.username ||
              "Teammate"}
          </span>
        </DialogTitle>
        {/* New Section: AI chatbot thread */}
        <div className="mb-4">
          <div className="font-medium text-green-800 mb-1 text-sm">
            <span>AI Chatbot (Private, Live View)</span>
          </div>
          <div className="bg-[#fffde8] rounded-lg border border-[#badc5b] p-2 min-h-[80px] shadow-inner max-h-56 overflow-y-auto">
            {aiLoading ? (
              <span className="text-xs text-gray-400">Loading AI chat...</span>
            ) : aiChatThread && Array.isArray(aiChatThread.messages) && aiChatThread.messages.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {aiChatThread.messages.map((msg: any, idx: number) => (
                  <li key={idx} className="text-xs mb-1">
                    <span className={`font-semibold mr-1 ${msg.role === "user" ? "text-[#8bb47e]" : "text-[#ad9271]"}`}>
                      {msg.role === "user" ? member?.profiles?.username || "You" : "AI"}:
                    </span>
                    <span className="text-[#233f24]">{msg.content}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-neutral-400">No AI chat history found.</div>
            )}
          </div>
        </div>
        {/* ...keep rest of the modal: live chat + todos ... */}
        <div className="font-medium text-[#8bb47e] mb-2 px-1">
          <span>Live screen preview</span>
        </div>
        {loading ? (
          <div className="flex flex-col gap-5 py-8 px-6">
            <Skeleton className="h-32 w-full rounded mb-2" />
            <Skeleton className="h-20 w-full rounded" />
          </div>
        ) : (
          <div className="flex gap-6 w-full flex-col md:flex-row">
            <div className="flex-1 min-w-[250px]">
              <div className="mb-1 text-xs text-[#ad9271]">Teammate's Chat</div>
              <div className="bg-[#fffde8] rounded-lg border border-[#badc5b] p-2 min-h-[128px] shadow-inner max-h-56 overflow-y-auto">
                {chatSnapshot && chatSnapshot.messages ? (
                  <ul className="flex flex-col gap-1">
                    {chatSnapshot.messages.map((msg: any, idx: number) => (
                      <li key={idx} className="text-xs mb-1">
                        <span className="font-semibold mr-1 text-[#8bb47e]">{msg.role === "user" ? member?.profiles?.username || "You" : "AI"}:</span>
                        <span className="text-[#233f24]">{msg.content}</span>
                      </li>
                    ))}
                  </ul>
                ) : <div className="text-neutral-400 text-xs">No chat yet</div>}
              </div>
            </div>
            <div className="flex-1 min-w-[230px]">
              <div className="mb-1 text-xs text-[#ad9271]">Teammate's Todos</div>
              <div className="bg-[#fffde8] rounded-lg border border-[#badc5b] p-2 min-h-[80px] shadow-inner">
                {todoSnapshot && Array.isArray(todoSnapshot.todos) && todoSnapshot.todos.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {todoSnapshot.todos.map((todo: any, idx: number) => (
                      <li key={idx} className="text-xs text-[#233f24]">
                        {todo.text}
                        {todo.done ? " ✅" : ""}
                      </li>
                    ))}
                  </ul>
                ) : <div className="text-neutral-400 text-xs">No todos found.</div>}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="pixel-font mt-4 w-full bg-[#badc5b] text-[#233f24] rounded py-2 text-sm hover:bg-[#aed57a]"
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}

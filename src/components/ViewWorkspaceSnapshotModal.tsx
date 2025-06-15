
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchTeamChatSnapshot, fetchTeamTodoSnapshot } from "@/hooks/useTeamSnapshots";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Member = {
  user_id: string;
  profiles?: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  };
  role?: string;
};

export default function ViewWorkspaceSnapshotModal({
  open,
  onClose,
  teamId,
  member,
}: {
  open: boolean;
  onClose: () => void;
  teamId: string;
  member: Member | null;
}) {
  const [loading, setLoading] = useState(true);
  const [chatSnapshot, setChatSnapshot] = useState<any>(null);
  const [todoSnapshot, setTodoSnapshot] = useState<any>(null);

  useEffect(() => {
    if (!open || !member) return;
    setLoading(true);
    Promise.all([
      fetchTeamChatSnapshot(teamId, member.user_id),
      fetchTeamTodoSnapshot(teamId, member.user_id)
    ]).then(([chat, todos]) => {
      setChatSnapshot(chat?.chat_state || null);
      setTodoSnapshot(todos?.todo_state || null);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [open, member, teamId]);

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent className="max-w-lg bg-[#fffde8]">
        <DialogTitle className="pixel-font text-[#233f24]">
          {member?.profiles?.full_name || member?.profiles?.username || "Teammate"}'s Workspace
        </DialogTitle>
        <div className="mt-2 flex flex-col gap-4">
          {loading ? (
            <>
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-20" />
            </>
          ) : (
            <>
              <div>
                <div className="pixel-font text-xs text-[#ad9271] mb-1">Chatbot Conversation</div>
                {chatSnapshot && Array.isArray(chatSnapshot) ? (
                  <div className="bg-[#f9ffe6] rounded px-2 py-2 min-h-[52px] max-h-40 overflow-y-auto border border-[#badc5b] text-xs pixel-font">
                    {chatSnapshot.map((msg: any, i: number) =>
                      <div key={i} className={`mb-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        <span className={`inline-block rounded ${msg.sender === "user"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-50 border border-green-200 text-green-800"} px-2 py-1 mb-1`}>
                          {msg.text}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pixel-font text-[#ad9271] text-xs">No chat available.</div>
                )}
              </div>
              <div>
                <div className="pixel-font text-xs text-[#ad9271] mb-1">To-do List</div>
                {todoSnapshot && Array.isArray(todoSnapshot) && todoSnapshot.length > 0 ? (
                  <ul className="bg-[#f9ffe6] rounded px-2 py-2 border border-[#badc5b] text-xs pixel-font max-h-32 overflow-y-auto">
                    {todoSnapshot.map((item: any, idx: number) => (
                      <li key={idx} className={`flex items-center justify-between py-0.5 ${item.done ? "line-through opacity-60" : ""}`}>
                        <span>{item.label}</span>
                        {item.done && <span className="text-green-700 mr-2">✔</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="pixel-font text-[#ad9271] text-xs">No to-do list available.</div>
                )}
              </div>
            </>
          )}
        </div>
        <Button onClick={onClose} className="pixel-font mt-3">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

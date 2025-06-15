
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { useTeammateChats } from "@/hooks/useTeammateChats";
import { User } from "lucide-react";

export default function MemberChatsModal({
  open,
  onClose,
  teamId,
  member,
  onMessageDragStart,
  neutral,
}: {
  open: boolean;
  onClose: () => void;
  teamId?: string;
  member: any;
  onMessageDragStart: (message: string) => void;
  neutral?: boolean;
}) {
  const { messages, loading } = useTeammateChats(teamId, member?.user_id);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`max-w-lg rounded-xl border shadow-lg ${neutral ? "bg-[#f7f7f9] border-[#e2e4e8]" : "bg-white"}`}
        style={{
          boxShadow: "0 4px 24px 0 rgba(44,48,64,0.08)",
          minWidth: 350,
          backdropFilter: neutral ? undefined : "blur(2px)",
        }}
      >
        <DialogTitle className="font-semibold text-neutral-800 flex items-center gap-3 mb-2">
          {member?.profiles?.avatar_url ? (
            <img
              src={member.profiles.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full border border-gray-100"
            />
          ) : (
            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 w-7 h-7 text-neutral-400">
              <User size={19} />
            </span>
          )}
          <span>
            {member?.profiles?.full_name ||
              member?.profiles?.username ||
              "Teammate"}
          </span>
        </DialogTitle>
        <div className="mt-1 mb-2 font-medium text-[1.05em] text-neutral-700">
          Conversation history
        </div>
        {loading ? (
          <div className="text-neutral-400 text-xs pt-3 pb-4 px-2">
            Loading chats… 
          </div>
        ) : messages.length === 0 ? (
          <div className="text-neutral-400 text-xs pt-3 pb-4 px-2">
            No chats yet.
          </div>
        ) : (
          <div className="bg-[#edeff3] p-2 rounded border border-[#e3e4ec] max-h-80 overflow-y-auto">
            <ul className="flex flex-col gap-2 pr-1">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", msg.message || "");
                    // trigger local drag logic for highlight/feedback
                    onMessageDragStart(msg.message || "");
                  }}
                  className="group flex items-center hover:bg-neutral-50 rounded px-2 py-1 transition cursor-grab border border-transparent hover:border-[#a2a6b0] "
                  title="Drag to add this message to your chat"
                >
                  <span className="text-neutral-700 text-sm font-normal flex-1 whitespace-pre-line">
                    {msg.message || ""}
                  </span>
                  <span className="ml-4 text-xs text-neutral-400 select-none min-w-12">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-neutral-400 mt-2">
              Drag a message into your chat below to continue working on it.
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}

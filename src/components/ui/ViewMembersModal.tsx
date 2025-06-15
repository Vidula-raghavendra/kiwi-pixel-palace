
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Modal that shows team members, their avatar, role, and LLM choice.
 */
export default function ViewMembersModal({ open, onClose, teamId }: { open: boolean, onClose: () => void, teamId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch members with profile + llm info
  useEffect(() => {
    if (!open || !teamId) return;
    setLoading(true);

    async function fetchMembers() {
      try {
        const { data } = await supabase
          .from("team_members")
          .select("user_id, role, profiles:profiles!team_members_user_id_fkey(full_name, avatar_url, github_username)")
          .eq("team_id", teamId);
        setMembers(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [open, teamId]);

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent>
        <DialogTitle className="pixel-font text-[#233f24]">Team Members</DialogTitle>
        <div className="flex flex-col gap-3 mt-3">
          {loading
            ? Array(4).fill(0).map((_, i) => (
              <div className="flex items-center gap-2" key={i}>
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))
            : members.map((m, i) => (
              <div className="flex items-center gap-3" key={m.user_id || i}>
                {m.profiles?.avatar_url
                  ? <img src={m.profiles.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full border border-[#badc5b]" />
                  : <div className="w-9 h-9 rounded-full bg-[#fafafa] border border-[#badc5b] flex items-center justify-center text-[#badc5b]"><User size={17} /></div>
                }
                <div className="flex flex-col">
                  <span className="pixel-font text-sm text-[#233f24]">{m.profiles?.full_name || m.profiles?.github_username || "User"}</span>
                  <span className="text-xs text-[#8bb47e]">{m.role}</span>
                  {/* TODO: LLM assistant type here if available */}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

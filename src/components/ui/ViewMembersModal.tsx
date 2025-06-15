import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useTeamPresence } from "@/hooks/useTeamPresence";
import { Button } from "@/components/ui/button";

export default function ViewMembersModal({
  open,
  onClose,
  teamId,
}: {
  open: boolean;
  onClose: () => void;
  teamId: string;
}) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showPresence, setShowPresence] = useState(false);

  const { user } = useAuth();
  const location = useLocation();

  // Use team presence hook
  const presence = useTeamPresence({
    teamId,
    userId: user?.id,
    path: location.pathname,
  });

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
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div className="flex items-center gap-2" key={i}>
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))
            : members.map((m, i) => (
                <button
                  className="flex items-center gap-3 px-1 py-1 rounded hover:bg-[#e2fde4] transition self-start"
                  key={m.user_id || i}
                  onClick={() => {
                    setSelectedMember(m);
                    setShowPresence(true);
                  }}
                >
                  {m.profiles?.avatar_url ? (
                    <img
                      src={m.profiles.avatar_url}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full border border-[#badc5b]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#fafafa] border border-[#badc5b] flex items-center justify-center text-[#badc5b]">
                      <User size={17} />
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="pixel-font text-sm text-[#233f24]">
                      {m.profiles?.full_name || m.profiles?.github_username || "User"}
                    </span>
                    <span className="text-xs text-[#8bb47e]">{m.role}</span>
                  </div>
                </button>
              ))}
        </div>

        {/* Modal for member's page presence */}
        {selectedMember && (
          <Dialog open={showPresence} onOpenChange={o => setShowPresence(o)}>
            <DialogContent>
              <DialogTitle className="pixel-font">
                {selectedMember.profiles?.full_name ||
                  selectedMember.profiles?.github_username ||
                  "User"}
              </DialogTitle>
              <div className="text-[#8bb47e] pixel-font text-xs mb-2">
                Role: {selectedMember.role}
              </div>
              <div className="mb-4">
                {presence[selectedMember.user_id] && presence[selectedMember.user_id].path ? (
                  <div className="pixel-font text-[#233f24]">
                    <span className="text-[#ad9271]">Current page: </span>
                    <span className="font-bold">{presence[selectedMember.user_id].path}</span>
                  </div>
                ) : (
                  <div className="pixel-font text-[#ad9271] text-sm">
                    (Their page is not available or not sharing presence.)
                  </div>
                )}
                {presence[selectedMember.user_id]?.updated_at && (
                  <div className="text-xs mt-1 text-[#ad9271]">
                    Last updated: {new Date(presence[selectedMember.user_id]?.updated_at).toLocaleTimeString()}
                  </div>
                )}
              </div>
              <Button onClick={() => setShowPresence(false)} className="pixel-font">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

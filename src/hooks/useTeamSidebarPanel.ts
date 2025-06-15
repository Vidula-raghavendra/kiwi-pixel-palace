
import { useState } from "react";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ModalType = "invite" | "share" | "members";
type ModalsState = { [K in ModalType]: boolean };

export function useTeamSidebarPanel({ teamId }: { teamId: string }) {
  const [modals, setModals] = useState<ModalsState>({ invite: false, share: false, members: false });
  const [loading, setLoading] = useState(false);
  const { currentTeam, setCurrentTeam } = useTeams();
  const { user } = useAuth();
  const { toast } = useToast();

  function openModal(modal: ModalType) { setModals(m => ({ ...m, [modal]: true })); }
  function closeModal(modal: ModalType) { setModals(m => ({ ...m, [modal]: false })); }

  // Checks if user is admin for this team for delete
  const canDeleteTeam = currentTeam?.created_by === user?.id;

  // Leave team
  async function handleLeaveTeam() {
    if (!user || !teamId) return;
    setLoading(true);
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", user.id);
    if (!error) {
      toast({ title: "Left Team" });
      setCurrentTeam(null);
      location.reload();
    } else {
      toast({ title: "Failed to leave", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  }

  // Delete team
  async function handleDeleteTeam() {
    if (!canDeleteTeam || !teamId) return;
    setLoading(true);
    // Remove all team data
    const { error } = await supabase.from("teams").delete().eq("id", teamId);
    if (!error) {
      toast({ title: "Team deleted. Bye!" });
      setCurrentTeam(null);
      location.reload();
    } else {
      toast({ title: "Failed to delete team", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  }

  return {
    modals,
    openModal,
    closeModal,
    handleLeaveTeam,
    handleDeleteTeam,
    canDeleteTeam,
    loading
  };
}

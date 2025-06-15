
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type TeamInvitation = {
  id: string;
  team_id: string;
  email: string | null;
  github_username: string | null;
  invited_by: string;
  status: string;
  code: string | null;
  created_at: string;
  accepted_at: string | null;
};

export function useTeamInvitations(teamId?: string) {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch invitations for a team (admin or member view)
  const fetchInvitations = async () => {
    setLoading(true);
    let query = supabase
      .from("team_invitations")
      .select("*")
      .order("created_at", { ascending: false });
    if (teamId) query = query.eq("team_id", teamId);

    const { data, error } = await query;
    if (error) {
      toast({ title: "Failed to load invitations", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setInvitations(data as TeamInvitation[]);
    setLoading(false);
  };

  // Send invitation (by email or GitHub username)
  const sendInvitation = async ({
    team_id,
    email,
    github_username,
    invited_by,
  }: { team_id: string, email?: string, github_username?: string, invited_by: string }) => {
    setLoading(true);
    const insertObj = {
      team_id,
      email: email || null,
      github_username: github_username || null,
      invited_by,
    };
    const { data, error } = await supabase
      .from("team_invitations")
      .insert([insertObj])
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send invite", description: error.message, variant: "destructive" });
      throw error;
    }
    toast({ title: "Invite sent", description: email ? `Sent to ${email}` : `GitHub: ${github_username}` });
    return data;
  };

  // Accept invitation
  const acceptInvitation = async (invitationId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("team_invitations")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invitationId);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to accept", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Invitation accepted!" });
      fetchInvitations(); // Refresh list
    }
  };

  return {
    invitations,
    loading,
    fetchInvitations,
    sendInvitation,
    acceptInvitation,
  };
}

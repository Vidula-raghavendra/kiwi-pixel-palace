
import React, { useState } from "react";
import { Users, Copy, Plus, Trash2 } from "lucide-react";
import { useTeamSidebarPanel } from "@/hooks/useTeamSidebarPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PanelView = "members" | "invite" | "share";

export default function WorkspaceSidebarPanel({ teamId }: { teamId: string }) {
  const {
    canDeleteTeam,
    handleLeaveTeam,
    handleDeleteTeam,
    loading,
  } = useTeamSidebarPanel({ teamId });
  const [panel, setPanel] = useState<PanelView>("members");

  // Toast for popups
  const { toast } = useToast();

  // --- Invite Section State & Handler
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteGithub, setInviteGithub] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    if (!inviteEmail && !inviteGithub) {
      toast({ title: "Enter email or GitHub username." });
      setInviteLoading(false);
      return;
    }
    let invited_by = null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) throw new Error("Not authenticated");
      invited_by = data.user.id;
    } catch (err: any) {
      toast({ title: "Failed to get current user", description: err.message, variant: "destructive" });
      setInviteLoading(false);
      return;
    }
    const { error } = await supabase.from("team_invitations").insert({
      team_id: teamId,
      email: inviteEmail || null,
      github_username: inviteGithub || null,
      invited_by,
    });
    if (!error) {
      toast({ title: "Invite sent!" });
      setInviteEmail("");
      setInviteGithub("");
    } else {
      toast({ title: "Invite failed", description: error.message, variant: "destructive" });
    }
    setInviteLoading(false);
  }

  // --- Share Code Section State & Handler
  const [teamCode, setTeamCode] = useState("");
  const [copy, setCopy] = useState(false);

  React.useEffect(() => {
    if (panel === "share" && teamId) {
      supabase
        .from("teams")
        .select("team_code")
        .eq("id", teamId)
        .maybeSingle()
        .then(({ data }) => setTeamCode(data?.team_code || ""));
      setCopy(false);
    }
  }, [panel, teamId]);

  async function handleCopyCode() {
    if (teamCode) {
      await navigator.clipboard.writeText(teamCode);
      setCopy(true);
      toast({ title: "Copied!" });
      setTimeout(() => setCopy(false), 1200);
    }
  }
  async function handleRegenerateCode() {
    const newCode = (Math.random().toString(36).substring(2, 10) + Date.now().toString()).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
    const { error } = await supabase.from("teams").update({ team_code: newCode }).eq("id", teamId);
    if (!error) {
      setTeamCode(newCode);
      toast({ title: "New code generated!" });
      setCopy(false);
    }
  }

  // --- View Members Section State
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  React.useEffect(() => {
    if (panel === "members" && teamId) {
      setMembersLoading(true);
      async function fetchMembers() {
        try {
          const { data } = await supabase
            .from("team_members")
            .select("user_id, role, profiles:profiles!team_members_user_id_fkey(full_name, avatar_url, github_username)")
            .eq("team_id", teamId);
          setMembers(data || []);
        } finally {
          setMembersLoading(false);
        }
      }
      fetchMembers();
    }
  }, [panel, teamId]);

  // --- Sidebar panel tabs
  const tabs = [
    { name: "Members", key: "members" as PanelView, icon: <Users size={16} /> },
    { name: "Invite", key: "invite" as PanelView, icon: <Plus size={16} /> },
    { name: "Share Code", key: "share" as PanelView, icon: <Copy size={16} /> },
  ];

  return (
    <aside className="flex flex-col w-[315px] rounded-xl shadow-xl border border-[#badc5b] bg-[#f7ffe1] mt-7 mr-2 pb-4 min-h-[620px] min-w-[300px] max-w-[340px]">
      {/* Tab Bar */}
      <div className="flex flex-row items-center w-full border-b border-[#badc5b]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setPanel(t.key)}
            className={`flex-1 pixel-font text-[#233f24] py-3 ${panel === t.key ? "bg-[#badc5b] shadow-[0_-2px_0_#e2fde4]" : "hover:bg-[#e2fde4]"}`}
            style={{ borderRadius: 0, outline: "none" }}
          >
            <span className="inline-flex items-center gap-2 justify-center">{t.icon} {t.name}</span>
          </button>
        ))}
      </div>

      {/* Main Panel Section */}
      <div className="flex-1 p-5 overflow-y-auto">
        {panel === "members" && (
          <div>
            <div className="pixel-font text-[#8bb47e] text-xs mb-5 tracking-wider">Team Members</div>
            <div className="flex flex-col gap-3">
              {membersLoading
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
                      ? <img src={m.profiles.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full border border-[#badc5b] bg-[#fbfff1]" />
                      : <div className="w-9 h-9 rounded-full bg-[#fafafa] border border-[#badc5b] flex items-center justify-center text-[#badc5b]"><Users size={17} /></div>
                    }
                    <div className="flex flex-col">
                      <span className="pixel-font text-sm text-[#233f24]">{m.profiles?.full_name || m.profiles?.github_username || "User"}</span>
                      <span className="text-xs text-[#8bb47e]">{m.role}</span>
                    </div>
                  </div>
                ))}
              {!membersLoading && members.length === 0 && (
                <div className="text-xs text-muted-foreground">No members found.</div>
              )}
            </div>
          </div>
        )}
        {panel === "invite" && (
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <label className="pixel-font text-xs text-[#8bb47e]">Email address</label>
            <Input
              autoFocus
              type="email"
              className="pixel-font bg-[#fffbe8] border-[#badc5b]"
              placeholder="friend@email.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              maxLength={80}
            />
            <label className="pixel-font text-xs text-[#8bb47e] mt-2">GitHub username</label>
            <Input
              type="text"
              className="pixel-font bg-[#fffbe8] border-[#badc5b]"
              placeholder="github-username"
              value={inviteGithub}
              onChange={e => setInviteGithub(e.target.value)}
              maxLength={39}
            />
            <Button disabled={inviteLoading} type="submit" className="mt-5 pixel-font bg-[#badc5b] text-[#233f24] w-full hover:brightness-95">
              {inviteLoading ? "Sending..." : "Send Invite"}
            </Button>
          </form>
        )}
        {panel === "share" && (
          <div>
            <div className="pixel-font text-[#8bb47e] text-xs mb-5">Share this join code with your teammates</div>
            <div className="flex flex-row items-center gap-3">
              <Input className="pixel-font text-lg bg-[#fffbe8] border-[#badc5b]" value={teamCode} readOnly />
              <Button
                className="flex gap-1 bg-[#dbe186] hover:bg-[#badc5b] text-[#233f24] rounded shadow"
                onClick={handleCopyCode}
                tabIndex={0}
              >
                {copy ? <Copy size={16}/> : <Copy size={16}/>}
              </Button>
            </div>
            <Button
              className="w-full pixel-font text-sm mt-4 bg-[#badc5b] text-[#233f24]"
              onClick={handleRegenerateCode}
            >
              Generate New Code
            </Button>
          </div>
        )}
      </div>

      {/* Footer: Actions */}
      <div className="mt-auto px-4">
        {canDeleteTeam ? (
          <Button
            className="w-full flex gap-2 pixel-font text-red-600 border border-red-300 bg-[#fbeeee] hover:bg-[#fbdddd] mt-7"
            onClick={handleDeleteTeam}
            disabled={loading}
          >
            <Trash2 size={16} /> Delete Team
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full flex gap-2 pixel-font text-[#ad9271] border-[#ad9271] mt-7"
            onClick={handleLeaveTeam}
            disabled={loading}
          >
            <Trash2 size={16} /> Leave Team
          </Button>
        )}
      </div>
    </aside>
  );
}


import React, { useState, useEffect } from "react";
import { LogOut, Users, User, Copy, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { useTeamSidebarPanel } from "@/hooks/useTeamSidebarPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Collapsible section helper component
function SidebarSection({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex flex-row items-center w-full gap-2 px-2 py-2 rounded-lg bg-[#e8f6da] pixel-font text-[#233f24] hover:bg-[#d5f3c2] transition-colors focus:outline-none border-b border-[#badc5b]`}
        style={{outline: 0}}
      >
        <span className="mr-2">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="bg-[#f7ffe1] p-3 rounded-lg shadow-inner animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceSidebar() {
  // Safely handle missing AuthContext with error boundary
  const authContext = useAuth();
  
  if (!authContext) {
    console.error('WorkspaceSidebar: AuthContext not available, redirecting...');
    return (
      <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[250px] max-w-[270px] flex flex-col justify-center items-center h-screen z-30 shadow-lg">
        <span className="pixel-font text-red-500 text-sm mt-10">
          AuthContext not available.<br />
          Please refresh the page.
        </span>
      </aside>
    );
  }

  const { profile, signOut, loading: authLoading } = authContext;

  // Safely handle missing TeamsContext
  const teamsHook = useTeams();
  
  if (!teamsHook) {
    return (
      <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[250px] max-w-[270px] flex flex-col justify-center items-center h-screen z-30 shadow-lg">
        <span className="pixel-font text-red-500 text-sm mt-10">
          Teams context not available.<br />
          Please refresh the page.
        </span>
      </aside>
    );
  }

  const { 
    teams, 
    currentTeam, 
    setCurrentTeam, 
    teamMembers, 
    fetchTeamMembers, 
    loading: teamsLoading 
  } = teamsHook;

  // Invite/Share/Members panel logic
  const teamId = currentTeam?.id;
  const {
    canDeleteTeam,
    handleLeaveTeam,
    handleDeleteTeam,
    loading: panelLoading,
  } = useTeamSidebarPanel({ teamId: teamId || "" });
  const { toast } = useToast();

  // For Invite section
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

  // For Share join code
  const [teamCode, setTeamCode] = useState("");
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    if (teamId) {
      supabase
        .from("teams")
        .select("team_code")
        .eq("id", teamId)
        .maybeSingle()
        .then(({ data }) => setTeamCode(data?.team_code || ""));
      setCopy(false);
    }
  }, [teamId]);

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

  // For Members section
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    if (teamId) {
      setMembersLoading(true);
      async function fetchMembersList() {
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
      fetchMembersList();
    }
  }, [teamId]);

  // Display avatar
  const Avatar = ({ src, alt }: { src?: string | null, alt: string }) =>
    src ?
      <img src={src} alt={alt} className="rounded-full border border-[#badc5b] w-9 h-9 bg-[#fdfae8]" />
      :
      <div className="w-9 h-9 flex items-center justify-center rounded-full border border-[#badc5b] bg-[#fdfae8] text-[#8bb47e]"><User size={17} /></div>;

  // Show current team (fallback first team)
  const displayTeam = currentTeam || teams?.[0];

  // In case teams and currentTeam are both not loaded, show a loader early to prevent blank crash
  if (!displayTeam && teamsLoading) {
    return (
      <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[250px] max-w-[270px] flex flex-col justify-center h-screen z-30 shadow-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-[#badc5b] pixel-font text-lg">Loading teams...</span>
        </div>
      </aside>
    );
  }
  if (!displayTeam && !teamsLoading) {
    return (
      <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[250px] max-w-[270px] flex flex-col justify-center items-center h-screen z-30 shadow-lg">
        <span className="pixel-font text-red-500 text-sm mt-10">No team context available.<br />Please join or create a team.</span>
      </aside>
    );
  }

  useEffect(() => {
    if (!currentTeam && teams && teams.length > 0) setCurrentTeam(teams[0]);
    if (displayTeam && fetchTeamMembers) fetchTeamMembers(displayTeam.id);
  }, [displayTeam?.id, currentTeam, teams, setCurrentTeam, fetchTeamMembers]);

  return (
    <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[250px] max-w-[270px] flex flex-col justify-between h-screen z-30 shadow-lg">
      {/* Profile Area */}
      <div>
        <div className="flex flex-row items-center px-6 py-5 gap-3 border-b border-[#ecf2c7]">
          <Avatar src={profile?.avatar_url} alt={profile?.full_name || "Avatar"} />
          <div>
            <div className="pixel-font text-base text-[#233f24] truncate">{profile?.full_name || profile?.github_username || "Kiwi User"}</div>
            {profile?.github_username && (
              <div className="text-xs text-[#90a872]">@{profile.github_username}</div>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-5 mb-2 px-4">
          <div className="flex flex-row items-center gap-2 mb-1">
            <Users size={16} color="#8bb47e" />
            <div className="pixel-font text-xs text-[#8bb47e]">Team</div>
          </div>
          <div className="text-[13px] ml-7 text-[#233f24] truncate font-semibold">
            {displayTeam?.name || <Skeleton className="h-4 w-28 rounded bg-[#e2fde4]" />}
          </div>
        </div>

        {/* Collapsible sections for Members, Invite, Share Code */}
        <div className="px-2 py-1">
          <SidebarSection label="Team Members" icon={<Users size={18} />}>
            <div className="flex flex-col gap-3">
              {membersLoading
                ? Array(3).fill(0).map((_, i) => (
                  <div className="flex items-center gap-2" key={i}>
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                ))
                : members.map((m, i) => (
                  <div className="flex items-center gap-3" key={m.user_id || i}>
                    {m.profiles?.avatar_url
                      ? <img src={m.profiles.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full border border-[#badc5b] bg-[#fbfff1]" />
                      : <div className="w-7 h-7 rounded-full bg-[#fafafa] border border-[#badc5b] flex items-center justify-center text-[#badc5b]"><Users size={15} /></div>
                    }
                    <div>
                      <div className="pixel-font text-xs text-[#233f24]">{m.profiles?.full_name || m.profiles?.github_username || "User"}</div>
                      <div className="text-xs text-[#8bb47e]">{m.role}</div>
                    </div>
                  </div>
                ))}
              {!membersLoading && members.length === 0 && (
                <div className="text-xs text-muted-foreground">No members found.</div>
              )}
            </div>
          </SidebarSection>
          
          <SidebarSection label="Invite Members" icon={<Plus size={18} />}>
            <form onSubmit={handleInvite} className="flex flex-col gap-2">
              <label className="pixel-font text-xs text-[#8bb47e]">Email</label>
              <Input
                autoFocus
                type="email"
                className="pixel-font bg-[#fffbe8] border-[#badc5b]"
                placeholder="friend@email.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                maxLength={80}
              />
              <label className="pixel-font text-xs text-[#8bb47e] mt-1">GitHub username</label>
              <Input
                type="text"
                className="pixel-font bg-[#fffbe8] border-[#badc5b]"
                placeholder="github-username"
                value={inviteGithub}
                onChange={e => setInviteGithub(e.target.value)}
                maxLength={39}
              />
              <Button disabled={inviteLoading} type="submit" className="mt-2 pixel-font bg-[#badc5b] text-[#233f24] w-full hover:brightness-95">
                {inviteLoading ? "Sending..." : "Send Invite"}
              </Button>
            </form>
          </SidebarSection>
          
          <SidebarSection label="Share Join Code" icon={<Copy size={18} />}>
            <div className="pixel-font text-[#8bb47e] text-xs mb-2">Share this code to let others join your team:</div>
            <div className="flex flex-row items-center gap-2">
              <Input className="pixel-font text-lg bg-[#fffbe8] border-[#badc5b]" value={teamCode} readOnly />
              <Button
                className="flex gap-1 bg-[#dbe186] hover:bg-[#badc5b] text-[#233f24] rounded"
                onClick={handleCopyCode}
                tabIndex={0}
              >
                <Copy size={15}/>
              </Button>
            </div>
            <Button
              className="w-full pixel-font text-xs mt-2 bg-[#badc5b] text-[#233f24]"
              onClick={handleRegenerateCode}
            >
              Generate New Code
            </Button>
          </SidebarSection>
        </div>
      </div>

      {/* Leave, Delete, and Logout actions - always shown at very bottom for seamless deletion */}
      <div className="mb-6 px-6">
        {/* Only show Delete Team button for creators/admins */}
        {canDeleteTeam && (
          <Button
            className="w-full flex gap-2 pixel-font text-red-600 border border-red-300 bg-[#fbeeee] hover:bg-[#fbdddd]"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this team? This cannot be undone.")) {
                handleDeleteTeam();
              }
            }}
            disabled={panelLoading}
          >
            Delete Team
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full flex gap-2 pixel-font text-[#ad9271] border-[#ad9271] mt-2"
          onClick={handleLeaveTeam}
          disabled={panelLoading}
        >
          <Trash2 size={16} /> Leave Team
        </Button>
        <Button
          variant="outline"
          className="w-full flex gap-2 items-center pixel-outline text-[#ad9271] hover:bg-[#fff6eb] border-2 border-[#ad9271] mt-4"
          onClick={signOut}
        >
          <LogOut size={17} /> Log out
        </Button>
      </div>
    </aside>
  );
}

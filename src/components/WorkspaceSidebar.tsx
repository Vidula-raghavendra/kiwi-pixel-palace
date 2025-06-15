import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTeamSidebarPanel } from "@/hooks/useTeamSidebarPanel";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";
import InviteModal from "@/components/ui/InviteModal";
import ShareCodeModal from "@/components/ui/ShareCodeModal";
import { useTeamPresence } from "@/hooks/useTeamPresence";
import { User as UserIcon } from "lucide-react";
import { Plus, Users, Share2 } from "lucide-react";
import ViewWorkspaceSnapshotModal from "@/components/ViewWorkspaceSnapshotModal";
import MemberChatsModal from "./MemberChatsModal"; // new
import TeammateScreenModal from "./TeammateScreenModal"; // NEW

// New: show profile presence modal state
type Member = any;

export default function WorkspaceSidebar() {
  const auth = useAuth();
  const teams = useTeams();

  if (!auth) {
    console.error("WorkspaceSidebar: AuthContext missing!");
    return (
      <div className="pixel-font text-red-700 p-6">
        Error: Not authenticated. Please <a href="/auth" className="underline">sign in</a>.
      </div>
    );
  }

  if (!teams) {
    console.error("WorkspaceSidebar: Teams context missing!");
    return (
      <div className="pixel-font text-red-700 p-6">
        Error: Teams context unavailable.
      </div>
    );
  }

  const { user } = auth;
  const {
    teams: allTeams,
    currentTeam,
    setCurrentTeam,
    teamMembers,
    loading,
  } = teams;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { createProject } = useProjects();
  const [projectName, setProjectName] = React.useState("");
  const [projectDesc, setProjectDesc] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [showMemberPresence, setShowMemberPresence] = React.useState(false);
  const [showMemberChats, setShowMemberChats] = React.useState(false);
  const [draggedMsg, setDraggedMsg] = React.useState<string | null>(null);
  const [activeMember, setActiveMember] = React.useState<any>(null);
  const [showTeammateModal, setShowTeammateModal] = React.useState(false); // NEW

  // ---- NEW MODAL LOGIC ----
  const [showInvite, setShowInvite] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = React.useState(false);
  const [snapshotMember, setSnapshotMember] = React.useState<Member | null>(null);

  // MVP: use presence for current team
  const presence = useTeamPresence({
    teamId: currentTeam?.id,
    userId: user?.id,
    path: location.pathname,
  });

  // Team panel actions
  const {
    modals,
    openModal,
    closeModal,
    handleLeaveTeam,
    handleDeleteTeam,
    canDeleteTeam,
    loading: teamPanelLoading,
  } = useTeamSidebarPanel({ teamId: currentTeam?.id || "" });

  React.useEffect(() => {
    // Add defensive logging so we see state during navigation
    console.log("[WorkspaceSidebar] Effect: id, allTeams, loading", {
      id,
      allTeams,
      loading,
      currentTeam,
    });

    // Don't run until loading complete:
    if (loading) return;

    if (id) {
      const team = allTeams.find((team) => team.id === id);
      if (team) {
        setCurrentTeam(team);
      } else if (allTeams.length > 0) {
        toast({
          title: "Team not found",
          description: "Redirecting to workspace...",
        });
        setTimeout(() => {
          navigate("/workspace");
        }, 1500);
      } else {
        // If user has NO teams, don't redirect yet; WorkspacePage should show onboarding instead!
        console.warn("[WorkspaceSidebar] No teams found for user, not redirecting from workspace room!");
      }
    }
    // eslint-disable-next-line
  }, [id, allTeams, loading, setCurrentTeam, navigate, toast]);

  async function handleCreateProject() {
    if (!currentTeam) return;
    try {
      await createProject(projectName, projectDesc, currentTeam.id);
      setProjectName("");
      setProjectDesc("");
      toast({ title: "Project created!" });
    } catch (error: any) {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const handleCopyInviteLink = () => {
    if (!currentTeam?.invite_code) return;
    const url = `${window.location.origin}/invite/${currentTeam.invite_code}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Invite link copied!", description: url });
  };

  const sidebarActions = [
    {
      key: "invite",
      label: "Invite Member",
      icon: <Users className="w-5 h-5" />,
      onClick: () => setShowInvite(true),
      disabled: !currentTeam,
      highlight: false,
    },
    {
      key: "code",
      label: "Share Code",
      icon: <Share2 className="w-5 h-5" />,
      onClick: () => setShowCode(true),
      disabled: !currentTeam,
      highlight: false,
    },
  ];

  // update sidebar to use modal
  return (
    <SidebarProvider>
      <div className="w-64 flex flex-col h-screen bg-[#fafbfc] border-r border-[#ececec]">
        {/* Team Members listing */}
        <ScrollArea className="flex-1 space-y-2 p-4">
          <div className="font-semibold text-[#283140] text-sm mb-2">
            Team Members
          </div>
          {teamMembers && teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                className="flex items-center space-x-2 py-2 hover:bg-neutral-100 rounded w-full mb-1 transition text-left"
                onClick={() => {
                  setActiveMember({ ...member });
                  setShowTeammateModal(true); // SHOW screen modal, not the chat modal
                }}
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  font: "inherit",
                }}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.profiles?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.profiles?.username?.slice(0, 2).toUpperCase() ||
                      member.profiles?.full_name?.slice(0, 2).toUpperCase() ||
                      "KI"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs truncate font-medium text-[#223447]">
                    {member.profiles?.full_name ||
                      member.profiles?.username ||
                      "Kiwi User"}
                  </span>
                  <span className="text-xs text-neutral-400">{member.role}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-xs text-neutral-400">
              No members in this team.
            </div>
          )}
        </ScrollArea>
        {/* Add Project dialog stays at bottom */}
        {/* Correct Dialog Trigger here */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24]">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#f7ffe1] border-[#badc5b]">
            <div className="flex flex-col gap-2">
              <DialogTitle className="pixel-font text-lg text-[#233f24]">
                Create Project
              </DialogTitle>
              <div className="pixel-font text-sm text-[#7b6449]">
                Make sure to set a descriptive name and description.
              </div>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="pixel-font text-sm text-[#233f24]">
                  Project name
                </label>
                <input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-[#fffde8] border-[#ad9271] rounded px-2 py-1"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="pixel-font text-sm text-[#233f24]">
                  Description
                </label>
                <textarea
                  id="description"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="bg-[#fffde8] border-[#ad9271] rounded px-2 py-1"
                />
              </div>
            </div>
            <Button
              onClick={handleCreateProject}
              className="w-full pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24]"
            >
              Create Project
            </Button>
          </DialogContent>
        </Dialog>

        {/* New: Copy invite link directly */}
        {currentTeam && (
          <Button
            className="w-full pixel-font bg-[#92ad97] hover:bg-[#b6c9b3] text-[#233f24] mb-3"
            onClick={handleCopyInviteLink}
          >
            Copy Invite Link
          </Button>
        )}

        {/* ----------- TEAM ACTION MODALS ----------- */}
        {currentTeam && (
          <>
            {/* Invite Modal: only email/github fields for inviting people */}
            <InviteModal
              open={showInvite}
              onClose={() => setShowInvite(false)}
              teamId={currentTeam.id}
            />
            {/* ShareCode Modal: show latest code + copy/generate */}
            <ShareCodeModal
              open={showCode}
              onClose={() => setShowCode(false)}
              teamId={currentTeam.id}
            />
          </>
        )}

        {/* Member Chats Modal - NOT transparent! */}
        {activeMember && (
          <MemberChatsModal
            open={showMemberChats}
            onClose={() => setShowMemberChats(false)}
            teamId={currentTeam?.id}
            member={activeMember}
            onMessageDragStart={(msg: string) => setDraggedMsg(msg)}
            neutral // passed down for style update
          />
        )}
      </div>

      {/* Place the screen modal at the top level for portals */}
      {activeMember && (
        <TeammateScreenModal
          open={showTeammateModal}
          onClose={() => setShowTeammateModal(false)}
          teamId={currentTeam?.id}
          member={activeMember}
        />
      )}
    </SidebarProvider>
  );
}


import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Users, UserPlus, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamSidebarPanel } from "@/hooks/useTeamSidebarPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";
import InviteModal from "@/components/ui/InviteModal";
import ShareCodeModal from "@/components/ui/ShareCodeModal";

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
  const { toast } = useToast();
  const { createProject } = useProjects();
  const [projectName, setProjectName] = React.useState("");
  const [projectDesc, setProjectDesc] = React.useState("");

  // ---- NEW MODAL LOGIC ----
  const [showInvite, setShowInvite] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);

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

  // Improved redirect logic: Only redirect **after** allTeams finished loading and user tried to view a workspace
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
        // Only redirect if we DO have teams (i.e. the user is in teams but not in this specific one)
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

  // --- SIDEBAR NAV/ACTIONS
  const sidebarActions = [
    {
      key: "members",
      label: "Team Members",
      icon: <Users className="w-5 h-5" />,
      onClick: null,
      disabled: true,
      highlight: false,
    },
    {
      key: "invite",
      label: "Invite Member",
      icon: <UserPlus className="w-5 h-5" />,
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

  return (
    <SidebarProvider>
      <div className="w-64 flex flex-col h-screen bg-[#f7ffe1] border-r border-[#badc5b]">
        {/* --- SIDEBAR ACTIONS (NEW) --- */}
        <div className="flex flex-col gap-2 p-4">
          {sidebarActions.map((act) => (
            <button
              key={act.key}
              onClick={act.onClick || undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded pixel-font text-[#233f24] transition-colors ${act.disabled ? 'opacity-50 pointer-events-none bg-[#f7ffe1]' : 'hover:bg-[#e8f6da] bg-[#fffde8]'} ${act.highlight ? 'bg-[#badc5b]' : ''}`}
              disabled={act.disabled}
              tabIndex={0}
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
        <Separator />

        <ScrollArea className="flex-1 space-y-2 p-4">
          <div className="pixel-font text-sm text-[#233f24] mb-2">
            Team Members
          </div>
          {teamMembers && teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-2 py-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.profiles?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.profiles?.username?.slice(0, 2).toUpperCase() ||
                      member.profiles?.full_name?.slice(0, 2).toUpperCase() ||
                      "KI"}
                  </AvatarFallback>
                </Avatar>
                <span className="pixel-font text-xs text-[#7b6449]">
                  {member.profiles?.full_name ||
                    member.profiles?.username ||
                    "Kiwi User"}
                </span>
              </div>
            ))
          ) : (
            <div className="pixel-font text-xs text-[#ad9271]">
              No members in this team.
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24]">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#f7ffe1] border-[#badc5b]">
              <DialogHeader>
                <DialogTitle className="pixel-font text-lg text-[#233f24]">
                  Create Project
                </DialogTitle>
                <DialogDescription className="pixel-font text-sm text-[#7b6449]">
                  Make sure to set a descriptive name and description.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="pixel-font text-sm text-[#233f24]">
                    Project name
                  </Label>
                  <Input
                    id="name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-[#fffde8] border-[#ad9271]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="pixel-font text-sm text-[#233f24]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="bg-[#fffde8] border-[#ad9271]"
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
        </div>

        {/* ----------- INVITE & SHARE CODE MODALS ----------- */}
        {currentTeam && (
          <>
            <InviteModal
              open={showInvite}
              onClose={() => setShowInvite(false)}
              teamId={currentTeam.id}
            />
            <ShareCodeModal
              open={showCode}
              onClose={() => setShowCode(false)}
              teamId={currentTeam.id}
            />
          </>
        )}
      </div>
    </SidebarProvider>
  );
}


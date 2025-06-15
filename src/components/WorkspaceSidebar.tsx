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

  // Instead of redirecting as soon as we can't find the team,
  // wait for teams loading to finish before attempting to redirect.
  React.useEffect(() => {
    if (id && allTeams && !loading) {
      const team = allTeams.find((team) => team.id === id);
      if (team) {
        setCurrentTeam(team);
      } else {
        toast({
          title: "Team not found",
          description: "Redirecting to workspace...",
        });
        setTimeout(() => {
          navigate("/workspace");
        }, 1500);
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

  return (
    <SidebarProvider>
      <div className="w-64 flex flex-col h-screen bg-[#f7ffe1] border-r border-[#badc5b]">
        <div className="flex items-center justify-between p-4">
          <div className="pixel-font text-lg text-[#233f24]">
            {currentTeam?.name || "Workspace"}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open options</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openModal("invite")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("share")}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("members")}>
                <Users className="mr-2 h-4 w-4" />
                View Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-500">
                    {canDeleteTeam ? "Delete Team" : "Leave Team"}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {canDeleteTeam ? "Delete Team?" : "Leave Team?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {canDeleteTeam
                        ? "This will permanently delete the team and all associated data."
                        : "Are you sure you want to leave this team?"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={canDeleteTeam ? handleDeleteTeam : handleLeaveTeam}
                    >
                      {teamPanelLoading ? "Loading..." : canDeleteTeam ? "Delete" : "Leave"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
    </SidebarProvider>
  );
}

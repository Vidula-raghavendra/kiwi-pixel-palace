
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PixelChatBox from "./pixel/PixelChatBox";
import PixelTodo from "./pixel/PixelTodo";
import PixelChatRoom from "./pixel/PixelChatRoom";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { useParams, useNavigate } from "react-router-dom";

export default function WorkspaceRoom() {
  // Get team id from route parameters
  const { id } = useParams();
  const navigate = useNavigate();

  let auth, teams, currentTeam;
  let errorMsg = "";

  // Defensive: Provide friendly error if hooks fail
  try {
    auth = useAuth();
    teams = useTeams();
    currentTeam = teams.currentTeam;

    // If we are on /workspace/:id, set the current team if different
    if (id && teams.teams && teams.teams.length > 0) {
      const thisTeam = teams.teams.find(t => t.id === id);
      if (thisTeam && (!currentTeam || currentTeam.id !== id)) {
        teams.setCurrentTeam(thisTeam);
        // currentTeam will update on next render
      }
      // If team not found, error
      if (!thisTeam) {
        errorMsg = "This team does not exist or you are not a member.";
      }
    }
  } catch (e) {
    errorMsg = (e as Error)?.message || "Critical error loading account or teams.";
    console.error("WorkspaceRoom errored:", errorMsg, e);
  }

  // Loading state - be more permissive
  if (!errorMsg && (!auth || !teams)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading workspace...</div>
      </div>
    );
  }

  // Not found or invalid team
  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-red-700 text-lg">
          {errorMsg}<br />
          <span className="text-xs text-[#ad9271]">
            <button className="underline" onClick={() => navigate("/home")}>Return to dashboard</button>
            &nbsp;(WorkspaceRoom)
          </span>
        </div>
      </div>
    );
  }

  // If user isn't member of any team, redirect to home
  if (!teams.teams || teams.teams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-[#ad9271] text-lg">
          You are not part of any team yet.<br />
          <span className="text-xs text-[#ad9271]">
            <button className="underline" onClick={() => navigate("/home")}>Create or join a team</button>
          </span>
        </div>
      </div>
    );
  }

  // Use current team or fallback to first team
  const displayTeam = currentTeam || teams.teams[0];

  return (
    <div className="relative w-full min-h-screen bg-[#e2fde4] flex flex-row">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-5 px-2">
        <div className="w-full max-w-4xl flex flex-row items-start justify-end mb-3">
          <Button
            variant="secondary"
            className="pixel-font text-[#233f24] flex flex-row items-center gap-2 px-5 py-2 border-[#233f24] border-2 rounded-lg shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all ml-3"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="mr-1" size={20} />
            Back to Home
          </Button>
        </div>
        <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row gap-6 items-start justify-center">
          <div className="flex-1 min-w-[320px] flex items-center justify-center">
            <div className="w-full flex justify-center">
              <PixelChatBox taller />
            </div>
          </div>
          <div className="flex flex-col gap-4 min-w-[320px] w-[340px] relative">
            <PixelTodo />
            <PixelChatRoom team={displayTeam || undefined as any} />
          </div>
        </div>
      </div>
    </div>
  );
}

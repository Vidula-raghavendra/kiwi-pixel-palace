
import React, { useEffect, useState } from "react";
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { teams, currentTeam, setCurrentTeam, loading: teamsLoading } = useTeams();
  const [error, setError] = useState<string>("");

  console.log('WorkspaceRoom render:', { 
    id, 
    user: !!user, 
    authLoading, 
    teamsLoading, 
    teamsCount: teams?.length, 
    currentTeam: currentTeam?.id 
  });

  // Set current team when we have the team ID and teams are loaded
  useEffect(() => {
    if (id && teams && teams.length > 0 && !teamsLoading) {
      const targetTeam = teams.find(t => t.id === id);
      console.log('Looking for team:', id, 'found:', !!targetTeam);
      
      if (targetTeam) {
        if (!currentTeam || currentTeam.id !== id) {
          console.log('Setting current team to:', targetTeam.name);
          setCurrentTeam(targetTeam);
        }
      } else {
        console.log('Team not found, setting error');
        setError("Team not found or you are not a member.");
      }
    }
  }, [id, teams, teamsLoading, currentTeam, setCurrentTeam]);

  // Show loading while auth or teams are loading
  if (authLoading || teamsLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading workspace...</div>
      </div>
    );
  }

  // Show error if we have one
  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-red-700 text-lg">
          {error}<br />
          <span className="text-xs text-[#ad9271]">
            <button className="underline" onClick={() => navigate("/home")}>Return to dashboard</button>
          </span>
        </div>
      </div>
    );
  }

  // If user has no teams, redirect to home
  if (!teams || teams.length === 0) {
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
  const displayTeam = currentTeam || teams[0];

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
            <PixelChatRoom team={displayTeam} />
          </div>
        </div>
      </div>
    </div>
  );
}

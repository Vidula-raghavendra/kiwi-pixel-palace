import React, { useEffect } from "react";
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
  const { user } = useAuth();
  const { teams, currentTeam, setCurrentTeam, loading } = useTeams();

  // If user is not authenticated, force login screen
  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Please sign in to access workspace</div>
        <Button onClick={() => navigate('/auth')} className="mt-4 pixel-font">
          Sign In
        </Button>
      </div>
    );
  }

  // Always keep teams up-to-date for the room, but don't redirect unless loaded
  useEffect(() => {
    // Only run this after loading finished
    if (loading) return;

    // If teams array is truly empty and loading finished, show onboarding—do NOT redirect (handled below)
    if (!teams || teams.length === 0) return;

    // Both teams loaded and id present
    // If the current id does not match any team, redirect to workspace hub
    if (id && !teams.find((t) => t.id === id)) {
      navigate("/workspace", { replace: true });
    }
  }, [id, teams, loading, navigate]);

  // Always update currentTeam if a new id is loaded (after teams are loaded!)
  useEffect(() => {
    if (id && teams && teams.length > 0) {
      const targetTeam = teams.find((t) => t.id === id);
      if (targetTeam) setCurrentTeam(targetTeam);
    }
  }, [id, teams, setCurrentTeam]);

  // While loading, show loader
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading workspace...</div>
      </div>
    );
  }

  // If (after loading) there are no teams, onboard
  if (!teams || teams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-[#ad9271] text-lg">
          No teams found. Please create or join a team first.
        </div>
        <button 
          className="underline text-xs text-[#ad9271] mt-2" 
          onClick={() => navigate("/home")}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Default fallback: show the room for the found team (or fallback to first)
  const displayTeam = currentTeam || teams[0];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] flex flex-row">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-6xl flex flex-row items-center justify-between mb-6">
          <div className="pixel-font text-3xl text-[#233f24] font-bold">
            {displayTeam.name}
          </div>
          <Button
            variant="secondary"
            className="pixel-font text-[#233f24] bg-[#fffdf3] hover:bg-[#fff7ea] flex flex-row items-center gap-2 px-6 py-3 border-[#233f24] border-4 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Button>
        </div>
        <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-[320px]">
            <div className="bg-[#fffdf3] border-4 border-[#233f24] shadow-[0_6px_0_#ad9271] p-1">
              <div className="pixel-font text-lg text-[#233f24] bg-[#badc5b] border-b-4 border-[#233f24] px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">&#x1F916;</span>
                <span>AI Assistant Chat</span>
              </div>
              <PixelChatBox taller />
            </div>
          </div>
          <div className="flex flex-col gap-6 min-w-[320px] w-full lg:w-[380px]">
            <div className="bg-[#fff7ea] border-4 border-[#233f24] shadow-[0_6px_0_#ad9271] p-1">
              <div className="pixel-font text-lg text-[#233f24] bg-[#f59e42] border-b-4 border-[#233f24] px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">&#x2705;</span>
                <span>Team To-Do</span>
              </div>
              <PixelTodo />
            </div>
            <div className="bg-[#f0ffe8] border-4 border-[#233f24] shadow-[0_6px_0_#ad9271] p-1">
              <div className="pixel-font text-lg text-[#233f24] bg-[#8bb47e] border-b-4 border-[#233f24] px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">&#x1F4AC;</span>
                <span>Team Chat</span>
              </div>
              <PixelChatRoom team={displayTeam} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

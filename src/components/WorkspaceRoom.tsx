
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PixelChatBox from "./pixel/PixelChatBox";
import PixelTodo from "./pixel/PixelTodo";
import PixelChatRoom from "./pixel/PixelChatRoom";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { useLocation } from "react-router-dom";

export default function WorkspaceRoom() {
  let auth, teams;
  let errorMsg = "";

  // Defensive logging for debugging
  const location = useLocation();
  const safe = location.pathname === "/workspace/my-room";
  if (!safe) {
    errorMsg = "This workspace route is not supported. Please use /workspace/my-room.";
  }

  if (!errorMsg) {
    try {
      auth = useAuth();
      teams = useTeams();
    } catch (e) {
      errorMsg = (e as Error)?.message || "Critical error loading account or teams.";
      // Output error to browser console for tracing
      console.error("WorkspaceRoom errored:", errorMsg, e);
    }
  }

  // Defensive loading fallback: show spinner until all context is ready
  if (!errorMsg && (!auth || !teams)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading workspace context...</div>
      </div>
    );
  }

  if (errorMsg) {
    // Show user a friendlier error rather than blank
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-red-700 text-lg">
          {errorMsg}<br />
          <span className="text-xs text-[#ad9271]">
            Please reload or <a className="underline" href="/home">go home</a>. (WorkspaceRoom)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#e2fde4] flex flex-row">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-5 px-2">
        <div className="w-full max-w-4xl flex flex-row items-start justify-end mb-3">
          <Button
            variant="secondary"
            className="pixel-font text-[#233f24] flex flex-row items-center gap-2 px-5 py-2 border-[#233f24] border-2 rounded-lg shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all ml-3"
            asChild
          >
            <a href="/home">
              <ArrowLeft className="mr-1" size={20} />
              Back to Home
            </a>
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
            <PixelChatRoom team={undefined as any} />
          </div>
        </div>
      </div>
    </div>
  );
}

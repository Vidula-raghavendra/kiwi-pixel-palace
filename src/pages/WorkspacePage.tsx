import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import DashboardCards from "@/components/DashboardCards";
import { TeamModals } from "@/components/TeamModals";
import { SidebarProvider } from "@/components/ui/sidebar";

const modalDefaults = {
  project: { open: false },
  team: { open: false },
  invite: { open: false },
};

export default function WorkspacePage() {
  const [modal, setModal] = React.useState(modalDefaults);
  const [formData, setFormData] = React.useState({
    projectName: '',
    projectDesc: '',
    teamName: '',
    teamDesc: '',
    teamPassword: '',
    inviteCode: '', // code to join another team (what "join" uses)
    teamJoinPassword: ''
  });
  const [errorMsg, setErrorMsg] = React.useState("");
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createTeam, joinTeam, loading, teams } = useTeams();
  const userName = profile?.full_name || profile?.github_username || 'Kiwi User';

  // Refactored cards for clarity: Join Room & Create Room
  function renderMainActions() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto mb-9">
        <button
          className="bg-gradient-to-br from-[#badc5b] to-[#8bb47e] hover:from-[#8bb47e] hover:to-[#badc5b] border-4 border-[#233f24] p-8 text-2xl font-bold pixel-font text-[#233f24] shadow-[0_6px_0_#233f24] transition hover:shadow-[0_8px_0_#233f24] hover:translate-y-[-2px] group"
          onClick={() => handleCard("project")}
          data-testid="join-room-btn"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">&#x1F511;</div>
          Join a Room
          <div className="text-base font-normal text-[#233f24] mt-3 leading-relaxed">
            Enter an invite code to join a team instantly
          </div>
        </button>
        <button
          className="bg-gradient-to-br from-[#8bb47e] to-[#badc5b] hover:from-[#badc5b] hover:to-[#8bb47e] border-4 border-[#233f24] p-8 text-2xl font-bold pixel-font text-[#233f24] shadow-[0_6px_0_#233f24] transition hover:shadow-[0_8px_0_#233f24] hover:translate-y-[-2px] group"
          onClick={() => handleCard("team")}
          data-testid="create-room-btn"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">&#x2728;</div>
          Create a Room
          <div className="text-base font-normal text-[#233f24] mt-3 leading-relaxed">
            Start a fresh team and get an instant invite link to share
          </div>
        </button>
      </div>
    );
  }

  function handleCard(card: "project" | "team" | "invite") {
    setErrorMsg("");
    if (card === "invite") {
      // The "invite" modal is now only for sharing invite code info, so open the join team modal instead
      setModal({ ...modalDefaults, project: { open: true } });
    } else {
      setModal({ ...modalDefaults, [card]: { open: true } });
    }
  }

  function closeAll() {
    setModal(modalDefaults);
    setFormData({
      projectName: '',
      projectDesc: '',
      teamName: '',
      teamDesc: '',
      teamPassword: '',
      inviteCode: '',
      teamJoinPassword: ''
    });
    setErrorMsg("");
  }

  async function submitCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const newTeam = await createTeam(formData.teamName, formData.teamDesc, formData.teamPassword);
      closeAll();
      // Navigate to the new team's workspace
      setTimeout(() => {
        navigate(`/workspace/${newTeam.id}`);
      }, 500);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error creating team. Please try again.");
    }
  }

  async function submitJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const team = await joinTeam(formData.inviteCode); // joinTeam only expects code
      closeAll();
      setTimeout(() => {
        navigate(`/workspace/${team.id}`);
      }, 500);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error joining team. Please try again.");
    }
  }

  // If user has teams
  if (teams && teams.length > 0) {
    return (
      <SidebarProvider>
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] overflow-x-auto">
          <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 min-w-0">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-10">
                <div className="pixel-font text-4xl md:text-5xl text-[#233f24] mb-3 drop-shadow-[2px_2px_0_rgba(186,220,91,0.3)]">
                  Welcome back, <span className="text-[#8bb47e]">{userName}</span>!
                </div>
                <p className="pixel-font text-[#7b6449] text-lg">You're part of {teams.length} awesome team{teams.length > 1 ? 's' : ''}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {teams.map((team) => (
                  <div key={team.id} className="bg-[#fffdf3] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all group">
                    <div className="mb-4">
                      <div className="pixel-font text-2xl text-[#233f24] font-bold mb-2">{team.name}</div>
                      {team.description && (
                        <div className="pixel-font text-sm text-[#7b6449] mb-3">{team.description}</div>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-[#badc5b] border-2 border-[#233f24] px-2 py-1 pixel-font text-[#233f24] font-mono">
                          {team.invite_code}
                        </span>
                        <span className="pixel-font text-[#ad9271]">Invite Code</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(`/workspace/${team.id}`)}
                      className="w-full pixel-font bg-[#8bb47e] hover:bg-[#badc5b] border-2 border-[#233f24] text-[#233f24] py-3 shadow-[0_2px_0_#233f24] hover:shadow-[0_4px_0_#233f24] hover:translate-y-[-2px] transition-all text-lg"
                    >
                      &#x26A1; Enter Workspace
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center mb-6">
                <div className="pixel-font text-2xl text-[#233f24] mb-2">Want to do more?</div>
                <p className="pixel-font text-[#7b6449]">Join another team or create a new workspace</p>
              </div>
              {renderMainActions()}
            </div>
          </main>

          <TeamModals
            modal={modal}
            closeAll={closeAll}
            loading={loading}
            formData={formData}
            setFormData={value => setFormData(prev => ({ ...prev, ...value }))}
            submitCreateTeam={submitCreateTeam}
            submitJoinTeam={submitJoinTeam}
            errorMsg={errorMsg}
          />
        </div>
      </SidebarProvider>
    );
  }

  // If no teams, default onboarding with join/create room options
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] overflow-x-auto">
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 min-w-0">
          <div className="max-w-4xl w-full text-center">
            <div className="mb-10">
              <div className="inline-block mb-6">
                <div className="w-24 h-24 bg-[#badc5b] border-4 border-[#233f24] flex items-center justify-center shadow-[0_6px_0_#233f24] animate-bounce">
                  <span className="text-5xl">&#x1F44B;</span>
                </div>
              </div>
              <div className="pixel-font text-4xl md:text-5xl text-[#233f24] mb-4 drop-shadow-[2px_2px_0_rgba(186,220,91,0.3)]">
                Welcome, <span className="text-[#8bb47e]">{userName}</span>!
              </div>
              <div className="pixel-font text-[#7b6449] text-xl mb-6 max-w-2xl mx-auto">
                Get started by joining an existing team or creating your own workspace.
              </div>
            </div>
            {renderMainActions()}
            <div className="mt-12 bg-[#fff7ea] border-4 border-[#233f24] p-8 shadow-[0_4px_0_#ad9271] max-w-2xl mx-auto">
              <div className="pixel-font text-lg text-[#233f24] mb-4">&#x2728; What you can do with KIWI:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <span className="text-[#8bb47e] flex-shrink-0">&#x2713;</span>
                  <span className="pixel-font text-sm text-[#7b6449]">Collaborate with AI assistants</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8bb47e] flex-shrink-0">&#x2713;</span>
                  <span className="pixel-font text-sm text-[#7b6449]">Real-time team chat</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8bb47e] flex-shrink-0">&#x2713;</span>
                  <span className="pixel-font text-sm text-[#7b6449]">Manage tasks together</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8bb47e] flex-shrink-0">&#x2713;</span>
                  <span className="pixel-font text-sm text-[#7b6449]">Share code snippets instantly</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <TeamModals
          modal={modal}
          closeAll={closeAll}
          loading={loading}
          formData={formData}
          setFormData={value => setFormData(prev => ({ ...prev, ...value }))}
          submitCreateTeam={submitCreateTeam}
          submitJoinTeam={submitJoinTeam}
          errorMsg={errorMsg}
        />
      </div>
    </SidebarProvider>
  );
}

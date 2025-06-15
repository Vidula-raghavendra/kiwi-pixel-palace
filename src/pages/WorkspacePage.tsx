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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-lg mx-auto mb-9">
        <button
          className="bg-[#badc5b] hover:bg-[#b6e879] border-2 border-[#ad9271] rounded-lg p-6 text-xl font-bold pixel-font text-[#233f24] shadow-[0_2px_0_#ad9271] transition hover:scale-105"
          onClick={() => handleCard("project")}
          data-testid="join-room-btn"
        >
          Join a Room
          <div className="text-base font-normal text-[#7b6449] mt-2">
            Enter an invite code to join a team instantly
          </div>
        </button>
        <button
          className="bg-[#8bb47e] hover:bg-[#93c88e] border-2 border-[#ad9271] rounded-lg p-6 text-xl font-bold pixel-font text-[#233f24] shadow-[0_2px_0_#ad9271] transition hover:scale-105"
          onClick={() => handleCard("team")}
          data-testid="create-room-btn"
        >
          Create a Room
          <div className="text-base font-normal text-[#7b6449] mt-2">
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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4] overflow-x-auto">
          <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
            <div className="max-w-2xl w-full text-center">
              <div className="pixel-font text-2xl text-[#233f24] mb-6">
                Welcome back, <span className="text-[#8bb47e]">{userName}</span>!
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="pixel-font text-[#233f24]">You're already part of {teams.length} team{teams.length > 1 ? 's' : ''}:</p>
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 bg-[#f7ffe1] rounded-lg border border-[#badc5b]">
                    <div>
                      <div className="pixel-font text-[#233f24] font-semibold">{team.name}</div>
                      {team.description && (
                        <div className="text-sm text-[#8bb47e]">{team.description}</div>
                      )}
                      <div className="text-xs mt-2">
                        Invite code to join:&nbsp;
                        <span className="bg-[#e2fde4] p-0.5 rounded font-mono">{team.invite_code}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/workspace/${team.id}`)}
                      className="pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24]"
                    >
                      Enter Workspace
                    </Button>
                  </div>
                ))}
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
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4] overflow-x-auto">
        <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
          <div className="max-w-2xl w-full">
            <div className="pixel-font text-2xl text-[#233f24] mb-6">
              Welcome, <span className="text-[#8bb47e]">{userName}</span>!
            </div>
            <div className="pixel-font text-[#233f24] mb-8">
              Get started by joining an existing team or creating a new one:
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

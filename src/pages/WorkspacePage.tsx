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
    inviteCode: '',
    teamJoinPassword: ''
  });
  const [errorMsg, setErrorMsg] = React.useState("");
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createTeam, joinTeam, loading, teams } = useTeams();
  const userName = profile?.full_name || profile?.github_username || 'Kiwi User';

  function handleCard(card: "project" | "team" | "invite") {
    setErrorMsg("");
    setModal({ ...modalDefaults, [card]: { open: true } });
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
      const team = await joinTeam(formData.inviteCode, formData.teamJoinPassword);
      closeAll();
      // Navigate to the joined team's workspace
      setTimeout(() => {
        navigate(`/workspace/${team.id}`);
      }, 500);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error joining team. Please try again.");
    }
  }

  // If user has teams, show option to go to existing workspace
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

              <div className="space-y-4">
                <p className="pixel-font text-[#233f24]">Or create/join a new team:</p>
                <DashboardCards
                  openCreate={() => handleCard("team")}
                  openJoin={() => handleCard("invite")}
                  openInvite={() => handleCard("invite")}
                  loading={loading}
                  // If DashboardCards expects callbacks with only one argument, make sure to only provide one!
                />
              </div>
            </div>
          </main>

          <TeamModals
            modal={modal}
            closeAll={closeAll}
            loading={loading}
            formData={formData}
            setFormData={(value) => setFormData({ ...formData, ...value })} // Fix: use spread for partial updates
            submitCreateTeam={submitCreateTeam}
            submitJoinTeam={submitJoinTeam}
            errorMsg={errorMsg}
          />
        </div>
      </SidebarProvider>
    );
  }

  // If no teams, show team creation interface
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#e2fde4] overflow-x-auto">
        <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
          <div className="max-w-2xl w-full">
            <div className="pixel-font text-2xl text-[#233f24] mb-6">
              Welcome, <span className="text-[#8bb47e]">{userName}</span>!
            </div>
            <div className="pixel-font text-[#233f24] mb-8">
              Get started by creating a new team or joining an existing one:
            </div>
            <DashboardCards
              openCreate={() => handleCard("team")}
              openJoin={() => handleCard("invite")}
              openInvite={() => handleCard("invite")}
              loading={loading}
            />
          </div>
        </main>

        <TeamModals
          modal={modal}
          closeAll={closeAll}
          loading={loading}
          formData={formData}
          setFormData={(value) => setFormData({ ...formData, ...value })} // Fix: ensure single argument
          submitCreateTeam={submitCreateTeam}
          submitJoinTeam={submitJoinTeam}
          errorMsg={errorMsg}
        />
      </div>
    </SidebarProvider>
  );
}

import React, { useState } from "react";
import KiwiSidebar from "./KiwiSidebar";
import KiwiMascot from "./KiwiMascot";
import KiwiBgAnim from "./KiwiBgAnim";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import DashboardCards from "./DashboardCards";
import { TeamModals } from "./TeamModals";
import WorkspaceSidebar from "./WorkspaceSidebar";

const modalDefaults = {
  project: { open: false },
  team: { open: false },
  invite: { open: false },
};

export default function KiwiWorkspace() {
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
  const { createTeam, joinTeam, loading } = useTeams();
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
      await createTeam(formData.teamName, formData.teamDesc, formData.teamPassword);
      closeAll();
      setTimeout(() => {
        navigate("/workspace/my-room");
      }, 500);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error creating team. Please try again.");
    }
  }

  async function submitJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      await joinTeam(formData.inviteCode, formData.teamJoinPassword);
      closeAll();
      setTimeout(() => {
        navigate("/workspace/my-room");
      }, 500);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error joining team. Please try again.");
    }
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    closeAll();
    setTimeout(() => {
      navigate("/workspace/my-room");
    }, 500);
  }

  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full flex bg-[#e2fde4] overflow-x-auto">
        <WorkspaceSidebar />
        <KiwiSidebar />
        <KiwiBgAnim />
        <KiwiMascot />

        <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
          <div className="max-w-2xl w-full">
            <div className="pixel-font text-2xl text-[#233f24] mb-6">
              Welcome back, <span className="text-[#8bb47e]">{userName}</span>!
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
          setFormData={setFormData}
          submitCreateTeam={submitCreateTeam}
          submitJoinTeam={submitJoinTeam}
          errorMsg={errorMsg}
        />
      </div>
    </SidebarProvider>
  );
}

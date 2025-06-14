
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

const modalDefaults = {
  project: { open: false },
  team: { open: false },
  invite: { open: false },
};

export default function KiwiWorkspace() {
  const [modal, setModal] = useState(modalDefaults);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDesc: '',
    teamName: '',
    teamDesc: '',
    inviteCode: ''
  });
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createTeam, joinTeam, loading } = useTeams();

  const userName = profile?.full_name || profile?.github_username || 'Kiwi User';

  function handleCard(card: "project" | "team" | "invite") {
    setModal({ ...modalDefaults, [card]: { open: true } });
  }

  function closeAll() {
    setModal(modalDefaults);
    setFormData({
      projectName: '',
      projectDesc: '',
      teamName: '',
      teamDesc: '',
      inviteCode: ''
    });
  }

  async function submitCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createTeam(formData.teamName, formData.teamDesc);
      closeAll();
      setTimeout(() => {
        navigate("/workspace/my-room");
      }, 500);
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  async function submitJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await joinTeam(formData.inviteCode);
      closeAll();
      setTimeout(() => {
        navigate("/workspace/my-room");
      }, 500);
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    closeAll();
    setTimeout(() => {
      navigate("/workspace/my-room");
    }, 500);
  }

  const cards = [
    {
      title: "Create a New Team",
      desc: "Start a new collaboration space!",
      icon: <Plus color="#ad9271" size={36} />,
      onClick: () => handleCard("team"),
    },
    {
      title: "Join a Team",
      desc: "Enter your invite code.",
      icon: <Users color="#8bb47e" size={36} />,
      onClick: () => handleCard("invite"),
    },
    {
      title: "Invite a Member",
      desc: "Share your team invite code.",
      icon: <Mail color="#badc5b" size={34} />,
      onClick: () => handleCard("invite"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full flex bg-[#e2fde4] overflow-x-auto">
        <KiwiSidebar />
        <KiwiBgAnim />
        <KiwiMascot />
        
        <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
          <div className="max-w-2xl w-full">
            <div className="pixel-font text-2xl text-[#233f24] mb-6">
              Welcome back, <span className="text-[#8bb47e]">{userName}</span>!
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
              {cards.map((card) => (
                <Button
                  key={card.title}
                  variant="outline"
                  className="pixel-outline bg-[#fdfae8] shadow-[0_2px_0_#ad9271] border-[#ad9271] border-2 text-[#233f24] rounded-lg flex flex-col gap-2 px-6 py-8 items-center hover-scale transition-all min-h-[168px] group"
                  style={{
                    boxShadow: "0 7px 0 #c4bb77, 0 2px 0 #ad9271",
                    fontWeight: 700
                  }}
                  onClick={card.onClick}
                  disabled={loading}
                >
                  <div className="mb-2">{card.icon}</div>
                  <div className="pixel-font text-lg">{card.title}</div>
                  <div className="text-[#917141] text-xs mt-2 mb-1">{card.desc}</div>
                  <div className="w-full text-right opacity-15 -mt-2 group-hover:opacity-40 transition-all">▼</div>
                </Button>
              ))}
            </div>
          </div>
        </main>

        {/* Create Team Modal */}
        <Dialog open={modal.team.open} onOpenChange={closeAll}>
          <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="pixel-font text-[#8bb47e]">Create New Team</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4 mt-4" onSubmit={submitCreateTeam}>
              <Input 
                name="name" 
                required 
                placeholder="Team Name"
                value={formData.teamName}
                onChange={(e) => setFormData(prev => ({...prev, teamName: e.target.value}))}
                className="pixel-outline bg-[#f9fbe3] text-[#233f24]" 
              />
              <Textarea 
                name="desc" 
                placeholder="Team Description (optional)"
                value={formData.teamDesc}
                onChange={(e) => setFormData(prev => ({...prev, teamDesc: e.target.value}))}
                className="pixel-outline bg-[#f9fbe3] text-[#7b6449]" 
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="mt-2 pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24] !rounded"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Join Team Modal */}
        <Dialog open={modal.invite.open} onOpenChange={closeAll}>
          <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="pixel-font text-[#badc5b]">Join Team</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4 mt-4" onSubmit={submitJoinTeam}>
              <Input 
                name="invite" 
                required 
                placeholder="Enter Invite Code"
                value={formData.inviteCode}
                onChange={(e) => setFormData(prev => ({...prev, inviteCode: e.target.value}))}
                className="pixel-outline bg-[#f9fbe3] text-[#233f24]" 
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="mt-2 pixel-font bg-[#badc5b] hover:bg-[#d8e893] text-[#233f24] !rounded"
              >
                {loading ? 'Joining...' : 'Join Team'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

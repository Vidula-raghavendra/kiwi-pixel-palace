
import React, { useState } from "react";
import KiwiSidebar from "./KiwiSidebar";
import KiwiMascot from "./KiwiMascot";
import KiwiBgAnim from "./KiwiBgAnim";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const modalDefaults = {
  project: { open: false },
  team: { open: false },
  invite: { open: false },
};

export default function KiwiWorkspace() {
  const [modal, setModal] = useState(modalDefaults);
  const navigate = useNavigate();
  const userName = "Kiwi User"; // Replace with actual user state

  // Handlers for cards
  function handleCard(card: "project" | "team" | "invite") {
    setModal({ ...modalDefaults, [card]: { open: true } });
  }
  function closeAll() {
    setModal(modalDefaults);
  }

  // Simulated submit handlers for modals
  function submitModal(type: "project" | "team" | "invite", e: React.FormEvent) {
    e.preventDefault();
    closeAll();
    setTimeout(() => {
      // Navigate to a sample new workspace (simulate ID 1234)
      navigate("/workspace/1234");
    }, 500);
  }

  // The 3 big cards with modals
  const cards = [
    {
      title: "Create a New Project",
      desc: "Start something new!",
      icon: <Plus color="#ad9271" size={36} />,
      onClick: () => handleCard("project"),
    },
    {
      title: "Join a Team",
      desc: "Enter your invite code.",
      icon: <Users color="#8bb47e" size={36} />,
      onClick: () => handleCard("team"),
    },
    {
      title: "Invite a Member",
      desc: "Email or phone + role.",
      icon: <Mail color="#badc5b" size={34} />,
      onClick: () => handleCard("invite"),
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex bg-[#e2fde4] overflow-x-auto">
      <KiwiSidebar />
      <KiwiBgAnim />
      <KiwiMascot />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 min-w-0">
        <div className="max-w-2xl w-full">
          <div className="pixel-font text-2xl text-[#233f24] mb-6">
            Welcome back, <span className="text-[#8bb47e]">{userName}</span>!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
            {cards.map((card, idx) => (
              <Button
                key={card.title}
                variant="outline"
                className="pixel-outline bg-[#fdfae8] shadow-[0_2px_0_#ad9271] border-[#ad9271] border-2 text-[#233f24] rounded-lg flex flex-col gap-2 px-6 py-8 items-center hover-scale transition-all min-h-[168px] group"
                style={{
                  boxShadow: "0 7px 0 #c4bb77, 0 2px 0 #ad9271",
                  fontWeight: 700
                }}
                onClick={card.onClick}
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
      {/* Modals */}
      <Dialog open={modal.project.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#ad9271]">Create Project</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2 mt-2" onSubmit={e => submitModal("project", e)}>
            <input name="name" required placeholder="Project Name" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] mt-2 text-[#233f24] rounded" />
            <input name="desc" placeholder="Description (optional)" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] text-[#7b6449] rounded" />
            <select name="type" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] text-[#233f24] rounded" defaultValue="team">
              <option value="team">Team Workspace</option>
              <option value="personal">Personal Project</option>
            </select>
            <Button type="submit" className="mt-4 pixel-font bg-[#badc5b] hover:bg-[#aed57a] text-[#233f24] !rounded">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={modal.team.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#8bb47e]">Join a Team</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2 mt-2" onSubmit={e => submitModal("team", e)}>
            <input name="invite" required placeholder="Invite Code or Project ID" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] text-[#233f24] rounded" />
            <Button type="submit" className="mt-4 pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24] !rounded">
              Join
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={modal.invite.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#badc5b]">Invite Member</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2 mt-2" onSubmit={e => submitModal("invite", e)}>
            <input name="target" type="text" required placeholder="Email or phone" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] text-[#233f24] rounded" />
            <select name="role" className="px-3 py-2 border pixel-outline bg-[#f9fbe3] text-[#233f24] rounded">
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" className="mt-4 pixel-font bg-[#badc5b] hover:bg-[#d8e893] text-[#233f24] !rounded">
              Invite
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

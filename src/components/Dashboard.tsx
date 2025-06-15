
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import DashboardCards from "./DashboardCards";
import { TeamModals } from "./TeamModals";

const statCard =
  "flex flex-col items-center justify-center bg-[#fffdf3] border-2 border-[#ad9271] rounded-lg shadow-[0_2px_0_#ad9271] px-6 py-4 min-w-[120px] min-h-[88px] pixel-font font-semibold text-lg text-[#233f24]";

const modalDefaults = {
  project: { open: false },
  team: { open: false },
  invite: { open: false },
};

const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Always call useTeams at the top level - never conditionally
  const { createTeam, joinTeam, loading, teams, currentTeam } = useTeams();
  
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

  // Early return after all hooks are called
  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || profile?.github_username || user?.email || 'User';

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
      console.log('Creating team:', formData.teamName);
      const newTeam = await createTeam(formData.teamName, formData.teamDesc, formData.teamPassword);
      console.log('Team created successfully:', newTeam);
      closeAll();
      navigate(`/workspace/${newTeam.id}`);
    } catch (error: any) {
      console.error('Error creating team:', error);
      setErrorMsg(error?.message || "Error creating team. Please try again.");
    }
  }

  async function submitJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      console.log('Joining team with code:', formData.inviteCode);
      const joinedTeam = await joinTeam(formData.inviteCode, formData.teamJoinPassword);
      console.log('Team joined successfully:', joinedTeam);
      closeAll();
      navigate(`/workspace/${joinedTeam.id}`);
    } catch (error: any) {
      console.error('Error joining team:', error);
      setErrorMsg(error?.message || "Error joining team. Please try again.");
    }
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    closeAll();
    if (currentTeam) {
      navigate(`/workspace/${currentTeam.id}`);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center py-10 gap-8 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-[640px]">
        <div className="text-3xl pixel-font text-[#233f24] text-center">
          Welcome, {displayName}!
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="pixel-font text-[#233f24] border-[#ad9271] flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
      
      {profile?.avatar_url && (
        <div className="flex justify-center mb-4">
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-[#badc5b]"
          />
        </div>
      )}

      <div className="w-full max-w-[640px] flex flex-row flex-wrap gap-4 justify-center">
        <div className={statCard}>
          <span className="text-2xl text-[#ad9271]">&#x2764;&#xFE0F; 3</span>
          <span className="mt-2 text-[#7b6449]">Lives left</span>
        </div>
        <div className={statCard}>
          <span className="text-2xl text-[#8bb47e]">&#x1F4B0; 1024</span>
          <span className="mt-2 text-[#7b6449]">Pixel Coins</span>
        </div>
        <div className={statCard}>
          <span className="text-2xl text-[#badc5b]">&#x1F3AE;</span>
          <span className="mt-2 text-[#7b6449]">Quests Completed: 7</span>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <DashboardCards
          openCreate={() => handleCard("team")}
          openJoin={() => handleCard("invite")}
          openInvite={() => handleCard("invite")}
          loading={loading}
        />
      </div>
      
      <div className="flex flex-row justify-center gap-5 mt-4">
        {teams && teams.length > 0 && currentTeam && (
          <Button 
            className="pixel-font bg-[#badc5b] border-[#233f24] border-2 rounded-lg text-[#233f24] text-lg px-5 py-2 shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all flex flex-row items-center gap-2"
            onClick={() => navigate(`/workspace/${currentTeam.id}`)}
          >
            Enter Workspace
            <ArrowRight className="ml-1" size={20} />
          </Button>
        )}
        <Button asChild variant="secondary" className="pixel-font text-lg flex flex-row items-center gap-2">
          <Link to="/">
            <ArrowLeft className="mr-1" size={20} />
            Back to Landing
          </Link>
        </Button>
      </div>
      
      <div className="mt-6 pixel-font text-[#8bb47e] text-center">
        <div className="text-lg mb-1">Your recent activity</div>
        <div className="bg-[#fffdf3] border-2 border-[#ad9271] rounded-lg px-6 py-3 shadow-[0_2px_0_#ad9271] max-w-[440px] text-[#232b1b]">
          <ul className="list-disc ml-6 text-left text-base">
            <li>Signed in with GitHub</li>
            <li>Accessed Dashboard</li>
            <li>Ready to collaborate!</li>
          </ul>
        </div>
      </div>

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
  );
};

export default Dashboard;

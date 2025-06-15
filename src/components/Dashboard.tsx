import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, CopyCheck, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const statCard =
  "flex flex-col items-center justify-center bg-[#fffdf3] border-2 border-[#ad9271] rounded-lg shadow-[0_2px_0_#ad9271] px-6 py-4 min-w-[120px] min-h-[88px] pixel-font font-semibold text-lg text-[#233f24]";

/** Invite Modal shown after creating a new team/project */
function InviteModal({
  open,
  onClose,
  inviteCode,
}: {
  open: boolean;
  onClose: () => void;
  inviteCode: string;
}) {
  // Ensure copied link resets when modal closes
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);
  const link =
    inviteCode && inviteCode.length > 0
      ? `${window.location.origin}/invite/${inviteCode}`
      : "";

  function handleCopy() {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }
  return (
    <Dialog open={open} onOpenChange={o => !o ? onClose() : undefined}>
      <DialogContent>
        <DialogTitle className="pixel-font text-[#233f24]">
          Share Your Team Invite Link
        </DialogTitle>
        <div className="flex flex-col gap-3 mt-4">
          <div className="text-[#233f24] text-sm mb-2">
            Send this link to teammates to let them join your workspace:
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="pixel-font text-sm"
              value={link}
              readOnly
              onFocus={e => e.target.select()}
            />
            <Button
              className="bg-[#dbe186] hover:bg-[#badc5b] text-[#233f24] rounded"
              onClick={handleCopy}
              tabIndex={0}
              type="button"
            >
              {copied ? <CopyCheck size={18} /> : <Copy size={18} />}
            </Button>
          </div>
        </div>
        <Button
          onClick={onClose}
          className="w-full pixel-font mt-4 bg-[#badc5b] text-[#233f24]"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // CRITICAL: All hooks must be called at the top level - NEVER conditionally
  const { createTeam, joinTeam, loading, teams, currentTeam } = useTeams();
  
  // Only one InviteModal rendered (moved out the duplicate at bottom!)
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Early return AFTER all hooks are called
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading...</div>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.github_username || user?.email || 'User';

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setCreating(true);
    setInviteCode(""); // Reset invite code in case of multiple attempts
    try {
      const team = await createTeam(teamName, teamDesc);
      // Robustly set invite code from a returned correct team object
      setInviteCode(team.invite_code || "");
      setModalOpen(true);
      setTeamName("");
      setTeamDesc("");
      // Don't navigate, just show modal
    } catch (err: any) {
      setErrorMsg(err?.message || "Error creating team.");
    } finally {
      setCreating(false);
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

      {/* Existing teams */}
      {teams && teams.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="pixel-font text-lg mb-3 text-[#233f24]">
            Your Workspaces:
          </div>
          <div className="space-y-4">
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
        </div>
      )}

      {/* Start a new project */}
      <div className="w-full max-w-lg mt-10 mb-6 p-7 rounded-lg border-2 border-[#ad9271] bg-[#fffdf3] shadow-[0_2px_0_#ad9271] flex flex-col items-center gap-2">
        <div className="pixel-font text-lg mb-3 text-[#233f24]">Start a New Project</div>
        <form onSubmit={handleCreateTeam} className="flex flex-col gap-3 w-full">
          <Input
            className="pixel-font"
            placeholder="Workspace/Team Name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
            maxLength={48}
            disabled={creating}
          />
          <Input
            className="pixel-font"
            placeholder="Description (optional)"
            value={teamDesc}
            onChange={e => setTeamDesc(e.target.value)}
            maxLength={100}
            disabled={creating}
          />
          {errorMsg && <div className="text-red-500 pixel-font">{errorMsg}</div>}
          <Button
            disabled={creating || !teamName}
            type="submit"
            className="pixel-font bg-[#badc5b] text-[#233f24] mt-3"
          >
            {creating ? "Creating..." : "Create Team"}
          </Button>
        </form>
        {/* Only one InviteModal here, shown when creating a team */}
        <InviteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          inviteCode={inviteCode}
        />
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
      
      <div className="flex flex-row justify-center gap-5 mt-4">
        {teams && teams.length > 0 && currentTeam && (
          <Button 
            className="pixel-font bg-[#badc5b] border-[#233f24] border-2 rounded-lg text-[#233f24] text-lg px-5 py-2 shadow-[0_2px_0_#ad9271] hover:brightness-95 hover:scale-105 transition-all flex flex-row items-center gap-2"
            onClick={() => navigate(`/workspace/${currentTeam.id}`)}
          >
            Enter Workspace
          </Button>
        )}
        <Button asChild variant="secondary" className="pixel-font text-lg flex flex-row items-center gap-2">
          <Link to="/">
            Back to Landing
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

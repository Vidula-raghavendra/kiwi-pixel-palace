import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CopyCheck, Copy, LogOut, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const statCard =
  "flex flex-col items-center justify-center bg-[#fffdf3] border-4 border-[#233f24] shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all px-8 py-6 min-w-[140px] min-h-[110px] pixel-font font-semibold text-lg text-[#233f24]";

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

// Minimal CreateTeam Modal
function CreateTeamModal({ open, onClose, onTeamCreated, loading }: {
  open: boolean;
  onClose: () => void;
  onTeamCreated: (team: any) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset form on open/close
  React.useEffect(() => {
    if (!open) {
      setName("");
      setDesc("");
      setErrorMsg("");
    }
  }, [open]);

  const { createTeam } = useTeams();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const team = await createTeam(name.trim(), desc.trim() || "");
      onTeamCreated(team);
    } catch (err: any) {
      setErrorMsg(err?.message || "Could not create team.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => !o ? onClose() : undefined}>
      <DialogContent>
        <DialogTitle className="pixel-font text-[#233f24]">Create a New Team</DialogTitle>
        <form onSubmit={handleCreate} className="flex flex-col gap-3 mt-2">
          <Input
            placeholder="Team name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
            autoFocus
            className="pixel-font"
          />
          <Input
            placeholder="Description (optional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={loading}
            className="pixel-font"
          />
          {errorMsg && <div className="text-red-500 px-1 text-sm">{errorMsg}</div>}
          <Button
            disabled={loading || !name.trim()}
            type="submit"
            className="pixel-font mt-2 bg-[#badc5b] text-[#233f24] w-full"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Minimal TeamCode modal for instant copy/share
function TeamCodeModal({ open, onClose, code }: { open: boolean, onClose: () => void, code: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  }
  React.useEffect(() => { if (!open) setCopied(false); }, [open]);
  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogTitle className="pixel-font text-[#233f24] text-center text-2xl mb-0">
          Team Join Code
        </DialogTitle>
        <div className="text-base text-[#233f24] my-3 text-center max-w-[320px]">
          Share this code with your teammates to let them join your team!
        </div>
        <div className="flex flex-col gap-2 items-center my-3 w-full">
          <Input 
            readOnly 
            value={code} 
            className="pixel-font text-2xl tracking-widest border-2 border-[#ad9271] text-center bg-[#fffbe8] px-6 py-3 max-w-[320px] mb-2"
            style={{ fontSize: "2.1rem", letterSpacing: "0.16em" }}
          />
          <Button 
            onClick={handleCopy} 
            className="bg-[#badc5b] text-[#233f24] flex gap-2 rounded px-5 py-2 text-lg font-semibold pixel-font"
            style={{ fontSize: "1.18rem" }}
          >
            {copied ? <CopyCheck size={19} /> : <Copy size={19} />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
        <Button onClick={onClose} className="w-full pixel-font bg-[#badc5b] text-[#233f24] mt-3 text-lg">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Main Dashboard
const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // HOOKS must always be at the top
  const { createTeam, loading, teams, currentTeam } = useTeams();

  // CreateTeam modal state
  const [createOpen, setCreateOpen] = useState(false);
  // TeamCode modal state (show after creation)
  const [codeOpen, setCodeOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState("");

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

  // Called after successful team created
  function handleCreated(team: any) {
    setCreatedCode(team.invite_code || team.team_code || "");
    setCreateOpen(false);
    setCodeOpen(true);
  }

  return (
    <div className="w-full h-full flex flex-col items-center py-12 gap-10 animate-fade-in bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-4 gap-4">
        <div className="text-center md:text-left">
          <div className="text-4xl md:text-5xl pixel-font text-[#233f24] mb-2 drop-shadow-[2px_2px_0_rgba(186,220,91,0.3)]">
            Welcome back, {displayName}!
          </div>
          <p className="pixel-font text-[#7b6449] text-lg">Ready to build something amazing today?</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateOpen(true)}
            className="pixel-font bg-[#badc5b] hover:bg-[#8bb47e] border-4 border-[#233f24] shadow-[0_4px_0_#233f24] hover:shadow-[0_6px_0_#233f24] hover:translate-y-[-2px] transition-all flex items-center gap-2 text-[#233f24] px-5 py-6 text-lg"
          >
            <Plus size={20} /> New Team
          </Button>
          <Button
            onClick={signOut}
            variant="outline"
            className="pixel-font text-[#233f24] border-4 border-[#ad9271] bg-[#fffdf3] hover:bg-[#fff7ea] shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all flex items-center gap-2 px-5 py-6 text-lg"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
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

      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={statCard}>
            <div className="text-4xl mb-2">&#x2764;&#xFE0F;</div>
            <span className="text-3xl text-[#f59e42] font-bold">3</span>
            <span className="mt-2 text-[#7b6449] text-sm">Active Teammates</span>
          </div>
          <div className={statCard}>
            <div className="text-4xl mb-2">&#x1F4B0;</div>
            <span className="text-3xl text-[#badc5b] font-bold">1,024</span>
            <span className="mt-2 text-[#7b6449] text-sm">Messages Sent</span>
          </div>
          <div className={statCard}>
            <div className="text-4xl mb-2">&#x1F3AE;</div>
            <span className="text-3xl text-[#8bb47e] font-bold">7</span>
            <span className="mt-2 text-[#7b6449] text-sm">Projects Completed</span>
          </div>
        </div>
      </div>

      {/* Existing teams */}
      {teams && teams.length > 0 && (
        <div className="w-full max-w-5xl px-4">
          <div className="pixel-font text-2xl mb-6 text-[#233f24]">
            &#x1F4BC; Your Workspaces
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-[#fffdf3] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="pixel-font text-xl text-[#233f24] font-bold mb-2">{team.name}</div>
                    {team.description && (
                      <div className="pixel-font text-sm text-[#7b6449] mb-3">{team.description}</div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-[#badc5b] border-2 border-[#233f24] px-2 py-1 pixel-font text-[#233f24]">
                        {team.invite_code}
                      </span>
                      <span className="pixel-font text-[#ad9271]">Invite Code</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/workspace/${team.id}`)}
                  className="w-full pixel-font bg-[#8bb47e] hover:bg-[#badc5b] border-2 border-[#233f24] text-[#233f24] py-3 shadow-[0_2px_0_#233f24] hover:shadow-[0_4px_0_#233f24] hover:translate-y-[-2px] transition-all"
                >
                  &#x26A1; Enter Workspace
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start a new project */}
      <div className="w-full max-w-2xl px-4 mt-12 mb-8 p-12 border-4 border-[#233f24] bg-gradient-to-br from-[#badc5b] to-[#8bb47e] shadow-[0_6px_0_#233f24] flex flex-col items-center gap-6"
      >
        <div className="pixel-font text-3xl mb-2 text-[#233f24] text-center">Create Your First Workspace</div>
        <p className="pixel-font text-[#233f24] text-center mb-2">Start collaborating with your team in minutes</p>
        <form onSubmit={handleCreateTeam} className="flex flex-col gap-5 w-full items-center">
          <Input
            className="pixel-font text-lg px-5 py-3"
            placeholder="Workspace/Team Name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
            maxLength={48}
            disabled={creating}
            style={{ fontSize: "1.08rem" }}
          />
          <Input
            className="pixel-font text-md px-5 py-2"
            placeholder="Description (optional)"
            value={teamDesc}
            onChange={e => setTeamDesc(e.target.value)}
            maxLength={100}
            disabled={creating}
            style={{ fontSize: "1rem" }}
          />
          {errorMsg && <div className="text-red-500 pixel-font text-base">{errorMsg}</div>}
          <Button
            disabled={creating || !teamName}
            type="submit"
            className="pixel-font bg-[#badc5b] text-[#233f24] mt-4 text-lg px-7 py-3"
            style={{
              fontSize: "1.15rem",
              minHeight: "48px",
            }}
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

      <div className="w-full max-w-5xl px-4 mt-8">
        <div className="bg-[#fff7ea] border-4 border-[#233f24] p-8 shadow-[0_4px_0_#ad9271]">
          <div className="pixel-font text-xl text-[#233f24] mb-4">&#x2728; Recent Activity</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pixel-font text-[#7b6449]">
              <div className="w-3 h-3 bg-[#8bb47e] border-2 border-[#233f24]"></div>
              <span>Signed in with GitHub</span>
              <span className="text-xs text-[#ad9271] ml-auto">Just now</span>
            </div>
            <div className="flex items-center gap-3 pixel-font text-[#7b6449]">
              <div className="w-3 h-3 bg-[#badc5b] border-2 border-[#233f24]"></div>
              <span>Accessed Dashboard</span>
              <span className="text-xs text-[#ad9271] ml-auto">1 min ago</span>
            </div>
            <div className="flex items-center gap-3 pixel-font text-[#7b6449]">
              <div className="w-3 h-3 bg-[#f59e42] border-2 border-[#233f24]"></div>
              <span>Ready to collaborate!</span>
              <span className="text-xs text-[#ad9271] ml-auto">Now</span>
            </div>
          </div>
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
      
      {/* Modals */}
      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onTeamCreated={handleCreated}
        loading={loading}
      />
      <TeamCodeModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        code={createdCode}
      />
    </div>
  );
};

export default Dashboard;

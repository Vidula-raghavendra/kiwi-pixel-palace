import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TeamModals({
  modal,
  closeAll,
  loading,
  formData,
  setFormData,
  submitCreateTeam,
  submitJoinTeam,
  errorMsg
}: {
  modal: any;
  closeAll: () => void;
  loading: boolean;
  formData: any;
  setFormData: (value: Partial<any>) => void; // <-- ENSURE: setFormData expects ONE object argument, not two!
  submitCreateTeam: (e: React.FormEvent) => Promise<void>;
  submitJoinTeam: (e: React.FormEvent) => Promise<void>;
  errorMsg: string;
}) {
  return (
    <>
      {/* Create Team Modal */}
      <Dialog open={modal.team.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#8bb47e]">Create New Team</DialogTitle>
            <DialogDescription className="pixel-font text-[#7b6449] text-sm">
              Create a new team to start collaborating with others.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4 mt-4" onSubmit={submitCreateTeam}>
            <Input
              name="name"
              required
              placeholder="Team Name"
              value={formData.teamName}
              onChange={(e) => setFormData({ teamName: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#233f24]"
              autoFocus
              disabled={loading}
            />
            <Textarea
              name="desc"
              placeholder="Team Description (optional)"
              value={formData.teamDesc}
              onChange={(e) => setFormData({ teamDesc: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#7b6449]"
              disabled={loading}
            />
            <Input
              name="password"
              type="password"
              placeholder="Team Password (optional)"
              value={formData.teamPassword}
              autoComplete="new-password"
              onChange={(e) => setFormData({ teamPassword: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#233f24]"
              disabled={loading}
            />
            {errorMsg && <div className="text-red-500 text-xs">{errorMsg}</div>}
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

      {/* Invite Member Modal (invite by email or github, NO code field here) */}
      <Dialog open={modal.invite.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#badc5b]">Invite Member</DialogTitle>
            <DialogDescription className="pixel-font text-[#7b6449] text-sm">
              Invite a collaborator by email or GitHub username. The invited person will receive a notification to join the team.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4 mt-4" 
                onSubmit={e => {
                  e.preventDefault();
                }}>
            <Input
              name="inviteEmail"
              type="email"
              placeholder="Friend's Email"
              value={formData.inviteEmail || ""}
              onChange={e => setFormData({ inviteEmail: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#233f24]"
              autoFocus
              disabled={loading}
            />
            <Input
              name="inviteGithub"
              type="text"
              placeholder="Github Username"
              value={formData.inviteGithub || ""}
              onChange={e => setFormData({ inviteGithub: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#233f24]"
              disabled={loading}
            />
            {errorMsg && <div className="text-red-500 text-xs">{errorMsg}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 pixel-font bg-[#badc5b] hover:bg-[#d8e893] text-[#233f24] !rounded"
            >
              {loading ? 'Inviting...' : 'Send Invite'}
            </Button>
          </form>
          <div className="text-xs text-[#ad9271] pixel-font mt-1">
            Anyone with a join code can also join instantly—share your code from the workspace sidebar!
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Team Modal (just a code field) */}
      <Dialog open={modal.project.open} onOpenChange={closeAll}>
        <DialogContent className="pixel-outline bg-[#fffde8] !rounded-lg shadow-2xl max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="pixel-font text-[#8bb47e]">Join a Team/Room</DialogTitle>
            <DialogDescription className="pixel-font text-[#7b6449] text-sm">
              Enter an invite code below to join a team instantly.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4 mt-4" onSubmit={submitJoinTeam}>
            <Input
              name="inviteCode"
              required
              placeholder="Invite Code"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ inviteCode: e.target.value })}
              className="pixel-outline bg-[#f9fbe3] text-[#233f24]"
              autoFocus
              disabled={loading}
              data-testid="join-code-input"
            />
            {errorMsg && <div className="text-red-500 text-xs">{errorMsg}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 pixel-font bg-[#8bb47e] hover:bg-[#92c993] text-[#233f24] !rounded"
              data-testid="submit-join-room"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </Button>
          </form>
          <div className="text-xs text-[#ad9271] pixel-font mt-1">
            Don't have a code? Ask your teammates to share their code!
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

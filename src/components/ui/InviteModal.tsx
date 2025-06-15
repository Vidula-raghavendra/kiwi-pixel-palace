
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Invite modal for inviting members by email or GitHub username.
 * Auto-focuses email input.
 */
export default function InviteModal({ open, onClose, teamId }: { open: boolean, onClose: () => void, teamId: string }) {
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Naive validation
    if (!email && !github) {
      toast({ title: "Enter email or GitHub username." });
      setLoading(false);
      return;
    }
    // Get user id
    let invited_by = null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) {
        throw new Error("Not authenticated");
      }
      invited_by = data.user.id;
    } catch (err: any) {
      toast({ title: "Failed to get current user", description: err.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    // Call invite API
    const { error } = await supabase.from("team_invitations").insert({
      team_id: teamId,
      email: email || null,
      github_username: github || null,
      invited_by,
    });
    if (!error) {
      toast({ title: "Invite sent!" });
      setEmail("");
      setGithub("");
      onClose();
    } else {
      toast({ title: "Invite failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent>
        <DialogTitle className="pixel-font text-[#233f24]">Invite to Team</DialogTitle>
        <form onSubmit={handleInvite} className="flex flex-col gap-3 mt-3">
          <label className="pixel-font text-xs text-[#8bb47e]">Email address</label>
          <Input
            autoFocus
            type="email"
            className="pixel-font"
            placeholder="friend@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            maxLength={80}
          />
          <label className="pixel-font text-xs text-[#8bb47e] mt-2">GitHub username</label>
          <Input
            type="text"
            className="pixel-font"
            placeholder="github-username"
            value={github}
            onChange={e => setGithub(e.target.value)}
            maxLength={39}
          />
          <Button disabled={loading} type="submit" className="mt-5 pixel-font bg-[#badc5b] text-[#233f24] w-full">
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

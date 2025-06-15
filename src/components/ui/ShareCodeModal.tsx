
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyCheck, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Displays/join code for the current team with copy and regenerate.
 */
export default function ShareCodeModal({ open, onClose, teamId }: { open: boolean, onClose: () => void, teamId: string }) {
  const [teamCode, setTeamCode] = useState("");
  const [copy, setCopy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !teamId) return;
    supabase
      .from("teams")
      .select("team_code")
      .eq("id", teamId)
      .maybeSingle()
      .then(({ data }) => setTeamCode(data?.team_code || ""));
    setCopy(false);
  }, [open, teamId]);

  async function handleCopyCode() {
    if (teamCode) {
      await navigator.clipboard.writeText(teamCode);
      setCopy(true);
      toast({ title: "Copied!" });
      setTimeout(() => setCopy(false), 1400);
    }
  }
  async function handleRegenerateCode() {
    // generate and update code
    const newCode = (Math.random().toString(36).substring(2, 10) + Date.now().toString()).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
    const { error } = await supabase.from("teams").update({ team_code: newCode }).eq("id", teamId);
    if (!error) {
      setTeamCode(newCode);
      toast({ title: "New code generated!" });
      setCopy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent>
        <DialogTitle className="pixel-font text-[#233f24]">Share Join Code</DialogTitle>
        <div className="flex flex-row items-center gap-3 mt-3">
          <Input className="pixel-font text-lg" value={teamCode} readOnly />
          <Button
            className="flex gap-1 bg-[#dbe186] hover:bg-[#badc5b] text-[#233f24] rounded shadow"
            onClick={handleCopyCode}
            tabIndex={0}
          >
            {copy ? <CopyCheck size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        <Button
          className="w-full pixel-font text-sm mt-4 bg-[#badc5b] text-[#233f24]"
          onClick={handleRegenerateCode}
        >
          Generate New Code
        </Button>
      </DialogContent>
    </Dialog>
  );
}

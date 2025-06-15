
import React, { useState } from "react";
import { Users, Copy, Plus, Trash2 } from "lucide-react";
import InviteModal from "./ui/InviteModal";
import ShareCodeModal from "./ui/ShareCodeModal";
import ViewMembersModal from "./ui/ViewMembersModal";
import { useTeamSidebarPanel } from "@/hooks/useTeamSidebarPanel";
import { Button } from "@/components/ui/button";

/**
 * Sidebar panel (right side) with buttons: Invite, Share Code, View Members
 */
export default function WorkspaceSidebarPanel({ teamId }: { teamId: string }) {
  const {
    modals,
    openModal,
    closeModal,
    canDeleteTeam,
    handleLeaveTeam,
    handleDeleteTeam,
    loading
  } = useTeamSidebarPanel({ teamId });

  return (
    <aside className="flex flex-col gap-5 p-4 bg-[#f4fbe7] w-56 rounded-lg shadow-lg border border-[#badc5b] mt-7 mr-8">
      {/* Invite Members */}
      <Button
        className="w-full flex gap-2 pixel-font text-[#233f24] border border-[#badc5b] bg-[#e2fde4] hover:bg-[#d1ebbc] mb-1"
        onClick={() => openModal("invite")}
      >
        <Plus size={16} /> Invite Members
      </Button>

      {/* Share Join Code */}
      <Button
        className="w-full flex gap-2 pixel-font text-[#233f24] border border-[#badc5b] bg-[#e2fde4] hover:bg-[#d1ebbc] mb-1"
        onClick={() => openModal("share")}
      >
        <Copy size={16} /> Share Join Code
      </Button>

      {/* View Team Members */}
      <Button
        className="w-full flex gap-2 pixel-font text-[#233f24] border border-[#badc5b] bg-[#e2fde4] hover:bg-[#d1ebbc]"
        onClick={() => openModal("members")}
      >
        <Users size={16} /> View Team Members
      </Button>

      {/* Leave/Delete Team if permitted */}
      {canDeleteTeam && (
        <Button
          className="w-full flex gap-2 pixel-font text-red-600 border border-red-300 bg-[#fbeeee] hover:bg-[#fbdddd] mt-7"
          onClick={handleDeleteTeam}
          disabled={loading}
        >
          <Trash2 size={16} /> Delete Team
        </Button>
      )}
      {!canDeleteTeam && (
        <Button
          variant="outline"
          className="w-full flex gap-2 pixel-font text-[#ad9271] border-[#ad9271] mt-7"
          onClick={handleLeaveTeam}
          disabled={loading}
        >
          <Trash2 size={16} /> Leave Team
        </Button>
      )}

      {/* Side modals */}
      <InviteModal open={modals.invite} onClose={() => closeModal("invite")} teamId={teamId} />
      <ShareCodeModal open={modals.share} onClose={() => closeModal("share")} teamId={teamId} />
      <ViewMembersModal open={modals.members} onClose={() => closeModal("members")} teamId={teamId} />
    </aside>
  );
}

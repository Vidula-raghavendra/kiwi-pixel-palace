
import React from "react";
import { LogOut, Users, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceSidebar() {
  const { profile, signOut } = useAuth();
  const { teams, currentTeam, setCurrentTeam, teamMembers, fetchTeamMembers, loading } = useTeams();

  // Display avatar
  const Avatar = ({ src, alt }: { src?: string | null, alt: string }) =>
    src ?
      <img src={src} alt={alt} className="rounded-full border border-[#badc5b] w-9 h-9 bg-[#fdfae8]" />
      :
      <div className="w-9 h-9 flex items-center justify-center rounded-full border border-[#badc5b] bg-[#fdfae8] text-[#8bb47e]"><User size={17} /></div>;

  // Show current team (fallback first team)
  const displayTeam = currentTeam || teams[0];
  React.useEffect(() => {
    if (!currentTeam && teams.length > 0) setCurrentTeam(teams[0]);
    if (displayTeam) fetchTeamMembers(displayTeam.id);
    // eslint-disable-next-line
  }, [displayTeam?.id]);

  return (
    <aside className="bg-[#fffde8] border-r border-[#badc5b] min-w-[235px] max-w-[235px] flex flex-col justify-between h-screen z-30 shadow-lg">
      {/* Profile Area */}
      <div>
        <div className="flex flex-row items-center px-6 py-5 gap-3 border-b border-[#ecf2c7]">
          <Avatar src={profile?.avatar_url} alt={profile?.full_name || "Avatar"} />
          <div>
            <div className="pixel-font text-base text-[#233f24] truncate">{profile?.full_name || profile?.github_username || "Kiwi User"}</div>
            {profile?.github_username && (
              <div className="text-xs text-[#90a872]">@{profile.github_username}</div>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-5 mb-2 px-4">
          <div className="flex flex-row items-center gap-2 mb-1">
            <Users size={16} color="#8bb47e" />
            <div className="pixel-font text-xs text-[#8bb47e]">Team</div>
          </div>
          <div className="text-[13px] ml-7 text-[#233f24] truncate font-semibold">
            {displayTeam?.name || <Skeleton className="h-4 w-28 rounded bg-[#e2fde4]" />}
          </div>
        </div>

        {/* Team Members */}
        <div className="px-3 py-2 mt-1">
          <div className="pixel-font text-xs text-[#8bb47e] mb-1 ml-2">Members</div>
          <ul className="flex flex-col gap-3">
            {loading ? (
              Array(3).fill(0).map((_, idx) =>
                <li key={idx} className="flex flex-row items-center gap-2 ml-1">
                  <Skeleton className="h-7 w-7 rounded-full bg-[#ecf2c7]" />
                  <Skeleton className="h-4 w-20 bg-[#e2fde4]" />
                </li>
              )
            ) : (
              teamMembers.map((m) => (
                <li key={m.user_id} className="flex flex-row items-center gap-2 ml-1">
                  <Avatar src={m.profiles?.avatar_url} alt={m.profiles?.full_name || "Member"} />
                  <div>
                    <div className="text-sm text-[#233f24] font-medium">
                      {m.profiles?.full_name || m.profiles?.github_username || "Kiwi"}
                    </div>
                    {m.role && <div className="text-slate-400 text-xs">{m.role}</div>}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mb-6 px-6">
        <Button
          variant="outline"
          className="w-full flex gap-2 items-center pixel-outline text-[#ad9271] hover:bg-[#fff6eb] border-2 border-[#ad9271]"
          onClick={signOut}
        >
          <LogOut size={17} /> Log out
        </Button>
      </div>
    </aside>
  );
}

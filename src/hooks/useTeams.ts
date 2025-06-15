import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  team_code: string;
  password_hash: string | null;
  created_by: string;
  creator_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  joined_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    github_username: string | null;
  } | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useTeams = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  const channelRef = useRef<any>(null);
  const subscriptionActive = useRef(false);

  // Helper for reliable redirect after join/create
  const navigateToTeam = (team) => {
    if (team && typeof window !== 'undefined') {
      window.location.href = `/workspace/${team.id}`;
    }
  };

  // Channel cleanup
  const cleanupChannel = () => {
    if (channelRef.current) {
      console.log("[Teams] Cleaning up channel");
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error("[Teams] Error removing channel:", error);
      }
      channelRef.current = null;
      subscriptionActive.current = false;
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cleanupChannel();
    };
  }, []);

  /**
   * Only subscribe ONCE per user!
   */
  useEffect(() => {
    if (!user?.id || !mounted.current) return;

    // Clean up any previous subscriptions
    cleanupChannel();

    // Subscribe if not active
    if (!subscriptionActive.current) {
      try {
        const channelName = `teams_presence_${user.id}_${Date.now()}`;
        channelRef.current = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'team_members', filter: `user_id=eq.${user.id}` },
            () => {
              console.log('[Teams] Team members changed for user');
              if (mounted.current) setTimeout(() => fetchTeams(), 100);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'team_members' },
            () => {
              console.log('[Teams] Team members changed globally');
              if (mounted.current && currentTeam) setTimeout(() => fetchTeamMembers(currentTeam.id), 100);
            }
          );
        channelRef.current.subscribe((status: string, error?: any) => {
          if (status === "SUBSCRIBED") {
            console.log("[Teams] Channel subscribed");
            subscriptionActive.current = true;
          } else if (status === "CHANNEL_ERROR") {
            console.error("[Teams] Error subscribing to realtime:", error);
            subscriptionActive.current = false;
          } else if (status === "CLOSED") {
            console.log("[Teams] Channel closed");
            subscriptionActive.current = false;
          }
        });
      } catch (e) {
        console.error("[Teams] Error subscribing to realtime:", e);
        subscriptionActive.current = false;
      }
    }

    return () => {
      cleanupChannel();
    };
    // Intentionally do NOT include subscriptionActive as a dependency
    // eslint-disable-next-line
  }, [user?.id]);

  // Fetch teams when user changes
  useEffect(() => {
    if (user && mounted.current) {
      fetchTeams();
    }
  }, [user?.id]);

  // Fetch team members when currentTeam changes
  useEffect(() => {
    if (currentTeam && mounted.current) {
      fetchTeamMembers(currentTeam.id);
    }
  }, [currentTeam?.id]);

  const fetchTeams = async () => {
    if (!user || !mounted.current) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams (*)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false });
        
      if (error) throw error;
      
      if (!mounted.current) return;
      
      const fetchedTeams: Team[] = data?.map((row: any) => row.teams).filter(Boolean) || [];
      setTeams(fetchedTeams);
      
      if (fetchedTeams.length > 0) {
        if (!currentTeam || !fetchedTeams.some(t => t.id === currentTeam.id)) {
          setCurrentTeam(fetchedTeams[0]);
        }
      } else {
        setCurrentTeam(null);
      }
    } catch (error: any) {
      if (mounted.current) {
        console.error("Error fetching teams:", error);
        toast({
          title: "Error",
          description: "Failed to load teams",
          variant: "destructive",
        });
        setTeams([]);
        setCurrentTeam(null);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    if (!mounted.current) return;
    
    try {
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId);
        
      if (membersError) throw membersError;

      if (!mounted.current || !membersData || membersData.length === 0) {
        if (mounted.current) setTeamMembers([]);
        return;
      }

      const userIds = membersData.map((member) => member.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, github_username")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      if (!mounted.current) return;

      const transformedData: TeamMember[] = membersData.map((member) => ({
        id: member.id,
        team_id: member.team_id,
        user_id: member.user_id,
        role: member.role as "admin" | "editor" | "viewer",
        joined_at: member.joined_at,
        profiles: profilesData?.find((profile) => profile.id === member.user_id) || null,
      }));

      setTeamMembers(transformedData);
    } catch (error: any) {
      if (mounted.current) {
        console.error("Error fetching team members:", error);
      }
    }
  };

  // Team creation: now returns the invite code/link directly and sets up redirect
  const createTeam = async (name: string, description: string, password?: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);

      // Use Supabase RPC function to create team and get basic data (team_id, invite_code)
      const { data: teamInserted, error: teamError } = await supabase.rpc("create_team_with_invite", {
        team_name: name, team_description: description
      }).single();

      if (teamError || !teamInserted) throw teamError || new Error("Failed to create team");

      // Optionally set up password afterwards if relevant
      if (password) {
        const hash = await bcrypt.hash(password, 10);
        await supabase.from("teams").update({ password_hash: hash }).eq("id", teamInserted.team_id);
      }

      // Fetch the full team record so it matches the Team interface
      const { data: teamFull, error: fetchError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamInserted.team_id)
        .single();

      if (fetchError || !teamFull) throw fetchError || new Error("Failed to fetch complete team info.");

      await fetchTeams();
      if (mounted.current) {
        setCurrentTeam(teamFull);
        navigateToTeam(teamFull);
        toast({
          title: "Team Created",
          description: `Share this link to invite: ${window.location.origin}/invite/${teamInserted.invite_code}`,
        });
      }
      return teamFull;
    } catch (error: any) {
      if (mounted.current) {
        toast({
          title: "Error",
          description: error.message || "Failed to create team",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  // New joinTeam - accepts invite code from a link
  const joinTeam = async (inviteCode: string, password?: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);

      // Use Supabase function to join by invite code
      const { data: teamId, error: joinError } = await supabase.rpc("join_team_by_invite", {
        code: inviteCode,
      }).single();

      if (joinError || !teamId) throw joinError || new Error("Invalid invite link or already a member.");

      // Fetch the full team record immediately so all fields match Team interface
      const { data: team, error: teamFetchErr } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (teamFetchErr || !team) throw new Error("Couldn't fetch team info after joining.");

      // If a password is set, require a correct password.
      if (team.password_hash) {
        const ok = await bcrypt.compare(password, team.password_hash);
        if (!ok) throw new Error("Incorrect password. Please try again.");
      }

      if (mounted.current) {
        setCurrentTeam(team);
        navigateToTeam(team);
        toast({
          title: "Joined Team",
          description: `You've joined "${team.name}" via link!`,
        });
        await fetchTeams();
      }
      return team;
    } catch (error: any) {
      if (mounted.current) {
        toast({
          title: "Error joining team",
          description: error.message || "Failed to join team",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const createProject = async (name: string, description: string, teamId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          team_id: teamId,
          created_by: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (mounted.current) {
        toast({
          title: "Project Created",
          description: `Project "${name}" created successfully!`,
        });
      }
      
      return data;
    } catch (error: any) {
      if (mounted.current) {
        toast({
          title: "Error",
          description: error.message || "Failed to create project",
          variant: "destructive"
        });
      }
      throw error;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  return {
    teams,
    currentTeam,
    setCurrentTeam,
    teamMembers,
    projects,
    loading,
    createTeam,
    joinTeam,
    createProject,
    fetchTeams,
    fetchTeamMembers
  };
};

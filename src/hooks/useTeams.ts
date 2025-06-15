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
  const supabaseRef = useRef(supabase);

  // --- Realtime Team Fetchers/Listeners ---
  useEffect(() => {
    if (!user) return;

    const channel = supabaseRef.current
      .channel("teams_members_presence")
      // TEAM MEMBERSHIP: refetch user's teams if any change for current user
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchTeams();
        }
      )
      // TEAM MEMBERS: refetch members if any row changes for current team
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        (payload) => {
          if (currentTeam) fetchTeamMembers(currentTeam.id);
        }
      )
      // TEAM DELETED: refetch if current team is deleted
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'teams' },
        (payload) => {
          if (currentTeam && payload.old.id === currentTeam.id) {
            setCurrentTeam(null);
            setTeams(prevTeams => prevTeams.filter(team => team.id !== currentTeam.id));
            toast({
              title: "Team deleted",
              description: "Your team was deleted.",
              variant: "destructive"
            });
          }
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current.removeChannel(channel);
    };
  }, [user, currentTeam?.id]);

  // Always fetch teams after login or team change
  useEffect(() => {
    if (user) fetchTeams();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (currentTeam) fetchTeamMembers(currentTeam.id);
    else setTeamMembers([]); // Avoid displaying stale data
  }, [currentTeam]);

  // --- Defensive fetchTeams ---
  const fetchTeams = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams (*)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false });

      if (error) {
        console.error("Error fetching teams (membership-based):", error);
        throw error;
      }
      const fetchedTeams: Team[] = data?.map((row: any) => row.teams).filter(Boolean) || [];
      setTeams(fetchedTeams);

      // Sync currentTeam: pick the latest unless currentTeam still exists
      if (fetchedTeams.length > 0) {
        if (!currentTeam || !fetchedTeams.some(t => t.id === currentTeam.id)) {
          setCurrentTeam(fetchedTeams[0]);
        }
      } else {
        setCurrentTeam(null);
      }
    } catch (error: any) {
      setTeams([]);
      setCurrentTeam(null);
      toast({
        title: "Error",
        description: "Failed to load teams. Try logging in again.",
        variant: "destructive"
      });
      console.error("Error fetching teams (membership-based):", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Defensive fetchTeamMembers ---
  const fetchTeamMembers = async (teamId: string) => {
    if (!teamId) {
      setTeamMembers([]);
      return;
    }
    try {
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      if (!membersData || membersData.length === 0) {
        setTeamMembers([]);
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
      // Merge member + profile
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
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    }
  };

  // --- Delete team (admin/creator only) ---
  const deleteTeam = async (teamId: string) => {
    if (!user) throw new Error("Not authenticated");
    if (!teamId) throw new Error("No team selected");
    try {
      setLoading(true);
      const { error } = await supabase.from("teams").delete().eq("id", teamId);
      if (error) throw error;
      toast({
        title: "Team Deleted",
        description: "Team deleted successfully.",
      });
      fetchTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create team (with team_code + password_hash + invite_code)
  const createTeamZoomStyle = async (
    name: string,
    description: string,
    password?: string
  ) => {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);

      // Generate unique codes (8 char)
      const teamCode = (
        Math.random().toString(36).substring(2, 10) + Date.now().toString()
      )
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 8)
        .toUpperCase();
      const inviteCode = (
        Math.random().toString(36).substring(2, 10) + (Date.now() + 1).toString()
      )
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 8)
        .toUpperCase();

      const hash = password ? await bcrypt.hash(password, 10) : null;

      // Insert team (with team_code + invite_code!)
      const { data: teamInserted, error: teamError } = await supabase
        .from("teams")
        .insert({
          name,
          description,
          team_code: teamCode,
          invite_code: inviteCode,
          password_hash: hash,
          created_by: user.id,
          creator_id: user.id,
        })
        .select()
        .single();
      if (teamError) throw teamError;

      // Add creator as admin
      const { error: memberErr } = await supabase
        .from("team_members")
        .insert({
          team_id: teamInserted.id,
          user_id: user.id,
          role: "admin",
        });
      if (memberErr) throw memberErr;
      toast({
        title: "Team Created",
        description: `Team "${name}" created! Code: ${teamCode}`,
      });
      await fetchTeams();
      return teamInserted;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Join team by code + password (hashed verify)
  const joinTeamZoomStyle = async (teamCode: string, password: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);
      // 1. find team by code (allow both invite_code or team_code for flexibility)
      let { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .or(`team_code.eq.${teamCode},invite_code.eq.${teamCode}`)
        .maybeSingle();
      if (teamError || !team) throw new Error("Invalid team code");

      // 2. check password
      if (team.password_hash) {
        const ok = await bcrypt.compare(password, team.password_hash);
        if (!ok) throw new Error("Incorrect password");
      }

      // 3. insert member (viewer)
      const { error: memberErr } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "viewer",
        });
      if (memberErr && memberErr.message.includes("duplicate key value")) {
        throw new Error("Already a team member");
      }
      if (memberErr) throw memberErr;

      toast({
        title: "Joined Team",
        description: `You've joined "${team.name}"!`,
      });
      // Ensure teams get refetched immediately
      await fetchTeams();
      setCurrentTeam(team);
      return team;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join team",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
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
      
      toast({
        title: "Project Created",
        description: `Project "${name}" created successfully!`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    teams,
    currentTeam,
    setCurrentTeam,
    teamMembers,
    projects,
    loading,
    createTeam: createTeamZoomStyle,
    joinTeam: joinTeamZoomStyle,
    createProject: createProject,
    fetchTeams,
    fetchTeamMembers,
    deleteTeam,
  };
};

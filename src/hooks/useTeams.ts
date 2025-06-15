import { useState, useEffect } from 'react';
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

  // Only fetch teams user is a member of (via team_members)
  const fetchTeams = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Join team_members → teams for correct filter
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams (*)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false });
      if (error) throw error;
      const fetchedTeams: Team[] =
        data?.map((row: any) => row.teams).filter(Boolean) || [];
      setTeams(fetchedTeams);
    } catch (error: any) {
      console.error("Error fetching teams (membership-based):", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Only load team members for current team
  const fetchTeamMembers = async (teamId: string) => {
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
      // 1. find team by code
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("team_code", teamCode)
        .maybeSingle();
      if (teamError || !team) throw new Error("Invalid team code");

      // 2. check password
      if (team.password_hash) {
        const ok = await bcrypt.compare(password, team.password_hash);
        if (!ok) throw new Error("Incorrect password");
      }

      // 3. insert member (RLS will allow only if not already a member)
      const { error: memberErr } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "viewer",
        });
      if (memberErr) {
        if (
          memberErr.message &&
          memberErr.message.includes("duplicate key value")
        ) {
          throw new Error("Already a team member");
        }
        throw memberErr;
      }
      toast({
        title: "Joined Team",
        description: `You've joined "${team.name}"!`,
      });
      await fetchTeams();
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

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

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
    fetchTeamMembers
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
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

  // Fetch user's teams
  const fetchTeams = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          team_id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            github_username
          )
        `)
        .eq('team_id', teamId);
        
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
    }
  };

  // Create a new team
  const createTeam = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('create_team_with_invite', {
        team_name: name,
        team_description: description
      });
      
      if (error) throw error;
      
      toast({
        title: "Team Created",
        description: `Team "${name}" created successfully!`,
      });
      
      await fetchTeams();
      return data[0];
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Join a team by invite code
  const joinTeam = async (inviteCode: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('join_team_by_invite', {
        code: inviteCode,
        member_role: 'viewer'
      });
      
      if (error) throw error;
      
      toast({
        title: "Joined Team",
        description: "Successfully joined the team!",
      });
      
      await fetchTeams();
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join team",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a project
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
    createTeam,
    joinTeam,
    createProject,
    fetchTeams,
    fetchTeamMembers
  };
};

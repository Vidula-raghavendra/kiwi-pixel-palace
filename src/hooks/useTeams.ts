
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
  const subscriptionInitialized = useRef(false);

  // Ensure hook is only used in valid context
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Set up realtime subscription - only once per user
  useEffect(() => {
    if (!user?.id || !mounted.current || subscriptionInitialized.current) return;

    const channelName = `teams_presence_${user.id}`;
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members', filter: `user_id=eq.${user.id}` },
        () => {
          if (mounted.current) {
            fetchTeams();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        () => {
          if (mounted.current && currentTeam) {
            fetchTeamMembers(currentTeam.id);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Teams] Subscribed to realtime");
          subscriptionInitialized.current = true;
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscriptionInitialized.current = false;
      }
    };
  }, [user?.id]); // Only depend on user.id

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

  const createTeam = async (name: string, description: string, password?: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);

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

      const { error: memberErr } = await supabase
        .from("team_members")
        .insert({
          team_id: teamInserted.id,
          user_id: user.id,
          role: "admin",
        });
        
      if (memberErr) throw memberErr;
      
      if (mounted.current) {
        toast({
          title: "Team Created",
          description: `Team "${name}" created! Code: ${teamCode}`,
        });
        fetchTeams();
      }
      
      return teamInserted;
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

  const joinTeam = async (teamCode: string, password: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);
      
      let { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .or(`team_code.eq.${teamCode},invite_code.eq.${teamCode}`)
        .maybeSingle();
        
      if (teamError || !team) throw new Error("Invalid team code");

      if (team.password_hash) {
        const ok = await bcrypt.compare(password, team.password_hash);
        if (!ok) throw new Error("Incorrect password");
      }

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

      if (mounted.current) {
        toast({
          title: "Joined Team",
          description: `You've joined "${team.name}"!`,
        });
        fetchTeams();
        setCurrentTeam(team);
      }
      
      return team;
    } catch (error: any) {
      if (mounted.current) {
        toast({
          title: "Error",
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

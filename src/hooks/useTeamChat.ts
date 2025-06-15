
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface TeamChatMessage {
  id: string;
  team_id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    github_username: string | null;
  } | null;
}

export function useTeamChat(teamId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const channelRef = useRef<any>(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!teamId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: msgs, error } = await supabase
      .from("team_chats")
      .select("*, profiles:profiles!team_chats_user_id_fkey(username, full_name, avatar_url, github_username)")
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Failed to get chat", description: error.message, variant: "destructive" });
      setMessages([]);
      setLoading(false);
      return;
    }
    setMessages(msgs || []);
    setLoading(false);
  }, [teamId, toast]);

  // Subscribe for real-time updates
  useEffect(() => {
    fetchMessages();
    if (!teamId) return;
    // Clean up previous channel if team changes
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    const channel = supabase
      .channel(`team_chat_realtime_${teamId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "team_chats", filter: `team_id=eq.${teamId}` }, (payload) => {
        fetchMessages();
      })
      .subscribe();
    channelRef.current = channel;
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    };
  }, [teamId, fetchMessages]);

  // Send message
  const sendMessage = async (text: string) => {
    if (!user) {
      toast({ title: "Not signed in", description: "Sign in to chat!", variant: "destructive" });
      return;
    }
    if (!teamId || !(text && text.trim())) return;
    const { error } = await supabase.from("team_chats").insert({
      team_id: teamId,
      user_id: user.id,
      message: text.trim()
    });
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    }
    // Message will show after realtime event (avoid local echo)
  };

  return { messages, sendMessage, loading };
}

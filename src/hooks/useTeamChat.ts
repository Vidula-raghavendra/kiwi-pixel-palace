
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
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  // Fetch messages with more error handling and logging
  const fetchMessages = useCallback(async () => {
    if (!teamId) {
      setMessages([]);
      setLoading(false);
      setError("Missing team id for chat.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: msgs, error: fetchError } = await supabase
        .from("team_chats")
        .select(
          "*, profiles:profiles!team_chats_user_id_fkey(username, full_name, avatar_url, github_username)"
        )
        .eq("team_id", teamId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        setMessages([]);
        setError(`Failed to fetch chat: ${fetchError.message}`);
        toast({
          title: "Failed to get chat",
          description: fetchError.message,
          variant: "destructive",
        });
      } else {
        setMessages(msgs || []);
        setError(null);
      }
    } catch (err: any) {
      setMessages([]);
      setError(`Unknown error: ${err?.message || String(err)}`);
      toast({
        title: "Error loading chat",
        description: err?.message || "Unknown error.",
        variant: "destructive",
      });
    }
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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_chats",
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          // Log which event triggered
          console.log("[useTeamChat] Chat event:", payload);
          fetchMessages();
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    };
  }, [teamId, fetchMessages]);

  // Send message, now returning error as a result to UI
  const sendMessage = async (text: string) => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Sign in to chat!",
        variant: "destructive",
      });
      return { ok: false, error: "User not signed in" };
    }
    if (!teamId || !(text && text.trim())) {
      return { ok: false, error: "Missing team id or empty message" };
    }
    const { error: sendError } = await supabase.from("team_chats").insert({
      team_id: teamId,
      user_id: user.id,
      message: text.trim(),
    });
    if (sendError) {
      setError(`Failed to send: ${sendError.message}`);
      toast({
        title: "Failed to send",
        description: sendError.message,
        variant: "destructive",
      });
      return { ok: false, error: sendError.message };
    }
    // Message will show after realtime event (avoid local echo)
    setError(null);
    return { ok: true };
  };

  return { messages, sendMessage, loading, error };
}


import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all chat messages of a teammate in a team.
 */
export function useTeammateChats(teamId?: string, userId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
    if (!teamId || !userId) return;
    setLoading(true);
    supabase
      .from("team_chats")
      .select(
        "id, team_id, user_id, message, created_at, profiles:profiles!team_chats_user_id_fkey(username, full_name, avatar_url, github_username)"
      )
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setLoading(false);
      });
  }, [teamId, userId]);

  return { messages, loading };
}

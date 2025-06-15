
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches most recent AI chatbot conversation for a teammate.
 * Looks for user_chats by teamId+userId, descending by updated_at, and returns latest single thread.
 */
export function useTeammateAIChat(teamId?: string, userId?: string) {
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setThread(null);
    if (!teamId || !userId) return;
    setLoading(true);
    supabase
      .from("user_chats")
      .select(
        "id, thread, updated_at"
      )
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setThread(data?.thread || null);
        setLoading(false);
      });
  }, [teamId, userId]);

  return { thread, loading };
}

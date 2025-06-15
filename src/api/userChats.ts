
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type UserChat = {
  id: string;
  user_id: string;
  team_id: string;
  thread: Json;
  created_at: string;
  updated_at: string;
  llm_provider?: string;
  last_used_at?: string;
};

// Fetch the chat for a user in a team
export async function fetchUserChats(team_id: string, user_id: string) {
  const { data, error } = await supabase
    .from("user_chats")
    .select("*")
    .eq("team_id", team_id)
    .eq("user_id", user_id)
    .single();
  if (error) throw error;
  return data as UserChat;
}

// Create or update (upsert) user's chat thread for a team
export async function upsertUserChat(chat: {
  user_id: string;
  team_id: string;
  thread: Json;
  llm_provider?: string;
  last_used_at?: string;
  updated_at?: string;
  created_at?: string;
  id?: string;
}) {
  const { data, error } = await supabase
    .from("user_chats")
    .upsert([chat], { onConflict: "user_id,team_id" })
    .select()
    .single();
  if (error) throw error;
  return data as UserChat;
}

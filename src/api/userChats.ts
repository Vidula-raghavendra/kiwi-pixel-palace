
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
  thread: Json; // Required property!
  llm_provider?: string;
  last_used_at?: string;
  updated_at?: string;
  created_at?: string;
  id?: string;
}) {
  // Ensure 'thread', 'user_id', and 'team_id' are always present
  const upsertObj = {
    user_id: chat.user_id,
    team_id: chat.team_id,
    thread: chat.thread,
    llm_provider: chat.llm_provider,
    last_used_at: chat.last_used_at,
    updated_at: chat.updated_at,
    created_at: chat.created_at,
    id: chat.id,
  };
  const { data, error } = await supabase
    .from("user_chats")
    .upsert([upsertObj], { onConflict: "user_id,team_id" })
    .select()
    .single();
  if (error) throw error;
  return data as UserChat;
}

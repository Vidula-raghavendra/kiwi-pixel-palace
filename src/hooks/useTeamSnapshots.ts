
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Upsert the "current" chat snapshot for the current user/team.
 * @param teamId
 * @param userId
 * @param chatState
 */
export async function upsertTeamChatSnapshot(teamId: string, userId: string, chatState: any) {
  if (!teamId || !userId) return;
  await supabase
    .from("team_chat_snapshots")
    .upsert(
      [
        {
          team_id: teamId,
          user_id: userId,
          chat_state: chatState,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "team_id,user_id" }
    );
}

/**
 * Upsert the "current" todo snapshot for the current user/team.
 * @param teamId
 * @param userId
 * @param todoState
 */
export async function upsertTeamTodoSnapshot(teamId: string, userId: string, todoState: any) {
  if (!teamId || !userId) return;
  await supabase
    .from("team_todo_snapshots")
    .upsert(
      [
        {
          team_id: teamId,
          user_id: userId,
          todo_state: todoState,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "team_id,user_id" }
    );
}

/**
 * Fetch a teammate's latest chat snapshot.
 * @param teamId
 * @param userId
 */
export async function fetchTeamChatSnapshot(teamId: string, userId: string) {
  if (!teamId || !userId) return null;
  const { data } = await supabase
    .from("team_chat_snapshots")
    .select("chat_state, updated_at")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

/**
 * Fetch a teammate's latest todo snapshot.
 * @param teamId
 * @param userId
 */
export async function fetchTeamTodoSnapshot(teamId: string, userId: string) {
  if (!teamId || !userId) return null;
  const { data } = await supabase
    .from("team_todo_snapshots")
    .select("todo_state, updated_at")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}


import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Publishes the user's current route and subscribes to updates from team members.
 * Returns an object { [user_id]: { path, updated_at } }
 */
type PresenceInfo = { path: string; updated_at: string };

export function useTeamPresence({
  teamId,
  userId,
  path,
}: {
  teamId: string | null | undefined;
  userId: string | null | undefined;
  path: string;
}): { [userId: string]: PresenceInfo } {
  // Force typing so we ONLY store those objects that match `PresenceInfo`
  const presenceState = useRef<{ [userId: string]: PresenceInfo }>({});
  const listeners = useRef<(() => void)[]>([]);
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!teamId || !userId) return;

    const channel = supabase.channel(`team-presence-${teamId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state: Record<string, any[]> = channel.presenceState();
        const sanitized: { [userId: string]: PresenceInfo } = {};
        for (const [uid, arr] of Object.entries(state)) {
          // Make sure it's actually an object with the right fields
          const item = arr && arr[0];
          if (
            item &&
            typeof item.path === "string" &&
            typeof item.updated_at === "string"
          ) {
            sanitized[uid] = { path: item.path, updated_at: item.updated_at };
          }
        }
        presenceState.current = sanitized;
        forceUpdate();
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        const item = newPresences && newPresences[0];
        if (
          item &&
          typeof item.path === "string" &&
          typeof item.updated_at === "string"
        ) {
          presenceState.current[key] = { path: item.path, updated_at: item.updated_at };
          forceUpdate();
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        delete presenceState.current[key];
        forceUpdate();
      })
      .subscribe(async (status: string) => {
        if (status !== "SUBSCRIBED") return;
        // First publish
        await channel.track({
          path,
          updated_at: new Date().toISOString(),
        });
      });

    // Always update presence on route change
    const updatePresence = async () => {
      await channel.track({
        path,
        updated_at: new Date().toISOString(),
      });
    };
    listeners.current.push(updatePresence);
    updatePresence();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [teamId, userId]);

  // Update presence if path changes, after initial
  useEffect(() => {
    listeners.current.forEach((fn) => fn());
    // eslint-disable-next-line
  }, [path]);

  return presenceState.current;
}

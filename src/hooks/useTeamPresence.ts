
import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Publishes the user's current route and subscribes to updates from team members.
 * Returns an object { [user_id]: { path, updated_at } }
 */
export function useTeamPresence({
  teamId,
  userId,
  path,
}: {
  teamId: string | null | undefined;
  userId: string | null | undefined;
  path: string;
}) {
  const presenceState = useRef<{ [userId: string]: { path: string; updated_at: string } }>(
    {}
  );
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
        const state: any = channel.presenceState();
        presenceState.current = {};
        for (const [uid, arr] of Object.entries<{ path: string; updated_at: string }[]>(state)) {
          if (arr[0] && typeof arr[0].path === "string" && typeof arr[0].updated_at === "string") {
            presenceState.current[uid] = arr[0];
          }
        }
        forceUpdate();
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (
          newPresences &&
          newPresences[0] &&
          typeof newPresences[0].path === "string" &&
          typeof newPresences[0].updated_at === "string"
        ) {
          presenceState.current[key] = newPresences[0];
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


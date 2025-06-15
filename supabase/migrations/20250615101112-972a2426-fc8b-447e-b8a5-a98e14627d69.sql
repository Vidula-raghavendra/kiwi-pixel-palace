
-- 1. Table to store team chat messages
CREATE TABLE public.team_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row-Level Security
ALTER TABLE public.team_chats ENABLE ROW LEVEL SECURITY;

-- 3. Allow team members to select messages for their team
CREATE POLICY "Team members can read team chat messages"
  ON public.team_chats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = team_chats.team_id
    )
  );

-- 4. Allow team members to insert messages for their team
CREATE POLICY "Team members can send chat messages"
  ON public.team_chats
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = team_chats.team_id
    )
  );

-- 5. Allow users to delete their own messages (optional for MVP, but good dev UX)
CREATE POLICY "Users can delete own chat messages"
  ON public.team_chats
  FOR DELETE
  USING (user_id = auth.uid());

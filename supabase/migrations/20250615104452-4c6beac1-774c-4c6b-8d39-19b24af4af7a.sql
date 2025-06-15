
-- 1. Allow team members to read ALL chat messages for their team.
-- If not already present, enforce RLS on team_chats and set policies for appropriate access:

ALTER TABLE public.team_chats ENABLE ROW LEVEL SECURITY;

-- Team members can select ALL chats in their team (including those by other users)
CREATE POLICY "Team members can read all team chats"
  ON public.team_chats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = team_chats.team_id
    )
  );

-- Only the message owner can insert/update/delete their own team chat messages
CREATE POLICY "Users can insert their own team chats"
  ON public.team_chats
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own team chats"
  ON public.team_chats
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own team chats"
  ON public.team_chats
  FOR DELETE
  USING (user_id = auth.uid());

-- 2. Optional: Track chat message cloning/copying between users (for drag & drop history/audit)
CREATE TABLE IF NOT EXISTS public.chat_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  source_user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  message_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_clones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can select chat clones"
  ON public.chat_clones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = chat_clones.team_id
    )
  );

CREATE POLICY "Members can insert chat clones when copying"
  ON public.chat_clones
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = chat_clones.team_id
    )
  );

-- 3. Robust invite code (improvement): Already using random + timestamped code, but add unique index if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename='teams' AND indexname='teams_team_code_key'
  ) THEN
    CREATE UNIQUE INDEX teams_team_code_key ON public.teams(team_code);
  END IF;
END $$;


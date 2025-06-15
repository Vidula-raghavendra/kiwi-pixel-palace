
-- 1. Table to store the latest chat snapshot for each user in a team
CREATE TABLE public.team_chat_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_state JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- 2. Table to store the latest todo snapshot for each user in a team
CREATE TABLE public.team_todo_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  todo_state JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- 3. Enable Row-Level Security
ALTER TABLE public.team_chat_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_todo_snapshots ENABLE ROW LEVEL SECURITY;

-- 4. Allow team members to select (read) each other’s snapshots
CREATE POLICY "Team members can read chat snapshots"
  ON public.team_chat_snapshots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = team_chat_snapshots.team_id
    )
  );

CREATE POLICY "Team members can read todo snapshots"
  ON public.team_todo_snapshots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid() AND team_id = team_todo_snapshots.team_id
    )
  );

-- 5. Allow users to insert their own chat/todo snapshots only
CREATE POLICY "Users can insert their own chat snapshot"
  ON public.team_chat_snapshots
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own todo snapshot"
  ON public.team_todo_snapshots
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 6. Allow users to update their own chat/todo snapshots only
CREATE POLICY "Users can update their own chat snapshot"
  ON public.team_chat_snapshots
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own todo snapshot"
  ON public.team_todo_snapshots
  FOR UPDATE
  USING (user_id = auth.uid());

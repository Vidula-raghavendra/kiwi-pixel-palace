
-- 1. Team Invitations Table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT,
  github_username TEXT,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'removed'
  code TEXT, -- Store invite code if needed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (team_id, email),
  UNIQUE (team_id, github_username)
);

ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members/invitees can see invitations"
  ON public.team_invitations
  FOR SELECT
  USING (
    (invited_by = auth.uid())
    OR (
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE user_id = auth.uid() AND team_id = team_invitations.team_id
      )
    )
    OR (
      (email IS NOT NULL AND email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
      OR (github_username IS NOT NULL AND github_username = (SELECT github_username FROM public.profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Inviter can update/delete invitations"
  ON public.team_invitations
  FOR UPDATE USING (invited_by = auth.uid())
  WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Inviter can delete invitations"
  ON public.team_invitations
  FOR DELETE USING (invited_by = auth.uid());

CREATE POLICY "Invitee can update status to accepted"
  ON public.team_invitations
  FOR UPDATE USING (
    (email IS NOT NULL AND email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    OR (github_username IS NOT NULL AND github_username = (SELECT github_username FROM public.profiles WHERE id = auth.uid()))
  )
  WITH CHECK (status = 'accepted' OR status = 'removed');

-- 2. Per-user, per-team chats (for Gemini LLM chat per user/workspace)
CREATE TABLE public.user_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  thread JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  llm_provider TEXT DEFAULT 'gemini',
  last_used_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.user_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can access own chats"
  ON public.user_chats
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User can insert/update own chats"
  ON public.user_chats
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User can update their chat"
  ON public.user_chats
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "User can delete own chat"
  ON public.user_chats
  FOR DELETE USING (user_id = auth.uid());

-- 3. Chat clones (for drag-to-clone UX)
CREATE TABLE public.chat_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  message_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_clones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can access chat clones"
  ON public.chat_clones
  FOR SELECT
  USING (source_user_id = auth.uid() OR target_user_id = auth.uid());
CREATE POLICY "Target can insert chat clone"
  ON public.chat_clones
  FOR INSERT WITH CHECK (target_user_id = auth.uid());

-- 4. Add status to team_members for pending/removed logic
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 5. Real-time sync prep
ALTER TABLE public.user_chats REPLICA IDENTITY FULL;
ALTER TABLE public.chat_clones REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chats, public.chat_clones;

-- 6. Indices for speed
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON public.team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_user_chats_user_team ON public.user_chats(user_id, team_id);
CREATE INDEX IF NOT EXISTS idx_chat_clones_target ON public.chat_clones(target_user_id);

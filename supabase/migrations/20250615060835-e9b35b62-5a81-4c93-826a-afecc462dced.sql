
-- 1. Add team_code (unique code) and password_hash to teams
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS team_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Backfill team_code for existing teams with a unique short code (8 char)
UPDATE public.teams
SET team_code = upper(substring(md5(random()::text) from 1 for 8))
WHERE team_code IS NULL;

-- 3. Make sure creator_id and created_by both exist for clarity (created_by is present, add creator_id alias)
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS creator_id UUID;
UPDATE public.teams SET creator_id = created_by WHERE creator_id IS NULL;

-- 4. Ensure only team members can SELECT their teams: 
DROP POLICY IF EXISTS "Enable read access for team members" ON public.teams;
CREATE POLICY "Enable read access for team members"
  ON public.teams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
    OR teams.created_by = auth.uid()
  );

-- 5. Prevent team from being created with members besides creator
-- (Already enforced by create_team_with_invite function; keep as is)

-- 6. Optional: Make sure team_code is never null from now on
ALTER TABLE public.teams ALTER COLUMN team_code SET NOT NULL;

-- 7. Create index for quick team_code lookups (for joins)
CREATE INDEX IF NOT EXISTS idx_teams_team_code ON public.teams(team_code);


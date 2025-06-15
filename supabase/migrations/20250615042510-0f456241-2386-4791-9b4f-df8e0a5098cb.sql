
-- Create a secure helper for checking team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members WHERE team_id = _team_id AND user_id = _user_id
  );
$$;

-- Remove any previous RLS on teams and team_members before re-applying
DROP POLICY IF EXISTS "Enable read access for team members" ON public.teams;
DROP POLICY IF EXISTS "Enable read access for team members" ON public.team_members;

-- Only team members can select their teams
CREATE POLICY "Enable read access for team members"
  ON public.teams
  FOR SELECT
  USING (public.is_team_member(auth.uid(), id) OR created_by = auth.uid());

-- Only team members can select their team membership
CREATE POLICY "Enable read access for team members"
  ON public.team_members
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_team_member(auth.uid(), team_id));


-- Allow team creators to insert new teams
CREATE POLICY "Enable insert for team creator"
  ON public.teams
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Allow self-access to insert into team_members table (as creator or by invite code RPC)
CREATE POLICY "Enable insert for own team membership"
  ON public.team_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid());


-- Generate a short unique team code
CREATE OR REPLACE FUNCTION public.generate_team_code()
RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  candidate TEXT;
BEGIN
  LOOP
    candidate := upper(substring(md5(random()::text) from 1 for 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.teams WHERE teams.team_code = candidate);
  END LOOP;
  RETURN candidate;
END;
$$;

-- Update create_team_with_invite to generate and set team_code
CREATE OR REPLACE FUNCTION public.create_team_with_invite(team_name text, team_description text DEFAULT NULL::text)
RETURNS TABLE(team_id uuid, invite_code text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_team_id UUID;
  new_invite_code TEXT;
  new_team_code TEXT;
BEGIN
  -- Generate unique codes
  new_invite_code := generate_invite_code();
  new_team_code := generate_team_code();

  -- Create team with both codes
  INSERT INTO public.teams (name, description, invite_code, team_code, created_by)
  VALUES (team_name, team_description, new_invite_code, new_team_code, auth.uid())
  RETURNING id INTO new_team_id;

  -- Add creator as admin
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (new_team_id, auth.uid(), 'admin');

  RETURN QUERY SELECT new_team_id, new_invite_code;
END;
$function$;


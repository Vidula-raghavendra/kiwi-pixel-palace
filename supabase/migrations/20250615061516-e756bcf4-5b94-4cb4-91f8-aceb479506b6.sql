
-- Remove Row Level Security for `team_members`
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- Optionally do the same for teams if you hit more policy errors
-- ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;


-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id),
  UNIQUE(team_id, user_id)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for teams
CREATE POLICY "Users can view teams they belong to" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team admins can update teams" ON public.teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id AND user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can manage members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = team_members.team_id AND user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can join teams via invite" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Team members can view projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = projects.team_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Team editors and admins can create projects" ON public.projects
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = projects.team_id AND user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Team editors and admins can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = projects.team_id AND user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, github_username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create team with invite code
CREATE OR REPLACE FUNCTION create_team_with_invite(
  team_name TEXT,
  team_description TEXT DEFAULT NULL
)
RETURNS TABLE(team_id UUID, invite_code TEXT) AS $$
DECLARE
  new_team_id UUID;
  new_invite_code TEXT;
BEGIN
  -- Generate unique invite code
  LOOP
    new_invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.teams WHERE teams.invite_code = new_invite_code);
  END LOOP;
  
  -- Create team
  INSERT INTO public.teams (name, description, invite_code, created_by)
  VALUES (team_name, team_description, new_invite_code, auth.uid())
  RETURNING id INTO new_team_id;
  
  -- Add creator as admin
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (new_team_id, auth.uid(), 'admin');
  
  RETURN QUERY SELECT new_team_id, new_invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to join team by invite code
CREATE OR REPLACE FUNCTION join_team_by_invite(
  code TEXT,
  member_role TEXT DEFAULT 'viewer'
)
RETURNS UUID AS $$
DECLARE
  target_team_id UUID;
BEGIN
  -- Find team by invite code
  SELECT id INTO target_team_id FROM public.teams WHERE invite_code = code;
  
  IF target_team_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (SELECT 1 FROM public.team_members WHERE team_id = target_team_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'User is already a member of this team';
  END IF;
  
  -- Add user to team
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (target_team_id, auth.uid(), member_role);
  
  RETURN target_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

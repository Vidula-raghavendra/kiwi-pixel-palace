
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Get initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Fetch profile in background if user exists
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        console.log('Profile loaded:', profileData);
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Attempting GitHub sign in...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        console.error('GitHub sign in error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('GitHub sign in catch error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with GitHub",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data });
        
      if (error) throw error;
      
      setProfile(prev => ({ ...prev, ...data }));
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGithub,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

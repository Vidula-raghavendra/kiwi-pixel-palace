
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { user, loading, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to home
  useEffect(() => {
    if (user && !loading) {
      console.log('User is authenticated, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading...</div>
      </div>
    );
  }

  if (user) {
    console.log('User exists, should redirect');
    return null; // Let the useEffect handle the redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2fde4] to-[#fff7ea] px-4">
      <Card className="w-full max-w-md pixel-outline bg-[#fffde8] border-[#ad9271]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <span
              className="rounded-full border border-[#badc5b] shadow-lg"
              style={{ 
                background: "#badc5b", 
                width: 64, 
                height: 64, 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}
            >
              <svg width="36" height="32" viewBox="0 0 19 15">
                <ellipse cx="9.5" cy="7.5" rx="7.5" ry="6.6" fill="#baf661" stroke="#8eaa4d" strokeWidth="1.3" />
                <ellipse cx="9.5" cy="7.5" rx="5.5" ry="5" fill="#fafbd6" opacity="0.5" />
              </svg>
            </span>
          </div>
          <CardTitle className="pixel-font text-2xl text-[#233f24]">
            Welcome to KIWI
          </CardTitle>
          <CardDescription className="pixel-font text-[#7b6449]">
            Sign in to access your workspace and collaborate with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={signInWithGithub}
            className="w-full pixel-font bg-[#24292e] hover:bg-[#1a1e22] text-white border-0 py-3 text-lg flex items-center justify-center gap-3"
          >
            <Github size={20} />
            Sign in with GitHub
          </Button>
          
          <div className="mt-6 text-center">
            <p className="pixel-font text-xs text-[#8bb47e]">
              Industry-ready collaboration platform
            </p>
            <p className="pixel-font text-xs text-[#ad9271] mt-1">
              ✓ Secure GitHub authentication
            </p>
            <p className="pixel-font text-xs text-[#ad9271]">
              ✓ Team management with invite codes
            </p>
            <p className="pixel-font text-xs text-[#ad9271]">
              ✓ Project collaboration tools
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

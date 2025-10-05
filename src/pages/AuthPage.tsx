import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { user, loading, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
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
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-2 h-2 bg-[#badc5b] opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + i % 4}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>
          {`
          @keyframes float {
            0%, 100% {transform: translateY(0px);}
            50% {transform: translateY(-20px);}
          }
          `}
        </style>
      </div>

      <Card className="w-full max-w-lg bg-[#fffdf3] border-4 border-[#233f24] shadow-[0_8px_0_#233f24] relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="border-4 border-[#233f24] shadow-[0_6px_0_#8bb47e] bg-[#badc5b] hover:shadow-[0_8px_0_#8bb47e] hover:translate-y-[-2px] transition-all"
                style={{
                  width: 96,
                  height: 96,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <svg width="50" height="44" viewBox="0 0 19 15">
                  <ellipse cx="9.5" cy="7.5" rx="7.5" ry="6.6" fill="#8bb47e" stroke="#233f24" strokeWidth="2" />
                  <ellipse cx="9.5" cy="7.5" rx="5" ry="4.5" fill="#fafbd6" opacity="0.7" />
                  <circle cx="7" cy="6" r="1" fill="#233f24" />
                  <circle cx="12" cy="6" r="1" fill="#233f24" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#f59e42] border-2 border-[#233f24] animate-bounce" />
            </div>
          </div>
          <CardTitle className="pixel-font text-4xl text-[#233f24] mb-3 tracking-wide">
            Welcome to KIWI
          </CardTitle>
          <CardDescription className="pixel-font text-[#7b6449] text-base px-4 leading-relaxed">
            Sign in to start collaborating with AI-powered teammates in your pixel-perfect workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Button
            onClick={signInWithGithub}
            className="w-full pixel-font bg-[#24292e] hover:bg-[#1a1e22] text-white border-0 py-6 text-xl flex items-center justify-center gap-3 shadow-[0_4px_0_#1a1e22] hover:shadow-[0_6px_0_#1a1e22] hover:translate-y-[-2px] transition-all"
          >
            <Github size={24} />
            Sign in with GitHub
          </Button>

          <div className="mt-8 p-6 bg-[#f0ffe8] border-2 border-[#8bb47e]">
            <p className="pixel-font text-sm text-[#233f24] font-semibold mb-3">
              ✨ What You'll Get:
            </p>
            <div className="space-y-2">
              <p className="pixel-font text-sm text-[#7b6449] flex items-start gap-2">
                <span className="text-[#8bb47e] flex-shrink-0">✓</span>
                <span>Instant team workspaces with invite codes</span>
              </p>
              <p className="pixel-font text-sm text-[#7b6449] flex items-start gap-2">
                <span className="text-[#8bb47e] flex-shrink-0">✓</span>
                <span>Dual AI chat assistants for every task</span>
              </p>
              <p className="pixel-font text-sm text-[#7b6449] flex items-start gap-2">
                <span className="text-[#8bb47e] flex-shrink-0">✓</span>
                <span>Real-time collaboration with teammates</span>
              </p>
              <p className="pixel-font text-sm text-[#7b6449] flex items-start gap-2">
                <span className="text-[#8bb47e] flex-shrink-0">✓</span>
                <span>Secure GitHub authentication</span>
              </p>
            </div>
          </div>

          <p className="pixel-font text-xs text-[#ad9271] text-center mt-6">
            Free to use. No credit card required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

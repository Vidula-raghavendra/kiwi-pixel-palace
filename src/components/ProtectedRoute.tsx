
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // If auth is still loading, render a loader (not blank)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading...</div>
      </div>
    );
  }

  // If user still not set/ready or is unauthenticated, redirect
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Render actual content if authenticated
  return <>{children}</>;
}

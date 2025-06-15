
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { 
    user: !!user, 
    loading, 
    pathname: location.pathname 
  });

  // If auth is still loading, render a loader
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-lg text-[#233f24]">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the protected content
  console.log('ProtectedRoute: User authenticated, rendering content');
  return <>{children}</>;
}

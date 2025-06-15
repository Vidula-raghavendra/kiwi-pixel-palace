import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./components/Dashboard";
import React from "react";
import KiwiWorkspace from "./components/KiwiWorkspace";
import WorkspaceRoom from "./components/WorkspaceRoom";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const DashboardPage = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Dashboard />
    </div>
  );
};

const WorkspacePage = () => <KiwiWorkspace />;
const WorkspaceRoomPage = () => <WorkspaceRoom />;

function NotFoundOrInvalidWorkspace() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#e2fde4]">
      <div className="pixel-font text-red-700 text-lg">
        Invalid workspace route or context.<br />
        <span className="text-xs text-[#ad9271]">
          Try reloading or return to <a href="/home" className="underline">dashboard</a>.
        </span>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/workspace/my-room" element={
              <ProtectedRoute>
                <WorkspaceRoomPage />
              </ProtectedRoute>
            } />
            {/* Accept numeric/alphanumeric workspace IDs only */}
            <Route path="/workspace/:id" element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            } />
            {/* Fallback for any other unknown or malformed workspace route */}
            <Route path="/workspace/*" element={<NotFoundOrInvalidWorkspace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

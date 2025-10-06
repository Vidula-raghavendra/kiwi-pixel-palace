
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./components/Dashboard";
import WorkspacePage from "./pages/WorkspacePage";
import WorkspaceRoom from "./components/WorkspaceRoom";
import AuthPage from "./pages/AuthPage";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [err, setErr] = React.useState<Error | null>(null);
  React.useEffect(() => {
    const handler = (e: any) => {
      setErr(e?.error || e || new Error("Unknown error"));
      console.error("Global ErrorBoundary caught:", e);
    };
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);
  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e2fde4]">
        <div className="pixel-font text-red-700">
          App error: {err.message}
          <br />
          Try reloading or <a href="/auth" className="underline">log in again</a>.
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

const DashboardPage = () => (
  <div className="min-h-screen w-full bg-[#e2fde4] flex items-center justify-center">
    <Dashboard />
  </div>
);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2fde4] via-[#f0ffe8] to-[#fff7ea] px-4">
                  <SignupForm />
                </div>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/workspace" element={
                <ProtectedRoute>
                  <WorkspacePage />
                </ProtectedRoute>
              } />
              <Route path="/workspace/:id" element={
                <ProtectedRoute>
                  <WorkspaceRoom />
                </ProtectedRoute>
              } />
              <Route path="/workspace/*" element={<NotFoundOrInvalidWorkspace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

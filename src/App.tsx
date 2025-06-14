
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Dashboard from "./components/Dashboard";
import React from "react";
import KiwiWorkspace from "./components/KiwiWorkspace";
import WorkspaceRoom from "./components/WorkspaceRoom";

const LoginPage = () => (
  <div className="min-h-[60vh] flex flex-col justify-center items-center">
    <LoginForm />
  </div>
);
const SignupPage = () => (
  <div className="min-h-[60vh] flex flex-col justify-center items-center">
    <SignupForm />
  </div>
);
const DashboardPage = () => {
  // Try to read email from sessionStorage (demo purpose)
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const stored = sessionStorage.getItem("loginEmail");
    setEmail(stored || undefined);
  }, []);
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Dashboard email={email} />
    </div>
  );
};
const WorkspacePage = () => <KiwiWorkspace />;
const WorkspaceRoomPage = () => <WorkspaceRoom />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/workspace/:id" element={<WorkspacePage />} />
          <Route path="/workspace/my-room" element={<WorkspaceRoomPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


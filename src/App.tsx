import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
// Placeholder pages till later steps
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";

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
const DashboardPage = () => <div className="pixel-font min-h-[50vh] flex items-center justify-center text-2xl">[Dashboard goes here]</div>;
const WorkspacePage = () => <div className="pixel-font min-h-[50vh] flex items-center justify-center text-2xl">[Workspace goes here]</div>;

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

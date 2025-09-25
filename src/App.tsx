import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Project from "./pages/Project";
import Explorar from "./pages/Explorar";
import Agenda from "./pages/Agenda";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DefaultLayout from "./components/Layout/DefaultLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import Welcome from "./pages/welcome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Página pública de boas-vindas */}
            <Route path="/" element={<Welcome />} />
            {/* Rotas de autenticação */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } />
            
            {/* Rotas protegidas */}
            <Route path="/*" element={
              <DefaultLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projetos" element={<Projetos />} />
                  <Route path="/project/:id" element={<Project />} />
                  <Route path="/explorar" element={<Explorar />} />
                  <Route path="/agenda" element={<Agenda />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DefaultLayout>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Explorar from "./pages/Explorar";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";
import DefaultLayout from "./components/Layout/DefaultLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/agenda" element={<Agenda />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DefaultLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

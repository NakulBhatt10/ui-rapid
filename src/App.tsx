import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { DisasterMap } from "@/pages/DisasterMap";
import { Accommodations } from "@/pages/Accommodations";
import { DiseaseReports } from "@/pages/DiseaseReports";
import { Communication } from "@/pages/Communication";
import { AboutUs } from "@/pages/AboutUs";
import { Profile } from "@/pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/disaster-map" element={<DisasterMap />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/disease-reports" element={<DiseaseReports />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

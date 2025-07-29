
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PlatformLayout from "@/components/layout/PlatformLayout";

// Platform Pages
import SchoolIndex from "./pages/school/Index";
import MasjidIndex from "./pages/masjid/Index";
import CharityIndex from "./pages/charity/Index";
import TravelsIndex from "./pages/travels/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PlatformLayout>
          <Routes>
            {/* Redirect root to school platform */}
            <Route path="/" element={<Navigate to="/school" replace />} />
            
            {/* School Platform Routes */}
            <Route path="/school" element={<SchoolIndex />} />
            <Route path="/school/*" element={<SchoolIndex />} />
            
            {/* Masjid Platform Routes */}
            <Route path="/masjid" element={<MasjidIndex />} />
            <Route path="/masjid/*" element={<MasjidIndex />} />
            
            {/* Charity Platform Routes */}
            <Route path="/charity" element={<CharityIndex />} />
            <Route path="/charity/*" element={<CharityIndex />} />
            
            {/* Travels Platform Routes */}
            <Route path="/travels" element={<TravelsIndex />} />
            <Route path="/travels/*" element={<TravelsIndex />} />
            
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PlatformLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

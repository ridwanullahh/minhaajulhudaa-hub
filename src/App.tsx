
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlatformLayout from "@/components/layout/PlatformLayout";

// Root Directory
import RootDirectory from "./pages/RootDirectory";

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
        <Routes>
          {/* Root Directory */}
          <Route path="/" element={<RootDirectory />} />
          
          {/* Platform Routes with Layout */}
          <Route path="/school" element={<PlatformLayout><SchoolIndex /></PlatformLayout>} />
          <Route path="/school/*" element={<PlatformLayout><SchoolIndex /></PlatformLayout>} />
          
          <Route path="/masjid" element={<PlatformLayout><MasjidIndex /></PlatformLayout>} />
          <Route path="/masjid/*" element={<PlatformLayout><MasjidIndex /></PlatformLayout>} />
          
          <Route path="/charity" element={<PlatformLayout><CharityIndex /></PlatformLayout>} />
          <Route path="/charity/*" element={<PlatformLayout><CharityIndex /></PlatformLayout>} />
          
          <Route path="/travels" element={<PlatformLayout><TravelsIndex /></PlatformLayout>} />
          <Route path="/travels/*" element={<PlatformLayout><TravelsIndex /></PlatformLayout>} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

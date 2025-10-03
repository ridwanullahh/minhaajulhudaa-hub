
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlatformLayout from "@/components/layout/PlatformLayout";
import PlatformRouter from "@/components/routing/PlatformRouter";
import { initializeAllPlatforms } from "@/lib/platform-db";
import { AuthProvider } from "@/lib/auth";

import RootDirectory from "./pages/RootDirectory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeAllPlatforms().catch(console.error);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootDirectory />} />

            <Route
              path="/school/*"
              element={
                <PlatformLayout>
                  <PlatformRouter platform="school" />
                </PlatformLayout>
              }
            />

            <Route
              path="/masjid/*"
              element={
                <PlatformLayout>
                  <PlatformRouter platform="masjid" />
                </PlatformLayout>
              }
            />

            <Route
              path="/charity/*"
              element={
                <PlatformLayout>
                  <PlatformRouter platform="charity" />
                </PlatformLayout>
              }
            />

            <Route
              path="/travels/*"
              element={
                <PlatformLayout>
                  <PlatformRouter platform="travels" />
                </PlatformLayout>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;

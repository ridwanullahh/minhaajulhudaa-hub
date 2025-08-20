import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlatformLayout from "@/components/layout/PlatformLayout";
import PlatformRouter from "@/components/routing/PlatformRouter";
import { initializeAllPlatforms } from "@/lib/platform-db";
import { CircleDotDashed } from 'lucide-react';
import { LoadingProvider } from './context/LoadingContext';

// Root Directory
import RootDirectory from "./pages/RootDirectory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const isInitialized = localStorage.getItem('db_initialized');
        if (!isInitialized) {
          console.log("Performing first-time database initialization...");
          await initializeAllPlatforms();
          localStorage.setItem('db_initialized', 'true');
          console.log("Database initialization complete.");
        } else {
          // Optional: run a non-blocking check in the background on subsequent visits
          console.log("Database already initialized. Skipping blocking setup.");
          initializeAllPlatforms().catch(console.error); // Run in background
        }
      } catch (error: any) {
        console.error("Failed to initialize database:", error);
        setInitializationError(error.message || "An unknown error occurred during setup.");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (isInitializing) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <CircleDotDashed className="w-12 h-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Minhaajulhudaa</h1>
        <p className="text-muted-foreground">Setting up the platform for the first time. Please wait...</p>
      </div>
    );
  }

  if (initializationError) {
      return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
              <h1 className="text-2xl font-bold mb-2">Initialization Failed</h1>
              <p className="mb-4">Could not connect to the database. Please check your configuration and network.</p>
              <pre className="bg-white p-4 rounded-lg text-sm text-left">{initializationError}</pre>
          </div>
      );
  }

  return (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root Directory */}
            <Route path="/" element={<RootDirectory />} />

            {/* Platform Routes with Layout and Router */}
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

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LoadingProvider>
  </QueryClientProvider>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./context/AppProviders";
import PlatformLayout from "@/components/layout/PlatformLayout";
import PlatformRouter from "@/components/routing/PlatformRouter";
import { initializeAllPlatforms } from "@/lib/platform-db";
import { CircleDotDashed } from 'lucide-react';
import AdminLogin from "./pages/admin/AdminLogin";

// Root Directory
import RootDirectory from "./pages/RootDirectory";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const isInitialized = localStorage.getItem('db_initialized_v2'); // Use a new key to force re-init for users of old version
        if (!isInitialized) {
          console.log("Performing first-time database initialization...");
          await initializeAllPlatforms();
          localStorage.setItem('db_initialized_v2', 'true');
          console.log("Database initialization complete.");
        } else {
          console.log("Database already initialized. Skipping setup.");
        }
      } catch (error: any) {
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
        <p className="text-muted-foreground">Setting up the platform...</p>
      </div>
    );
  }

  if (initializationError) {
      return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
              <h1 className="text-2xl font-bold mb-2">Initialization Failed</h1>
              <pre className="bg-white p-4 rounded-lg text-sm text-left">{initializationError}</pre>
          </div>
      );
  }

  return (
    <Routes>
      <Route path="/" element={<RootDirectory />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/school/*" element={<PlatformLayout><PlatformRouter platform="school" /></PlatformLayout>} />
      <Route path="/masjid/*" element={<PlatformLayout><PlatformRouter platform="masjid" /></PlatformLayout>} />
      <Route path="/charity/*" element={<PlatformLayout><PlatformRouter platform="charity" /></PlatformLayout>} />
      <Route path="/travels/*" element={<PlatformLayout><PlatformRouter platform="travels" /></PlatformLayout>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


const App = () => {
    return (
        <AppProviders>
            <AppContent />
        </AppProviders>
    );
}

export default App;

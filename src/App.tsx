import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./context/AppProviders";
import PlatformLayout from "@/components/layout/PlatformLayout";
import PlatformRouter from "@/components/routing/PlatformRouter";
import AdminLogin from "./pages/admin/AdminLogin";

// Root Directory
import RootDirectory from "./pages/RootDirectory";
import NotFound from "./pages/NotFound";

const AppContent = () => {
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

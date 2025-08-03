
import React, { useEffect } from 'react';
import { usePlatform } from '@/hooks/usePlatform';
import PlatformNavigation from '@/components/navigation/PlatformNavigation';
import PlatformFooter from '@/components/layout/PlatformFooter';
import { initializeAllPlatforms } from '@/lib/platform-db';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children }) => {
  const { theme, config, platform } = usePlatform();

  // Initialize platform databases on mount
  useEffect(() => {
    initializeAllPlatforms().catch(console.error);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}
      style={{
        '--platform-primary': theme.primary,
        '--platform-secondary': theme.secondary,
        '--platform-accent': theme.accent,
      } as React.CSSProperties}
    >
      <div className="relative">
        {/* Platform-specific styling */}
        <style>
          {`
            .platform-primary { color: ${theme.primary}; }
            .platform-secondary { color: ${theme.secondary}; }
            .platform-accent { color: ${theme.accent}; }
            .bg-platform-primary { background-color: ${theme.primary}; }
            .bg-platform-secondary { background-color: ${theme.secondary}; }
            .bg-platform-accent { background-color: ${theme.accent}; }
            .border-platform-primary { border-color: ${theme.primary}; }
            .hover\\:bg-platform-primary:hover { background-color: ${theme.primary}; }
            .hover\\:text-platform-primary:hover { color: ${theme.primary}; }
            .hover\\:bg-platform-primary\\/10:hover { background-color: ${theme.primary}1a; }
            .text-platform-primary { color: ${theme.primary}; }
            .text-platform-secondary { color: ${theme.secondary}; }
            .text-platform-accent { color: ${theme.accent}; }
          `}
        </style>

        {/* Navigation */}
        <PlatformNavigation />

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <PlatformFooter />
      </div>
    </div>
  );
};

export default PlatformLayout;

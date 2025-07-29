
import React from 'react';
import { usePlatform } from '@/hooks/usePlatform';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children }) => {
  const { theme, config, platform } = usePlatform();
  
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
          `}
        </style>
        
        {/* Platform indicator for development */}
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          <span className="platform-primary">{config.name}</span>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default PlatformLayout;

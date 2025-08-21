import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks/usePlatform';
import PlatformHeader from '@/components/layout/PlatformHeader';
import AdminHeader from '@/components/layout/AdminHeader';
import PortalHeader from '@/components/layout/PortalHeader';
import PlatformFooter from '@/components/layout/PlatformFooter';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children }) => {
  const { theme } = usePlatform();
  const location = useLocation();

  const renderHeader = () => {
    const path = location.pathname;
    if (path.includes('/admin')) {
      return <AdminHeader />;
    }
    if (path.includes('/portal')) {
      return <PortalHeader />;
    }
    return <PlatformHeader />;
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        '--platform-primary': theme.primary,
        '--platform-secondary': theme.secondary,
      } as React.CSSProperties}
    >
        {renderHeader()}
        <main className="min-h-screen">
          {children}
        </main>
        <PlatformFooter />
    </div>
  );
};

export default PlatformLayout;

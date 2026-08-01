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

/**
 * Platform layout shell.
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Applies the per-platform CSS class (e.g. `platform-school`) on the
 * root div so that the `--platform-accent` CSS variable and all
 * derived `bg-platform-accent` / `text-platform-accent` utility
 * classes resolve to the correct color for the active platform.
 */
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
    <div className={`min-h-screen bg-background ${theme.platformClass}`}>
      {renderHeader()}
      <main className="min-h-screen">
        {children}
      </main>
      <PlatformFooter />
    </div>
  );
};

export default PlatformLayout;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useUserAuth } from '@/hooks/useUserAuth'; // To be created later
import { ModernButton } from '@/components/ui/ModernButton';
import { User, LayoutDashboard } from 'lucide-react';

const PortalHeader = () => {
    // const { user, logout } = useUserAuth();
    const location = useLocation();
    const platform = location.pathname.split('/')[1];

    return (
        <header className="bg-background shadow-md sticky top-0 z-50 border-b">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={`/${platform}/portal`} className="flex items-center space-x-3 text-foreground group">
                        <User className="w-6 h-6 text-primary"/>
                        <span className="font-bold text-lg">
                            <span className="text-muted-foreground">Portal:</span> <span className="capitalize">{platform}</span>
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to={`/${platform}/portal`}>
                            <ModernButton variant="ghost" size="sm">Dashboard</ModernButton>
                        </Link>
                         <Link to={`/${platform}/portal/profile`}>
                            <ModernButton variant="ghost" size="sm">My Profile</ModernButton>
                        </Link>
                        <ModernButton variant="outline" size="sm" onClick={() => alert('Logout')}>
                            Logout
                        </ModernButton>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PortalHeader;

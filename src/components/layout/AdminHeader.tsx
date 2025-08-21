import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ModernButton } from '@/components/ui/ModernButton';
import { Shield, LayoutDashboard } from 'lucide-react';

const AdminHeader = () => {
    const { admin, logout } = useAdminAuth();
    const location = useLocation();
    const platform = location.pathname.split('/')[1];

    return (
        <header className="bg-background shadow-md sticky top-0 z-50 border-b">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={`/${platform}/admin`} className="flex items-center space-x-3 text-foreground group">
                        <Shield className="w-6 h-6 text-primary"/>
                        <span className="font-bold text-lg">
                            <span className="text-muted-foreground">Admin:</span> <span className="capitalize">{platform}</span>
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to={`/${platform}`}>
                            <ModernButton variant="outline" size="sm">View Public Site</ModernButton>
                        </Link>
                        {admin && (
                            <ModernButton variant="ghost" size="sm" onClick={logout}>
                                Logout
                            </ModernButton>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

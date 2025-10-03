import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  redirectTo,
}) => {
  const { user, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={redirectTo || '/auth/login'} state={{ from: location }} replace />;
  }

  if (requireRoles.length > 0 && !requireRoles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requirePermissions.length > 0 && !requirePermissions.every(permission => hasPermission(permission))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

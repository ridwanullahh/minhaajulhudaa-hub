import React, { ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminProtectedRouteProps {
  children: ReactNode;
  platform: string;
}

const AdminProtectedRoute = ({ children, platform }: AdminProtectedRouteProps) => {
  const { admin } = useAdminAuth();
  const location = useLocation();

  // Check if there is an admin logged in AND if their platform matches the required platform
  if (!admin || admin.platform !== platform) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful login.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;

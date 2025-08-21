import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  admin: any;
  login: (platform: string, user: string, pass: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to parse admin credentials from .env
const getAdminCredentials = (platform: string): Map<string, string> => {
    const credentials = new Map<string, string>();
    const envVar = `VITE_ADMIN_USERS_${platform.toUpperCase()}`;
    const credString = import.meta.env[envVar] || '';

    credString.split(',').forEach(pair => {
        const [user, pass] = pair.split(':');
        if (user && pass) {
            credentials.set(user.trim(), pass.trim());
        }
    });
    return credentials;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<any>(() => {
    try {
        const item = window.sessionStorage.getItem('admin_user');
        return item ? JSON.parse(item) : null;
    } catch (error) {
        return null;
    }
  });

  const login = (platform: string, user: string, pass: string): boolean => {
    const validAdmins = getAdminCredentials(platform);
    if (validAdmins.has(user) && validAdmins.get(user) === pass) {
      const adminData = { username: user, platform };
      setAdmin(adminData);
      window.sessionStorage.setItem('admin_user', JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    window.sessionStorage.removeItem('admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

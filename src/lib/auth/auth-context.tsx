import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import db from '../db';
import config from '../config';

interface User {
  id: string;
  uid: string;
  email: string;
  name?: string;
  platform: string;
  role: string;
  roles?: string[];
  permissions?: string[];
  verified: boolean;
  createdAt: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, platform: string) => Promise<User>;
  register: (email: string, password: string, name: string, platform: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  sendOTP: (email: string, reason: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'minhaajulhudaa_session';
const SESSION_EXPIRY = config.auth.sessionExpiry * 1000;

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + config.auth.jwtSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateToken = (): string => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          const now = Date.now();
          
          if (session.expiresAt > now) {
            const users = await db.get('users');
            const foundUser = users.find((u: User) => u.uid === session.userId);
            if (foundUser) {
              setUser(foundUser);
            } else {
              localStorage.removeItem(SESSION_KEY);
            }
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveSession = (userId: string) => {
    const session = {
      userId,
      token: generateToken(),
      expiresAt: Date.now() + SESSION_EXPIRY,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const login = async (email: string, password: string, platform: string): Promise<User> => {
    const hashedPassword = await hashPassword(password);
    const users = await db.get<User>('users');
    
    const foundUser = users.find(
      (u: User) => u.email === email && u.password === hashedPassword && u.platform === platform
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    if (config.auth.requireEmailVerification && !foundUser.verified) {
      throw new Error('Email not verified. Please verify your email first.');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    saveSession(foundUser.uid);
    
    return userWithoutPassword;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    platform: string,
    role: string = 'user'
  ): Promise<User> => {
    const users = await db.get<User>('users');
    
    const existingUser = users.find((u: User) => u.email === email && u.platform === platform);
    if (existingUser) {
      throw new Error('User already exists with this email on this platform');
    }

    const hashedPassword = await hashPassword(password);
    
    const newUser = await db.insert<User>('users', {
      email,
      password: hashedPassword,
      name,
      platform,
      role,
      roles: [role],
      permissions: [],
      verified: !config.auth.requireEmailVerification,
      createdAt: new Date().toISOString(),
    });

    if (config.auth.requireEmailVerification) {
      await sendOTP(email, 'register');
    } else {
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      saveSession(newUser.uid);
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const sendOTP = async (email: string, reason: string): Promise<void> => {
    const otp = generateOTP();
    const expiresAt = Date.now() + (config.auth.otpExpiry * 60 * 1000);
    
    const otps = await db.get('otps').catch(() => []);
    const existingOtpIndex = otps.findIndex((o: any) => o.email === email && o.reason === reason);
    
    if (existingOtpIndex >= 0) {
      await db.update('otps', otps[existingOtpIndex].uid, {
        otp,
        expiresAt,
        createdAt: new Date().toISOString(),
      });
    } else {
      await db.insert('otps', {
        email,
        otp,
        reason,
        expiresAt,
        createdAt: new Date().toISOString(),
      });
    }

    if (config.app.debug) {
      console.log(`OTP for ${email}: ${otp}`);
    }
  };

  const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
    const otps = await db.get('otps');
    const otpRecord = otps.find(
      (o: any) => o.email === email && o.otp === otp && o.reason === 'register' && o.expiresAt > Date.now()
    );

    if (!otpRecord) {
      return false;
    }

    const users = await db.get<User>('users');
    const userToVerify = users.find((u: User) => u.email === email);
    
    if (userToVerify) {
      await db.update('users', userToVerify.uid, { verified: true });
      await db.delete('otps', otpRecord.uid);
      
      const { password: _, ...userWithoutPassword } = { ...userToVerify, verified: true };
      setUser(userWithoutPassword);
      saveSession(userToVerify.uid);
      
      return true;
    }

    return false;
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    const otps = await db.get('otps');
    const otpRecord = otps.find(
      (o: any) => o.email === email && o.otp === otp && o.reason === 'reset' && o.expiresAt > Date.now()
    );

    if (!otpRecord) {
      return false;
    }

    const users = await db.get<User>('users');
    const userToUpdate = users.find((u: User) => u.email === email);
    
    if (userToUpdate) {
      const hashedPassword = await hashPassword(newPassword);
      await db.update('users', userToUpdate.uid, { password: hashedPassword });
      await db.delete('otps', otpRecord.uid);
      return true;
    }

    return false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.roles?.includes('admin')) return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role) || false;
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const { password, email, uid, id, ...allowedUpdates } = updates;
    
    const updatedUser = await db.update<User>('users', user.uid, allowedUpdates);
    const { password: _, ...userWithoutPassword } = updatedUser;
    setUser(userWithoutPassword);
    
    return userWithoutPassword;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        sendOTP,
        resetPassword,
        hasPermission,
        hasRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User, AuthContextType };

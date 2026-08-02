import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Notification System
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * In-app notification center. Stores notifications in localStorage so
 * they persist across sessions. Each platform page can push
 * notifications (e.g. "New blog post published", "Donation received").
 *
 * Addresses PRODUCTION_GAPS.md item 3.x (notification system).
 */

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  platform?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const STORAGE_KEY = 'minhaajulhudaa_notifications';

function loadFromStorage(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Auto-expire notifications older than 7 days
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return parsed.filter((n: AppNotification) => new Date(n.createdAt).getTime() > cutoff);
  } catch {
    return [];
  }
}

function saveToStorage(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)));
  } catch {}
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [bellOpen, setBellOpen] = useState(false);

  useEffect(() => {
    setNotifications(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(notifications);
  }, [notifications]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const notification: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 50));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll }}
    >
      {children}
      {/* Bell button - fixed top-right */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setBellOpen(!bellOpen)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-medium px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {bellOpen && (
          <div className="absolute top-12 right-0 w-80 sm:w-96 max-h-[60vh] overflow-hidden rounded-lg border border-border bg-card shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-platform-accent hover:underline">
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.type === 'success' ? CheckCircle : n.type === 'error' ? AlertCircle : Info;
                  const iconColor =
                    n.type === 'success' ? 'text-success' :
                    n.type === 'error' ? 'text-destructive' :
                    n.type === 'warning' ? 'text-warning' : 'text-info';
                  return (
                    <div
                      key={n.id}
                      className={`p-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${!n.read ? 'bg-platform-accent-soft/30' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs text-muted-foreground">
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                            {n.actionUrl && n.actionLabel && (
                              <a
                                href={n.actionUrl}
                                onClick={() => markAsRead(n.id)}
                                className="text-xs text-platform-accent hover:underline"
                              >
                                {n.actionLabel}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

export default NotificationProvider;

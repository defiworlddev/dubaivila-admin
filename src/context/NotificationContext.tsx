import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { adminService } from '../service/adminService';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await adminService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
    // Poll every 5 seconds
    const interval = setInterval(refreshUnreadCount, 5000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};


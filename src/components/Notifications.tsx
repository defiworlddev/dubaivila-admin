import { useState, useEffect, useCallback } from 'react';
import { adminService, Notification } from '../service/adminService';
import { useNotifications } from '../context/NotificationContext';

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());
  const { refreshUnreadCount } = useNotifications();

  const loadNotifications = useCallback(async (isInitial: boolean) => {
    if (isInitial) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const allNotifications = await adminService.getAllNotifications();
      setNotifications(allNotifications);
      // Refresh unread count after loading notifications
      await refreshUnreadCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      console.error('Failed to load notifications:', err);
    } finally {
      if (isInitial) {
        setIsLoading(false);
      }
    }
  }, [refreshUnreadCount]);

  useEffect(() => {
    loadNotifications(true);
    // Poll notifications every 5 seconds
    const interval = setInterval(() => loadNotifications(false), 5000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (markingAsRead.has(notificationId)) return;

    setMarkingAsRead((prev) => new Set(prev).add(notificationId));
    try {
      await adminService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      // Refresh unread count after marking as read
      await refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    } finally {
      setMarkingAsRead((prev) => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await adminService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      // Refresh unread count after marking all as read
      await refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-600 font-medium">Loading notifications...</div>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-primary-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-12 text-center">
          <p className="text-primary-700 font-medium">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.isRead && !markingAsRead.has(notification.id) && handleMarkAsRead(notification.id)}
              className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all ${
                notification.isRead
                  ? 'border-primary-200'
                  : 'border-primary-600 border-2 bg-primary-50 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    )}
                    <p className={`font-medium ${notification.isRead ? 'text-primary-700' : 'text-primary-900'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-primary-500 mt-2">
                    <span>{formatDateTime(notification.createdAt)}</span>
                    {notification.agentName && (
                      <span>Agent: {notification.agentName}</span>
                    )}
                    {notification.agentPhoneNumber && !notification.agentName && (
                      <span>Agent: {notification.agentPhoneNumber}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


import { api } from './api';

export interface AdminUser {
  id: string;
  phoneNumber: string;
  name?: string;
  isNewUser: boolean;
  isAgent: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'agent_viewed_request';
  requestId: string;
  agentId: string;
  agentName?: string;
  agentPhoneNumber?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ServerUser {
  _id: string;
  phoneNumber: string;
  name?: string;
  isNewUser: boolean;
  isAgent: boolean;
  isApproved: boolean;
  createdAt: string;
}

interface ServerNotification {
  _id: string;
  type: 'agent_viewed_request';
  requestId: string;
  agentId: string;
  agentName?: string;
  agentPhoneNumber?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

class AdminService {
  private convertServerUser(serverUser: ServerUser): AdminUser {
    return {
      id: serverUser._id,
      phoneNumber: serverUser.phoneNumber,
      name: serverUser.name,
      isNewUser: serverUser.isNewUser,
      isAgent: serverUser.isAgent,
      isApproved: serverUser.isApproved,
      createdAt: serverUser.createdAt,
    };
  }

  private convertServerNotification(serverNotification: ServerNotification): Notification {
    return {
      id: serverNotification._id,
      type: serverNotification.type,
      requestId: serverNotification.requestId,
      agentId: serverNotification.agentId,
      agentName: serverNotification.agentName,
      agentPhoneNumber: serverNotification.agentPhoneNumber,
      message: serverNotification.message,
      isRead: serverNotification.isRead,
      createdAt: serverNotification.createdAt,
    };
  }

  async getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get<{ users: ServerUser[] }>('/api/admin/users');
    return response.users.map((user) => this.convertServerUser(user));
  }

  async approveAgent(userId: string): Promise<AdminUser> {
    const response = await api.post<{ user: ServerUser }>(
      `/api/admin/agents/${userId}/approve`
    );
    return this.convertServerUser(response.user);
  }

  async getAllNotifications(): Promise<Notification[]> {
    const response = await api.get<{ notifications: ServerNotification[] }>('/api/admin/notifications');
    return response.notifications.map((notification) => this.convertServerNotification(notification));
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get<{ notifications: ServerNotification[] }>('/api/admin/notifications/unread');
    return response.notifications.map((notification) => this.convertServerNotification(notification));
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/api/admin/notifications/unread/count');
    return response.count;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    const response = await api.put<{ notification: ServerNotification }>(
      `/api/admin/notifications/${notificationId}/read`
    );
    return this.convertServerNotification(response.notification);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await api.put('/api/admin/notifications/read-all');
  }
}

export const adminService = new AdminService();


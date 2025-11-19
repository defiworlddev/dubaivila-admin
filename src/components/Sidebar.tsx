import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/requests', label: 'Requests', icon: '📋' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-primary-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:h-screen
          w-64 shadow-lg lg:shadow-none
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-primary-200">
            <h2 className="text-xl font-bold text-primary-900">Admin Panel</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-semibold transition-colors
                      ${
                        isActive(item.path)
                          ? 'bg-primary-700 text-white'
                          : 'text-primary-700 hover:bg-primary-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`
                          px-2 py-0.5 text-xs font-bold rounded-full
                          ${
                            isActive(item.path)
                              ? 'bg-white text-primary-700'
                              : 'bg-primary-600 text-white'
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};


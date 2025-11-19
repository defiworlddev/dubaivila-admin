import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-primary-50 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0 overflow-hidden">
        <header className="bg-white border-b border-primary-200 sticky top-0 z-30 shadow-md">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-primary-700 hover:text-primary-900"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <Link to="/users" className="flex items-center">
                  <h1 className="text-xl font-bold text-primary-900">Dubai Villas Admin</h1>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <span className="text-sm text-primary-700 font-medium">
                      {user.name || user.phoneNumber}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-primary-600 hover:text-primary-900 font-medium transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};


import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-primary-700 font-medium">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isNewUser) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};


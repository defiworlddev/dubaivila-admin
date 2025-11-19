import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Verification } from './components/Verification';
import { Registration } from './components/Registration';
import { UserList } from './components/UserList';
import { RequestList } from './components/RequestList';
import { Notifications } from './components/Notifications';

const AppRoutes = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-primary-700 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/register" element={<Registration />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UserList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  );
}


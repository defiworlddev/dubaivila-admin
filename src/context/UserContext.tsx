import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../service/authService';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  verifyCode: (phoneNumber: string, code: string) => Promise<void>;
  completeRegistration: (name: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (phoneNumber: string) => {
    await authService.sendVerificationCode(phoneNumber);
  };

  const verifyCode = async (phoneNumber: string, code: string) => {
    const verifiedUser = await authService.verifyCode(phoneNumber, code);
    setUser(verifiedUser);
  };

  const completeRegistration = async (name: string) => {
    const updatedUser = await authService.completeRegistration(name);
    setUser(updatedUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isNewUser,
        isLoading,
        login,
        verifyCode,
        completeRegistration,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


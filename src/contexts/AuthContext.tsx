
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'employer' | 'jobseeker' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  hasResume?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Load user data from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role);
    }
  }, []);

  // In a real app, these would connect to your backend
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API call (would be real in production)
      // This is frontend-only for demo purposes
      
      // Mock users for demo
      const mockEmployers = [
        { id: 'emp1', name: 'Tech Corp', email: 'employer@example.com', password: 'password', role: 'employer', company: 'Tech Corp' },
      ];
      
      const mockJobSeekers = [
        { id: 'js1', name: 'John Doe', email: 'jobseeker@example.com', password: 'password', role: 'jobseeker', hasResume: false },
      ];
      
      let foundUser;
      
      if (role === 'employer') {
        foundUser = mockEmployers.find(u => u.email === email && u.password === password);
      } else {
        foundUser = mockJobSeekers.find(u => u.email === email && u.password === password);
      }
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setCurrentUser(userWithoutPassword as User);
        setIsAuthenticated(true);
        setUserRole(foundUser.role as UserRole);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      // Simulate API call (would be real in production)
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
      };

      setCurrentUser(newUser as User);
      setIsAuthenticated(true);
      setUserRole(userData.role as UserRole);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jobs');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

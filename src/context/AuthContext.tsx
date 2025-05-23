
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define our user roles
export type UserRole = 'system_admin' | 'tenant_admin' | 'employee';

// Define our user and auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string; // Only for tenant_admin and employee roles
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration (will be replaced with actual authentication)
const SAMPLE_USERS: Record<string, User> = {
  system_admin: {
    id: 'sa-1',
    name: 'System Administrator',
    email: 'admin@aurahrms.com',
    role: 'system_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  tenant_admin: {
    id: 'ta-1',
    name: 'Tenant Administrator',
    email: 'hradmin@company.com',
    role: 'tenant_admin',
    tenantId: 'tenant-1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hradmin',
  },
  employee: {
    id: 'emp-1',
    name: 'John Employee',
    email: 'john@company.com',
    role: 'employee',
    tenantId: 'tenant-1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employee',
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hrms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    
    try {
      // Simulating authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple demo authentication logic (to be replaced with real auth)
      let matchedUser: User | null = null;
      
      // If role is specified, look for a user with that specific role
      if (role) {
        const user = SAMPLE_USERS[role];
        if (user && user.email === email) {
          matchedUser = user;
        }
      } else {
        // If no role specified, check all users
        for (const key in SAMPLE_USERS) {
          const user = SAMPLE_USERS[key];
          if (user.email === email) {
            matchedUser = user;
            break;
          }
        }
      }
      
      if (matchedUser) {
        setUser(matchedUser);
        localStorage.setItem('hrms_user', JSON.stringify(matchedUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User } from '../lib/data';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First try the mock users (for testing without backend)
      const mockUser = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast("Login Successful", {
          description: `Welcome back, ${mockUser.username}!`,
        });
        return true;
      }

      // If not a mock user, try the API
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        const apiUser: User = {
          ...userData,
          password: '', // Don't store password client side
        };
        setUser(apiUser);
        localStorage.setItem('user', JSON.stringify(apiUser));
        toast("Login Successful", {
          description: `Welcome back, ${apiUser.username}!`,
        });
        return true;
      } else {
        toast("Login Failed", {
          description: "Invalid username or password",
          style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast("Login Failed", {
        description: "An error occurred during login",
        style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast("Logged Out", {
      description: "You have been successfully logged out",
    });
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if username already exists among mock users
      const userExists = mockUsers.some((u) => u.username === username);
      
      if (userExists) {
        toast("Registration Failed", {
          description: "Username already exists",
          style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
        });
        return false;
      }

      // Try to register with the API
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email }),
        });

        if (response.ok) {
          const userData = await response.json();
          const newUser: User = {
            ...userData,
            password: '', // Don't store password client side
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          toast("Registration Successful", {
            description: "Your account has been created",
          });
          
          return true;
        }
        
        // Handle API errors
        const errorData = await response.json();
        toast("Registration Failed", {
          description: errorData.error || "Registration failed",
          style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
        });
        return false;
      } catch (apiError) {
        // If API fails, fallback to mock registration for demo
        console.warn('API registration failed, using mock implementation:', apiError);
        
        // Mock implementation - just simulate success
        const newUser: User = {
          id: `${mockUsers.length + 1}`,
          username,
          password,
          email,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        // In a real implementation, this would add to the database
        // For now, we'll just set the user as logged in
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast("Registration Successful", {
          description: "Your account has been created (mock)",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast("Registration Failed", {
        description: "An error occurred during registration",
        style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' }
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

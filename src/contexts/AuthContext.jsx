import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockUsers } from '../utils/mockData';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('beachCleanupUser');
    console.log('AuthContext - Saved user from localStorage:', savedUser);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('AuthContext - Parsed user:', parsedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Try real auth service first
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.log('Real auth service failed, trying mock auth:', error.message);
      
      // Fallback to mock authentication for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const savedUsers = localStorage.getItem('beachCleanupRegisteredUsers');
      const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
      const allUsers = [...mockUsers, ...registeredUsers];
      const foundUser = allUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        // Generate a mock JWT token for development
        const mockToken = btoa(JSON.stringify({ 
          sub: foundUser.id.toString(), 
          user_id: foundUser.id.toString(),
          role: foundUser.role,
          email: foundUser.email 
        }));
        
        localStorage.setItem('authToken', mockToken);
        setUser(foundUser);
        localStorage.setItem('beachCleanupUser', JSON.stringify(foundUser));
        setIsLoading(false);
        return { user: foundUser, token: mockToken };
      } else {
        setIsLoading(false);
        throw new Error('Invalid credentials');
      }
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Try real auth service first
      const data = await authService.register(userData);
      setUser(data.user);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.log('Real auth service failed, using mock registration:', error.message);
      
      // Fallback to mock registration for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const savedUsers = localStorage.getItem('beachCleanupRegisteredUsers');
      const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
      const allUsers = [...mockUsers, ...registeredUsers];
      const existingUser = allUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        setIsLoading(false);
        throw new Error('User with this email already exists');
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'participant',
        bio: userData.bio,
        location: userData.location,
        eventsJoined: 0,
        eventsOrganized: 0,
        totalWasteCollected: 0,
        ecoScore: 0
      };
      
      // Generate a mock JWT token for development
      const mockToken = btoa(JSON.stringify({ 
        sub: newUser.id.toString(), 
        user_id: newUser.id.toString(),
        role: newUser.role,
        email: newUser.email 
      }));
      
      // Save to registered users list
      const updatedRegisteredUsers = [...registeredUsers, newUser];
      localStorage.setItem('beachCleanupRegisteredUsers', JSON.stringify(updatedRegisteredUsers));
      
      // Set as current user
      localStorage.setItem('authToken', mockToken);
      setUser(newUser);
      localStorage.setItem('beachCleanupUser', JSON.stringify(newUser));
      setIsLoading(false);
      return { user: newUser, token: mockToken };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beachCleanupUser');
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
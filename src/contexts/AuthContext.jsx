import React, { createContext, useContext, useState, useEffect } from 'react';
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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Check both mock users and registered users
    const savedUsers = localStorage.getItem('beachCleanupRegisteredUsers');
    const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
    const allUsers = [...mockUsers, ...registeredUsers];
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('beachCleanupUser', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const register = async (userData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Check if user already exists
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
    // Save to registered users list
    const updatedRegisteredUsers = [...registeredUsers, newUser];
    localStorage.setItem('beachCleanupRegisteredUsers', JSON.stringify(updatedRegisteredUsers));
    // Set as current user
    setUser(newUser);
    localStorage.setItem('beachCleanupUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beachCleanupUser');
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
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
    const init = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const resp = await fetch('/api/auth/validate', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const json = await resp.json();
          if (resp.ok && json?.success && json?.data) {
            // First set basic user info from validate endpoint
            let u = {
              id: json.data.userId,
              email: json.data.email,
              role: json.data.role,
              verified: json.data.verified
            };
            
            // Try to fetch full user profile to get name and other details
            try {
              const profileResp = await fetch('/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (profileResp.ok) {
                const profileData = await profileResp.json();
                // Merge profile data with basic user info
                u = {
                  ...u,
                  name: profileData.name || u.name,
                  phone: profileData.phone || u.phone,
                  avatar: profileData.avatar || u.avatar,
                  bio: profileData.bio || u.bio,
                  address: profileData.address || u.address
                };
              }
            } catch (profileError) {
              console.log('Could not fetch user profile, using basic info:', profileError);
              // Continue with basic user info if profile fetch fails
            }
            
            setUser(u);
            localStorage.setItem('beachCleanupUser', JSON.stringify(u));
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('beachCleanupUser');
            setUser(null);
          }
        } else {
          // Fallback to saved user if any (dev mode)
          const savedUser = localStorage.getItem('beachCleanupUser');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('beachCleanupUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
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
      console.log('Calling authService.register with:', { ...userData, password: '***' });
      const data = await authService.register(userData);
      console.log('Registration successful, user data:', data.user);
      // Registration successful - user is stored but no token yet
      // User should log in after registration
      setUser(data.user);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Real auth service failed:', error.message);
      console.error('Error details:', error);
      
      // Only fallback to mock if it's a network/server error, not validation errors
      if (error.status === 0 || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        console.log('Network error detected, using mock registration fallback');
        
        // Prevent registration of super admin email
        if (userData.email && userData.email.toLowerCase() === 'admin@blueforce.com') {
          setIsLoading(false);
          throw new Error('This email is reserved and cannot be registered');
        }
        
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
      } else {
        // Re-throw validation/backend errors
        setIsLoading(false);
        throw error;
      }
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
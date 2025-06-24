import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User roles
  const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    GUEST: 'guest'
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      foundUser.lastLogin = new Date().toISOString();
      const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      return { success: true, user: foundUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: userData.role || ROLES.STUDENT,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        preferences: {
          theme: 'light',
          notifications: true,
          soundEnabled: true
        },
        stats: {
          totalSessions: 0,
          totalWordsLearned: 0,
          averageAccuracy: 0,
          streakDays: 0
        }
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const rolePermissions = {
      [ROLES.ADMIN]: ['all'],
      [ROLES.TEACHER]: ['view_students', 'manage_content', 'view_analytics'],
      [ROLES.STUDENT]: ['learn', 'view_progress'],
      [ROLES.GUEST]: ['learn']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    loading,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
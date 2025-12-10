// Storage utility functions for token and user data management

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'hieq_access_token';
const USER_STORAGE_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'hieq_user_data';

export const storage = {
  // Token management
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error setting token in storage:', error);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  },

  // User data management
  getUser: () => {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  },

  setUser: (user) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user in storage:', error);
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  },

  // Clear all auth data
  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  },
};


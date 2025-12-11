import axios from 'axios';

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'hieq_access_token';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for login/refresh endpoints to avoid loops
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/login') || 
                            error.config?.url?.includes('/api/auth/refresh');
      
      // Don't redirect if already on login page
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isAuthEndpoint && !isLoginPage) {
        // Token expired or invalid - clear storage and redirect to login
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY || 'hieq_user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },
  
  refresh: async () => {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
};

// List Management API
export const listManagementAPI = {
  // GET /api/admin/listmanagement/:type
  getByType: async (type, params = {}) => {
    const response = await apiClient.get(`/api/admin/listmanagement/${type}`, {
      params,
    });
    return response.data;
  },

  // GET /api/admin/listmanagement/:type/:id
  getById: async (type, id) => {
    const response = await apiClient.get(`/api/admin/listmanagement/${type}/${id}`);
    return response.data;
  },

  // POST /api/admin/listmanagement/:type
  create: async (type, data) => {
    const response = await apiClient.post(`/api/admin/listmanagement/${type}`, data);
    return response.data;
  },

  // PATCH /api/admin/listmanagement/:type/:id
  update: async (type, id, data) => {
    const response = await apiClient.patch(
      `/api/admin/listmanagement/${type}/${id}`,
      data
    );
    return response.data;
  },

  // DELETE /api/admin/listmanagement/:type/:id
  delete: async (type, id) => {
    const response = await apiClient.delete(
      `/api/admin/listmanagement/${type}/${id}`
    );
    return response.data;
  },

  // PATCH /api/admin/listmanagement/:type/:id/status
  toggleStatus: async (type, id, status) => {
    const response = await apiClient.patch(
      `/api/admin/listmanagement/${type}/${id}/status`,
      { status }
    );
    return response.data;
  },
};

// User API
export const userAPI = {
  // GET all users
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/users', { params });
    return response.data;
  },

  // GET user by ID
  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  // CREATE user (with file uploads)
  create: async (formData) => {
    const response = await apiClient.post('/api/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

   // POST /api/users/bulk - Bulk create users from CSV
  bulkCreate: async (users) => {
    const response = await apiClient.post('/api/users/bulk', { users });
    return response.data;
  },

  // UPDATE user (with file uploads)
  update: async (id, formData) => {
    const response = await apiClient.patch(`/api/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // DELETE user (soft delete)
  delete: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },

  // Hard delete
  hardDelete: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}/hard`);
    return response.data;
  },

  // Update role
  updateRole: async (id, role) => {
    const response = await apiClient.patch(`/api/users/${id}/role`, { role });
    return response.data;
  },

  // Block user
  block: async (id) => {
    const response = await apiClient.patch(`/api/users/${id}/block`);
    return response.data;
  },

  // Unblock user
  unblock: async (id) => {
    const response = await apiClient.patch(`/api/users/${id}/unblock`);
    return response.data;
  },

  // Change password
  changePassword: async (id, newPassword, confirmPassword) => {
    const response = await apiClient.patch(`/api/users/${id}/change-password`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // Send password reset email
  sendPasswordResetEmail: async (id) => {
    const response = await apiClient.post(`/api/users/${id}/send-reset-password`);
    return response.data;
  },

  // Send email verification link
  sendEmailVerificationLink: async (id) => {
    const response = await apiClient.post(`/api/users/${id}/send-verification`);
    return response.data;
  },

  // Verify email
  verifyEmail: async (id, token) => {
    const response = await apiClient.post(`/api/users/${id}/verify-email`, { token });
    return response.data;
  },

  // Update document status
  updateDocumentStatus: async (id, documentType, status, educationIndex = null) => {
    const response = await apiClient.patch(`/api/users/${id}/document-status`, {
      documentType,
      status,
      educationIndex,
    });
    return response.data;
  },
};

// Role and Permission API
export const roleAPI = {
  // Roles
  getAllRoles: async () => {
    const response = await apiClient.get('/api/admin/roles');
    return response.data;
  },

  getRoleById: async (id) => {
    const response = await apiClient.get(`/api/admin/roles/${id}`);
    return response.data;
  },

  createRole: async (data) => {
    const response = await apiClient.post('/api/admin/roles', data);
    return response.data;
  },

  updateRole: async (id, data) => {
    const response = await apiClient.patch(`/api/admin/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await apiClient.delete(`/api/admin/roles/${id}`);
    return response.data;
  },

  // Permissions
  getAllPermissions: async () => {
    const response = await apiClient.get('/api/admin/roles/permissions/all');
    return response.data;
  },

  createPermission: async (data) => {
    const response = await apiClient.post('/api/admin/roles/permissions', data);
    return response.data;
  },

  updatePermission: async (id, data) => {
    const response = await apiClient.patch(`/api/admin/roles/permissions/${id}`, data);
    return response.data;
  },

  deletePermission: async (id) => {
    const response = await apiClient.delete(`/api/admin/roles/permissions/${id}`);
    return response.data;
  },
};

// Generic API call function for future use
export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default apiClient;


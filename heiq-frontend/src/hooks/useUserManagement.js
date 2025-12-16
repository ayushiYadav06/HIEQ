import { useState, useEffect, useCallback } from "react";
import { candidateAPI, employerAPI, userAPI } from "../services/api";

const useUserManagement = (activeTab, filterBy, searchQuery, selectedDate, verificationStatus, accountStatus, currentPage, pageSize, updateTotalItems) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return {
      from: new Date(`${dateString}T00:00:00.000Z`).toISOString(),
      to: new Date(`${dateString}T23:59:59.999Z`).toISOString()
    };
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // Build params based on filter type (no role needed - endpoint determines it)
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      // Handle different filter types
      if (filterBy === "Verification Status") {
        if (verificationStatus) {
          params.verificationStatus = verificationStatus;
        }
      } else if (filterBy === "Account Status") {
        if (accountStatus) {
          params.accountStatus = accountStatus;
        }
      } else {
        // For Name, Email - use search
        if (searchQuery) {
          params.search = searchQuery;
          params.filterBy = filterBy;
        }
      }

      // Date filter
      if (selectedDate) {
        const dateRange = formatDateForAPI(selectedDate);
        params.dateFrom = dateRange.from;
        params.dateTo = dateRange.to;
      }

      console.log('[useUserManagement] Fetching users with params:', params);
      // Use appropriate API based on activeTab
      let api;
      if (activeTab === "Candidates") {
        api = candidateAPI;
      } else if (activeTab === "Employers") {
        api = employerAPI;
      } else if (activeTab === "Admins") {
        api = userAPI;
        // For admin users, we don't filter by role - the userAPI endpoint returns all admin users
        // The backend User model only has admin roles, so all users from /api/users are admins
      } else {
        api = candidateAPI; // Default fallback
      }
      const response = await api.getAll(params);
      console.log('[useUserManagement] Response:', { 
        isArray: Array.isArray(response),
        usersCount: Array.isArray(response) ? response.length : response.users?.length,
        total: Array.isArray(response) ? response.length : response.total,
        page: response.page,
        totalPages: response.totalPages
      });
      
      // Handle response - should be an object with users array
      if (Array.isArray(response)) {
        // Fallback: backend returned full array. Apply client-side filtering and pagination
        let filteredUsers = response;

        // Apply client-side filtering
        if (filterBy === "Verification Status" && verificationStatus) {
          filteredUsers = filteredUsers.filter(user => {
            if (verificationStatus === "Active") {
              return !user.blocked;
            } else if (verificationStatus === "Blocked") {
              return user.blocked === true;
            }
            return true;
          });
        } else if (filterBy === "Account Status" && accountStatus) {
          filteredUsers = filteredUsers.filter(user => {
            if (accountStatus === "Active") {
              return !user.deleted && !user.blocked;
            } else if (accountStatus === "Deleted") {
              return user.deleted === true;
            } else if (accountStatus === "Blocked") {
              return user.blocked === true && !user.deleted;
            }
            return true;
          });
        }

        // Apply client-side date filtering
        if (selectedDate) {
          const selectedDateStr = selectedDate.toISOString().split('T')[0];
          filteredUsers = filteredUsers.filter(user => {
            if (!user.createdAt) return false;
            const userDateStr = new Date(user.createdAt).toISOString().split('T')[0];
            return userDateStr === selectedDateStr;
          });
        }

        // Apply client-side search filtering
        if (searchQuery && filterBy !== "Verification Status" && filterBy !== "Account Status") {
          const searchLower = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter(user => {
            if (filterBy === "Name") {
              return user.name?.toLowerCase().includes(searchLower);
            } else if (filterBy === "Email ID") {
              return user.email?.toLowerCase().includes(searchLower);
            }
            return true;
          });
        }

        // Apply pagination
        const total = filteredUsers.length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const sliced = filteredUsers.slice(start, end);
        
        setUsers(sliced);
        updateTotalItems(total);
      } else {
        // New format - paginated object (backend handled filtering)
        setUsers(response.users || []);
        updateTotalItems(response.total || 0);
      }
      // Clear any previous errors if request succeeded
      setError("");
    } catch (err) {
      // Only set error for actual API/network errors, not for empty results
      console.error('[useUserManagement] Error fetching users:', err);
      console.error('[useUserManagement] Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      // Check if it's a network error or API error
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load users. Please try again.';
      
      // Only show error for actual failures (not 404 which might mean endpoint doesn't exist yet)
      // For 401/403, show authentication error
      // For 500, show server error
      // For network errors, show connection error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Authentication failed. Please log in again.");
      } else if (err.response?.status === 404) {
        // 404 might mean endpoint doesn't exist - this is an actual error
        setError("");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (!err.response) {
        // Network error
        setError("Network error. Please check your connection.");
      } else {
        setError(errorMessage);
      }
      
      setUsers([]);
      updateTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, filterBy, selectedDate, verificationStatus, accountStatus, currentPage, pageSize, updateTotalItems]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers
  };
};

export default useUserManagement;


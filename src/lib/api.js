import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = 'https://backend.ricefield-dev.cloud/api/v1';

// Helper to handle session expiration centrally
const handleSessionExpired = () => {
  // Prevent multiple simultaneous triggers
  if (window.isHandlingSessionExpiration) return;
  window.isHandlingSessionExpiration = true;

  console.log("Session expired. Clearing storage and redirecting...");

  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  
  toast({
    title: "Session Expired",
    description: "Your session has expired. Please log in again.",
    variant: "destructive",
  });

  // Brief delay to allow the toast to be visible before redirecting
  setTimeout(() => {
    window.location.href = '/login';
    // Reset flag just in case, though the page will reload
    window.isHandlingSessionExpiration = false;
  }, 1500);
};

export const authenticatedFetch = async (endpoint, options = {}) => {
  const getFullUrl = (path) => {
    if (path.startsWith('http')) return path;
    const cleanEndpoint = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanEndpoint}`;
  };

  const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  // 1. Attempt initial request
  let token = localStorage.getItem('token');

  try {
    let response = await fetch(getFullUrl(endpoint), {
      ...options,
      headers: getHeaders(token)
    });

    // 2. Check for 401 Unauthorized
    if (response.status === 401) {
      console.log("Access token expired (401). Attempting refresh...");
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        console.warn("No refresh token available.");
        handleSessionExpired();
        return response;
      }

      try {
        // 3. Attempt to refresh the access token
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.data.access;

          if (newAccessToken) {
            // 4. Update the access token in local storage
            localStorage.setItem('token', newAccessToken);

            // 5. Retry the original request with the NEW token
            // Note: We MUST use the newAccessToken here, not the old 'token' variable
            return fetch(getFullUrl(endpoint), {
              ...options,
              headers: getHeaders(newAccessToken)
            });
          } else {
             console.error("Refresh response OK but no access token returned.");
             handleSessionExpired();
             return response;
          }
        } else {
          console.warn("Refresh token invalid or expired.");
          // Refresh failed - Force logout
          handleSessionExpired();
          return response;
        }
      } catch (error) {
        console.error("Network error during token refresh:", error);
        handleSessionExpired();
        throw error;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};
// Save access token
export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Clear token (used on logout)
export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

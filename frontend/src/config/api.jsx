// config/api.js
const API_BASE_URL = "http://localhost:4000";
const PORTAL_BASE_URL = "http://localhost:3000";
const WS_BASE_URL = "ws://localhost:8000";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${PORTAL_BASE_URL}/login`,
  VERIFY_TOKEN: `${API_BASE_URL}/users/verify-token`,
  
  // WebSocket
  WS_SSH: `${WS_BASE_URL}/ws/ssh`,
};

export const ROUTES = {
  LOGIN: `${PORTAL_BASE_URL}/login`,
  SSH_PAGE: `${PORTAL_BASE_URL}/ssh`,
};

// Helper functions
export const buildWebSocketUrl = (token) => {
  return `${API_ENDPOINTS.WS_SSH}?token=${encodeURIComponent(token)}`;
};

export default {
  API_BASE_URL,
  PORTAL_BASE_URL,
  WS_BASE_URL,
  API_ENDPOINTS,
  ROUTES,
  buildWebSocketUrl
};
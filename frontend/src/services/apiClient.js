import axios from 'axios';

// Base Axios instance for all AssetFlow API calls.
// The Express backend base URL will be supplied via environment variable
// once the backend team publishes it. For now this is a placeholder.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('assetflow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response error handling (toast wiring can hook in here later)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

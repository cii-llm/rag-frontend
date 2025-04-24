// src/services/apiClient.js
import axios from 'axios';
// Import auth store if you need to add tokens to requests
// import { useAuthStore } from '@/store/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000', // Fallback URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// Optional: Add request interceptor to include auth token
// apiClient.interceptors.request.use(config => {
//   const authStore = useAuthStore();
//   const token = authStore.token; // Assuming token is stored in Pinia state
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default apiClient;
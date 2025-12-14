// Axios HTTP client configuration with interceptors for authentication
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// Create axios instance with base configuration
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Attach authentication token to all outgoing requests
client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('auth_token');
  if(token){
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', cfg.method?.toUpperCase(), cfg.url, cfg.data);
  return cfg;
});

// Interceptor: Log API responses and handle errors
client.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.config?.url, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default client;

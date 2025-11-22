import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token if present
client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('auth_token');
  if(token){
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', cfg.method?.toUpperCase(), cfg.url, cfg.data);
  return cfg;
});

// Log responses for debugging
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

import axios from 'axios';

// Read the base URL from an env-var (see below)
const BASE_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,           // optional: set a global timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
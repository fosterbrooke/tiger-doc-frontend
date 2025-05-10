import axios from 'axios';

// Read the base URL from an env-var (see below)
const BASE_URL = "subcruncher-server-czdggue2awdze4gz.uksouth-01.azurewebsites.net";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,           // optional: set a global timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
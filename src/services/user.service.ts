// src/services/userService.js
import api from './api';

// Fetch a list of users
export function login(userData) {
  return api.post('/users/signin', userData);
}

// Create a new user
export function signup(userData) {
  return api.post('/users/signup', userData);
}

const userService = {
    login,
    signup,
}

export default userService;
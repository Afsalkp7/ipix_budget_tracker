import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ipix-budget-be.vercel.app/api/',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle the error
  }
);

export default API;
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Add token if exists
instance.interceptors.request.use(config => {
  const loginToken = localStorage.getItem('loginToken'); // or sessionStorage
  if (loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
  }
  return config;
});

export default instance;

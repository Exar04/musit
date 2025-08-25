import axios,  {type InternalAxiosRequestConfig } from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});


const serviceApi = axios.create({
  baseURL: 'http://localhost:8085/',
  headers: {
    'Content-Type': 'application/json',
  },
});

serviceApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export { authApi, serviceApi }